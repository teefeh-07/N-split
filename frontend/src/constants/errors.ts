// Error Constants

export const CONTRACT_ERRORS = {
  UNAUTHORIZED: "u100",
  INSUFFICIENT_FUNDS: "u101",
  INVALID_PARAMS: "u102",
  NOT_FOUND: "u103",
  ALREADY_EXISTS: "u104",
} as const;

export const ERROR_MESSAGES: Record<string, string> = {
  [CONTRACT_ERRORS.UNAUTHORIZED]: "You are not authorized to perform this action",
  [CONTRACT_ERRORS.INSUFFICIENT_FUNDS]: "Insufficient funds for this transaction",
  [CONTRACT_ERRORS.INVALID_PARAMS]: "Invalid parameters provided",
  [CONTRACT_ERRORS.NOT_FOUND]: "Resource not found",
  [CONTRACT_ERRORS.ALREADY_EXISTS]: "Resource already exists",
};

