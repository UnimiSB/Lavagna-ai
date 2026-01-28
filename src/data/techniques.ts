import type { Technique, GlossaryTerm, BestPractice, PromptTemplate } from '@/types';

export const techniques: Technique[] = [
  {
    id: 'zero-shot',
    name: 'Zero-Shot',
    description: 'Richiesta diretta senza esempi precedenti',
    useCase: 'Questioni legali semplici e ben codificate',
    advantages: 'Veloce, non richiede setup complesso',
    disadvantages: 'Meno accurato per questioni complesse',
    complexity: 'Bassa',
    cost: 'Basso',
    example: 'Analizza questo contratto di compravendita immobiliare secondo il Codice Civile italiano.',
    applicazioni: ['Analisi Base', 'Domande Dirette', 'Ricerche Rapide'],
    category: 'base'
  },
  {
    id: 'few-shot',
    name: 'Few-Shot',
    description: 'Fornire 2-5 esempi prima della richiesta principale',
    useCase: 'Analisi contrattuali, redazione con formato specifico',
    advantages: 'Migliora accuratezza, definisce chiaramente lo stile desiderato',
    disadvantages: 'Richiede tempo per preparare esempi, consuma più token',
    complexity: 'Media',
    cost: 'Medio',
    example: '[Esempio 1 di contratto] [Esempio 2 di contratto] Ora analizza questo terzo contratto...',
    applicazioni: ['Redazione Standardizzata', 'Interpretazione Coerente', 'Format Specifici'],
    category: 'base'
  },
  {
    id: 'chain-of-thought',
    name: 'Chain-of-Thought (CoT)',
    description: 'Esplicitare il ragionamento passo-passo',
    useCase: 'Questioni legali complesse con ragionamento multi-step',
    advantages: 'Trasparenza, migliora ragionamento legale complesso',
    disadvantages: 'Output più lungo, più token consumati',
    complexity: 'Alta',
    cost: 'Medio',
    example: 'Analizza passo dopo passo: 1) Identifica fattispecie 2) Applica norme 3) Analizza giurisprudenza 4) Concludi',
    applicazioni: ['Analisi Complessa', 'Ragionamento Multi-Step', 'Pareri Articolati'],
    category: 'avanzata'
  },
  {
    id: 'self-consistency',
    name: 'Self-Consistency',
    description: 'Generare multiple risposte e selezionare quella più consistente',
    useCase: 'Decisioni critiche che richiedono affidabilità massima',
    advantages: 'Aumenta affidabilità, riduce errori di ragionamento',
    disadvantages: 'Costoso (richiede 3-5 chiamate API), più lento',
    complexity: 'Molto Alta',
    cost: 'Molto Alto',
    example: 'Genera 3 risposte alternative alla stessa domanda e identifica la più coerente',
    applicazioni: ['Questioni Critiche', 'Massima Affidabilità', 'Decisioni Ad Alto Rischio'],
    category: 'esperta'
  },
  {
    id: 'tree-of-thought',
    name: 'Tree-of-Thought (ToT)',
    description: 'Esplora multiple rami di ragionamento con backtracking',
    useCase: 'Strategie processuali, scelta fra rimedi alternativi',
    advantages: 'Esplora più opzioni, decision-making deliberato',
    disadvantages: 'Complesso da implementare, molto costoso',
    complexity: 'Molto Alta',
    cost: 'Altissimo',
    example: 'Esplora: Percorso A (risoluzione) vs Percorso B (adempimento) vs Percorso C (riduzione)',
    applicazioni: ['Strategia Processuale', 'Scelta Rimedi', 'Pianificazione Complessa'],
    category: 'esperta'
  },
  {
    id: 'role-based',
    name: 'Role-Based Prompting',
    description: 'Assegnare al modello un ruolo specifico (es. "Sei un avvocato specializzato in...")',
    useCase: 'Pareri con tono professionale, prospettive diverse',
    advantages: 'Attiva pattern di conoscenza specializzata, tono coerente',
    disadvantages: 'Non sempre migliora accuratezza sostanziale',
    complexity: 'Media',
    cost: 'Basso',
    example: 'Sei un avvocato civilista con 15 anni di esperienza in diritto immobiliare. Analizza...',
    applicazioni: ['Pareri Formali', 'Tone Professionale', 'Expertise Specializzata'],
    category: 'base'
  },
  {
    id: 'instruction',
    name: 'Instruction Prompting',
    description: 'Istruzioni chiare e dirette senza esempi dimostrativi',
    useCase: 'Estrazione dati, elaborazione documentale, task specifici',
    advantages: 'Flessibile, applicabile a diverse situazioni, simple',
    disadvantages: 'Può essere ambiguo senza contesto',
    complexity: 'Media',
    cost: 'Basso',
    example: 'Estrai SOLO gli obblighi del venditore. Elenca ogni obbligo con il riferimento alla clausola.',
    applicazioni: ['Estrazione Informazioni', 'Elaborazione Dati', 'Task Specifici'],
    category: 'base'
  },
  {
    id: 'constraints',
    name: 'Prompting con Vincoli',
    description: 'Specificare limitazioni, formati o condizioni precise',
    useCase: 'Atti processuali con limiti formali, compliance specifici',
    advantages: 'Garantisce output conformi a requisiti specifici',
    disadvantages: 'Richiede chiarezza sui vincoli desiderati',
    complexity: 'Media',
    cost: 'Basso',
    example: 'Redigi parere max 500 parole, solo C.C. artt. 1321-1469, includi 2 sentenze Cassazione.',
    applicazioni: ['Atti Processuali', 'Compliance', 'Limitazioni Formali'],
    category: 'avanzata'
  },
  {
    id: 'rag',
    name: 'Retrieval-Augmented Generation (RAG)',
    description: 'Integrare prompting con recupero da knowledge base esterni',
    useCase: 'Ricerca giurisprudenziale aggiornata, analisi basate su fonti specifiche',
    advantages: 'Accesso a dati aggiornati oltre knowledge cutoff, cita fonti',
    disadvantages: 'Richiede infrastruttura, verifica delle fonti',
    complexity: 'Molto Alta',
    cost: 'Molto Alto',
    example: 'Ricerca sentenze Cassazione su [tema] e analizzale nel contesto del caso',
    applicazioni: ['Ricerca Giurisprudenziale', 'Dati Aggiornati', 'Fonti Citate'],
    category: 'esperta'
  },
  {
    id: 'meta',
    name: 'Meta Prompting',
    description: 'Usare prompt per generare/modificare altri prompt',
    useCase: 'Standardizzazione processi, template riutilizzabili',
    advantages: 'Automazione della creazione di workflow, scalabilità',
    disadvantages: 'Astratto, richiede comprensione profonda',
    complexity: 'Molto Alta',
    cost: 'Medio',
    example: 'Genera un prompt ottimale per analizzare contratti di locazione considerando: durata, canone, clausole.',
    applicazioni: ['Automazione', 'Template Riutilizzabili', 'Standardizzazione'],
    category: 'esperta'
  },
  {
    id: 'multilayer',
    name: 'Multilayer Legal Reasoning',
    description: 'Ragionamento giuridico stratificato per tutti i livelli delle fonti',
    useCase: 'Memoriae processuali, pareri articolati con visione completa',
    advantages: 'Analisi esaustiva, considera tutte le dimensioni del ragionamento legale',
    disadvantages: 'Output molto lunghi, richiede tema complesso',
    complexity: 'Molto Alta',
    cost: 'Alto',
    example: 'Analizza Layer 1 (norme), Layer 2 (dottrina), Layer 3 (giurisprudenza), Layer 4 (caso)',
    applicazioni: ['Memoriae Processuali', 'Pareri Complessi', 'Visione Globale'],
    category: 'esperta'
  },
  {
    id: 'issue-spotting',
    name: 'Issue-Spotting Prompting',
    description: 'Identificazione sistematica di TUTTE le questioni giuridiche rilevanti',
    useCase: 'Due diligence contrattuale, revisione atti, analisi rischi',
    advantages: 'Garantisce completezza, non trascura aspetti critici',
    disadvantages: 'Output lungo, richiede analisi approfondita',
    complexity: 'Alta',
    cost: 'Alto',
    example: 'Identifica TUTTE le potenziali problematiche: clausole illegittime, ambiguità, lacune...',
    applicazioni: ['Due Diligence', 'Revisione Atti', 'Risk Assessment'],
    category: 'avanzata'
  },
  {
    id: 'comparative',
    name: 'Prompting Comparativo',
    description: 'Richiedere esplicitamente il confronto fra opzioni alternative',
    useCase: 'Scelta fra rimedi giuridici alternativi, analisi comparate',
    advantages: 'Facilita decisioni informate, evidenzia pro/contro',
    disadvantages: 'Output più lungo, complesso organizzare comparazione',
    complexity: 'Alta',
    cost: 'Medio',
    example: 'Confronta risolutoria vs riduzione prezzo vs risarcimento danni: quale è più efficace?',
    applicazioni: ['Scelta Rimedi', 'Analisi Alternative', 'Strategia Legale'],
    category: 'avanzata'
  },
  {
    id: 'hypothetical',
    name: 'Hypothetical Variation Prompting',
    description: 'Modificare elementi del caso ipotetico per stress-testing',
    useCase: 'Analisi scenari alternativi, anticipazione obiezioni',
    advantages: 'Esplora scenari alternativi, prepara a sorprese processuali',
    disadvantages: 'Output lungo, richiede molti scenari plausibili',
    complexity: 'Alta',
    cost: 'Alto',
    example: 'Caso base: [descrizione]. Se scopri documento X? Se cambia la giurisprudenza?',
    applicazioni: ['Stress-Testing', 'Scenari Alternativi', 'Preparazione Procedurale'],
    category: 'avanzata'
  },
  {
    id: 'deep-dive',
    name: 'Deep-Dive Giurisprudenziale',
    description: 'Analisi approfondita dell\'evoluzione giurisprudenziale su un tema',
    useCase: 'Ricerca giurisprudenziale, analisi trend Cassazione',
    advantages: 'Comprensione dell\'evoluzione legale, identifica trend',
    disadvantages: 'Limitato dal data cutoff del modello',
    complexity: 'Alta',
    cost: 'Medio',
    example: 'Analizza evoluzione Cassazione su inadempimento non scarsa importanza (ultimi 10 anni)',
    applicazioni: ['Ricerca Giurisprudenziale', 'Evoluzione Legale', 'Trend Analysis'],
    category: 'avanzata'
  },
  {
    id: 'ratio-legis',
    name: 'Ratio Legis Prompting',
    description: 'Focalizzarsi sulla finalità (teleologia) della norma',
    useCase: 'Interpretazione sostanziale, lacune normative, hard cases',
    advantages: 'Privilegia interpretazione teleologica, gestisce lacune',
    disadvantages: 'Richiede comprensione profonda della ratio, più soggettivo',
    complexity: 'Alta',
    cost: 'Medio',
    example: 'Qual è la ratio dell\'art. 1341 c.c.? Come si applica teleologicamente al caso?',
    applicazioni: ['Interpretazione Teleologica', 'Hard Cases', 'Lacune Normative'],
    category: 'avanzata'
  },
  {
    id: 'norm-conflict',
    name: 'Norm Conflict Resolution',
    description: 'Risolvere antinomie normative usando criteri di prevalenza',
    useCase: 'Conflitti fra norme, gerarchia delle fonti',
    advantages: 'Chiarisce complesse gerarchie, risolve antinomie',
    disadvantages: 'Richiede knowledge della gerarchia delle fonti',
    complexity: 'Alta',
    cost: 'Medio',
    example: 'Conflitto fra art. 1942 c.c. e legge speciale 2024: quale prevale? Criterio: gerarchia/specialità',
    applicazioni: ['Conflitti Normativi', 'Gerarchia Fonti', 'Antinomie'],
    category: 'avanzata'
  },
  {
    id: 'exam-style',
    name: 'Exam-Style Full Parere',
    description: 'Strutturare output come parere formale completo',
    useCase: 'Pareri formali per clienti, training praticanti',
    advantages: 'Formato professionale riconoscibile, completo',
    disadvantages: 'Richiede setup iniziale della struttura',
    complexity: 'Alta',
    cost: 'Medio',
    example: '1) Fattispecie 2) Questioni 3) Normativa 4) Giurisprudenza 5) Applicazione 6) Conclusioni',
    applicazioni: ['Pareri Formali', 'Training', 'Documentazione Professionale'],
    category: 'avanzata'
  },
  {
    id: 'iterative',
    name: 'Prompting Iterativo',
    description: 'Costruire progressivamente l\'analisi attraverso dialogo sequenziale',
    useCase: 'Analisi complessa, affinamenti successivi',
    advantages: 'Permette affinamenti, costruisce gradualmente',
    disadvantages: 'Richiede più interazioni, context window limitato',
    complexity: 'Media',
    cost: 'Medio',
    example: '1) Analizza contratto 2) Approfondisci clausola X 3) Verifica art. Y 4) Proponi modifiche',
    applicazioni: ['Analisi Progressiva', 'Affinamenti', 'Costruzione Graduale'],
    category: 'base'
  },
  {
    id: 'caso-pratico',
    name: 'Caso Pratico Dettagliato',
    description: 'Presentare scenari concreti molto specifici con dettagli realistici',
    useCase: 'Analisi case-specific, applicazione pratica concreta',
    advantages: 'Output concreto e direttamente applicabile',
    disadvantages: 'Richiede attenzione a privacy, molto specifico',
    complexity: 'Media',
    cost: 'Basso',
    example: 'Tizio acquista immobile 15/03/2023. Scopre vizio strutturale. Termine prescrizione? Azioni?',
    applicazioni: ['Analisi Concrete', 'Casi Specifici', 'Applicazione Pratica'],
    category: 'base'
  },
  {
    id: 'combined-doctrinal',
    name: 'Combined-Doctrinal Prompting',
    description: 'Integrare prospettive dottrinali diverse e contraddittorie',
    useCase: 'Questioni dottrinalmente controverse, visione plurale',
    advantages: 'Visione plurale, gestisce controversie dottrinali',
    disadvantages: 'Output lungo, potenzialmente confuso',
    complexity: 'Alta',
    cost: 'Alto',
    example: 'Analizza causa contrattuale secondo: teoria oggettiva, soggettiva, funzione economico-sociale',
    applicazioni: ['Controversie Dottrinali', 'Visione Plurale', 'Approfondimento Teorico'],
    category: 'esperta'
  },
  {
    id: 'procedural-mix',
    name: 'Procedural + Substantive Mix',
    description: 'Integrare diritto sostanziale e processuale in analisi unitaria',
    useCase: 'Strategia processuale completa, visione olistica',
    advantages: 'Visione olistica della strategia processuale',
    disadvantages: 'Richiede competenze trasversali, output lungo',
    complexity: 'Molto Alta',
    cost: 'Alto',
    example: '1) Fondatezza pretesa 2) Strumento processuale 3) Competenza/rito 4) Onere della prova',
    applicazioni: ['Strategia Processuale', 'Visione Olistica', 'Pianificazione Procedurale'],
    category: 'esperta'
  },
  {
    id: 'risk-assessment',
    name: 'Risk Assessment Prompting',
    description: 'Valutazione sistematica dei rischi legali e strategie di mitigazione',
    useCase: 'Due diligence, analisi operazioni commerciali, compliance',
    advantages: 'Identifica rischi nascosti, suggerisce mitigazione',
    disadvantages: 'Richiede comprensione approfondita della situazione',
    complexity: 'Alta',
    cost: 'Alto',
    example: 'Valuta rischi legali di [operazione]: rischi legali, reputazionali, finanziari, mitigazione',
    applicazioni: ['Risk Assessment', 'Due Diligence', 'Compliance'],
    category: 'avanzata'
  }
];

