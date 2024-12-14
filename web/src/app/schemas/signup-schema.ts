import { z } from "zod";

export const signupSchema = z.object({
  nome: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  email: z
    .string()
    .email({ message: "O e-mail deve ser válido." }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  phone: z
    .string()
    .min(10, { message: "O telefone deve ter pelo menos 10 dígitos." })
    .max(11, { message: "O telefone deve ter no máximo 11 dígitos." }),
  cpf: z
    .string()
    .min(11, { message: "O CPF deve ter exatamente 11 dígitos." })
    .max(11, { message: "O CPF deve ter exatamente 11 dígitos." }),
});

export type SignupData = z.infer<typeof signupSchema>;