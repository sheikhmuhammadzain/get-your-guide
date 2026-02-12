import { ZodError } from "zod";
import type { ProblemDetails } from "@/types/travel";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly extensions?: Record<string, unknown>;

  constructor(status: number, code: string, message: string, extensions?: Record<string, unknown>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.extensions = extensions;
  }
}

export function fromZodError(error: ZodError, instance?: string): ProblemDetails {
  return {
    type: "https://travel-planner.dev/errors/validation-error",
    title: "Validation Error",
    status: 400,
    detail: "Request validation failed",
    code: "VALIDATION_ERROR",
    instance,
    errors: error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
      code: issue.code,
    })),
  };
}

export function fromUnknownError(error: unknown, instance?: string): ProblemDetails {
  if (error instanceof ApiError) {
    return {
      type: `https://travel-planner.dev/errors/${error.code.toLowerCase()}`,
      title: error.code,
      status: error.status,
      detail: error.message,
      code: error.code,
      instance,
      ...(error.extensions ?? {}),
    };
  }

  return {
    type: "https://travel-planner.dev/errors/internal-server-error",
    title: "Internal Server Error",
    status: 500,
    detail: "An unexpected error occurred",
    code: "INTERNAL_SERVER_ERROR",
    instance,
  };
}
