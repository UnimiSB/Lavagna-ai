import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github, BookOpen } from 'lucide-react';

export function IntroSection() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-teal-500" />
          Introduzione al progetto
        </h2>
        <p className="text-muted-foreground">
          Lavagna AI è uno strumento pensato per supportare avvocati e professionisti del diritto
          nell'esplorazione di tecniche di prompting, modelli e pratiche consigliate per l'utilizzo
          dell'intelligenza artificiale in ambito civilistico. Qui trovi una panoramica delle funzionalità,
          esempi e risorse utili per iniziare.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cosa offre Lavagna AI</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
            <li>Catalogo organizzato di tecniche di prompting e modelli utili.</li>
            <li>Sezione di confronto per scegliere l'approccio più adatto.</li>
            <li>Generatore di prompt e template pronti all'uso.</li>
            <li>Glossario e best practices per un uso responsabile.</li>
          </ul>

          <div className="mt-4 flex items-center gap-3">
            <Button asChild>
              <a href="/README.md" target="_blank" rel="noopener noreferrer">Leggi il README</a>
            </Button>

            <Button variant="outline" asChild>
              <a href="https://github.com/UnimiSB/Lavagna-ai" target="_blank" rel="noopener noreferrer">
                <GitHub className="mr-2 h-4 w-4" /> Repository
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default IntroSection;
