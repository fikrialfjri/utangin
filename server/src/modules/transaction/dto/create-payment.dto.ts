import z, { ZodObject } from 'zod';

const createPaymentSchema = z.object({
  amount: z
    .number({
      error: (iss) => {
        if (!iss.input) return 'Nominal wajib diisi';
        if (iss.code === 'invalid_type') return 'Nominal harus berupa angka';
      },
    })
    .positive('Nominal harus lebih dari 0'),
  date: z.iso.date({
    error: (iss) => {
      if (iss.code === 'invalid_format')
        return "Format tanggal tidak sesuai (gunakan 'YYYY-MM-DD')";
    },
  }),
  note: z
    .string({
      error: (iss) => {
        if (iss.code === 'invalid_type') return 'Catatan harus berupa string';
      },
    })
    .max(255, 'Catatan tidak boleh lebih dari 255 karakter')
    .optional(),
});

export class CreatePaymentDto {
  static readonly schema: ZodObject<typeof createPaymentSchema.shape> =
    createPaymentSchema;

  constructor(
    public readonly amount: number,
    public readonly date: string,
    public readonly note?: string,
  ) {}
}
