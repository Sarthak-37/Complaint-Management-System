import cron from "node-cron";
import { autoCloseResolvedComplaints } from "../modules/complaint/complaint.service.js";

export function startAutoCloseJob() {
  // Runs every hour
  cron.schedule("0 * * * *", async () => {
    try {
      await autoCloseResolvedComplaints();
      console.log("Auto-close job ran successfully");
    } catch (err) {
      console.error("Auto-close job failed", err);
    }
  });
}
