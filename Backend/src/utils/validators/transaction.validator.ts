import { z } from "zod";

export const transferSchema = z.object({
  receiverEmail: z.string().email(),
  amount: z.number().positive(),
});
