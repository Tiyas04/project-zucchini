import { type ZodSchema, type ZodError } from "zod";

export { RegistrationSchema, type Registration, schemas } from "./schemas";

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly incorrectData: unknown,
    public readonly expectedSchema: unknown,
    public readonly zodError: ZodError
  ) {
    super(message);
    this.name = "ValidationError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }
}

export function validateAndThrow<TSchema extends ZodSchema, TData>(
  schema: TSchema,
  data: TData,
  context?: string
): asserts data is TData {
  const validationResult = schema.safeParse(data);

  if (!validationResult.success) {
    const contextMsg = context ? `${context}: ` : "";
    const formattedErrors = validationResult.error.errors
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join(", ");

    throw new ValidationError(
      `${contextMsg}Validation failed - ${formattedErrors}`,
      data,
      schema._def,
      validationResult.error
    );
  }
}

export function handleError(error: unknown, defaultMessage = "Operation failed"): never {
  if (error instanceof ValidationError) {
    console.error("Validation failed:", {
      message: error.message,
      data: error.incorrectData,
      errors: error.zodError.errors,
    });
  } else if (error instanceof Error) {
    console.error(`${defaultMessage}:`, error.message);
  } else {
    console.error(`${defaultMessage}:`, error);
  }
  throw error;
}

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

export const isApiError = (error: unknown): error is ApiError => error instanceof ApiError;
