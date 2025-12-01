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
    .trim()
    .min(1, 'Password wajib diisi')
    .max(100, 'Password tidak boleh lebih dari 100 karakter'),
});

export class LoginAuthDto {
  static readonly schema: ZodObject<typeof loginAuthSchema.shape> =
    loginAuthSchema;

  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}
