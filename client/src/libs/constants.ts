export const UTANGIN_API_BASE_URL = import.meta.env.VITE_UTANGIN_API_BASE_URL;
export const UTANGIN_ASSETS_BASE_URL = import.meta.env
  .VITE_UTANGIN_ASSETS_BASE_URL;
export const TRANSACTION_TYPES = {
  DEBT: 'DEBT',
  RECEIVABLE: 'RECEIVABLE',
} as const;
export const TRANSACTION_STATUS = {
  ACTIVE: 'ACTIVE',
  PAID: 'PAID',
} as const;
export const SUMMARY_CARD_VARIANTS = {
  POTENTIAL: 'POTENTIAL',
  CURRENT: 'CURRENT',
  RECEIVABLE_DEBT: 'RECEIVABLE_DEBT',
  ...TRANSACTION_TYPES,
};
export const PASSWORD_RULES: {
  regex: RegExp;
  label: string;
}[] = [
  { regex: /[A-Z]/, label: 'Minimal 1 Huruf besar (A-Z)' },
  { regex: /[a-z]/, label: 'Minimal 1 Huruf kecil (a-z)' },
  { regex: /[0-9]/, label: 'Minimal 1 Angka (0-9)' },
  { regex: /[!@#$%^&*]/, label: 'Minimal 1 Simbol (!@#$%^&*)' },
];
