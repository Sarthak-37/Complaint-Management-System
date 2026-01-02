import Complaint from "./complaint.model.js";
import { ComplaintStatus } from "../state-machine/complaintStatus.enum.js";
import { canTransition } from "../state-machine/canTransition.js";
import type { AuthUser, UserRole } from "../types.js";
import type {
  CreateComplaintPayload,
  TransitionComplaintPayload,
} from "./dto.js";
import { ComplaintPriority } from "./complaintPriority.enum.js";
import { ComplaintCategory } from "./complaintCategory.enum.js";
/* -------------------------------------------------------------------------- */
/*                               ACCESS GUARD                                 */
/* -------------------------------------------------------------------------- */

function assertComplaintAccess(
  complaint: any,
  authUser: AuthUser
) {
  // ADMIN has full read access
  if (authUser.role === "ADMIN") return;

  // USER can access only own complaints
  if (
    authUser.role === "USER" &&
    complaint.createdBy?.toString() === authUser.id
  ) {
    return;
  }

  // AUTHORITY can access only assigned complaints
  if (
    authUser.role === "AUTHORITY" &&
    complaint.assignedTo?.toString() === authUser.id
  ) {
    return;
  }

  throw new Error("Access denied");
}

//create complaint
export const createComplaintService = async (
  payload: CreateComplaintPayload,
  authUser: AuthUser
) => {
  if (authUser.role !== "USER") {
    throw new Error("Only users can create complaints");
  }

  const complaintCode = `CMP-${Date.now().toString().slice(-6)}`;

  const complaint = await Complaint.create({
    complaintCode,
    title: payload.title,
    description: payload.description,
    category: payload.category,
    status: ComplaintStatus.SUBMITTED,
    createdBy: authUser.id,
    statusHistory: [
      {
        from: null,
        to: ComplaintStatus.SUBMITTED,
        changedBy: "SYSTEM",
        changedAt: new Date(),
      },
    ],
  });

  return complaint;
};

//transition complaint status
export const transitionComplaintStatusService = async (
  complaintId: string,
  payload: TransitionComplaintPayload,
  authUser: AuthUser
) => {
  const complaint = await Complaint.findById(complaintId);
  if (!complaint) throw new Error("Complaint not found");

  if (authUser.role === "USER") {
    throw new Error("Users cannot change complaint status");
  }

  if (
    authUser.role === "AUTHORITY" &&
    complaint.assignedTo?.toString() !== authUser.id
  ) {
    throw new Error("Access denied");
  }

  if (authUser.role === "ADMIN") {
    if (
      ![
        ComplaintStatus.SUBMITTED,
        ComplaintStatus.UNDER_REVIEW,
        ComplaintStatus.ESCALATED,
      ].includes(complaint.status)
    ) {
      throw new Error("Admin cannot act on this complaint state");
    }
  }

  const currentStatus = complaint.status as ComplaintStatus;
  const { nextStatus } = payload;

  if (
    !canTransition(
      authUser.role as UserRole,
      currentStatus,
      nextStatus
    )
  ) {
    throw new Error(
      `Invalid transition from ${currentStatus} to ${nextStatus}`
    );
  }

  complaint.statusHistory.push({
    from: currentStatus,
    to: nextStatus,
    changedBy: authUser.id,
    changedAt: new Date(),
  });

  complaint.status = nextStatus;

  // 🔥 Escalation transfers control to Admin
  if (
    authUser.role === "AUTHORITY" &&
    nextStatus === ComplaintStatus.ESCALATED
  ) {
    complaint.assignedTo = null;
  }

  await complaint.save();
  return complaint;
};

//get complaint by ID
export const getComplaintByIdService = async (
  id: string,
  authUser: AuthUser
) => {
  const complaint = await Complaint.findById(id);
  if (!complaint) throw new Error("Complaint not found");

  assertComplaintAccess(complaint, authUser);
  return complaint;
};

//get complaint status history
export const getComplaintHistoryService = async (
  complaintId: string,
  authUser: AuthUser
) => {
  const complaint = await Complaint.findById(complaintId);
  if (!complaint) {
    throw new Error("Complaint not found");
  }

  assertComplaintAccess(complaint, authUser);
  return complaint.statusHistory;
};

//get all complaints

