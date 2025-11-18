import z, { ZodObject } from 'zod';

const getTransactionSchema = z.object({
  page: z
    .union([
      z
        .string()
        .regex(/^\d+$/, { message: 'Page harus berupa angka' })
        .transform(Number),
      z.number(),
    ])
    .refine((val) => val >= 1, { message: 'Page minimal 1' })
    .optional(),

  limit: z
    .union([
      z
        .string()
        .regex(/^\d+$/, { message: 'Limit harus berupa angka' })
        .transform(Number),
      z.number(),
    ])
    .refine((val) => val >= 1, { message: 'Limit minimal 1' })
    .optional(),
  group_by: z.enum(['month']).optional(),
});

export class GetTransactionDto {
  static readonly schema: ZodObject<typeof getTransactionSchema.shape> =
    getTransactionSchema;

  constructor(
    public readonly page?: number,
    public readonly limit?: number,
    public readonly group_by?: 'month',
  ) {}
}
