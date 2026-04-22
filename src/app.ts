import express from "express";
import morgan from "morgan";
import {
  errorHandler,
  notFoundHandler,
} from "@/middlewares/error.middleware.js";
import sessionMiddleware from "@/middlewares/session.middleware.js";
import routes from "@/routes.js";
import cors from "cors";
// import { corsMiddleware } from "./middlewares/cors.middleware.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(sessionMiddleware);

app.use(routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
