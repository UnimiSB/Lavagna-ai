import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChatInterface } from './ChatInterface';

export function HomeSection() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          AI & Prompting per Avvocati
        </h2>
        <p className="text-muted-foreground">Breve guida per interagire con l'IA realizzata per l'Ordine degli Avvocati di Como</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Benvenuto</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Nel corso dei mesi di dicembre 2024 e gennaio 2025, l'Ordine degli Avvocati di Como ha organizzato una serie di incontri formativi relativi all'utilizzo dell'intelligenza artificiale nella professione legale.
            E' stato così realizzato, dall'intelligenza artificiale generativa, il presente breve prontuario. Nella sezione "Catalogo" sono elencate alcune delle più note tecniche di prompting, ossia la tecnica di formulare "quesiti" all'AI, modulando le istruzioni in funzione del risultato desiderato e della fattispecie in esame; le tecniche possono essere confrontate nella sezione "Confronto".
            Vi sono poi un "Glossario" e un breve elenco di utili accorgimenti ("Best practices") da adottare nell'uso dell'IA.
          </p>
          <p className="text-sm text-muted-foreground mt-3">
            Puoi anche utilizzare la chat qui sotto per interagire direttamente con diversi modelli AI e mettere in pratica le tecniche di prompting.
          </p>
        </CardContent>
      </Card>

      {/* AI Chat Interface */}
      <ChatInterface />
    </div>
  );
}

export default HomeSection;
