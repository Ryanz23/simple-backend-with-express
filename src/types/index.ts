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

export interface Criterion {
  name: string;
  weight: number;
}

export interface Alternative {
  name: string;
  scores: Record<string, number>; // Criterion name to score mapping
}

export interface AlternativeRow {
  id: number;
  name: string;
}

export interface ScoreRow {
  alternative_id: number;
  alternative_name: string;
  criterion_name: string;
  score: number;
}

export interface ScoreDetail {
  id: string;
  alternative_id: string;
  alternative_name: string;
  criterion_id: string;
  criterion_name: string;
  score: number;
}
