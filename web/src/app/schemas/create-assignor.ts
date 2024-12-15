import { z } from "zod";

export const registerAssignorSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  email: z
    .string()
    .email({ message: "O e-mail deve ser válido." }),
  phone: z
    .string()
    .min(10, { message: "O telefone deve ter pelo menos 10 dígitos." })
    .max(11, { message: "O telefone deve ter no máximo 11 dígitos." }),
  document: z
    .string()
    .min(11, { message: "O CPF deve ter exatamente 11 dígitos." })
    .max(11, { message: "O CPF deve ter exatamente 11 dígitos." }),
});

export type RegisterData = z.infer<typeof registerAssignorSchema>;