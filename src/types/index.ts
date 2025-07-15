// src/types/index.ts
export interface User {
  id?: number;
  name: string;
  email: string;
  created_at?: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
}

export interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
}

export interface UserParams {
  id: string;
}
