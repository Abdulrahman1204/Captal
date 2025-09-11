import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import connectDB from "./configs/connectToDb";
import { errorHandler, notFound } from "./middlewares/error";
import compression from "compression";

// routes import
import routeAuth from "./routes/users/Auth.route";
import routeUser from "./routes/users/User.route";
import routeClassFather from "./routes/classifications/father/ClassFather.route";
import routeClassSon from "./routes/classifications/son/ClassSon.route";
import routeMaterial from "./routes/materials/material.route";
import routeFinanceOrder from "./routes/orders/finance/Finance.route";
import routeMaterialOrder from "./routes/orders/material/Material.route";
import routeRehabilitationOrder from "./routes/orders/rehabilitation/Rehabilitation.route";
import routeRecourseOrder from "./routes/orders/recourse/Recourse.route";

// .env
dotenv.config();

// Validate required environment variables
["MONGO_URL", "JWT_SECRET_KEY", "NODE_ENV", "PORT", "FRONTEND_URL"].forEach(
  (env) => {
    if (!process.env[env]) {
      throw new Error(`Missing required environment variable: ${env}`);
    }
  }
);

// Connection To Db
connectDB();

// Init App
const app: Application = express();

// middleware
app.use(compression());
app.use(express.json());
app.use(helmet());
app.use(cookieParser());

//Cors Policy
app.use(
  cors({
    origin: ["http://localhost:5173", "https://captalsa.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.get("/test", (req: Request, res: Response) => {
  res.send("API is running in Captal");
});
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
app.use("/api/captal/auth", routeAuth);
app.use("/api/captal/user", routeUser);
app.use("/api/captal/classficationMaterial", routeClassFather);
app.use("/api/captal/classficationMaterialSon", routeClassSon);
app.use("/api/captal/material", routeMaterial);
app.use("/api/captal/orderFinance", routeFinanceOrder);
app.use("/api/captal/orderMaterial", routeMaterialOrder);
app.use("/api/captal/orderQualification", routeRehabilitationOrder);
app.use("/api/captal/recourseUserOrder", routeRecourseOrder);

// Error Handler Middleware
app.use(notFound);
app.use(errorHandler);

//Running The Server
const PORT: number = parseInt(process.env.PORT || "8000");

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
