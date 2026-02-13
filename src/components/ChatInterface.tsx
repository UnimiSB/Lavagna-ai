import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Send,
  Plus,
  Download,
  Trash2,
  RefreshCw,
  MessageSquare,
  Loader2,
  AlertCircle,
  Wallet
} from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { POPULAR_MODELS, OpenRouterService } from '@/services/openrouter';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

export function ChatInterface() {
  const {
    currentConversation,
    conversations,
    isLoading,
    isStreaming,
    error,
    isLoaded,
    sendMessage,
    createNewConversation,
    switchConversation,
    deleteConversation,
    clearCurrentConversation,
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
  }, [isLoaded, conversations.length]);

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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Conversations Sidebar */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Conversazioni</CardTitle>
            <Button
              size="sm"
              onClick={() => createNewConversation(selectedModel)}
              className="h-8 w-8 p-0 bg-teal-500 hover:bg-teal-600"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-2">
              {conversations.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nessuna conversazione
                </p>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`p-3 rounded-md border cursor-pointer transition-colors ${
                      conv.id === currentConversation?.id
                        ? 'bg-teal-50 dark:bg-teal-950 border-teal-500'
                        : 'hover:bg-accent'
                    }`}
                    onClick={() => switchConversation(conv.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{conv.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {conv.messages.length} messaggi
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversation(conv.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Credit Display */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Credito API:</span>
              </div>
              {loadingCredits ? (
                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
              ) : credits ? (
                <Badge variant="secondary" className="text-xs font-semibold">
                  ${(credits.limit - credits.usage).toFixed(2)}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
                  N/A
                </Badge>
              )}
            </div>
            {credits && credits.limit > 0 && (
              <div className="mt-2">
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className="bg-teal-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${((credits.limit - credits.usage) / credits.limit) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Usato: ${credits.usage.toFixed(2)} / ${credits.limit.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Chat Area */}
      <Card className="lg:col-span-3">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle>Chat AI</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POPULAR_MODELS.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {currentConversation && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => exportConversation(currentConversation.id)}
                    title="Esporta conversazione"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={clearCurrentConversation}
                    title="Cancella messaggi"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          {/* Messages Area */}
          <ScrollArea className="h-[400px] p-4">
            <div ref={scrollRef}>
              {!currentConversation || currentConversation.messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">Inizia una conversazione</p>
                  <p className="text-sm text-muted-foreground mt-2 max-w-md">
                    Seleziona un modello e invia un messaggio per iniziare a chattare con l'AI
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-teal-500 text-white'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <Badge
                            variant={message.role === 'user' ? 'outline' : 'secondary'}
                            className={`text-xs ${message.role === 'user' ? 'border-white/30 text-white' : ''}`}
                          >
                            {message.role === 'user' ? 'Tu' : message.model?.split('/')[1] || 'AI'}
                          </Badge>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        {message.role === 'assistant' && message.content && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="mt-2 h-6 text-xs hover:bg-accent"
                            onClick={() => copy(message.content)}
                          >
                            {copied ? 'Copiato!' : 'Copia'}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {isStreaming && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg p-3">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Error Display */}
          {error && (
            <div className="px-4 py-2 bg-destructive/10 border-t border-destructive/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={retryLastMessage}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Riprova
                </Button>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Scrivi il tuo messaggio... (Shift+Enter per andare a capo)"
                className="min-h-[60px] max-h-[200px] resize-none"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-teal-500 hover:bg-teal-600 self-end"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Premi Invio per inviare, Shift+Invio per andare a capo
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
