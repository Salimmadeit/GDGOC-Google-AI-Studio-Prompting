import React, { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Theme } from '../types';

interface PasswordDisplayProps {
  password: string;
  theme: Theme;
  onGenerate: () => void;
}

export const PasswordDisplay: React.FC<PasswordDisplayProps> = ({ password, theme, onGenerate }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const getStyles = () => {
    switch (theme) {
      case Theme.NEON:
        return {
          container: 'bg-black border-2 border-cyan-500 shadow-neon-blue',
          text: 'text-cyan-400 font-mono tracking-wider drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]',
          button: 'text-orange-500 hover:text-orange-300 hover:drop-shadow-[0_0_8px_rgba(249,115,22,1)]',
          icon: 'text-cyan-500',
          label: 'text-cyan-600',
        };
      case Theme.DARK:
        return {
          container: 'bg-gray-800 border border-gray-700',
          text: 'text-white font-mono tracking-wider',
          button: 'text-gray-400 hover:text-white hover:bg-gray-700',
          icon: 'text-gray-400',
          label: 'text-gray-500',
        };
      default:
        return {
          container: 'bg-white border border-gray-200 shadow-sm',
          text: 'text-gray-800 font-mono tracking-wider',
          button: 'text-gray-500 hover:text-gray-900 hover:bg-gray-100',
          icon: 'text-gray-500',
          label: 'text-gray-400',
        };
    }
  };

  const styles = getStyles();

  // Helper to render strength bars
  const renderStrengthBars = () => {
    // We always show 4 bars because the generator ensures strict/strong passwords.
    // Neon Theme: Uniform Royal Blue to avoid confusion about "half-filled" state
    
    if (theme === Theme.NEON) {
      return (
        <>
          <div className="flex-1 rounded-full bg-blue-600 shadow-[0_0_8px_#2563eb] transition-all duration-500"></div>
          <div className="flex-1 rounded-full bg-blue-600 shadow-[0_0_8px_#2563eb] transition-all duration-500 delay-75"></div>
          <div className="flex-1 rounded-full bg-blue-600 shadow-[0_0_8px_#2563eb] transition-all duration-500 delay-150"></div>
          <div className="flex-1 rounded-full bg-blue-600 shadow-[0_0_8px_#2563eb] transition-all duration-500 delay-200"></div>
        </>
      );
    }

    // Default Green for other themes
    return (
      <>
        <div className="flex-1 rounded-full bg-green-500 transition-all duration-300"></div>
        <div className="flex-1 rounded-full bg-green-500 transition-all duration-300 delay-75"></div>
        <div className="flex-1 rounded-full bg-green-500 transition-all duration-300 delay-150"></div>
        <div className="flex-1 rounded-full bg-green-500 transition-all duration-300 delay-200"></div>
      </>
    );
  };

  return (
    <div className={`relative w-full rounded-2xl p-6 mb-6 transition-all duration-300 ${styles.container}`}>
      <div className="flex justify-between items-center gap-4 break-all">
        <div className={`text-2xl md:text-3xl font-bold truncate w-full ${styles.text}`}>
          {password}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onGenerate}
            className={`p-3 rounded-xl transition-all duration-200 ${styles.button}`}
            title="Generate New"
          >
            <RefreshCw size={24} />
          </button>
          <button
            onClick={handleCopy}
            className={`p-3 rounded-xl transition-all duration-200 ${styles.button}`}
            title="Copy to Clipboard"
          >
            {copied ? <Check size={24} className="text-green-500" /> : <Copy size={24} />}
          </button>
        </div>
      </div>
      
      {/* Strength Indicator Visual */}
      <div className="mt-5">
         <div className={`flex justify-between items-center mb-2 text-xs font-bold uppercase tracking-widest ${styles.label}`}>
            <span>Strength</span>
            <span>Maximum</span>
         </div>
         <div className="flex gap-2 h-2">
            {renderStrengthBars()}
         </div>
      </div>
    </div>
  );
};
