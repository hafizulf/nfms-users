export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly httpStatus: number = 400,
    public readonly cause?: unknown,
  ) { super(message); }
}
