import { z } from "zod";

export const createPayableSchema = z.object({
  value: z
    .string({ message: "O valor não pode ser vazio." }),
  emissionDate: z
  .string({ message: "A data de Emissão não pode ser vazia." })
  .regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Data de emissão Inválida',
  }),
  assignors: z.string({ message: "O cedente não pode ser vazio." }).uuid(),
});

export type CreatePayableData = z.infer<typeof createPayableSchema>;