export const glossaryTerms: GlossaryTerm[] = [
  { id: 'ai', term: 'AI (Intelligenza Artificiale)', definition: 'Sistema informatico progettato per svolgere compiti che richiederebbero intelligenza umana. Nel contesto legale, rilevanti i modelli linguistici per analisi, redazione e ricerca.', letter: 'A' },
  { id: 'training', term: 'Addestramento (Training)', definition: 'Fase in cui il modello viene esposto a grandi quantità di dati. Il modello non "ricorda" i singoli documenti, ma apprende schemi statistici generali.', letter: 'A' },
  { id: 'allucinazione', term: 'Allucinazione', definition: 'Output plausibile ma fattualmente falso. Nel diritto: sentenze inesistenti, articoli inventati. Richiede sempre verifica su fonti ufficiali.', letter: 'A' },
  { id: 'scope', term: 'Ambito di applicazione (Scope)', definition: 'Perimetro della richiesta nel prompt: materia, giurisdizione, periodo temporale (es. "solo Cassazione ultimi 5 anni").', letter: 'A' },
  { id: 'benchmark', term: 'Benchmark', definition: 'Test standardizzati per valutare le prestazioni di un modello. Non sostituiscono la valutazione specifica per il dominio legale.', letter: 'B' },
  { id: 'bias', term: 'Bias (Pregiudizio)', definition: 'Distorsione nelle risposte causata dai dati di addestramento. Può comportare scarsa attenzione alla specificità giuridica italiana.', letter: 'B' },
  { id: 'cot', term: 'Chain-of-Thought (CoT)', definition: 'Tecnica che chiede al modello di mostrare il ragionamento passo per passo. Utile per pareri complessi e verifica logica.', letter: 'C' },
  { id: 'chatbot', term: 'Chatbot legale', definition: 'Interfaccia conversazionale basata su AI per risposte giuridiche. Strumento di supporto, non sostituisce l\'avvocato.', letter: 'C' },
  { id: 'contesto', term: 'Contesto (Context)', definition: 'Informazioni inserite nel prompt per guidare la risposta: fatti, tipo di cliente, fase procedurale. Riduce le allucinazioni.', letter: 'C' },
  { id: 'context-window', term: 'Context window', definition: 'Capacità massima del modello di "ricordare" testo nel prompt e nella conversazione corrente.', letter: 'C' },
  { id: 'cutoff', term: 'Data Cutoff', definition: 'Data oltre la quale il modello non ha conoscenze aggiornate. Leggi recenti potrebbero non essere note.', letter: 'D' },
  { id: 'dati-personali', term: 'Dati personali / sensibili', definition: 'Informazioni identificative. Regola pratica: mai inserire dati reali dei clienti nei prompt; usare dati fittizi.', letter: 'D' },
  { id: 'deep-learning', term: 'Deep Learning', definition: 'Tecniche di apprendimento automatico basate su reti neurali profonde, base tecnologica dei LLM.', letter: 'D' },
  { id: 'exam-style', term: 'Exam-Style Prompting', definition: 'Strutturare il prompt come un parere d\'esame: 1) Fatti, 2) Questioni, 3) Normativa, 4) Giurisprudenza, 5) Conclusioni.', letter: 'E' },
  { id: 'few-shot', term: 'Few-Shot Prompting', definition: 'Fornire 2-5 esempi di output desiderato prima della richiesta. Esempio: mostrare due analisi di clausole prima di chiederne una terza.', letter: 'F' },
  { id: 'framework', term: 'Framework di prompting', definition: 'Schema strutturato per progettare prompt (es. Task, Context, Output, Format).', letter: 'F' },
  { id: 'generative', term: 'Generative AI', definition: 'Modelli che generano nuovi contenuti (testi, bozze di atti) basandosi su pattern appresi.', letter: 'G' },
  { id: 'hard-case', term: 'Hard Case', definition: 'Casi con normativa non chiara. Essenziale chiedere all\'AI alternative interpretative e distinzioni tra orientamenti.', letter: 'H' },
  { id: 'istruzioni', term: 'Istruzioni (Instructions)', definition: 'Comandi espliciti nel prompt (analizza, riscrivi, sintetizza). Definiscono cosa deve fare il modello.', letter: 'I' },
  { id: 'issue-spotting', term: 'Issue-Spotting', definition: 'Tecnica che chiede di individuare tutte le questioni giuridiche rilevanti. Utile per due diligence e revisioni.', letter: 'I' },
  { id: 'llm', term: 'Large Language Model (LLM)', definition: 'Modello addestrato su enormi quantità di testo. Non "capisce" il diritto, ma imita schemi argomentativi.', letter: 'L' },
  { id: 'responsabilita', term: 'Limiti di responsabilità', definition: 'Necessità di chiarire che gli output AI sono ausiliari. La decisione finale è sempre professionale.', letter: 'L' },
  { id: 'meta', term: 'Meta Prompting', definition: 'Uso di prompt per generare altri prompt efficaci (es. generare un template per analisi contratti).', letter: 'M' },
  { id: 'provider', term: 'Model Provider', definition: 'Soggetto che fornisce il modello (OpenAI, Google, ecc.). Rilevante per privacy e condizioni d\'uso.', letter: 'M' },
  { id: 'norm-conflict', term: 'Norm Conflict Resolution', definition: 'Prompting per risolvere antinomie tra norme usando criteri di gerarchia, specialità e cronologia.', letter: 'N' },
  { id: 'output', term: 'Output', definition: 'Risultato generato. Utile specificare forma e stile (es. "Tabella", "Parere formale").', letter: 'O' },
  { id: 'temperatura', term: 'Parametri (Temperatura)', definition: 'Impostazioni del modello. Temperatura bassa (0-0.3) preferibile per compiti giuridici per maggiore coerenza.', letter: 'P' },
  { id: 'persona', term: 'Persona / Ruolo', definition: 'Identità assegnata al modello (es. "sei un avvocato esperto"). Modula tono e stile.', letter: 'P' },
  { id: 'prompt-engineering', term: 'Prompt Engineering', definition: 'Arte di progettare prompt efficaci. Equivalente a saper istruire un collaboratore veloce ma poco autonomo.', letter: 'P' },
  { id: 'prompting-comparativo', term: 'Prompting Comparativo', definition: 'Richiedere confronto esplicito tra opzioni giuridiche (es. azione risolutoria vs riduzione prezzo).', letter: 'P' },
  { id: 'prompting-iterativo', term: 'Prompting Iterativo', definition: 'Costruire il risultato tramite scambi successivi: analisi, raffinamento, riscrittura.', letter: 'P' },
  { id: 'rag', term: 'RAG (Retrieval-Augmented Gen)', definition: 'Il modello interroga fonti esterne (database, documenti) prima di rispondere. Ponte tra LLM e banche dati.', letter: 'R' },
  { id: 'ratio-legis', term: 'Ratio Legis', definition: 'Spirito della norma. Utile chiedere al modello di spiegarla per interpretare casi dubbi.', letter: 'R' },
  { id: 'responsabilita-prof', term: 'Responsabilità professionale', definition: 'L\'uso di AI non attenua la responsabilità. Richiede revisione umana e verifica fonti.', letter: 'R' },
  { id: 'self-consistency', term: 'Self-Consistency', definition: 'Generare più risposte indipendenti e scegliere la più coerente. Utile per questioni ad alto rischio.', letter: 'S' },
  { id: 'sistema-esperto', term: 'Sistema esperto vs LLM', definition: 'I primi usano regole rigide; gli LLM apprendono dai dati e usano linguaggio naturale, ma sono meno deterministici.', letter: 'S' },
  { id: 'tecnica', term: 'Tecnica di Prompting', definition: 'Metodo per costruire il prompt (Zero-shot, Few-shot, CoT). Scegliere quella giusta è competenza chiave.', letter: 'T' },
  { id: 'token', term: 'Token', definition: 'Unità minima di testo usata dal modello. Incide su costi e lunghezza massima della risposta.', letter: 'T' },
  { id: 'tree-of-thought', term: 'Tree-of-Thought', definition: 'Il modello esplora diversi rami di ragionamento possibili prima di concludere. Utile per strategia processuale.', letter: 'T' },
  { id: 'vincoli', term: 'Vincoli (Constraints)', definition: 'Limiti espliciti nel prompt: lunghezza, fonti ammesse, stile. Rendono il modello più controllabile.', letter: 'V' },
  { id: 'zero-shot', term: 'Zero-Shot Prompting', definition: 'Richiesta diretta senza esempi. Veloce ma fragile su casi complessi.', letter: 'Z' }
];

