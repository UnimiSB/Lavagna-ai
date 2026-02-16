import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Send,
  Plus,
  Download,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { POPULAR_MODELS, OpenRouterService } from '@/services/openrouter';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

export function ChatInterface() {
  const {
    currentConversation,
    isLoading,
    isStreaming,
    error,
    isLoaded,
    sendMessage,
    createNewConversation,
    exportConversation,
    retryLastMessage,
  } = useChat();

  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState(POPULAR_MODELS[0].id);
  const [credits, setCredits] = useState<{ balance: number; usage: number; limit: number } | null>(null);
  const [loadingCredits, setLoadingCredits] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { copied, copy } = useCopyToClipboard();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentConversation?.messages]);

  // Fetch credits on mount and after each message
  useEffect(() => {
    const fetchCredits = async () => {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      if (!apiKey) return;

      setLoadingCredits(true);
      try {
        const service = new OpenRouterService(apiKey);
        const creditData = await service.getCredits();
        setCredits(creditData);
      } catch (error) {
        console.error('Failed to fetch credits:', error);
      } finally {
        setLoadingCredits(false);
      }
    };

    if (isLoaded) {
      fetchCredits();
    }
  }, [isLoaded]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const message = input;
    setInput('');
    await sendMessage(message, selectedModel);

    // Focus back on textarea
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  // Loading state while initializing
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!apiKey) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            API Key Non Configurata
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Configura la variabile d'ambiente VITE_OPENROUTER_API_KEY per utilizzare la chat.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full">
      {/* Main Chat Area */}
      <Card className="w-full shadow-sm">
        <CardHeader className="py-2 px-4 bg-muted/30">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <CardTitle className="text-sm font-bold text-teal-700 dark:text-teal-400">Chat AI</CardTitle>

              {/* Relocated AI Cost/Budget Display */}
              <div className="flex items-center gap-2 bg-background/50 border border-teal-500/20 px-2.5 py-1 rounded-full shadow-sm">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-tight">Budget:</span>
                {loadingCredits ? (
                  <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                ) : credits ? (
                  <span className="text-[11px] font-black text-teal-600 dark:text-teal-400 font-mono">
                    ${(credits.limit - credits.usage).toFixed(2)}
                  </span>
                ) : (
                  <span className="text-[10px] text-muted-foreground font-bold">N/A</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="h-8 w-[160px] text-xs bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POPULAR_MODELS.map((model) => (
                    <SelectItem key={model.id} value={model.id} className="text-xs">
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-1 border-l pl-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-teal-600"
                  onClick={() => createNewConversation(selectedModel)}
                  title="Nuova chat"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                {currentConversation && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-teal-600"
                    onClick={() => exportConversation(currentConversation.id)}
                    title="Esporta"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          {/* Messages Area - Terminal Style */}
          <ScrollArea className="h-[400px] p-4 bg-zinc-950 font-mono text-sm border-x border-zinc-800">
            <div ref={scrollRef} className="space-y-4">
              {!currentConversation || currentConversation.messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16 text-zinc-500">
                  <p className="text-base uppercase tracking-widest mb-2 opacity-50">System Initialized</p>
                  <p className="text-xs">Waiting for command input...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {currentConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className="group"
                    >
                      <div className="flex items-center gap-2 mb-1.5 opacity-70">
                        <span className={message.role === 'user' ? 'text-teal-400' : 'text-amber-400'}>
                          {message.role === 'user' ? '[USER]' : `[AI_SYSTEM:${message.model?.split('/')[1] || 'LEGALE'}]`}
                        </span>
                        <span className="text-zinc-600">--&gt;</span>
                      </div>
                      <div
                        className={`pl-4 border-l-2 ${message.role === 'user'
                          ? 'border-teal-500/30 text-zinc-100'
                          : 'border-amber-500/30 text-zinc-300'
                          }`}
                      >
                        <div className="whitespace-pre-wrap leading-relaxed tabular-nums">
                          {message.content}
                          {isStreaming && message.role === 'assistant' && message.id === currentConversation.messages[currentConversation.messages.length - 1].id && (
                            <span className="inline-block w-2 h-4 bg-amber-500 ml-1 animate-pulse" />
                          )}
                        </div>
                        {message.role === 'assistant' && message.content && (
                          <div className="mt-4 flex gap-2 overflow-hidden max-h-0 group-hover:max-h-10 transition-all duration-300">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 text-[10px] text-zinc-500 hover:text-teal-400 hover:bg-zinc-900 border border-zinc-800 uppercase tracking-tighter"
                              onClick={() => copy(message.content)}
                            >
                              {copied ? 'Copied' : 'Execute Copy'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isStreaming && currentConversation.messages[currentConversation.messages.length - 1].role === 'user' && (
                    <div className="flex items-center gap-2 text-amber-500">
                      <span>[AI_SYSTEM]</span>
                      <span className="text-zinc-600">--&gt;</span>
                      <span className="inline-block w-2 h-4 bg-amber-500 animate-pulse" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Error Display */}
          {error && (
            <div className="px-4 py-2 bg-rose-950/30 border-t border-rose-500/20 font-mono">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-400 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  <p>ERROR: {error}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={retryLastMessage}
                  className="h-6 text-[10px] text-rose-400 hover:bg-rose-500/10 border border-rose-500/20"
                >
                  RETRY_PROCEDURE()
                </Button>
              </div>
            </div>
          )}

          {/* Input Area - Terminal Style */}
          <div className="p-4 bg-zinc-900/50 border-t border-zinc-800 font-mono">
            <div className="flex gap-3">
              <div className="text-teal-500 pt-3 text-sm font-bold">$&gt;</div>
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Inserisci comando..."
                className="min-h-[80px] max-h-[200px] resize-none bg-transparent border-none focus-visible:ring-0 text-zinc-100 placeholder:text-zinc-700 text-sm p-3 scrollbar-hide"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-zinc-800 hover:bg-teal-900/50 hover:text-teal-400 text-zinc-400 self-end border border-zinc-700 h-10 w-10 shadow-lg transition-all"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2 px-1 text-[9px] text-zinc-600 uppercase tracking-widest font-bold">
              <span>Shift + Enter to line break</span>
              <span>Encoding: UTF-8</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
