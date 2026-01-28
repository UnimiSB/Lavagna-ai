import { useState } from 'react';
import { 
  Wand2, 
  Copy, 
  CheckCheck, 
  RefreshCw,
  Lightbulb,
  FileText,
  Scale,
  Gavel,
  BookOpen,
  Shield,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { promptTemplates } from '@/data/techniques';

interface GeneratorField {
  id: string;
  label: string;
  placeholder: string;
  required?: boolean;
}

interface GeneratorTemplate {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  fields: GeneratorField[];
  generate: (values: Record<string, string>) => string;
}

const generators: GeneratorTemplate[] = [
  {
    id: 'analisi-contratto',
    name: 'Analisi Contrattuale',
    icon: <FileText className="h-5 w-5" />,
    description: 'Genera un prompt per analizzare un contratto',
    fields: [
      { id: 'tipo', label: 'Tipo di contratto', placeholder: 'es. Compravendita immobiliare, Locazione, Appalto...', required: true },
      { id: 'focus', label: 'Focus dell\'analisi', placeholder: 'es. Clausole vessatorie, Obblighi delle parti, Penali...' },
      { id: 'normativa', label: 'Normativa di riferimento', placeholder: 'es. artt. 1341-1342 c.c., art. 1571 c.c....' },
    ],
    generate: (values) => `Sei un avvocato civilista esperto in diritto contrattuale.

ANALIZZA IL SEGUENTE CONTRATTO DI ${values.tipo.toUpperCase()}:
[INSERISCI IL TESTO DEL CONTRATTO]

FOCUS DELL'ANALISI:
${values.focus || 'Identificazione di criticità e clausole problematiche'}

${values.normativa ? `NORMATIVA DI RIFERIMENTO:
${values.normativa}` : ''}

SVOLGI L'ANALISI SECONDO QUESTI PUNTI:
1. Identifica il tipo contrattuale e la natura giuridica
2. Verifica la presenza di clausole vessatorie o abusive
3. Analizza le obbligazioni delle parti
4. Identifica eventuali nullità o annullabilità
5. Valuta la conformità alla normativa vigente
6. Suggerisci eventuali modifiche o integrazioni

FORMATO OUTPUT:
- Struttura per punti numerati
- Cita gli articoli del codice civile pertinenti
- Evidenzia in grassetto le criticità rilevanti
- Fornisci suggerimenti concreti per migliorare il contratto`
  },
  {
    id: 'parere-legale',
    name: 'Parere Legale',
    icon: <Scale className="h-5 w-5" />,
    description: 'Genera un prompt per un parere legale formale',
    fields: [
      { id: 'materia', label: 'Materia', placeholder: 'es. Diritto immobiliare, Responsabilità civile...', required: true },
      { id: 'domanda', label: 'Domanda giuridica', placeholder: 'es. È valida la clausola...? Quali azioni sono possibili...?', required: true },
      { id: 'dettagli', label: 'Dettagli aggiuntivi', placeholder: 'Informazioni specifiche sul caso...' },
    ],
    generate: (values) => `Agisci come avvocato civilista specializzato in ${values.materia}.

REDIGI UN PARERE LEGALE FORMALE SULLA SEGUENTE QUESTIONE:

DOMANDA:
${values.domanda}

${values.dettagli ? `DETTAGLI DEL CASO:
${values.dettagli}` : ''}

STRUTTURA DEL PARERE:
1. PREMESSA - Breve descrizione della questione e del contesto
2. QUADRO NORMATIVO - Norme applicabili con riferimenti specifici
3. GIURISPRUDENZA - Orientamenti della Cassazione e giurisprudenza di merito rilevanti
4. ANALISI - Applicazione delle norme al caso concreto
5. CONCLUSIONI - Risposta chiara alla domanda con motivazione
6. RISCHI ED INCERTEZZE - Eventuali rischi o punti critici da considerare

REQUISITI:
- Usa linguaggio tecnico-giuridico appropriato
- Cita fonti specifiche (articoli, sentenze)
- Sii obiettivo e bilanciato nella valutazione
- Evidenzia eventuali orientamenti contrapposti`
  },
  {
    id: 'strategia-processuale',
    name: 'Strategia Processuale',
    icon: <Gavel className="h-5 w-5" />,
    description: 'Genera un prompt per pianificare una strategia processuale',
    fields: [
      { id: 'caso', label: 'Descrizione del caso', placeholder: 'Descrivi la situazione...', required: true },
      { id: 'obiettivo', label: 'Obiettivo', placeholder: 'es. Ottenere risarcimento, Risolvere contratto...', required: true },
      { id: 'fase', label: 'Fase procedurale', placeholder: 'es. Pre-contenzioso, Primo grado, Appello...' },
    ],
    generate: (values) => `Come avvocato processualista, analizza la strategia processuale per il seguente caso.

DESCRIZIONE DEL CASO:
${values.caso}

OBIETTIVO DA RAGGIUNGERE:
${values.obiettivo}

${values.fase ? `FASE PROCEDURALE ATTUALE:
${values.fase}` : ''}

SVOLGI L'ANALISI STRATEGICA:
1. VALUTAZIONE DELLA FONDATEZZA
   - Analisi dei presupposti sostanziali
   - Valutazione delle probabilità di successo
   - Identificazione dei punti di forza e debolezza

2. SCELTA DELLO STRUMENTO PROCESSUALE
   - Azione giudiziaria più adeguata
   - Alternative procedurali (mediazione, arbitrato, ecc.)
   - Procedimenti cautelari eventuali

3. ANALISI DELLA COMPETENZA E DEL RITO
   - Foro competente
   - Procedimento applicabile
   - Termini da rispettare

4. VALUTAZIONE DELL'ONERE DELLA PROVA
   - Elementi provabili vs non provabili
   - Documentazione necessaria
   - Testimonianze e altre prove

5. RISCHI PROCESSUALI
   - Possibili eccezioni dell'attore/convenuto
   - Rischi di soccombenza
   - Costi e tempi stimati

6. STRATEGIA CONSIGLIATA
   - Piano d'azione dettagliato
   - Alternative di fallback
   - Timeline consigliata`
  },
  {
    id: 'ricerca-giurisprudenza',
    name: 'Ricerca Giurisprudenza',
    icon: <BookOpen className="h-5 w-5" />,
    description: 'Genera un prompt per ricercare giurisprudenza',
    fields: [
      { id: 'tema', label: 'Tematica', placeholder: 'es. Inadempimento contrattuale, Nullità del contratto...', required: true },
      { id: 'articoli', label: 'Articoli di legge', placeholder: 'es. art. 1218 c.c., art. 1418 c.c....' },
      { id: 'periodo', label: 'Periodo', placeholder: 'es. Ultimi 5 anni, Ultimi 10 anni...' },
    ],
    generate: (values) => `Sei un ricercatore legale specializzato in giurisprudenza.

TEMATICA DA ANALIZZARE:
${values.tema}

${values.articoli ? `ARTICOLI DI LEGGE RILEVANTI:
${values.articoli}` : ''}

${values.periodo ? `PERIODO DI RIFERIMENTO:
${values.periodo}` : ''}

SVOLGI L'ANALISI GIURISPRUDENZIALE:
1. PRINCIPI GIURIDICI FONDAMENTALI
   - Identifica i principi cardine sulla tematica
   - Spiega la ratio sottostante

2. EVOLUZIONE INTERPRETATIVA
   - Descrivi come l'interpretazione è cambiata nel tempo
   - Identifica eventuali "svolte" giurisprudenziali

3. ORIENTAMENTI DELLA CASSAZIONE
   - Sezioni più attive sulla tematica
   - Principali sentenze di riferimento
   - Eventuali orientamenti contrapposti

4. GIURISPRUDENZA DI MERITO
   - Come i tribunali applicano i principi della Cassazione
   - Eventuali divergenze territoriali

5. STATO ATTUALE DELLA DISCIPLINA
   - Sintesi dell'orientamento prevalente
   - Punti ancora controversi

⚠️ NOTA IMPORTANTE: Verifica sempre le sentenze citate su banche dati ufficiali (Italgiure, De Jure, ecc.)`
  },
  {
    id: 'due-diligence',
    name: 'Due Diligence',
    icon: <Shield className="h-5 w-5" />,
    description: 'Genera un prompt per analisi di due diligence',
    fields: [
      { id: 'operazione', label: 'Tipo di operazione', placeholder: 'es. Acquisizione società, Fusione, Contratto...', required: true },
      { id: 'settore', label: 'Settore', placeholder: 'es. Immobiliare, Tecnologico, Manifatturiero...' },
      { id: 'documenti', label: 'Documenti disponibili', placeholder: 'es. Bilanci, Contratti, Atti societari...' },
    ],
    generate: (values) => `Sei un avvocato esperto in due diligence ${values.settore ? `nel settore ${values.settore}` : ''}.

OPERAZIONE DA ANALIZZARE:
${values.operazione}

${values.documenti ? `DOCUMENTI DISPONIBILI PER L'ANALISI:
${values.documenti}` : ''}

EFFETTUA LA DUE DILIGENCE LEGALE:

1. ISSUE SPOTTING - PROBLEMATICHE IDENTIFICATE
   - Identifica TUTTE le potenziali problematiche legali
   - Classifica per area: societaria, contrattuale, fiscale, del lavoro, IP, etc.
   - Evidenzia le criticità "deal-breaker"

2. ANALISI CONTRATTUALE
   - Verifica clausole critiche nei contratti principali
   - Identifica clausole di change of control
   - Analizza durata e condizioni di recesso

3. VERIFICA COMPLIANCE
   - Conformità normativa del settore
   - Autorizzazioni e licenze necessarie
   - Eventuali procedure sanzionatorie in corso

4. VALUTAZIONE RISCHI
   | Rischio | Gravità | Probabilità | Mitigazione |
   |---------|---------|-------------|-------------|
   [Crea tabella con i rischi identificati]

5. RACCOMANDAZIONI
   - Azioni necessarie prima della chiusura
   - Clausole contrattuali da inserire
   - Garanzie da richiedere

6. CONCLUSIONI
   - Parere complessivo sull'operazione
   - Condizioni sospensive consigliate`
  },
  {
    id: 'custom',
    name: 'Prompt Personalizzato',
    icon: <Briefcase className="h-5 w-5" />,
    description: 'Crea un prompt completamente personalizzato',
    fields: [
      { id: 'ruolo', label: 'Ruolo dell\'AI', placeholder: 'es. Sei un avvocato civilista esperto...', required: true },
      { id: 'task', label: 'Task da svolgere', placeholder: 'es. Analizza, Redigi, Confronta...', required: true },
      { id: 'contesto', label: 'Contesto', placeholder: 'Descrivi il contesto e i dettagli rilevanti...' },
      { id: 'output', label: 'Formato output desiderato', placeholder: 'es. Parere formale, Elenco puntato, Tabella...' },
    ],
    generate: (values) => `${values.ruolo}

TASK DA SVOLGERE:
${values.task}

${values.contesto ? `CONTESTO E DETTAGLI:
${values.contesto}` : ''}

${values.output ? `FORMATO OUTPUT RICHIESTO:
${values.output}` : ''}

REQUISITI GENERALI:
- Usa linguaggio tecnico-giuridico appropriato
- Cita norme e giurisprudenza rilevanti quando necessario
- Sii preciso e dettagliato
- Evidenzia eventuali incertezze o punti critici`
  }
];

export function GeneratorSection() {
  const [activeGenerator, setActiveGenerator] = useState<string>(generators[0].id);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const { copied, copy } = useCopyToClipboard();

  const currentGenerator = generators.find(g => g.id === activeGenerator) || generators[0];

  const handleGenerate = () => {
    const prompt = currentGenerator.generate(fieldValues);
    setGeneratedPrompt(prompt);
  };

  const handleFieldChange = (id: string, value: string) => {
    setFieldValues(prev => ({ ...prev, [id]: value }));
  };

  const handleReset = () => {
    setFieldValues({});
    setGeneratedPrompt('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Wand2 className="h-6 w-6 text-teal-500" />
          Generatore di Prompt
        </h2>
        <p className="text-muted-foreground">
          Crea prompt ottimizzati per ogni esigenza legale. Compila i campi e genera il tuo prompt personalizzato.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generator Selection */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Seleziona Tipo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {generators.map((gen) => (
                <button
                  key={gen.id}
                  onClick={() => {
                    setActiveGenerator(gen.id);
                    setGeneratedPrompt('');
                  }}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all
                    ${activeGenerator === gen.id 
                      ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 ring-1 ring-teal-500/30' 
                      : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  {gen.icon}
                  <div>
                    <p className="font-medium text-sm">{gen.name}</p>
                    <p className="text-xs opacity-70">{gen.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              {currentGenerator.icon}
              {currentGenerator.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentGenerator.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>
                  {field.label}
                  {field.required && <span className="text-rose-500 ml-1">*</span>}
                </Label>
                <Textarea
                  id={field.id}
                  placeholder={field.placeholder}
                  value={fieldValues[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className="min-h-[80px] resize-none"
                />
              </div>
            ))}

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleGenerate}
                className="flex-1 bg-teal-500 hover:bg-teal-600"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Genera Prompt
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generated Prompt */}
      {generatedPrompt && (
        <Card className="border-teal-500/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCheck className="h-5 w-5 text-teal-500" />
              Prompt Generato
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copy(generatedPrompt)}
            >
              {copied ? <CheckCheck className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? 'Copiato!' : 'Copia'}
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <pre className="text-sm font-mono whitespace-pre-wrap text-muted-foreground p-4 bg-muted rounded-lg">
                {generatedPrompt}
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Quick Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Template Pronti all'Uso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {promptTemplates.slice(0, 4).map((template) => (
              <button
                key={template.id}
                onClick={() => copy(template.template)}
                className="text-left p-4 rounded-lg border hover:border-teal-500/50 hover:bg-teal-500/5 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{template.category}</Badge>
                  {copied ? <CheckCheck className="h-4 w-4 text-teal-500" /> : <Copy className="h-4 w-4" />}
                </div>
                <p className="font-medium text-sm">{template.name}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {template.description}
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
