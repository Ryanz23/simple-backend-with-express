import { Response } from 'express';
import { ApiResponse } from '../types';

/**
 * Kirim response sukses dengan data opsional.
 */
export function sendSuccess<T>(
  res: Response<ApiResponse<T>>,
  data?: T,
  message = 'Success',
  count?: number,
) {
  const payload: ApiResponse<T> = {
    success: true,
    ...(data !== undefined && { data }),
    ...(message && { message }),
    ...(count !== undefined && { count }),
  };
  return res.status(200).json(payload);
}

/**
 * Kirim response error dengan status code dan pesan error.
 */
export function sendError(
  res: Response<ApiResponse<unknown>>,
  statusCode = 500,
  errorMessage = 'Internal Server Error',
) {
  return res.status(statusCode).json({
    success: false,
    error: errorMessage,
  });
}
