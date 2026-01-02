export type UserRole = "ADMIN" | "AUTHORITY" | "USER";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  categories: string[];
}


