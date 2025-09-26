import { z, ZodError } from 'zod';

export const formatEnvErrors = (error: ZodError) => {
  return error.issues.map((e) => ({
    field: e.path.join('.'),
    message: e.message,
  }));
};

export const EnvValidationSchema = z.object({
  APP_PORT: z
    .string()
    .regex(/^\d+$/, { message: 'PORT must be a number' })
    .transform(Number),
  GRPC_URL: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.string().refine((v) => !isNaN(Number(v)), { message: 'PORT must be a number' }),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
});

export type Env = z.infer<typeof EnvValidationSchema>;
