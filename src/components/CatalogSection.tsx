import { useState, useMemo } from 'react';
import { 
  Search, 
  Heart, 
  Copy, 
  CheckCheck, 
  BookOpen,
  Filter,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { techniques } from '@/data/techniques';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

interface CatalogSectionProps {
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

export function CatalogSection({ favorites, toggleFavorite }: CatalogSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterComplexity, setFilterComplexity] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { copied, copy } = useCopyToClipboard();

  const filteredTechniques = useMemo(() => {
    return techniques.filter(tech => {
      const matchesSearch = 
        searchQuery === '' ||
        tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.applicazioni.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = filterCategory === 'all' || tech.category === filterCategory;
      const matchesComplexity = filterComplexity === 'all' || tech.complexity === filterComplexity;
      
      return matchesSearch && matchesCategory && matchesComplexity;
    });
  }, [searchQuery, filterCategory, filterComplexity]);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Bassa': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'Media': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'Alta': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
      case 'Molto Alta': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'Basso': return 'bg-emerald-500/10 text-emerald-600';
      case 'Medio': return 'bg-amber-500/10 text-amber-600';
      case 'Alto': return 'bg-orange-500/10 text-orange-600';
      case 'Molto Alto': return 'bg-rose-500/10 text-rose-600';
      case 'Altissimo': return 'bg-purple-500/10 text-purple-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'base': return '🌱';
      case 'avanzata': return '🚀';
      case 'esperta': return '⭐';
      default: return '📋';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-teal-500" />
          Catalogo Completo
        </h2>
        <p className="text-muted-foreground">
          Esplora tutte le {techniques.length} tecniche di prompting legale. Cerca, filtra e trova la tecnica giusta per ogni situazione.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca tecniche, applicazioni..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutte</SelectItem>
            <SelectItem value="base">Base</SelectItem>
            <SelectItem value="avanzata">Avanzata</SelectItem>
            <SelectItem value="esperta">Esperta</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterComplexity} onValueChange={setFilterComplexity}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Complessità" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutte</SelectItem>
            <SelectItem value="Bassa">Bassa</SelectItem>
            <SelectItem value="Media">Media</SelectItem>
            <SelectItem value="Alta">Alta</SelectItem>
            <SelectItem value="Molto Alta">Molto Alta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        {filteredTechniques.length} {filteredTechniques.length === 1 ? 'tecnica trovata' : 'tecniche trovate'}
      </p>

      {/* Techniques Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredTechniques.map((technique) => {
          const isFav = favorites.includes(technique.id);
          const isExpanded = expandedId === technique.id;
          
          return (
            <Collapsible
              key={technique.id}
              open={isExpanded}
              onOpenChange={() => setExpandedId(isExpanded ? null : technique.id)}
            >
              <Card className="transition-all duration-200 hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getCategoryIcon(technique.category)}</span>
                        <CardTitle className="text-base truncate">{technique.name}</CardTitle>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {technique.description}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(technique.id);
                      }}
                    >
                      <Heart className={`h-4 w-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className={getComplexityColor(technique.complexity)}>
                      {technique.complexity}
                    </Badge>
                    <Badge variant="outline" className={getCostColor(technique.cost)}>
                      {technique.cost}
                    </Badge>
                    <Badge variant="secondary" className="capitalize text-xs">
                      {technique.category}
                    </Badge>
                  </div>

                  <CollapsibleContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-emerald-500/5 rounded-lg p-3">
                        <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Vantaggi
                        </p>
                        <p className="text-xs">{technique.advantages}</p>
                      </div>
                      <div className="bg-rose-500/5 rounded-lg p-3">
                        <p className="text-xs font-medium text-rose-600 dark:text-rose-400 mb-1 flex items-center gap-1">
                          <XCircle className="h-3 w-3" /> Svantaggi
                        </p>
                        <p className="text-xs">{technique.disadvantages}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                        <Lightbulb className="h-4 w-4" /> Caso d'uso
                      </p>
                      <p className="text-sm">{technique.useCase}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Applicazioni</p>
                      <div className="flex flex-wrap gap-1">
                        {technique.applicazioni.map((app, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {app}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Esempio
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copy(technique.example)}
                        >
                          {copied ? <CheckCheck className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                      <ScrollArea className="h-20">
                        <p className="text-xs font-mono text-muted-foreground">
                          {technique.example}
                        </p>
                      </ScrollArea>
                    </div>
                  </CollapsibleContent>

                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full mt-2 text-muted-foreground"
                    >
                      {isExpanded ? (
                        <><ChevronUp className="h-4 w-4 mr-1" /> Mostra meno</>
                      ) : (
                        <><ChevronDown className="h-4 w-4 mr-1" /> Mostra dettagli</>
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </CardContent>
              </Card>
            </Collapsible>
          );
        })}
      </div>

      {filteredTechniques.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">Nessuna tecnica trovata</p>
          <p className="text-muted-foreground">Prova a modificare i filtri di ricerca</p>
        </div>
      )}
    </div>
  );
}
