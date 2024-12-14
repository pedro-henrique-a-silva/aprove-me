import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ message: "O e-mail deve ser válido." })
    .email({ message: "O e-mail deve ser válido." }),
  password: z
    .string({ message: "A senha deve ter pelo menos 6 caracteres." })
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

export type LoginData = z.infer<typeof loginSchema>;