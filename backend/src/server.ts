import app from "./app.js";
import { connectDB } from "./config/db.js";
import { ENV } from "./config/env.js";
import { startAutoCloseJob } from "./jobs/autoCloseResolvedComplaints.js";

export async function startServer() {
  await connectDB();
  startAutoCloseJob();

  app.listen(ENV.PORT, () => {
    console.log(`🚀 Server running on port ${ENV.PORT}`);
  });
}
