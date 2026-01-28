import { useState, useMemo } from 'react';
import { 
  Search, 
  BookOpen, 
  Bookmark,
  Info
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { glossaryTerms } from '@/data/techniques';

export function GlossarySection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const letters = useMemo(() => {
    const uniqueLetters = [...new Set(glossaryTerms.map(t => t.letter))];
    return uniqueLetters.sort();
  }, []);

  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter(term => {
      const matchesSearch = 
        searchQuery === '' ||
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLetter = selectedLetter === null || term.letter === selectedLetter;
      
      return matchesSearch && matchesLetter;
    });
  }, [searchQuery, selectedLetter]);

  const groupedTerms = useMemo(() => {
    const grouped: Record<string, typeof glossaryTerms> = {};
    filteredTerms.forEach(term => {
      if (!grouped[term.letter]) {
        grouped[term.letter] = [];
      }
      grouped[term.letter].push(term);
    });
    return grouped;
  }, [filteredTerms]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-teal-500" />
          Glossario AI & Prompting
        </h2>
        <p className="text-muted-foreground">
          Dizionario terminologico per comprendere il linguaggio dell'AI Generativa applicato al diritto civile italiano.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cerca termini..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Letter Filter */}
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => setSelectedLetter(null)}
          className={`
            px-3 py-1.5 rounded-lg text-sm font-medium transition-all
            ${selectedLetter === null 
              ? 'bg-teal-500 text-white' 
              : 'bg-muted hover:bg-muted/80 text-muted-foreground'
            }
          `}
        >
          Tutti
        </button>
        {letters.map((letter) => (
          <button
            key={letter}
            onClick={() => setSelectedLetter(selectedLetter === letter ? null : letter)}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${selectedLetter === letter 
                ? 'bg-teal-500 text-white' 
                : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }
            `}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        {filteredTerms.length} {filteredTerms.length === 1 ? 'termine trovato' : 'termini trovati'}
      </p>

      {/* Terms */}
      <div className="space-y-8">
        {Object.entries(groupedTerms).sort(([a], [b]) => a.localeCompare(b)).map(([letter, terms]) => (
          <div key={letter} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-lg">
                {letter}
              </div>
              <div className="h-px flex-1 bg-border" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {terms.map((term) => (
                <Card key={term.id} className="group hover:shadow-md transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <Bookmark className="h-5 w-5 text-teal-500 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                          {term.term}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                          {term.definition}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">Nessun termine trovato</p>
          <p className="text-muted-foreground">Prova a cercare con altre parole</p>
        </div>
      )}

      {/* Info Box */}
      <Card className="bg-gradient-to-r from-teal-500/5 to-transparent border-teal-500/20">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-teal-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Nota importante</p>
              <p className="text-sm text-muted-foreground mt-1">
                Questo glossario è specificamente pensato per l'applicazione dell'AI nel contesto legale italiano. 
                I termini possono avere significati diversi in altri contesti tecnici.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
