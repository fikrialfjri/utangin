/* eslint-disable @typescript-eslint/no-explicit-any */
export type ValidatorFn = (
  value: any,
  values?: Record<string, any>,
) => string | null;

export type FieldValidators<T extends Record<string, any>> = {
  [K in keyof T]?: ValidatorFn[];
};

export function runFieldValidators<T extends Record<string, any>>(
  name: keyof T,
  value: any,
  values: T,
  validators?: FieldValidators<T>,
): string | null {
  const rules = validators?.[name];
  if (!rules || rules.length === 0) return null;

  for (const rule of rules) {
    const msg = rule(value, values);
    if (msg) return msg;
  }
  return null;
}

export const valid = {
  min:
    (label: string, len: number, msg?: string): ValidatorFn =>
    (value) => {
      if (String(value).length < len)
        return msg || `${label} harus memiliki minimal ${len} karakter`;
      return null;
    },
  max:
    (label: string, len: number, msg?: string): ValidatorFn =>
    (value) => {
      if (String(value).length > len)
        return msg || `${label} tidak boleh lebih dari ${len} karakter`;
      return null;
    },
};
