import { z, ZodObject } from 'zod';

const registerAuthSchema = z.object({
  username: z
    .string({
      error: (iss) => {
        if (iss.code === 'invalid_type') return 'Username harus berupa string';
      },
    })
    .trim()
    .min(1, 'Username wajib diisi')
    .max(100, 'Username tidak boleh lebih dari 100 karakter')
    .toLowerCase(),
  full_name: z
    .string({
      error: (iss) => {
        if (iss.code === 'invalid_type')
          return 'Nama lengkap harus berupa string';
      },
    })
    .min(1, 'Nama lengkap wajib diisi')
    .max(100, 'Nama lengkap tidak boleh lebih dari 100 karakter'),
  email: z
    .string({
      error: (iss) => {
        if (iss.code === 'invalid_type') return 'Email harus berupa string';
      },
    })
    .trim()
    .min(1, 'Email wajib diisi')
    .max(100, 'Email tidak boleh lebih dari 100 karakter')
    .toLowerCase()
    .pipe(
      z.email({
        error: (iss) => {
          if (iss.code === 'invalid_format') return 'Format email tidak sesuai';
        },
      }),
    ),
  password: z
    .string()
    .min(8, 'Password harus memiliki minimal 8 karakter')
    .max(100, 'Password tidak boleh lebih dari 100 karakter')
    .refine(
      (password) => /[A-Z]/.test(password),
      'Password harus mengandung setidaknya satu huruf besar (A-Z)',
    )
    .refine(
      (password) => /[a-z]/.test(password),
      'Password harus mengandung setidaknya satu huruf kecil (a-z)',
    )
    .refine(
      (password) => /[0-9]/.test(password),
      'Password harus mengandung setidaknya satu angka (0-9)',
    )
    .refine(
      (password) => /[!@#$%^&*]/.test(password),
      'Password harus mengandung setidaknya satu karakter spesial (!@#$%^&*)',
    ),
  balance: z
    .number({
      error: (iss) => {
        if (iss.code === 'invalid_type') return 'Saldo harus berupa angka';
      },
    })
    .nullish(),
});

export class RegisterAuthDto {
  static readonly schema: ZodObject<typeof registerAuthSchema.shape> =
    registerAuthSchema;

  constructor(
    public readonly username: string,
    public readonly full_name: string,
    public readonly email: string,
    public password: string,
    public readonly balance?: number,
  ) {}
}
