// import type { ShippingInfo } from "@/models/order.models.js";
import type { Request } from "express";
import type { SessionData } from "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: number;
    cartId?: number;
  }
}

// Promisified version of req.session.regenerate + req.session.save
export function commitSession(
  req: Request,
  data: Partial<SessionData>
): Promise<void> {
  return new Promise((resolve, reject) => {
    const sessionData = { ...req.session, ...data };
    req.session.regenerate((err) => {
      if (err) {
        reject(err instanceof Error ? err : new Error(String(err)));
        return;
      }

      Object.assign<SessionData, Partial<SessionData>>(
        req.session,
        sessionData
      );

      req.session.save((saveErr) => {
        if (saveErr) {
          reject(
            saveErr instanceof Error ? saveErr : new Error(String(saveErr))
          );
          return;
        }

        resolve();
      });
    });
  });
}

// Promisified version of req.session.destroy
export function destroySession(req: Request): Promise<void> {
  return new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) {
        reject(err instanceof Error ? err : new Error(String(err)));
        return;
      }

      resolve();
    });
  });
}
