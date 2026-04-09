import { z } from "zod";

export const addProductSchema = z.object({
  url: z
    .string()
    .url("Must be a valid URL")
    .refine(
      (u) => u.startsWith("http://") || u.startsWith("https://"),
      "URL must start with http:// or https://",
    ),
  productName: z.string().max(500).optional(),
  targetPrice: z.number().positive("Target price must be positive").max(999999),
  frequency: z.enum(["1x", "2x", "4x", "6x"]).default("2x"),
  notifyPriceDrop: z.boolean().default(true),
  notifyBackInStock: z.boolean().default(true),
});

export const editProductSchema = z.object({
  targetPrice: z.number().positive().max(999999).optional(),
  frequency: z.enum(["1x", "2x", "4x", "6x"]).optional(),
  notifyPriceDrop: z.boolean().optional(),
  notifyBackInStock: z.boolean().optional(),
  productName: z.string().max(500).optional(),
});

export const extractionResultSchema = z.object({
  price: z.number().nullable(),
  currency: z.string().nullable(),
  availability: z.enum(["in_stock", "out_of_stock", "unknown"]),
  product_name: z.string().nullable(),
  confidence: z.enum(["high", "medium", "low"]),
});
