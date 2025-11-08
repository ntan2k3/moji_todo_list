import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { connectDB } from "./libs/db.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/user.Routes.js";
import taskRouter from "./routes/taskRoutes.js";
import { protectedRoute } from "./middlewares/authMiddleware.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// --- Middleware ---
app.use(express.json());
app.use(cookieParser());

// Chỉ bật CORS trong development
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    })
  );
}

// --- Public Routes ---
app.use("/api/auth", authRouter);

// --- Private Routes ---
app.use("/api/users", protectedRoute, userRouter);
app.use("/api/tasks", protectedRoute, taskRouter);

// --- Production Setup: Serve Frontend ---
if (process.env.NODE_ENV === "production") {
  const frontendDist = path.join(__dirname, "../frontend/dist");

  // Serve static files
  app.use(express.static(frontendDist));

  // SPA fallback
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

// --- Start Server ---
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server đang chạy trên cổng ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Kết nối DB thất bại:", err);
  });
