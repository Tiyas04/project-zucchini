import { NextResponse } from "next/server";
import { ValidationError, isApiError } from "@repo/shared-types";

export interface ApiResponse<T = any> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

export function handleResponse<T>(data: T, status: number = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

export function handleApiError(
  error: unknown,
  defaultMessage: string = "An error occurred"
): NextResponse<ApiErrorResponse> {
  console.error("API Error:", error);

  if (isApiError(error)) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.details,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof ValidationError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.zodError.errors,
      },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || defaultMessage,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      error: defaultMessage,
    },
    { status: 500 }
  );
}
