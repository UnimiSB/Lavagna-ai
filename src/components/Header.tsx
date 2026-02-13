import { useState } from 'react';
import {
  Scale,
  Moon,
  Sun,
  ChevronDown,
  ExternalLink,
  Heart,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { aiTools } from '@/data/techniques';
import type { TabType } from '@/types';

interface HeaderProps {
  isDark: boolean;
  toggleDark: () => void;
  favoritesCount: number;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'Home', icon: <span className="text-sm">🏠</span> },
  { id: 'catalog', label: 'Catalogo', icon: <span className="text-sm">📚</span> },
  { id: 'comparison', label: 'Confronto', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'glossary', label: 'Glossario', icon: <span className="text-sm">📖</span> },
  { id: 'practices', label: 'Best Practices', icon: <span className="text-sm">✅</span> },
  { id: 'generator', label: 'Generatore', icon: <span className="text-sm">✨</span> },
];

export function Header({ isDark, toggleDark, favoritesCount, activeTab, onTabChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-lg">
              <Scale className="h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold leading-tight text-foreground">
                AI & Prompting per Avvocati
              </h1>
              <p className="text-xs text-muted-foreground">
                Breve guida per interagire con l'AI
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  flex items-center gap-2
                  ${activeTab === tab.id
                    ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }
                `}
              >
                {tab.icon}
                {tab.label}
                {tab.id === 'comparison' && favoritesCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1 text-xs">
                    {favoritesCount}
                  </Badge>
                )}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* AI Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                  <span>🛠️</span>
                  Tool AI
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>Strumenti AI Consigliati</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {aiTools.map((tool) => (
                  <DropdownMenuItem key={tool.name} asChild>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{tool.icon}</span>
                        <div>
                          <span className="font-medium">{tool.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">{tool.desc}</span>
                        </div>
                      </div>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Favorites Badge */}
            {favoritesCount > 0 && (
              <div className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm">
                <Heart className="h-4 w-4 fill-current" />
                <span className="font-medium">{favoritesCount}</span>
              </div>
            )}

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDark}
              className="rounded-full"
              aria-label={isDark ? 'Attiva modalità chiara' : 'Attiva modalità scura'}
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t">
            <div className="flex flex-col gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`
                    px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                    flex items-center gap-3 text-left
                    ${activeTab === tab.id
                      ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }
                  `}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.id === 'comparison' && favoritesCount > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {favoritesCount}
                    </Badge>
                  )}
                </button>
              ))}

              <div className="mt-4 pt-4 border-t">
                <p className="px-4 text-xs font-medium text-muted-foreground mb-2">
                  STRUMENTI AI
                </p>
                {aiTools.slice(0, 6).map((tool) => (
                  <a
                    key={tool.name}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <span>{tool.icon}</span>
                    {tool.name}
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </a>
                ))}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
