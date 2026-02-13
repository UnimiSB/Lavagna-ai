import { useState, useCallback, useEffect } from 'react';
import { OpenRouterService } from '@/services/openrouter';
import type { ChatMessage, Conversation } from '@/types/chat';

const CONVERSATIONS_KEY = 'lavagna-ai-conversations';
const ACTIVE_CONVERSATION_KEY = 'lavagna-ai-active-conversation';

interface UseChatReturn {
  // State
  conversations: Conversation[];
  activeConversationId: string | null;
  currentConversation: Conversation | null;
  isLoading: boolean;
  error: string | null;
  isStreaming: boolean;
  isLoaded: boolean;

  // Actions
  sendMessage: (content: string, model: string) => Promise<void>;
  createNewConversation: (model: string) => void;
  switchConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  clearCurrentConversation: () => void;
  exportConversation: (id: string) => void;
  retryLastMessage: () => Promise<void>;
}

export function useChat(): UseChatReturn {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CONVERSATIONS_KEY);
    const activeId = localStorage.getItem(ACTIVE_CONVERSATION_KEY);

    if (stored) {
      try {
        setConversations(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse conversations from localStorage:', e);
      }
    }
    if (activeId) {
      setActiveConversationId(activeId);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when conversations change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
      if (activeConversationId) {
        localStorage.setItem(ACTIVE_CONVERSATION_KEY, activeConversationId);
      }
    }
  }, [conversations, activeConversationId, isLoaded]);

  const currentConversation = conversations.find(c => c.id === activeConversationId) || null;

  const createNewConversation = useCallback((model: string) => {
    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      title: 'Nuova Conversazione',
      messages: [],
      model,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
  }, []);

  const sendMessage = useCallback(async (content: string, model: string) => {
    if (!content.trim()) return;

    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    if (!apiKey) {
      setError('OpenRouter API key not configured');
      return;
    }

    // Create conversation if none exists
    let conversationId = activeConversationId;
    if (!conversationId) {
      const newConv: Conversation = {
        id: crypto.randomUUID(),
        title: content.slice(0, 50) + (content.length > 50 ? '...' : ''),
        messages: [],
        model,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setConversations(prev => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
      conversationId = newConv.id;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    // Add user message
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, userMessage],
              updatedAt: Date.now(),
              // Update title if it's the first message
              title: conv.messages.length === 0 ? content.slice(0, 50) + (content.length > 50 ? '...' : '') : conv.title
            }
          : conv
      )
    );

    // Prepare assistant message
    const assistantMessageId = crypto.randomUUID();
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      model,
    };

    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, messages: [...conv.messages, assistantMessage] }
          : conv
      )
    );

    setIsLoading(true);
    setIsStreaming(true);
    setError(null);

    const service = new OpenRouterService(apiKey);

    const conversation = conversations.find(c => c.id === conversationId);
    const messages = conversation ? [...conversation.messages, userMessage] : [userMessage];

    await service.createStreamingChatCompletion(
      {
        model,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
      },
      (chunk) => {
        setConversations(prev =>
          prev.map(conv =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: conv.messages.map(msg =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: msg.content + chunk }
                      : msg
                  ),
                }
              : conv
          )
        );
      },
      () => {
        setIsLoading(false);
        setIsStreaming(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
        setIsStreaming(false);
      }
    );
  }, [activeConversationId, conversations]);

  const switchConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    setError(null);
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
  }, [activeConversationId]);

  const clearCurrentConversation = useCallback(() => {
    if (!activeConversationId) return;
    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversationId
          ? { ...conv, messages: [], updatedAt: Date.now() }
          : conv
      )
    );
    setError(null);
  }, [activeConversationId]);

  const exportConversation = useCallback((id: string) => {
    const conversation = conversations.find(c => c.id === id);
    if (!conversation) return;

    const markdown = `# ${conversation.title}\n\n` +
      `**Model**: ${conversation.model}\n` +
      `**Created**: ${new Date(conversation.createdAt).toLocaleString('it-IT')}\n\n` +
      `---\n\n` +
      conversation.messages.map(msg =>
        `### ${msg.role === 'user' ? 'Utente' : 'Assistente'}\n${msg.content}\n`
      ).join('\n');

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conversation.title.replace(/[^a-z0-9]/gi, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [conversations]);

  const retryLastMessage = useCallback(async () => {
    if (!currentConversation || currentConversation.messages.length < 2) return;

    const lastUserMessage = [...currentConversation.messages]
      .reverse()
      .find(m => m.role === 'user');

    if (lastUserMessage) {
      // Remove last assistant message if it exists
      setConversations(prev =>
        prev.map(conv =>
          conv.id === activeConversationId
            ? { ...conv, messages: conv.messages.slice(0, -1) }
            : conv
        )
      );
      setError(null);
      await sendMessage(lastUserMessage.content, currentConversation.model);
    }
  }, [currentConversation, activeConversationId, sendMessage]);

  return {
    conversations,
    activeConversationId,
    currentConversation,
    isLoading,
    error,
    isStreaming,
    isLoaded,
    sendMessage,
    createNewConversation,
    switchConversation,
    deleteConversation,
    clearCurrentConversation,
    exportConversation,
    retryLastMessage,
  };
}
