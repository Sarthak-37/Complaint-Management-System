import "dotenv/config";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { User, AccountStatus } from "../modules/auth/user.model.js";

await mongoose.connect(process.env.MONGO_URI!);

const passwordHash = await bcrypt.hash("Admin@123", 10);

await User.create({
  email: "admin@test.com",
  passwordHash,
  role: "ADMIN",
  accountStatus: AccountStatus.ACTIVE,
  isEmailVerified: true
});

console.log("Admin created");
process.exit(0);
