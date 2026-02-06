import React, { useState, useEffect } from 'react';
import { Theme } from '../types';
import { wordList } from '../utils/wordList';
import { Copy, Check, RefreshCw, KeyRound, Settings2 } from 'lucide-react';

interface PassphraseGeneratorProps {
  theme: Theme;
}

export const PassphraseGenerator: React.FC<PassphraseGeneratorProps> = ({ theme }) => {
  const [passphrase, setPassphrase] = useState<string>('');
  const [wordCount, setWordCount] = useState<number>(12);
  const [separator, setSeparator] = useState<string>('-');
  const [copied, setCopied] = useState<boolean>(false);

  const generatePassphrase = () => {
    const words: string[] = [];
    for (let i = 0; i < wordCount; i++) {
      const randomIndex = Math.floor(Math.random() * wordList.length);
      words.push(wordList[randomIndex]);
    }
    setPassphrase(words.join(separator));
  };

  // Initial generation
  useEffect(() => {
    generatePassphrase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = async () => {
    if (!passphrase) return;
    try {
      await navigator.clipboard.writeText(passphrase);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const getThemeStyles = () => {
    switch (theme) {
      case Theme.NEON:
        return {
          container: 'bg-black/80 border-cyan-900 shadow-[0_0_15px_-5px_rgba(6,182,212,0.3)]',
          header: 'text-orange-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.8)]',
          displayBox: 'bg-gray-900/50 border-cyan-500/50 text-cyan-300 shadow-neon-blue',
          controlLabel: 'text-cyan-400',
          controlValue: 'text-orange-500',
          slider: 'accent-orange-500',
          select: 'bg-gray-900 border-cyan-800 text-cyan-300 focus:border-orange-500',
          buttonPrimary: 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-[0_0_10px_rgba(249,115,22,0.5)] hover:from-orange-500 hover:to-red-500',
          buttonSecondary: 'text-cyan-500 hover:text-cyan-300 hover:bg-cyan-900/20',
        };
      case Theme.DARK:
        return {
          container: 'bg-gray-800/50 border-gray-700',
          header: 'text-blue-400',
          displayBox: 'bg-gray-900 border-gray-600 text-gray-200',
          controlLabel: 'text-gray-300',
          controlValue: 'text-blue-400',
          slider: 'accent-blue-500',
          select: 'bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500',
          buttonPrimary: 'bg-blue-600 text-white hover:bg-blue-500',
          buttonSecondary: 'text-gray-400 hover:text-white hover:bg-gray-700',
        };
      default:
        return {
          container: 'bg-white border-gray-200 shadow-sm',
          header: 'text-blue-700',
          displayBox: 'bg-gray-50 border-gray-200 text-gray-800',
          controlLabel: 'text-gray-600',
          controlValue: 'text-blue-600',
          slider: 'accent-blue-600',
          select: 'bg-white border-gray-300 text-gray-700 focus:border-blue-500',
          buttonPrimary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
          buttonSecondary: 'text-gray-500 hover:text-gray-800 hover:bg-gray-100',
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <div className={`mt-12 w-full rounded-2xl border p-6 transition-all duration-300 ${styles.container}`}>
      <div className="flex items-center gap-3 mb-6">
        <KeyRound size={24} className={styles.header} />
        <h2 className={`text-xl font-bold uppercase tracking-wider ${styles.header}`}>Passphrase Generator</h2>
      </div>

      {/* Display Area */}
      <div className={`relative w-full rounded-xl p-4 mb-6 border-2 transition-all ${styles.displayBox}`}>
        <div className="font-mono text-lg break-all leading-relaxed min-h-[3rem] flex items-center pr-10">
          {passphrase}
        </div>
        <div className="absolute top-2 right-2 flex gap-1">
           <button
            onClick={handleCopy}
            className={`p-2 rounded-lg transition-colors ${styles.buttonSecondary}`}
            title="Copy to Clipboard"
          >
            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${styles.controlLabel}`}>
              <Settings2 size={14} /> Word Count
            </label>
            <span className={`font-mono font-bold ${styles.controlValue}`}>{wordCount}</span>
          </div>
          <input
            type="range"
            min="6"
            max="24"
            value={wordCount}
            onChange={(e) => setWordCount(parseInt(e.target.value))}
            className={`w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-500/20 ${styles.slider}`}
          />
          <div className={`flex justify-between text-[10px] mt-1 opacity-60 ${styles.controlLabel}`}>
            <span>6 words</span>
            <span>24 words</span>
          </div>
        </div>

        <div>
          <label className={`block text-sm font-bold uppercase tracking-wider mb-2 ${styles.controlLabel}`}>
            Separator
          </label>
          <select
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
            className={`w-full p-2 rounded-lg border outline-none transition-colors ${styles.select}`}
          >
            <option value="-">Hyphen (-)</option>
            <option value=" ">Space ( )</option>
            <option value="_">Underscore (_)</option>
          </select>
        </div>
      </div>

      {/* Main Action */}
      <button
        onClick={generatePassphrase}
        className={`w-full py-3 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 ${styles.buttonPrimary}`}
      >
        <RefreshCw size={20} /> Generate Passphrase
      </button>
    </div>
  );
};
