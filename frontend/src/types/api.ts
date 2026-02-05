// API Type Definitions

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