export const getComplaintsService = async (authUser: AuthUser) => {
  const query: any = {};

  if(authUser.role === "ADMIN"){
    return Complaint.find();
  }
  if (authUser.role === "USER") {
    query.createdBy = authUser.id;
  }

  if (authUser.role === "AUTHORITY") {
    query.assignedTo = authUser.id;
    query.category = { $in: authUser.categories };
  }

  // ADMIN sees all

  return Complaint.find(query)
    .populate("createdBy", "name email")
    .populate("assignedTo", "name email")
    .sort({ createdAt: -1 });
};


//access guard for category-based access
function assertCategoryAccess(
  complaint: any,
  authUser: AuthUser
) {
  if (authUser.role === "ADMIN") return;

  if (
    authUser.role === "USER" &&
    complaint.createdBy.toString() === authUser.id
  ) {
    return;
  }

  if (
    authUser.role === "AUTHORITY" &&
    authUser.categories.includes(complaint.category)
  ) {
    return;
  }

  throw new Error("Access denied");
}

//update complaint priority
export const updateComplaintPriorityService = async (
  complaintId: string,
  priority: ComplaintPriority,
  authUser: AuthUser
) => {
  const complaint = await Complaint.findById(complaintId);
  if (!complaint) throw new Error("Complaint not found");

  if (
    [ComplaintStatus.RESOLVED,
     ComplaintStatus.REJECTED,
     ComplaintStatus.CLOSED].includes(complaint.status)
  ) {
    throw new Error("Cannot change priority after complaint is finalized");
  }

  if (authUser.role === "ADMIN") {
    // allowed
  } else if (
    authUser.role === "AUTHORITY" &&
    complaint.assignedTo?.toString() === authUser.id &&
    authUser.categories.includes(complaint.category)
  ) {
    // allowed
  } else {
    throw new Error("Access denied");
  }

  complaint.priority = priority;
  await complaint.save();

  return complaint;
};

export async function deleteComplaintService(
  complaintId: string,
  authUser: any
) {
  const complaint = await Complaint.findById(complaintId);
  if (!complaint) throw new Error("Complaint not found");

  // ownership check already exists in your project
  assertComplaintAccess(complaint, authUser);

  if (complaint.status !== ComplaintStatus.SUBMITTED) {
    throw new Error("Complaint cannot be deleted after review");
  }

  await complaint.deleteOne();
}

export async function userResolveActionService(
  id: string,
  nextStatus: ComplaintStatus,
  authUser: any
) {
  const complaint = await Complaint.findById(id);
  if (!complaint) throw new Error("Complaint not found");

  // ownership
  if (complaint.createdBy.toString() !== authUser.id) {
    throw new Error("Access denied");
  }

  // only from RESOLVED
  if (complaint.status !== ComplaintStatus.RESOLVED) {
    throw new Error("Action allowed only on resolved complaints");
  }

  // state-machine validation
  if (!canTransition("USER" as UserRole, complaint.status, nextStatus)) {
    throw new Error("Invalid status transition");
  }

  complaint.statusHistory.push({
    from: complaint.status,
    to: nextStatus,
    changedBy: "USER",
    changedAt: new Date(),
  });

  complaint.status = nextStatus;
  await complaint.save();

  return complaint;
}

export async function autoCloseResolvedComplaints() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const complaints = await Complaint.find({
    status: ComplaintStatus.RESOLVED,
    "statusHistory.to": ComplaintStatus.RESOLVED,
    "statusHistory.changedAt": { $lte: oneDayAgo },
  });

  for (const complaint of complaints) {
    complaint.statusHistory.push({
      from: ComplaintStatus.RESOLVED,
      to: ComplaintStatus.CLOSED,
      changedBy: "SYSTEM",
      changedAt: new Date(),
    });

    complaint.status = ComplaintStatus.CLOSED;
    await complaint.save();
  }
}

export const getAdminComplaintsService = async (filters?: {
  status?: ComplaintStatus;
  category?: ComplaintCategory;
}) => {
  const query: any = {};

  if (filters?.status) query.status = filters.status;
  if (filters?.category) query.category = filters.category;

  return Complaint.find(query)
    .populate("createdBy", "email username")
    .populate("assignedTo", "email username")
    .sort({ createdAt: -1 });
};