export const bestPractices: BestPractice[] = [
  { id: 'specifico', title: 'Sii Specifico e Dettagliato', description: 'Fornisci il massimo contesto. Piuttosto che "analizza questo contratto", scrivi "analizza questa compravendita immobiliare per identificare clausole vessatorie secondo art. 1341-1342 c.c."', type: 'do' },
  { id: 'norme', title: 'Cita le Norme Applicabili', description: 'Riferimenti come "art. 1382 c.c." aiutano il modello a focalizzarsi sulla normativa corretta. Includi sempre gli articoli rilevanti.', type: 'do' },
  { id: 'esempi', title: 'Fornisci Esempi', description: 'Se possibile, includi 2-3 casi similari di fattispecie legali. Questo migliora notevolmente la qualità della risposta.', type: 'do' },
  { id: 'ragionamento', title: 'Chiedi Ragionamento Passo-Passo', description: 'Per questioni complesse, richiedi analisi esplicita per step: "Procedi passo dopo passo: 1) Identifica... 2) Verifica... 3) Analizza..."', type: 'do' },
  { id: 'verifica', title: 'Verifica i Risultati', description: 'Confronta sempre le risposte con altre fonti. Non fidarti mai completamente di una singola risposta AI senza verifica indipendente.', type: 'do' },
  { id: 'terminologia', title: 'Usa Terminologia Corretta', description: 'Usa il linguaggio legale italiano preciso. "Nullità", "annullabilità", "inesistenza" non sono sinonimi—la precisione terminologica è critica.', type: 'do' },
  { id: 'dati-sensibili', title: 'Non Fornire Dati Sensibili', description: 'Evita di inserire nomi veri di clienti, IBAN, codici fiscali, o informazioni privilegiate nel prompt.', type: 'dont' },
  { id: 'fiducia-cieca', title: 'Non Avere Fiducia Cieca', description: 'Verifica sempre le conclusioni legali. I modelli possono "allucinare" informazioni false o imprecise.', type: 'dont' },
  { id: 'prompt-vaghi', title: 'Non Usare Prompt Vaghi', description: 'Evita richieste generiche come "dimmi tutto sulla compravendita". Sii sempre specifico sul cosa e perché.', type: 'dont' },
  { id: 'allucinazioni', title: 'Non Ignorare le Allucinazioni', description: 'Se vedi risposte che sembrano sbagliate o inventate, non procedere. Richiedi chiarimenti e verifica.', type: 'dont' },
  { id: 'unica-fonte', title: 'Non Usare come Unica Fonte', description: 'L\'AI non può essere l\'unica base per consulenza legale. È uno strumento di supporto, non un avvocato.', type: 'dont' },
  { id: 'presentare', title: 'Non Presentare come Tuo Lavoro', description: 'Non presentare output AI non rivisti come tuo lavoro professionale. Sempre review e personalizza prima di usare.', type: 'dont' }
];

