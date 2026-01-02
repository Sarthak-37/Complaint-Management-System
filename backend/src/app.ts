import express from "express";
import complaintRoutes from "./modules/complaint/complaint.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import cors from "cors";
import { errorHandler } from "./middleware/error.middleware.js";
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // frontend origin
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);



// Global middleware
app.use(express.json());

// Complaint APIs
app.use("/api/complaints", complaintRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

export default app;

