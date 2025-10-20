import { TransactionStatus, TransactionType } from '@prisma/client';
import z, { ZodObject } from 'zod';

const createTransactionSchema = z.object({
  contact_id: z.number().min(1).positive(),
  type: z.enum(TransactionType, {
    error: (iss) => {
      if (!iss.input) return 'Tipe transaksi wajib diisi';
      if (iss.code === 'invalid_value') return 'Tipe transaksi tidak valid';
    },
  }),
  amount: z
    .number({
      error: (iss) => {
        if (!iss.input) return 'Nominal wajib diisi';
        if (iss.code === 'invalid_type') return 'Nominal harus berupa angka';
      },
    })
    .positive('Nominal harus lebih dari 0'),
  description: z
    .string({
      error: (iss) => {
        if (iss.code === 'invalid_type') return 'Deskripsi harus berupa string';
      },
    })
    .max(255, 'Deskripsi tidak boleh lebih dari 255 karakter')
    .optional(),
  status: z.enum(TransactionStatus).optional(),
  date: z.iso.date({
    error: (iss) => {
      if (iss.code === 'invalid_format')
        return "Format tanggal tidak sesuai (gunakan 'YYYY-MM-DD')";
    },
  }),
  due_date: z.iso
    .date({
      error: (iss) => {
        if (iss.code === 'invalid_format')
          return "Format tanggal tidak sesuai (gunakan 'YYYY-MM-DD')";
      },
    })
    .optional(),
});

export class CreateTransactionDto {
  static readonly schema: ZodObject<typeof createTransactionSchema.shape> =
    createTransactionSchema;

  constructor(
    public readonly contact_id: number,
    public readonly type: TransactionType,
    public readonly amount: number,
    public readonly date: string,
    public readonly description?: string,
    public readonly status?: TransactionStatus,
    public readonly due_date?: string,
  ) {}
}
