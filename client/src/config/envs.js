import { z } from 'zod'

const envsSchema = z.object({
  BASE_API_URL: z.string(),
  MODE: z.string(),
  BACKEND: z.coerce.boolean().default(false)
})

export const envs = envsSchema.parse({
  BASE_API_URL: import.meta.env.VITE_PETS_BASE_API_URL ?? '',
  MODE: import.meta.env.MODE,
  BACKEND: import.meta.env.VITE_BACKEND
})
