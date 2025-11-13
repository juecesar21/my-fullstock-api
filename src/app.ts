import express from "express";
import morgan from "morgan";
import {
  errorHandler,
  notFoundHandler,
} from "@/middlewares/error.middleware.js";
import sessionMiddleware from "@/middlewares/session.middleware.js";
import routes from "@/routes.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(sessionMiddleware);

app.use(routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
