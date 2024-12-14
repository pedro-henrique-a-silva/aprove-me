import { z } from "zod";

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, { message: "O username deve ter pelo menos 3 caracteres." }),

  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

export type SignupData = z.infer<typeof signupSchema>;