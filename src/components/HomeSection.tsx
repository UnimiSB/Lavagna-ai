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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Welcome Card */}
        <Card className="lg:col-span-4 lg:h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Benvenuto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-relaxed">
              Nel corso dei mesi di dicembre 2024 e gennaio 2025, l'Ordine degli Avvocati di Como ha organizzato una serie di incontri formativi relativi all'utilizzo dell'intelligenza artificiale nella professione legale.
            </p>
            <p className="text-sm leading-relaxed">
              È stato così realizzato, dall'intelligenza artificiale generativa, il presente breve prontuario. Nella sezione "Catalogo" sono elencate alcune delle più note tecniche di prompting; le tecniche possono essere confrontate nella sezione "Confronto". Vi sono poi un "Glossario" e un breve elenco di utili accorgimenti ("Best practices") da adottare nell'uso dell'IA.
            </p>
            <p className="text-sm leading-relaxed">
              Nello spazio a lato è possibile interagire con l'intelligenza artificiale generativa "Chat AI", scegliendo nel menù a tendina uno tra i tanti modelli disponibili. Il piccolo budget cala ad ogni interazione della quale si può vedere il costo.
            </p>
            <p className="text-sm leading-relaxed">
              Como, febbraio 2026
            </p>
          </CardContent>
        </Card>

        {/* AI Chat Interface */}
        <div className="lg:col-span-8">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}

export default HomeSection;
