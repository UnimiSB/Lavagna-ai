import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
          <p className="text-sm text-muted-foreground">Nel corso dei mesi di dicembre 2024, l'Ordine degli Avvocati di Como ha organizzato incontri formativi relativi all'AI e la professione legale. E' stato così realizzato un progetto per aiutare gli avvocati a interagire con l'AI in modo efficace e sicuro. </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default HomeSection;
