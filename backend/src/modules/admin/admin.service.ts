//import bcrypt from "bcrypt";
import { User, AccountStatus } from "../auth/user.model.js";
import type { IUser } from "../auth/user.model.js";
//import { sendVerificationEmail } from "../auth/email.service.js";
import crypto from "crypto";
//import { VerificationToken } from "../auth/verificationToken.model.js";
import { InviteToken } from "../auth/inviteToken.model.js";
import { sendAuthorityInviteEmail } from "../auth/email.service.js";
import { ComplaintCategory } from "../complaint/complaintCategory.enum.js";
import { ENV } from "../../config/env.js";
import Complaint from "../complaint/complaint.model.js";
import { ComplaintStatus } from "../state-machine/complaintStatus.enum.js";

export class AdminService {

static async inviteAuthority(
  email: string,
  categories: ComplaintCategory[],
  instructions?: string
) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  await InviteToken.create({
    email,
    role: "AUTHORITY",
    categories,
    token: hashedToken,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  });

  await sendAuthorityInviteEmail(
    email,
    `${ENV.FRONTEND_URL}/accept-invite?token=${rawToken}`,
    instructions // ✅ email-only
  );
}

  static async updateUserStatus(
  id: string,
  action: "ACTIVATE" | "SUSPEND"
) {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");

  if (action === "ACTIVATE") {
    if (user.accountStatus === AccountStatus.ACTIVE) {
      throw new Error("User is already active");
    }
    user.accountStatus = AccountStatus.ACTIVE;
  }

  if (action === "SUSPEND") {
    if (user.accountStatus === AccountStatus.SUSPENDED) {
      throw new Error("User is already suspended");
    }
    user.accountStatus = AccountStatus.SUSPENDED;
  }

  await user.save();
  return user;
}

  static async listUsers(filters: {
    role?: string;
    status?: AccountStatus;
    ComplaintCategory?: ComplaintCategory;
  }) {
    const query: Record<string, unknown> = {};
    if (filters.role) query.role = filters.role;
    if (filters.status) query.accountStatus = filters.status;
    if (filters.ComplaintCategory)
      query.categories = filters.ComplaintCategory;
    
    return User.find(query).select("-password");
  }

  static async assignComplaint(
    complaintId: string,
    authorityId: string
  ) {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      throw new Error("Complaint not found");
    }

    const authority = await User.findById(authorityId);
    if (!authority || authority.role !== "AUTHORITY") {
      throw new Error("Invalid authority");
    }

    // 🔒 Category safety check
    if (!authority.categories.includes(complaint.category)) {
      throw new Error(
        "Authority does not handle this complaint category"
      );
    }

    if (complaint.status !== ComplaintStatus.UNDER_REVIEW) {
      throw new Error("Only UNDER_REVIEW complaints can be assigned");
    }

    complaint.assignedTo = authority._id;
    complaint.status = ComplaintStatus.ASSIGNED;
    await complaint.save();

    return {
      message: "Complaint assigned successfully",
      complaintId: complaint._id,
      authorityId: authority._id
    };
  }
}




