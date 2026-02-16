import { useState, useMemo } from 'react';
import {
  Check,
  X,
  Copy,
  CheckCheck,
  Sparkles,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

import { Label } from '@/components/ui/label';
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
}

const complexityOrder: Record<string, number> = { 'Bassa': 1, 'Media': 2, 'Alta': 3, 'Molto Alta': 4 };
const costOrder: Record<string, number> = { 'Basso': 1, 'Medio': 2, 'Alto': 3, 'Molto Alto': 4, 'Altissimo': 5 };

export function ComparisonSection({ }: ComparisonSectionProps) {
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
      <div className="space-y-1">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-teal-500" />
          Confronto Tecniche
        </h2>
        <p className="text-sm text-muted-foreground">
          Seleziona fino a 3 tecniche per visualizzare l'analisi comparativa.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Selection Grid */}
        <div className="lg:col-span-5 space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-2 gap-3 items-end">
            <div className="space-y-1.5">
              <Label htmlFor="category" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Categoria</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger id="category" className="h-9 text-xs">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutte</SelectItem>
                  <SelectItem value="base">Base</SelectItem>
                  <SelectItem value="avanzata">Avanzata</SelectItem>
                  <SelectItem value="esperta">Esperta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sort" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Ordina per</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort" className="h-9 text-xs">
                  <SelectValue placeholder="Ordina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nome</SelectItem>
                  <SelectItem value="complexity">Complessità</SelectItem>
                  <SelectItem value="cost">Costo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">
              {filteredTechniques.length} tecniche disponibili
            </p>
            {selectedIds.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedIds([])}
                className="h-7 text-[10px] uppercase font-bold text-teal-600"
              >
                Reset
              </Button>
            )}
          </div>

          <ScrollArea className="h-[600px] pr-4">
            <div className="grid grid-cols-1 gap-3">
              {filteredTechniques.map((technique) => {
                const isSelected = selectedIds.includes(technique.id);

                return (
                  <Card
                    key={technique.id}
                    className={`
                      relative transition-all duration-200 cursor-pointer
                      hover:border-teal-500/40 border-2
                      ${isSelected ? 'border-teal-500 bg-teal-50/30 dark:bg-teal-950/20' : 'border-transparent bg-muted/30'}
                    `}
                    onClick={() => toggleSelection(technique.id)}
                  >
                    <div className="p-3 flex items-center gap-3">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelection(technique.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{technique.name}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[10px] text-muted-foreground uppercase">{technique.complexity}</span>
                          <span className="text-[10px] text-muted-foreground">•</span>
                          <span className="text-[10px] text-muted-foreground uppercase">{technique.category}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Right: Comparison Analysis (moved here) */}
        <div className="lg:col-span-7 space-y-6">
          {selectedTechniques.length === 0 ? (
            <Card className="border-dashed h-[400px] flex flex-col items-center justify-center text-center p-8 bg-muted/10">
              <div className="h-12 w-12 rounded-full bg-teal-500/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-teal-500" />
              </div>
              <h3 className="text-lg font-bold mb-2">Seleziona le Tecniche</h3>
              <p className="text-sm text-muted-foreground max-w-[280px]">
                Scegli fino a 3 tecniche dal catalogo a sinistra per visualizzare l'analisi comparativa dettagliata.
              </p>
            </Card>
          ) : (
            <>
              {/* Results Title Area & Selection Alert */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-teal-700 dark:text-teal-400">
                    <Sparkles className="h-5 w-5" />
                    Analisi Comparativa
                  </h3>
                  <Badge variant="secondary" className="px-3 py-0.5 text-xs font-bold bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300">
                    {selectedTechniques.length} Selezionate
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {selectedTechniques.map((tech) => (
                    <Card key={tech.id} className="overflow-hidden border-teal-500/20 shadow-sm">
                      <CardHeader className="py-3 bg-muted/30">
                        <CardTitle className="text-base font-bold">{tech.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Caso d'uso</p>
                            <p className="text-xs leading-relaxed">{tech.useCase}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Vantaggi & Svantaggi</p>
                            <div className="flex flex-col gap-1.5">
                              <span className="text-[11px] flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                                <Check className="h-3 w-3" /> {tech.advantages}
                              </span>
                              <span className="text-[11px] flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium">
                                <X className="h-3 w-3" /> {tech.disadvantages}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground">Esempio di Prompt</p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-teal-600"
                              onClick={() => copy(tech.example)}
                            >
                              {copied ? <CheckCheck className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                            </Button>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                            <p className="text-xs font-mono text-muted-foreground leading-relaxed line-clamp-2 hover:line-clamp-none transition-all">
                              {tech.example}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Comparison Table */}
                {selectedTechniques.length > 1 && (
                  <Card className="border-teal-500/30 overflow-hidden shadow-md">
                    <CardHeader className="py-3 bg-teal-500/10">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Info className="h-4 w-4 text-teal-600" />
                        Tabella Comparativa
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ScrollArea className="w-full">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b bg-muted/20">
                              <th className="text-left py-3 px-4 font-bold uppercase tracking-tighter text-muted-foreground">Aspetto</th>
                              {selectedTechniques.map(t => (
                                <th key={t.id} className="text-left py-3 px-4 font-bold text-teal-700 dark:text-teal-400">{t.name}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            <tr>
                              <td className="py-3 px-4 font-medium text-muted-foreground">Complessità</td>
                              {selectedTechniques.map(t => (
                                <td key={t.id} className="py-3 px-4">
                                  <Badge variant="outline" className={`text-[10px] ${getComplexityColor(t.complexity)}`}>
                                    {t.complexity}
                                  </Badge>
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="py-3 px-4 font-medium text-muted-foreground">Costo AI</td>
                              {selectedTechniques.map(t => (
                                <td key={t.id} className="py-3 px-4">
                                  <Badge variant="outline" className={`text-[10px] ${getCostColor(t.cost)}`}>
                                    {t.cost}
                                  </Badge>
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="py-3 px-4 font-medium text-muted-foreground">Difficoltà Setup</td>
                              {selectedTechniques.map(t => (
                                <td key={t.id} className="py-3 px-4 font-medium">
                                  {t.category === 'base' ? '🌱 Minima' : t.category === 'avanzata' ? '🚀 Media' : '⭐ Alta'}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
