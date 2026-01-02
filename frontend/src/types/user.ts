export type UserRole = "USER" | "AUTHORITY" | "ADMIN";

export type AccountStatus = "ACTIVE" | "SUSPENDED";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  categories?: string[]; // only for authority
  accountStatus: AccountStatus;
  createdAt: string;
}
