import { z, ZodObject } from 'zod';

const updateBalanceProfileSchema = z.object({
  balance: z.number({
    error: (iss) => {
      if (iss.code === 'invalid_type') return 'Saldo harus berupa angka';
    },
  }),
});

export class UpdateBalanceProfileDto {
  static readonly schema: ZodObject<typeof updateBalanceProfileSchema.shape> =
    updateBalanceProfileSchema;

  constructor(public readonly balance: number) {}
}
