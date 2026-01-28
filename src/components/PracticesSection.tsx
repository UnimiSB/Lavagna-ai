import { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Shield,
  Lightbulb,
  Scale,
  Copy,
  CheckCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { bestPractices } from '@/data/techniques';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

const checklistItems = [
  { id: 'specifico', text: 'Ho fornito contesto specifico e dettagliato', checked: false },
  { id: 'norme', text: 'Ho citato le norme applicabili', checked: false },
  { id: 'ruolo', text: 'Ho assegnato un ruolo specifico all\'AI', checked: false },
  { id: 'formato', text: 'Ho specificato il formato di output desiderato', checked: false },
  { id: 'vincoli', text: 'Ho indicato vincoli e limitazioni', checked: false },
  { id: 'dati', text: 'Ho rimosso dati personali e sensibili', checked: false },
  { id: 'verifica', text: 'Ho pianificato di verificare le fonti citate', checked: false },
  { id: 'revisione', text: 'Ricordo che serve revisione professionale', checked: false },
];

export function PracticesSection() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const { copied, copy } = useCopyToClipboard();

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const progress = (checkedCount / checklistItems.length) * 100;

  const dos = bestPractices.filter(p => p.type === 'do');
  const donts = bestPractices.filter(p => p.type === 'dont');

  const promptChecklistText = checklistItems.map(item => 
    `[${checkedItems[item.id] ? 'X' : ' '}] ${item.text}`
  ).join('\n');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6 text-teal-500" />
          Best Practices
        </h2>
        <p className="text-muted-foreground">
          Linee guida per ottenere risultati ottimali e utilizzare l'AI in modo sicuro ed efficace.
        </p>
      </div>

      {/* Checklist */}
      <Card className="border-teal-500/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-teal-500" />
            Checklist Pre-Prompt
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Completamento</span>
              <span className="font-medium">{checkedCount}/{checklistItems.length}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-teal-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {checklistItems.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`
                  flex items-start gap-3 p-3 rounded-lg text-left transition-all
                  ${checkedItems[item.id] 
                    ? 'bg-teal-500/10 border border-teal-500/30' 
                    : 'bg-muted hover:bg-muted/80'
                  }
                `}
              >
                <div className={`
                  h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5
                  ${checkedItems[item.id] 
                    ? 'bg-teal-500 border-teal-500' 
                    : 'border-muted-foreground/30'
                  }
                `}>
                  {checkedItems[item.id] && <CheckCircle className="h-3 w-3 text-white" />}
                </div>
                <span className={`text-sm ${checkedItems[item.id] ? 'text-teal-700 dark:text-teal-300' : ''}`}>
                  {item.text}
                </span>
              </button>
            ))}
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => copy(promptChecklistText)}
            className="w-full"
          >
            {copied ? <CheckCheck className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            Copia checklist
          </Button>
        </CardContent>
      </Card>

      {/* Do's and Don'ts */}
      <Tabs defaultValue="do" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="do" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Cosa FARE
          </TabsTrigger>
          <TabsTrigger value="dont" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Cosa EVITARE
          </TabsTrigger>
        </TabsList>

        <TabsContent value="do" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dos.map((practice, index) => (
              <Card key={practice.id} className="border-l-4 border-l-emerald-500">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-sm shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{practice.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {practice.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dont" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {donts.map((practice, index) => (
              <Card key={practice.id} className="border-l-4 border-l-rose-500">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-sm shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{practice.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {practice.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Disclaimer */}
      <Card className="border-rose-500/30 bg-rose-500/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="h-5 w-5" />
            Disclaimer Legale Importante
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Scale className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">I modelli AI NON SONO AVVOCATI</p>
              <p className="text-sm text-muted-foreground mt-1">
                Non possono sostituire il giudizio legale di un professionista qualificato.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-emerald-600 dark:text-emerald-400">Uso APPROPRIATO</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Tool di supporto per ricerca iniziale, generazione bozze, esplorazione opzioni legali, training.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-rose-600 dark:text-rose-400">Uso INAPPROPRIATO</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Unica fonte di consulenza, questioni ad alto rischio, clienti finali senza revisione professionale.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Consigli Pratici
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Badge variant="secondary" className="shrink-0 mt-0.5">1</Badge>
              <p className="text-sm">
                <strong>Inizia sempre con un ruolo:</strong> "Sei un avvocato civilista esperto in..." attiva pattern di conoscenza specifici.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <Badge variant="secondary" className="shrink-0 mt-0.5">2</Badge>
              <p className="text-sm">
                <strong>Specifica il formato output:</strong> Richiedi tabelle, elenchi puntati o pareri formali secondo necessità.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <Badge variant="secondary" className="shrink-0 mt-0.5">3</Badge>
              <p className="text-sm">
                <strong>Itera e affina:</strong> Usa il prompting iterativo per migliorare progressivamente i risultati.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <Badge variant="secondary" className="shrink-0 mt-0.5">4</Badge>
              <p className="text-sm">
                <strong>Verifica sempre:</strong> Controlla citazioni normative e giurisprudenziali su fonti ufficiali.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <Badge variant="secondary" className="shrink-0 mt-0.5">5</Badge>
              <p className="text-sm">
                <strong>Documenta il processo:</strong> Tieni traccia dei prompt usati per revisioni future.
              </p>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
