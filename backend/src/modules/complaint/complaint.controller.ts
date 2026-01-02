import type { Request, Response, NextFunction } from "express";
import { getAuthUser } from "../auth/types/auth-request.js";
import { ComplaintPriority } from "./complaintPriority.enum.js";
import { getUserNotificationsService } from "../notification/notification.service.js";
import mongoose from "mongoose";
import {
  createComplaintService,
  transitionComplaintStatusService,
  getComplaintByIdService,
  getComplaintHistoryService,
  getComplaintsService,
  updateComplaintPriorityService,
  deleteComplaintService,
  userResolveActionService,
  getAdminComplaintsService
} from "./complaint.service.js";
import Complaint from "./complaint.model.js";
import { ComplaintStatus } from "../state-machine/complaintStatus.enum.js";
import { ComplaintCategory } from "./complaintCategory.enum.js";
import type {
  CreateComplaintPayload,
  TransitionComplaintPayload,
} from "./dto.js";

//create complaint
export const createComplaint = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authUser = getAuthUser(req);
  const payload = req.body as CreateComplaintPayload;

  const complaint = await createComplaintService(payload, authUser);
  res.status(201).json(complaint);
};

//transition complaint status
export const transitionComplaintStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authUser = getAuthUser(req);
  const { id } = req.params;
  const payload = req.body as TransitionComplaintPayload;

  if (!id) throw new Error("Complaint ID is missing");

  if (!payload.nextStatus) {
    throw new Error("nextStatus is required");
  }

  const complaint = await transitionComplaintStatusService(
    id,
    payload,
    authUser
  );

  res.json({
    message: "Complaint status updated",
    complaint
  });
};

//get complaint by ID
export const getComplaintById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authUser = getAuthUser(req);
  const { id } = req.params;

  if (!id) throw new Error("Complaint ID is missing");
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid complaint ID");
  }


  const complaint = await getComplaintByIdService(id, authUser);
  res.json(complaint);
};

//get complaint by ID
export const getComplaintHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authUser = getAuthUser(req);
  const { id } = req.params;

  if (!id) throw new Error("Complaint ID is missing");

  const history = await getComplaintHistoryService(id, authUser);
  res.json(history);
};

/* -------------------------------------------------------------------------- */
/*                         LIST COMPLAINTS                                      */
/* -------------------------------------------------------------------------- */

export const getComplaints = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authUser = getAuthUser(req);
  const complaints = await getComplaintsService(authUser);
  res.json(complaints);
};

export const getAdminComplaints = async (
  req: Request,
  res: Response
) => {
  const { status, category } = req.query;

  const complaints = await getAdminComplaintsService({
    status: status as ComplaintStatus,
    category: category as ComplaintCategory
  });

  res.json(complaints);
};

export const updateComplaintPriority = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authUser = getAuthUser(req);
  const { id } = req.params;
  const { priority } = req.body;

  if (!id || !priority) {
    throw new Error("Complaint ID and priority are required");
  }

  if (!Object.values(ComplaintPriority).includes(priority)) {
    throw new Error("Invalid priority");
  }

  const complaint = await updateComplaintPriorityService(
    id,
    priority,
    authUser
  );

  res.json(complaint);
};

export async function getMyNotifications(
  req: Request,
  res: Response
) {
  const authUser = getAuthUser(req);
  const notifications = await getUserNotificationsService(authUser);
  res.json(notifications);
}

export async function deleteComplaint(
  req: Request,
  res: Response
) {
  const authUser = getAuthUser(req);
  const { id } = req.params;

  if (!id) {
    throw new Error("Complaint ID is required");
  }

  await deleteComplaintService(id, authUser);
  res.status(204).send();
}

export async function markComplaintNotificationsRead(
  req: Request,
  res: Response
) {
  const authUser = getAuthUser(req);

  await Complaint.updateOne(
    { _id: req.params.id },
    {
      $addToSet: {
        "statusHistory.$[].readBy": authUser.id
      }
    }
  );

  res.json({ success: true });
}

export async function userResolveAction(
  req: Request,
  res: Response
) {
  const authUser = getAuthUser(req);
  const { status } = req.body;
  const { id } = req.params;

  if (!id) {
    throw new Error("Complaint ID is required");
  }

  if (!status) {
    throw new Error("Status is required");
  }

  if (!Object.values(ComplaintStatus).includes(status)) {
    throw new Error("Invalid status value");
  }

  const complaint = await userResolveActionService(
    id,
    status,
    authUser
  );

  res.json(complaint);
}
