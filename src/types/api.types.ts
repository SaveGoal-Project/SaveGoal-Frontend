// Common API Response Types

// Standard API Response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp?: string;
}

// Paginated Response
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// API Error Response
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  timestamp?: string;
}

// Field Validation Error
export interface FieldError {
  field: string;
  message: string;
}

// Standardized Error with field errors
export interface ValidationError extends ApiError {
  errors: FieldError[];
}

// Query Parameters for list endpoints
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sort?: string;
}

// Common filter parameters
export interface FilterParams extends PaginationParams {
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

// File upload response
export interface UploadResponse {
  url: string;
  filename: string;
  mimeType: string;
  size: number;
}

// Generic mutation response
export interface MutationResponse {
  success: boolean;
  message: string;
  id?: string;
}

