import { PasswordOptions } from '../types';

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

export const generatePassword = (options: PasswordOptions): string => {
  // Ensure strict compliance with the regex requirement:
  // At least one Uppercase, one Lowercase, one Symbol, one Number.
  // Min length 10.
  
  // We'll treat the options as "enabled" sets, but for this specific app requirement,
  // we will enforce the inclusion of at least one of each if the user tries to turn them off,
  // OR we assume the user of this app wants the strict mode. 
  // However, for good UX, we usually allow toggling. 
  // BUT the prompt says "Ensuring it follows the REGEX pattern". 
  // So we will force these characters into the password regardless of checkbox UI if we want to strictly follow the prompt,
  // or better, we set the UI constraints to not allow disabling all of them, 
  // and ensure the generation logic prioritizes the constraints.
  
  let charset = '';
  const mandatoryChars: string[] = [];
  
  if (options.includeUpper) {
    charset += UPPERCASE;
    mandatoryChars.push(UPPERCASE[Math.floor(Math.random() * UPPERCASE.length)]);
  }
  if (options.includeLower) {
    charset += LOWERCASE;
    mandatoryChars.push(LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)]);
  }
  if (options.includeNumbers) {
    charset += NUMBERS;
    mandatoryChars.push(NUMBERS[Math.floor(Math.random() * NUMBERS.length)]);
  }
  if (options.includeSymbols) {
    charset += SYMBOLS;
    mandatoryChars.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
  }

  // Fallback if somehow nothing is selected (should be prevented in UI)
  if (charset.length === 0) {
    charset = LOWERCASE;
    mandatoryChars.push(LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)]);
  }

  // Fill the rest
  let password = mandatoryChars.join('');
  for (let i = password.length; i < options.length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }

  // Shuffle the password
  return password.split('').sort(() => 0.5 - Math.random()).join('');
};

export const validatePassword = (password: string): boolean => {
  // Regex: At least 1 Upper, 1 Lower, 1 Number, 1 Symbol, Min 10 chars.
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,}$/;
  return regex.test(password);
};
