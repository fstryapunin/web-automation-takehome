import { z } from "zod";

const configurationSchema = z.object({
  ECOMMERCE_API_BASE_URL: z.string().url(),
  PRODUCT_MIN_PRICE: z.coerce.number().nonnegative(),
  PRODUCT_MAX_PRICE: z.coerce.number().positive(),
  MAX_PRODUCTS_RETURNED_PER_REQUEST: z.coerce.number().positive(),
  RETRY_COEFICIENT: z.coerce
    .number()
    .min(0, "Please provide number between 0 and 1")
    .max(1, "Please provide number between 0 and 1"),
});

export const Configuration = configurationSchema.parse(process.env);
