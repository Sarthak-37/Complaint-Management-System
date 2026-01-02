export type UserRole = "USER" | "AUTHORITY" | "ADMIN";
import { ComplaintCategory } from "./complaint/complaintCategory.enum.js";
//export { ComplaintPriority } from "./complaint/complaintPriority.enum.js";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  categories: ComplaintCategory[];
}