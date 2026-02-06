import React, { useState, useEffect, useCallback } from 'react';
import { ThemeToggle } from './components/ThemeToggle';
import { PasswordDisplay } from './components/PasswordDisplay';
import { Controls } from './components/Controls';
import { PassphraseGenerator } from './components/PassphraseGenerator';
import { generatePassword } from './utils/passwordGenerator';
import { Theme, PasswordOptions, PasswordHistoryItem } from './types';
import { ShieldCheck, History, Download } from 'lucide-react';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);
  const [password, setPassword] = useState<string>('');
  const [history, setHistory] = useState<PasswordHistoryItem[]>([]);
  const [isLocked, setIsLocked] = useState<boolean>(true);
  
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUpper: true,
    includeLower: true,
    includeNumbers: true,
    includeSymbols: true,
  });

  const handleGenerate = useCallback(() => {
    const newPassword = generatePassword(options);
    setPassword(newPassword);

    setHistory(prev => {
      const newItem = { password: newPassword, timestamp: Date.now() };
      return [newItem, ...prev].slice(0, 5);
    });
  }, [options]);

  const handleExportHistory = () => {
    if (history.length === 0) return;

    const exportData = history.map(item => {
      const date = new Date(item.timestamp).toLocaleString();
      return `[${date}] ${item.password}`;
    }).join('\n');

    const header = `SecureGen Password History\nExport Date: ${new Date().toLocaleString()}\n\n`;
    const blob = new Blob([header + exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `securegen-history-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Initial generation only

  // Apply Theme Side Effects
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    if (theme === Theme.DARK || theme === Theme.NEON) {
      root.classList.add('dark');
    }
  }, [theme]);

  const getAppBackground = () => {
    switch (theme) {
      case Theme.NEON:
        return 'bg-black text-cyan-500';
      case Theme.DARK:
        return 'bg-gray-900 text-gray-100';
      default:
        return 'bg-gray-50 text-gray-900';
    }
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 ${getAppBackground()} flex flex-col items-center py-12 px-4`}>
      
      <header className="w-full max-w-2xl flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <ShieldCheck 
            size={32} 
            className={theme === Theme.NEON ? 'text-orange-500 drop-shadow-[0_0_8px_#f97316]' : theme === Theme.DARK ? 'text-blue-500' : 'text-blue-600'} 
          />
          <h1 className={`text-2xl md:text-3xl font-bold tracking-tight ${theme === Theme.NEON ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-[0_0_2px_#06b6d4]' : ''}`}>
            SecureGen
          </h1>
        </div>
        <ThemeToggle currentTheme={theme} onThemeChange={setTheme} />
      </header>

      <main className="w-full max-w-2xl">
        <PasswordDisplay 
          password={password} 
          theme={theme} 
          onGenerate={handleGenerate} 
        />
        
        <Controls 
          options={options} 
          setOptions={setOptions} 
          theme={theme} 
          isLocked={isLocked}
          setIsLocked={setIsLocked}
        />

        {/* History Section */}
        {history.length > 0 && (
          <div className={`mt-8 p-6 rounded-2xl border transition-all ${
            theme === Theme.NEON 
              ? 'border-orange-500/30 bg-black/50 shadow-[0_0_15px_-5px_rgba(249,115,22,0.3)]' 
              : theme === Theme.DARK 
                ? 'border-gray-800 bg-gray-800/30' 
                : 'border-gray-200 bg-white'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 opacity-70">
                <History size={16} />
                <h3 className="text-sm font-semibold uppercase tracking-wider">Recent History</h3>
              </div>
              <button
                onClick={handleExportHistory}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  theme === Theme.NEON 
                    ? 'hover:bg-cyan-900/30 text-cyan-500 hover:text-cyan-300' 
                    : theme === Theme.DARK 
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' 
                      : 'hover:bg-gray-100 text-gray-500 hover:text-gray-800'
                }`}
                title="Download History as Text File"
              >
                <span className="hidden sm:inline">Export</span>
                <Download size={14} />
              </button>
            </div>
            
            <div className="space-y-2">
              {history.map((item, index) => (
                <div 
                  key={item.timestamp} 
                  className={`font-mono text-sm truncate p-2 rounded cursor-pointer transition-colors ${
                    index === 0 ? 'opacity-100' : 'opacity-50 hover:opacity-100'
                  } ${
                    theme === Theme.NEON 
                      ? 'hover:bg-cyan-900/20 text-cyan-300' 
                      : theme === Theme.DARK 
                        ? 'hover:bg-gray-700 text-gray-300' 
                        : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  onClick={() => {
                    setPassword(item.password);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {item.password}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Passphrase Generator */}
        <PassphraseGenerator theme={theme} />
      </main>

      <footer className={`mt-16 text-sm ${theme === Theme.NEON ? 'text-cyan-800' : 'text-gray-400'}`}>
        <p>Securely generated client-side.</p>
      </footer>
    </div>
  );
};

export default App;
