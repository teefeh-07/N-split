// API Type Definitions

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface TransactionStatus {
  txId: string;
  status: "pending" | "success" | "failed";
  blockHeight?: number;
}

