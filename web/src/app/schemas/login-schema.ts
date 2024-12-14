import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string({ message: "O username deve ser válido." }),
  password: z
    .string({ message: "A senha deve ter pelo menos 6 caracteres." })
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

export type LoginData = z.infer<typeof loginSchema>;