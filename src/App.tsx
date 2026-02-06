import { useState } from 'react';
import { Header } from '@/components/Header';
import { ComparisonSection } from '@/components/ComparisonSection';
import { CatalogSection } from '@/components/CatalogSection';
import { GeneratorSection } from '@/components/GeneratorSection';
import { GlossarySection } from '@/components/GlossarySection';
import { PracticesSection } from '@/components/PracticesSection';
import { HomeSection } from '@/components/HomeSection';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useFavorites } from '@/hooks/useFavorites';
import type { TabType } from '@/types';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('comparison');
  const { isDark, toggle, isLoaded: themeLoaded } = useDarkMode();
  const { favorites, toggleFavorite, isLoaded: favoritesLoaded } = useFavorites();

  // Prevent hydration mismatch
  if (!themeLoaded || !favoritesLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isDark={isDark} 
        toggleDark={toggle} 
        favoritesCount={favorites.length}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'comparison' && (
          <ComparisonSection 
            favorites={favorites} 
            toggleFavorite={toggleFavorite} 
          />
        )}
        {activeTab === 'home' && (
          <HomeSection />
        )}
        
        {activeTab === 'catalog' && (
          <CatalogSection 
            favorites={favorites} 
            toggleFavorite={toggleFavorite} 
          />
        )}
        
        {activeTab === 'generator' && (
          <GeneratorSection />
        )}
        
        {activeTab === 'glossary' && (
          <GlossarySection />
        )}
        
        {activeTab === 'practices' && (
          <PracticesSection />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-3">AI & Prompting per Avvocati</h3>
              <p className="text-sm text-muted-foreground">
                Guida interattiva per l'utilizzo dell'AI nella pratica legale italiana.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Link Utili</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="https://www.giustizia.it/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    Ministero della Giustizia
                  </a>
                </li>
                <li>
                  <a href="https://www.cortedicassazione.it/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    Corte di Cassazione
                  </a>
                </li>
                <li>
                  <a href="https://www.ordineavvocati.it/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    Consiglio Nazionale Forense
                  </a>
                </li>
                <li>
                  <a href="https://ordineavvocaticomo.it/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    Ordine degli Avvocati di Como
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Disclaimer</h3>
              <p className="text-sm text-muted-foreground">
                Questo strumento è fornito a scopo informativo. Non sostituisce il parere professionale di un avvocato.
              </p>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Prompting Avvocati - Strumento per Civilisti Italiani
          </div>
        </div>
      </footer>

      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
