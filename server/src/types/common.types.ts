import { Request } from 'express';
import { IUserPayload } from './auth.types';

export interface AuthenticatedRequest extends Request {
  user?: IUserPayload;
}

export interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    totalResults: number;
    totalPages: number;
  };
}
