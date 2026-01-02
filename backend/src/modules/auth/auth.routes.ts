import { Router } from "express";
import { registerUser } from "./auth.controller.js";
import { verifyEmail } from "./auth.controller.js";
import { resendVerificationEmail } from "./auth.controller.js";
import { login } from "./auth.controller.js";
import { acceptInvite } from "./auth.controller.js";
import { me } from "./auth.controller.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import { verifyInviteController } from "./auth.controller.js";
const router = Router();

// USER registration
router.post("/register", registerUser);

// Email verification
router.get("/verify-email", verifyEmail);

// Resend verification email
router.post("/resend-verification", resendVerificationEmail);

//Login user
router.post("/login",  login);

router.post("/accept-invite", acceptInvite);

router.get("/me", requireAuth, me);

router.get("/verify-invite", verifyInviteController);
export default router;




