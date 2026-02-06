import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Theme } from '../types';

interface PasswordDisplayProps {
  password: string;
  theme: Theme;
  onGenerate: () => void;
}

export const PasswordDisplay: React.FC<PasswordDisplayProps> = ({ password, theme, onGenerate }) => {
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState({ score: 0, label: 'Weak' });

  useEffect(() => {
    calculateStrength(password);
  }, [password]);

  const calculateStrength = (pass: string) => {
    if (!pass) {
      setStrength({ score: 0, label: '' });
      return;
    }

    let score = 0;
    if (/[a-z]/.test(pass)) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[^a-zA-Z0-9]/.test(pass)) score++;

    let label = 'Weak';
    if (score === 2) label = 'Fair';
    if (score === 3) label = 'Strong';
    if (score === 4) {
      label = 'Very Strong';
      if (pass.length >= 18) label = 'Extremely Strong';
    }
    // Adjust label if score is 1
    if (score === 1) label = 'Weak';

    setStrength({ score, label });
  };

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

  // Helper to get bar color based on score
  const getBarColor = (index: number) => {
    const isActive = index < strength.score;
    // Inactive bar color
    if (!isActive) {
      return theme === Theme.NEON ? 'bg-gray-800' : 'bg-gray-200';
    }

    // Active Colors
    if (theme === Theme.NEON) {
        if (strength.score <= 2) return 'bg-orange-600 shadow-[0_0_5px_#ea580c]';
        if (strength.score === 3) return 'bg-yellow-400 shadow-[0_0_5px_#facc15]';
        return 'bg-cyan-500 shadow-[0_0_8px_#06b6d4]';
    }
    
    // Light/Dark Themes
    if (strength.score <= 2) return 'bg-red-500';
    if (strength.score === 3) return 'bg-yellow-500';
    return 'bg-green-500';
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
            <span className={`transition-colors duration-300 ${
                theme === Theme.NEON 
                    ? (strength.label === 'Extremely Strong' ? 'text-cyan-300 drop-shadow-[0_0_5px_#06b6d4]' : 'text-orange-500') 
                    : (strength.score >= 4 ? 'text-green-600' : strength.score === 3 ? 'text-yellow-600' : 'text-red-500')
            }`}>
                {strength.label}
            </span>
         </div>
         <div className="flex gap-2 h-2">
            {[0, 1, 2, 3].map((i) => (
                <div 
                    key={i} 
                    className={`flex-1 rounded-full transition-all duration-500 ${getBarColor(i)} ${
                        i === 1 ? 'delay-75' : i === 2 ? 'delay-150' : i === 3 ? 'delay-200' : ''
                    }`} 
                />
            ))}
         </div>
      </div>
    </div>
  );
};