export const promptTemplates: PromptTemplate[] = [
  {
    id: 'analisi-contratto',
    name: 'Analisi Contrattuale',
    description: 'Template per analizzare un contratto alla ricerca di clausole problematiche',
    template: `Sei un avvocato civilista esperto in diritto contrattuale.

ANALIZZA IL SEGUENTE CONTRATTO:
[INSERISCI CONTRATTO]

EFFETTUA L'ANALISI SECONDO QUESTI PUNTI:
1. Identifica il tipo contrattuale e la natura giuridica
2. Verifica la presenza di clausole vessatorie (art. 1341-1342 c.c.)
3. Analizza le obbligazioni delle parti
4. Identifica eventuali nullità o annullabilità
5. Valuta la conformità alla normativa vigente
6. Suggerisci eventuali modifiche o integrazioni

FORMATO OUTPUT:
- Struttura per punti numerati
- Cita gli articoli del codice civile pertinenti
- Evidenzia in grassetto le criticità rilevanti`,
    category: 'Contratti'
  },
  {
    id: 'parere-legale',
    name: 'Parere Legale Formale',
    description: 'Struttura completa per un parere legale professionale',
    template: `Agisci come avvocato civilista. Redigi un parere legale formale sul seguente caso.

FATTISPECIE:
[DESCRIZI FATTISPECIE]

DOMANDA:
[INSERISCI DOMANDA]

STRUTTURA DEL PARERE:
1. PREMESSA - Breve descrizione della questione
2. QUADRO NORMATIVO - Norme applicabili con riferimenti
3. GIURISPRUDENZA - Orientamenti della Cassazione rilevanti
4. ANALISI - Applicazione al caso concreto
5. CONCLUSIONI - Risposta alla domanda con motivazione
6. RISCHI - Eventuali rischi o incertezze

REQUISITI:
- Usa linguaggio tecnico-giuridico
- Cita fonti specifiche
- Sei obiettivo e bilanciato`,
    category: 'Pareri'
  },
  {
    id: 'ricerca-giurisprudenza',
    name: 'Ricerca Giurisprudenziale',
    description: 'Template per ricercare e analizzare la giurisprudenza',
    template: `Sei un ricercatore legale specializzato in giurisprudenza.

TEMATICA DA ANALIZZARE:
[INSERISCI TEMA]

SVOLGI:
1. Identifica i principi giuridici fondamentali sulla tematica
2. Descrivi l'evoluzione interpretativa nel tempo
3. Evidenzia le diverse orientamenti della Cassazione (se presenti)
4. Indica le sentenze più rilevanti (indicando numero e data)
5. Analizza lo stato attuale della disciplina

NOTA: Verifica sempre le sentenze citate su banche dati ufficiali.`,
    category: 'Ricerca'
  },
  {
    id: 'strategia-processuale',
    name: 'Strategia Processuale',
    description: 'Template per pianificare una strategia processuale',
    template: `Come avvocato processualista, analizza la strategia processuale per il seguente caso.

CASO:
[DESCRIZI CASO]

OBIETTIVO:
[INSERISCI OBIETTIVO]

SVOLGI L'ANALISI:
1. Valutazione della fondatezza della pretesa/difesa
2. Identificazione dello strumento processuale più adeguato
3. Analisi della competenza e del rito
4. Valutazione dell'onere della prova
5. Identificazione dei rischi processuali
6. Strategia consigliata con alternative
7. Timeline stimata e costi

CONSIDERA:
- Aspetti sostanziali e processuali
- Precedenti giurisprudenziali
- Elementi di forzza e debolezza`,
    category: 'Processo'
  },
  {
    id: 'due-diligence',
    name: 'Due Diligence',
    description: 'Template per analisi di due diligence',
    template: `Sei un avvocato esperto in due diligence. Analizza la segute operazione.

OPERAZIONE:
[DESCRIZI OPERAZIONE]

DOCUMENTI DISPONIBILI:
[ELENCA DOCUMENTI]

EFFETTUA:
1. Issue Spotting - Identifica TUTTE le problematiche legali potenziali
2. Analisi contrattuale - Verifica clausole critiche
3. Verifica compliance - Controlla conformità normativa
4. Valutazione rischi - Classifica per gravità e probabilità
5. Suggerimenti mitigazione - Proposte per ridurre i rischi

OUTPUT:
- Report strutturato per aree (civile, societario, fiscale, ecc.)
- Tabella riassuntiva dei rischi con priorità
- Raccomandazioni operative`,
    category: 'Compliance'
  },
  {
    id: 'revisione-atto',
    name: 'Revisione Atto Processuale',
    description: 'Template per revisionare un atto processuale',
    template: `Revisiona il seguente atto processuale come avvocato esperto.

ATTO DA REVISIONARE:
[INSERISCI ATTO]

TIPO ATTO: [es. citazione, memoria, comparsa]

VERIFICA:
1. Requisiti di forma (artt. 125 e seg. c.p.c.)
2. Correttezza delle deduzioni di fatto
3. Correttezza delle deduzioni di diritto
4. Completezza della documentazione
5. Termini processuali
6. Stile e chiarezza espositiva

FORNISCI:
- Elenco puntato delle correzioni necessarie
- Versione corretta dei passaggi problematici
- Suggerimenti per migliorare la persuasività`,
    category: 'Processo'
  }
];

