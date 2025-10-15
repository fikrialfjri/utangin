import { z, ZodObject } from 'zod';

const loginAuthSchema = z.object({
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
});

export class LoginAuthDto {
  static readonly schema: ZodObject<typeof loginAuthSchema.shape> =
    loginAuthSchema;

  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}
