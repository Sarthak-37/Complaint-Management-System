import { Router } from "express";
import {
  createComplaint,
  transitionComplaintStatus,
  getComplaintById,
  getComplaintHistory,
  getComplaints,
  updateComplaintPriority,
  getMyNotifications,
  deleteComplaint,
  markComplaintNotificationsRead,
  userResolveAction,
  getAdminComplaints
} from "./complaint.controller.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import { requireVerifiedUser } from "../../middleware/requireVerifiedUser.js";
import { authorizeRoles } from "../../middleware/authorizeRoles.js";


const router = Router();

/**
 * Create a new complaint
 * POST /api/complaints
 */
router.post(
  "/",
  requireAuth,
  requireVerifiedUser,
  createComplaint
);

/**
 * Transition complaint status
 * PATCH /api/complaints/:id/status
 */
router.patch(
  "/:id/status",
  requireAuth,
  requireVerifiedUser,
  authorizeRoles("ADMIN", "AUTHORITY"),
  transitionComplaintStatus
);


/**
 * Get complaint lifecycle history
 * GET /api/complaints/:id/history
 */
router.get(
  "/:id/history",
  requireAuth,
  requireVerifiedUser,
  getComplaintHistory
);

/**
 * Get my complaints (MUST come before /:id route)
 * GET /api/complaints/my
 */
router.get(
  "/my",
  requireAuth,
  requireVerifiedUser,
  getComplaints
);

router.get(
  "/admin",
  requireAuth,
  requireVerifiedUser,
  authorizeRoles("ADMIN"),
  getAdminComplaints
);

/**
 * Get user notifications (MUST come before /:id route)
 * GET /api/complaints/notifications
 */
router.get(
  "/notifications",
  requireAuth,
  requireVerifiedUser,
  authorizeRoles("USER"),
  getMyNotifications
);

router.patch(
  "/:id/notifications/read",
  requireAuth,
  requireVerifiedUser,
  authorizeRoles("USER"),
  markComplaintNotificationsRead
);

/**
 * Get complaint by ID
 * GET /api/complaints/:id
 */
router.get(
  "/:id",
  requireAuth,
  requireVerifiedUser,
  getComplaintById
);

router.patch(
  "/:id/priority",
  requireAuth,
  requireVerifiedUser,
  authorizeRoles("ADMIN", "AUTHORITY"),
  updateComplaintPriority
);

router.delete(
  "/:id",
  requireAuth,
  requireVerifiedUser,
  authorizeRoles("USER"),
  deleteComplaint
);

router.patch(
  "/:id/user-action",
  requireAuth,
  requireVerifiedUser,
  authorizeRoles("USER"),
  userResolveAction
);




export default router;
