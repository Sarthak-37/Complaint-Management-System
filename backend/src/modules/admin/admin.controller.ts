import type { Request, Response } from "express";
import { AdminService } from "./admin.service.js";
import type { InviteAuthorityDto } from "./admin.dto.js";
import type { AccountStatus } from "../auth/user.model.js";
import type { AssignComplaintDto } from "./admin.dto.js";
import { ComplaintCategory } from "../complaint/complaintCategory.enum.js";

export class AdminController {

  //controller to invite authorities on platform
  static async inviteAuthority(req: Request, res: Response) {
    const { email, categories, instructions } = req.body;

    if (!email || !categories || categories.length === 0 ) {
      throw new Error("Email and categories are required");
    }

    const result =  await AdminService.inviteAuthority(
    email,
    categories,
    instructions
  );
    res.status(201).json(result);
  }

  //controller to update userStatus
  static async updateUserStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { action } = req.body;
 
    if (!id) throw new Error("id is missing");

    if (action !== "ACTIVATE" && action !== "SUSPEND") {
      return res.status(400).json({ message: "Invalid action" });
    }

    const user = await AdminService.updateUserStatus(id, action);
    res.json({ message: "User status updated", user });
  }

  //controller to list all users and authorities
  static async listUsers(req: Request, res: Response) {
  const { role, status } = req.query;

  const filters: {
    role?: string;
    status?: AccountStatus;
    ComplaintCategory?: ComplaintCategory;
  } = {};

  if (typeof role === "string") {
    filters.role = role;
  }

  if (typeof status === "string") {
    filters.status = status as AccountStatus;
  }
  if (typeof req.query.ComplaintCategory === "string") {
    filters.ComplaintCategory = req.query.ComplaintCategory as ComplaintCategory;
  }

  const users = await AdminService.listUsers(filters);
  res.json(users);
  } 

  //controller to assign complaints to user
  static async assignComplaint(req: Request, res: Response) {
    const { complaintId, authorityId } =
      req.body as AssignComplaintDto;

    if (!complaintId || !authorityId) {
      throw new Error("complaintId and authorityId are required");
    }

    const result = await AdminService.assignComplaint(
      complaintId,
      authorityId
    );

    res.status(200).json(result);
  }
  
}