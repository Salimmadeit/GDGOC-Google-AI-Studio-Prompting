import React from 'react';
import { Theme, PasswordOptions } from '../types';
import { Lock, Unlock, Settings2 } from 'lucide-react';

interface ControlsProps {
  options: PasswordOptions;
  setOptions: React.Dispatch<React.SetStateAction<PasswordOptions>>;
  theme: Theme;
  isLocked: boolean;
  setIsLocked: (v: boolean) => void;
}

export const Controls: React.FC<ControlsProps> = ({ options, setOptions, theme, isLocked, setIsLocked }) => {
  
  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions(prev => ({ ...prev, length: parseInt(e.target.value, 10) }));
  };

  const toggleOption = (key: keyof PasswordOptions) => {
    if (isLocked) return;
    setOptions(prev => {
      const newState = { ...prev, [key]: !prev[key] };
      // Prevent disabling all options - keep at least one
      if (!newState.includeUpper && !newState.includeLower && !newState.includeNumbers && !newState.includeSymbols) {
        return prev;
      }
      return newState;
    });
  };

  const getThemeStyles = () => {
    switch (theme) {
      case Theme.NEON:
        return {
          label: 'text-cyan-400 drop-shadow-[0_0_2px_rgba(34,211,238,0.8)]',
          subLabel: 'text-orange-400/80',
          inputRange: 'accent-orange-500',
          checkbox: 'accent-cyan-500',
          container: 'border-cyan-900/50 bg-black/50',
          headerText: 'text-cyan-500',
          toggleActive: 'bg-cyan-900/30 text-cyan-400 border border-cyan-500/50 shadow-[0_0_10px_-3px_rgba(6,182,212,0.5)]',
          toggleInactive: 'bg-orange-900/30 text-orange-400 border border-orange-500/50 hover:bg-orange-900/50',
        };
      case Theme.DARK:
        return {
          label: 'text-gray-200',
          subLabel: 'text-gray-400',
          inputRange: 'accent-blue-600',
          checkbox: 'accent-blue-600',
          container: 'border-gray-700 bg-gray-800/50',
          headerText: 'text-gray-300',
          toggleActive: 'bg-blue-900/30 text-blue-300 border border-blue-500/30',
          toggleInactive: 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600',
        };
      default:
        return {
          label: 'text-gray-700',
          subLabel: 'text-gray-500',
          inputRange: 'accent-blue-600',
          checkbox: 'accent-blue-600',
          container: 'border-gray-200 bg-gray-50',
          headerText: 'text-gray-800',
          toggleActive: 'bg-blue-50 text-blue-700 border border-blue-200',
          toggleInactive: 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200',
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <div className={`p-6 rounded-2xl border ${styles.container} transition-colors duration-300`}>
      {/* Header with Lock Toggle */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-500/10 pb-4">
        <div className="flex items-center gap-2">
          <Settings2 size={18} className={styles.headerText} />
          <h3 className={`font-bold uppercase tracking-wider text-sm ${styles.headerText}`}>Configuration</h3>
        </div>
        
        <button 
          onClick={() => setIsLocked(!isLocked)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
            isLocked ? styles.toggleActive : styles.toggleInactive
          }`}
          title={isLocked ? "Unlock to make changes" : "Lock current settings"}
        >
          {isLocked ? (
            <>
              <Lock size={14} /> 
              <span>Locked</span>
            </>
          ) : (
            <>
              <Unlock size={14} /> 
              <span>Unlocked</span>
            </>
          )}
        </button>
      </div>

      {/* Length Slider */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <label className={`text-sm font-bold uppercase tracking-wider ${styles.label}`}>
            Password Length
          </label>
          <span className={`text-2xl font-mono font-bold ${theme === Theme.NEON ? 'text-orange-500 drop-shadow-[0_0_5px_#f97316]' : styles.label}`}>
            {options.length}
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="50"
          value={options.length}
          onChange={handleLengthChange}
          className={`w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200/20 ${styles.inputRange}`}
        />
        <div className={`mt-2 text-xs ${styles.subLabel} flex justify-between`}>
          <span>Min: 10</span>
          <span>Max: 50</span>
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: 'includeUpper', label: 'Uppercase (A-Z)' },
          { key: 'includeLower', label: 'Lowercase (a-z)' },
          { key: 'includeNumbers', label: 'Numbers (0-9)' },
          { key: 'includeSymbols', label: 'Symbols (!@#$)' },
        ].map((opt) => (
          <div 
            key={opt.key}
            onClick={() => !isLocked && toggleOption(opt.key as keyof PasswordOptions)}
            className={`flex items-center p-3 rounded-lg border border-transparent transition-all ${
              isLocked 
                ? 'opacity-60 cursor-not-allowed' 
                : `${theme === Theme.NEON ? 'hover:border-cyan-500/30 cursor-pointer' : 'hover:bg-gray-500/5 cursor-pointer'}`
            }`}
          >
            <input
              type="checkbox"
              id={opt.key}
              checked={options[opt.key as keyof PasswordOptions] as boolean}
              onChange={() => {}} // Handled by div click
              disabled={isLocked} 
              className={`w-5 h-5 rounded ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'} ${styles.checkbox}`}
            />
            <label htmlFor={opt.key} className={`ml-3 text-sm font-medium ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'} ${styles.label}`}>
              {opt.label}
              {isLocked && <span className="block text-[10px] mt-0.5 opacity-60">(Locked)</span>}
            </label>
          </div>
        ))}
      </div>
      
      <p className={`mt-6 text-xs text-center italic ${styles.subLabel} transition-opacity duration-300`}>
        {isLocked 
          ? "* Settings are locked."
          : "* Unlocked. Customize your password requirements."}
      </p>
    </div>
  );
};
