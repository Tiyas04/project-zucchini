import { NextResponse } from "next/server";
import { ApiError, ValidationError, isApiError } from "@repo/shared-types";

/**
 * Standard API response format
 */
export interface ApiResponse<T = any> {
  success: true;
  data: T;
}

/**
 * Standard API error response format
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

/**
 * Creates a standardized success response
 */
export function handleResponse<T>(data: T, status: number = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Creates a standardized error response from various error types
 */
export function handleApiError(
  error: unknown,
  defaultMessage: string = "An error occurred"
): NextResponse<ApiErrorResponse> {
  console.error("API Error:", error);

  // Handle custom ApiError
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

  // Handle ValidationError
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

  // Handle standard Error
  if (error instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || defaultMessage,
      },
      { status: 500 }
    );
  }

  // Handle unknown errors
  return NextResponse.json(
    {
      success: false,
      error: defaultMessage,
    },
    { status: 500 }
  );
}
