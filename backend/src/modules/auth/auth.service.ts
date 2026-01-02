import { User, AccountStatus } from "./user.model.js";
import { hashPassword } from "./password.util.js";
import crypto from "crypto";
import { VerificationToken } from "./verificationToken.model.js";
import { sendVerificationEmail } from "./email.service.js";
import bcrypt from "bcrypt";
import { signToken } from "./jwt.util.js";
import { InviteToken } from "./inviteToken.model.js";
import type { LoginDTO } from "./dto/login.dto.js";
import type { RegisterDTO } from "./dto/register.dto.js";

const TOKEN_EXPIRY_MINUTES = 15;

// Register a new USER (self-registration only)
export const registerUserService = async (payload: {
  email: string;
  password: string;
  username: string;
}) => {
  try {
    const existingUser = await User.findOne({
      $or: [{ email: payload.email }, { username: payload.username }],
    });

    if (existingUser) {
      if (
        existingUser.email === payload.email &&
        !existingUser.isEmailVerified
      ) {
        throw Object.assign(
          new Error("Email already registered but not verified"),
          {
            statusCode: 409,
            code: "EMAIL_NOT_VERIFIED",
          }
        );
      }

      if (existingUser.email === payload.email) {
        throw Object.assign(
          new Error("Email already registered"),
          { statusCode: 409 }
        );
      }

      if (existingUser.username === payload.username) {
        throw Object.assign(
          new Error("Username is already taken"),
          { statusCode: 409 }
        );
      }
    }


    const passwordHash = await hashPassword(payload.password);

    const user = await User.create({
      username: payload.username,
      email: payload.email,
      passwordHash,
      role: "USER",
      accountStatus: AccountStatus.PENDING_VERIFICATION,
      isEmailVerified: false,
    });

    await sendEmailVerificationService(user._id.toString());

    return {
      message: "Registration successful. Please verify your email.",
      id: user._id,
    };
  } catch (err: any) {
    // 🔥 HANDLE DUPLICATE KEY ERROR (race condition safety)
    if (err.code === 11000) {
      if (err.keyPattern?.email) {
        throw Object.assign(
          new Error("Email already registered"),
          { statusCode: 409 }
        );
      }
      if (err.keyPattern?.username) {
        throw Object.assign(
          new Error("Username is already taken"),
          { statusCode: 409 }
        );
      }
    }

    throw err;
  }
};



//Send verification email
export const sendEmailVerificationService = async (id: string) => {
  const user = await User.findById(id);

  if (!user) throw new Error("User not found");

  const rawToken = crypto.randomBytes(32).toString("hex");

  console.log("RAW VERIFICATION TOKEN:", rawToken);

  const tokenHash = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const expiresAt = new Date(
    Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000
  );

  await VerificationToken.create({
    id: user._id,
    tokenHash,
    expiresAt
  });

  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${rawToken}`;
  
  console.log("VERIFICATION LINK:", verificationLink);
  await sendVerificationEmail(user.email, verificationLink);
};

 // Verify email
export const verifyEmailService = async (token: string) => {
  const tokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const record = await VerificationToken.findOne({ tokenHash });

  if (!record) {
    return {
      message: "Email already verified",
      alreadyVerified: true
    };
  }

  if (record.expiresAt < new Date()) {
  await VerificationToken.deleteOne({ _id: record._id });
  throw new Error("Verification token expired");
}

  const user = await User.findById(record.id);
  if (!user) throw new Error("User not found");

    if (user.isEmailVerified) {
    await VerificationToken.deleteMany({ id: user._id });
    return {
      message: "Email already verified",
      alreadyVerified: true
    };
  }
  
  user.isEmailVerified = true;
  user.accountStatus = AccountStatus.ACTIVE;
  await user.save();

  await VerificationToken.deleteMany({ id: user._id });

  return { message: "Email verified successfully" };
};

//Resend verification email
export const resendVerificationEmailService = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isEmailVerified || user.accountStatus === AccountStatus.ACTIVE) {
    throw new Error("Email already verified");
  }

  // Remove existing tokens (important)
  await VerificationToken.deleteMany({ id: user._id });

  // Send new verification email
  await sendEmailVerificationService(user._id.toString());

  return {
    message: "Verification email resent successfully"
  };
};

export async function loginUser(data: LoginDTO) {
  const user = await User.findOne({ email: data.email });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (!user.passwordHash) {
    throw new Error("Password not set for this user");
  }

  if (user.accountStatus !== "ACTIVE") {
    throw new Error("Account not active");
  }

  if (!user.isEmailVerified) {
    throw new Error("Email not verified");
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = signToken({
    id: user._id.toString(),
    role: user.role,
  });

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
}

export async function acceptAuthorityInvite(
  rawToken: string,
  password: string,
  name: string
) {
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const invite = await InviteToken.findOne({
    token: hashedToken,
    used: false,
    expiresAt: { $gt: new Date() }
  });

  if (!invite) {
    throw new Error("Invalid or expired invite token");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await User.create({
    email: invite.email,
    username: name,
    role: "AUTHORITY",
    passwordHash,
    categories: invite.categories,
    isEmailVerified: true,
    accountStatus: AccountStatus.ACTIVE
  });

  invite.used = true;
  await invite.save();

  return { message: "Invitation accepted successfully" };
}



export async function verifyAuthorityInvite(rawToken: string) {
  if (!rawToken) {
    throw new Error("Invite token is required");
  }

  // 1️⃣ Hash token
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  // 2️⃣ Find invite token
  const invite = await InviteToken.findOne({
    token: hashedToken,
    used: false,
    expiresAt: { $gt: new Date() }
  });

  if (!invite) {
    throw new Error("Invalid or expired invite token");
  }

  
  return {
    email: invite.email,
    role: invite.role,
    categories : invite.categories
  };
}
