import { Router } from "express";
import { AdminController } from "./admin.controller.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import { requireVerifiedUser } from "../../middleware/requireVerifiedUser.js";
import { authorizeRoles } from "../../middleware/authorizeRoles.js";

const router = Router();

router.use(requireAuth, requireVerifiedUser, authorizeRoles("ADMIN"));

router.post(
  "/invite-authority",
  requireAuth,
  requireVerifiedUser,
  authorizeRoles("ADMIN"),
  AdminController.inviteAuthority
);

router.post(
  "/assign-complaint",
  requireAuth,
  requireVerifiedUser,
  authorizeRoles("ADMIN"),
  AdminController.assignComplaint
);


router.patch("/users/:id/status",
  requireAuth,
  requireVerifiedUser,
  authorizeRoles("ADMIN"),
  AdminController.updateUserStatus);


router.get("/users",
  requireAuth,
  requireVerifiedUser,
  authorizeRoles("ADMIN"),
  AdminController.listUsers);

export default router;
