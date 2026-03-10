import { HttpException, HttpStatus } from '@nestjs/common';

interface ErrorResponse {
  statusCode: number;
  message: string;
  timestamp: string;
}

export function buildErrorObject(
  statusCode: HttpStatus,
  message: string,
): ErrorResponse {
  return {
    statusCode,
    message,
    timestamp: new Date().toISOString(),
  };
}

export function throwHttpError(
  statusCode: HttpStatus,
  message: string,
): never {
  const errorResponse = buildErrorObject(statusCode, message);
  throw new HttpException(errorResponse, statusCode);
}
