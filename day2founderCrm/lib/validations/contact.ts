import { z } from "zod";

const ContactStatusSchema = z.enum(["new", "contacted", "replied", "closed"]);

export const CreateContactSchema = z.object({
  linkedin_url: z
    .string()
    .url()
    .regex(/^https:\/\/(www\.)?linkedin\.com\/in\/[^/?#]+\/?$/),
  full_name: z.string().min(1).max(200).optional(),
  notes: z.string().max(10000).optional(),
});

export const UpdateContactSchema = z.object({
  status: ContactStatusSchema.optional(),
  notes: z.string().max(10000).optional(),
  last_contacted_at: z.string().datetime().optional(),
});

export type CreateContactInput = z.infer<typeof CreateContactSchema>;
export type UpdateContactInput = z.infer<typeof UpdateContactSchema>;
