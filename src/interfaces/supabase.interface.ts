/**
 * Supabase response interfaces for better type safety
 */

export interface SupabaseResponse<T = unknown> {
  data: T | null;
  error: SupabaseError | null;
}

export interface SupabaseError {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}

export interface SupabaseUser {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupabaseUserSelect {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface RefreshTokenRecord {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: string;
  created_at: string;
}

/**
 * JWT payload interfaces
 */
export interface JWTPayload {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface RefreshJWTPayload {
  sub: string;
  type: 'refresh';
  iat: number;
  exp: number;
}

/**
 * Utility type for Supabase database types
 */
export interface Database {
  public: {
    Tables: {
      users: {
        Row: SupabaseUser;
        Insert: Omit<SupabaseUser, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SupabaseUser, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
      refresh_tokens: {
        Row: RefreshTokenRecord;
        Insert: Omit<RefreshTokenRecord, 'id' | 'created_at'>;
        Update: Partial<Omit<RefreshTokenRecord, 'id' | 'created_at'>>;
        Relationships: [];
      };
      health_check: {
        Row: {
          id: string;
          status: string;
          timestamp: string;
        };
        Insert: {
          status?: string;
          timestamp?: string;
        };
        Update: Partial<{
          status: string;
          timestamp: string;
        }>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
