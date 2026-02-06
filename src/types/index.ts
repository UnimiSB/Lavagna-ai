// Types for the Prompting Tool

export interface Technique {
  id: string;
  name: string;
  description: string;
  useCase: string;
  advantages: string;
  disadvantages: string;
  complexity: 'Bassa' | 'Media' | 'Alta' | 'Molto Alta';
  cost: 'Basso' | 'Medio' | 'Alto' | 'Molto Alto' | 'Altissimo';
  example: string;
  applicazioni: string[];
  category: 'base' | 'avanzata' | 'esperta';
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  letter: string;
}

export interface BestPractice {
  id: string;
  title: string;
  description: string;
  type: 'do' | 'dont';
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  category: string;
}

export type TabType = 'home' | 'comparison' | 'catalog' | 'glossary' | 'practices' | 'generator';