export const aiTools = [
  { name: 'ChatGPT', url: 'https://openai.com/', icon: '💬', desc: 'OpenAI' },
  { name: 'Claude', url: 'https://claude.ai/', icon: '🤖', desc: 'Anthropic' },
  { name: 'Gemini', url: 'https://gemini.google.com/', icon: '🔮', desc: 'Google' },
  { name: 'Kimi', url: 'https://www.kimi.com/', icon: '✨', desc: 'Moonshot AI' },
  { name: 'Qwen', url: 'https://qwen.ai/', icon: '🌐', desc: 'Alibaba' },
  { name: 'Grok', url: 'https://x.ai/grok', icon: '⚡', desc: 'xAI' },
  { name: 'DeepSeek', url: 'https://deep-seek.ai', icon: '🔍', desc: 'DeepSeek' },
  { name: 'Mistral', url: 'https://mistral.ai/', icon: '🚀', desc: 'Mistral AI' },
  { name: 'Perplexity', url: 'https://perplexity.ai/', icon: '🧠', desc: 'Perplexity' },
  { name: 'NotebookLM', url: 'https://notebooklm.google/', icon: '📖', desc: 'Google' },
  { name: 'Google AI Studio', url: 'https://aistudio.google.com/', icon: '⚙️', desc: 'Google' },
  { name: 'OpenRouter', url: 'https://openrouter.ai/', icon: '🌉', desc: 'API' }
];
