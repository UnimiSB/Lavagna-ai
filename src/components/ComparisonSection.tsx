import { useState, useMemo } from 'react';
import { 
  Check, 
  X, 
  Heart, 
  Copy, 
  CheckCheck, 
  Sparkles,
  Filter,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { techniques } from '@/data/techniques';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

interface ComparisonSectionProps {
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

const complexityOrder: Record<string, number> = { 'Bassa': 1, 'Media': 2, 'Alta': 3, 'Molto Alta': 4 };
const costOrder: Record<string, number> = { 'Basso': 1, 'Medio': 2, 'Alto': 3, 'Molto Alto': 4, 'Altissimo': 5 };

export function ComparisonSection({ favorites, toggleFavorite }: ComparisonSectionProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const { copied, copy } = useCopyToClipboard();

  const filteredTechniques = useMemo(() => {
    let filtered = [...techniques];
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(t => t.category === filterCategory);
    }
    
    filtered.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'complexity') return complexityOrder[a.complexity] - complexityOrder[b.complexity];
      if (sortBy === 'cost') return costOrder[a.cost] - costOrder[b.cost];
      return 0;
    });
    
    return filtered;
  }, [filterCategory, sortBy]);

  const selectedTechniques = useMemo(() => {
    return techniques.filter(t => selectedIds.includes(t.id));
  }, [selectedIds]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

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
      case 'Basso': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
      case 'Medio': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
      case 'Alto': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400';
      case 'Molto Alto': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400';
      case 'Altissimo': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-teal-500" />
          Confronta le Tecniche di Prompting
        </h2>
        <p className="text-muted-foreground">
          Seleziona fino a 3 tecniche per confrontarle. Visualizza differenze, casi d'uso e vantaggi.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutte le categorie</SelectItem>
              <SelectItem value="base">Base</SelectItem>
              <SelectItem value="avanzata">Avanzata</SelectItem>
              <SelectItem value="esperta">Esperta</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Ordina per" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Nome</SelectItem>
            <SelectItem value="complexity">Complessità</SelectItem>
            <SelectItem value="cost">Costo</SelectItem>
          </SelectContent>
        </Select>

        {selectedIds.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSelectedIds([])}
          >
            Deseleziona tutto
          </Button>
        )}
      </div>

      {/* Selection Alert */}
      {selectedIds.length > 0 && (
        <Alert className="bg-teal-500/5 border-teal-500/20">
          <Info className="h-4 w-4 text-teal-500" />
          <AlertDescription>
            {selectedIds.length === 1 
              ? '1 tecnica selezionata. Selezionane altre per confrontarle.' 
              : `${selectedIds.length} tecniche selezionate.`}
          </AlertDescription>
        </Alert>
      )}

      {/* Technique Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredTechniques.map((technique) => {
          const isSelected = selectedIds.includes(technique.id);
          const isFav = favorites.includes(technique.id);
          
          return (
            <Card 
              key={technique.id}
              className={`
                relative transition-all duration-300 cursor-pointer
                hover:shadow-lg hover:-translate-y-1
                ${isSelected ? 'ring-2 ring-teal-500 shadow-lg' : ''}
              `}
              onClick={() => toggleSelection(technique.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={isSelected}
                      onCheckedChange={() => toggleSelection(technique.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <CardTitle className="text-base">{technique.name}</CardTitle>
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
                    <Heart 
                      className={`h-4 w-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} 
                    />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {technique.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={getComplexityColor(technique.complexity)}>
                    {technique.complexity}
                  </Badge>
                  <Badge variant="outline" className={getCostColor(technique.cost)}>
                    {technique.cost}
                  </Badge>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {technique.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Comparison Results */}
      {selectedTechniques.length > 0 && (
        <div className="space-y-6 pt-6 border-t">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-teal-500" />
            Analisi Comparativa
          </h3>

          {/* Detailed Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {selectedTechniques.map((tech) => (
              <Card key={tech.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-teal-500/5 to-transparent">
                  <CardTitle className="text-lg">{tech.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Descrizione</p>
                    <p className="text-sm">{tech.description}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Caso d'uso</p>
                    <p className="text-sm">{tech.useCase}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-500/5 rounded-lg p-3">
                      <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1">
                        <Check className="h-3 w-3" /> Vantaggi
                      </p>
                      <p className="text-xs">{tech.advantages}</p>
                    </div>
                    <div className="bg-rose-500/5 rounded-lg p-3">
                      <p className="text-xs font-medium text-rose-600 dark:text-rose-400 mb-1 flex items-center gap-1">
                        <X className="h-3 w-3" /> Svantaggi
                      </p>
                      <p className="text-xs">{tech.disadvantages}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Applicazioni</p>
                    <div className="flex flex-wrap gap-1">
                      {tech.applicazioni.map((app, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-muted-foreground">Esempio</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copy(tech.example)}
                      >
                        {copied ? <CheckCheck className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                    <p className="text-xs font-mono text-muted-foreground line-clamp-3">
                      {tech.example}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Comparison Table */}
          {selectedTechniques.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tabella Comparativa</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="w-full">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Aspetto</th>
                        {selectedTechniques.map(t => (
                          <th key={t.id} className="text-left py-3 px-4 font-medium">{t.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 px-4 text-muted-foreground">Complessità</td>
                        {selectedTechniques.map(t => (
                          <td key={t.id} className="py-3 px-4">
                            <Badge variant="outline" className={getComplexityColor(t.complexity)}>
                              {t.complexity}
                            </Badge>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 text-muted-foreground">Costo</td>
                        {selectedTechniques.map(t => (
                          <td key={t.id} className="py-3 px-4">
                            <Badge variant="outline" className={getCostColor(t.cost)}>
                              {t.cost}
                            </Badge>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 text-muted-foreground">Setup</td>
                        {selectedTechniques.map(t => (
                          <td key={t.id} className="py-3 px-4">
                            {t.category === 'base' ? 'Minimo' : t.category === 'avanzata' ? 'Medio' : 'Alto'}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-muted-foreground">Ideale per</td>
                        {selectedTechniques.map(t => (
                          <td key={t.id} className="py-3 px-4 text-xs">{t.useCase}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
