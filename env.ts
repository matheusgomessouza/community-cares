import { z } from "zod";

const envSchema = z.object({
  EXPO_PUBLIC_CLIENT_ID: z.string(),
  EXPO_PUBLIC_GOOGLE_API_KEY: z.string(),
  EXPO_PUBLIC_API: z.string().url(),
});

export const env = envSchema.parse(process.env);