import z, { ZodObject } from 'zod';

const createContactSchema = z.object({
  name: z
    .string({
      error: (iss) => {
        if (iss.code === 'invalid_type') return 'Nama harus berupa string';
      },
    })
    .min(1, 'Nama wajib diisi')
    .max(100, 'Nama tidak boleh lebih dari 100 karakter'),
  avatar: z
    .string({
      error: (iss) => {
        if (iss.code === 'invalid_type') return 'Nama harus berupa string';
      },
    })
    .nullish(),
});

export class CreateContactDto {
  static readonly schema: ZodObject<typeof createContactSchema.shape> =
    createContactSchema;

  constructor(
    public readonly name: string,
    public readonly avatar?: string | null,
  ) {}
}
