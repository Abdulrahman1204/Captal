import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import connectDB from "./configs/connectToDb";
import { errorHandler, notFound } from "./middlewares/error";
import compression from "compression";
// import https from "https";
// import fs from "fs";
import path from "path";

// Load environment variables
dotenv.config();

// Validate required environment variables
["MONGO_URL", "JWT_SECRET_KEY", "NODE_ENV", "PORT", "FRONTEND_URL"].forEach(
  (env) => {
    if (!process.env[env]) {
      throw new Error(`Missing required environment variable: ${env}`);
    }
  }
);

// Connect to MongoDB
connectDB();

// Initialize Express app
const app: Application = express();

// Middleware
app.use(compression());
app.use(express.json());
app.use(helmet());
app.use(cookieParser());

// CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://captalsa.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Home route
app.get("/", (req: Request, res: Response) => {
  res.send("API is running in Captal (HTTPS)");
});

// Routes
import routeAuth from "./routes/users/Auth.route";
import routeUser from "./routes/users/User.route";
import routeClassFather from "./routes/classifications/father/ClassFather.route";
import routeClassSon from "./routes/classifications/son/ClassSon.route";
import routeMaterial from "./routes/materials/material.route";
import routeFinanceOrder from "./routes/orders/finance/Finance.route";
import routeMaterialOrder from "./routes/orders/material/Material.route";
import routeRehabilitationOrder from "./routes/orders/rehabilitation/Rehabilitation.route";
import routeRecourseOrder from "./routes/orders/recourse/Recourse.route";

app.use("/api/captal/auth", routeAuth);
app.use("/api/captal/user", routeUser);
app.use("/api/captal/classficationMaterial", routeClassFather);
app.use("/api/captal/classficationMaterialSon", routeClassSon);
app.use("/api/captal/material", routeMaterial);
app.use("/api/captal/orderFinance", routeFinanceOrder);
app.use("/api/captal/orderMaterial", routeMaterialOrder);
app.use("/api/captal/orderQualification", routeRehabilitationOrder);
app.use("/api/captal/recourseUserOrder", routeRecourseOrder);

// Error handling
app.use(notFound);
app.use(errorHandler);

// SSL Certificates
// const sslOptions = {
//   key: fs.readFileSync("/etc/letsencrypt/live/captalsa.com/privkey.pem"),
//   cert: fs.readFileSync("/etc/letsencrypt/live/captalsa.com/fullchain.pem"),
// };

// Start HTTPS server
const PORT: number = parseInt(process.env.PORT || "8000");
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
