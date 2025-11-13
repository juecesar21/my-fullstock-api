import type { Request, Response, NextFunction } from "express";
import {
  ValidationError,
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
  ConflictError,
} from "@/shared/errors.js";
import { flattenError, ZodError } from "zod";

export function notFoundHandler(
  _req: Request,
  _res: Response,
  next: NextFunction
) {
  next(new NotFoundError("Resource not found"));
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err);
  //SyntaxError se usa para mostrar error en caso error de sintaxis en json
  if (
    err instanceof SyntaxError &&
    "type" in err &&
    err["type"] === "entity.parse.failed"
  ) {
    return res.status(400).json({ error: "Syntax JSON error" });
  }
  if (err instanceof BadRequestError) {
    return res.status(400).json({ error: err.message });
  }
  if (err instanceof UnauthorizedError) {
    return res.status(401).json({ error: err.message });
  }
  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: err.message });
  }
  if (err instanceof ValidationError) {
    return res.status(422).json({ error: err.message, errors: err.errors });
  }
  if (err instanceof ConflictError) {
    return res.status(409).json({ error: err.message });
  }

  if (err instanceof ZodError) {
    return res
      .status(422)
      .json({ error: "Error de validación", issues: flattenError(err) });
  }

  res.status(500).json({ error: "Error interno del servidor" });
  return;
}
