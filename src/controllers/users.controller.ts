import { userUpdateSchema } from "@/schemas/users.schemas.js";
import { usersService } from "@/services/users.service.js";
import { UnauthorizedError } from "@/shared/errors.js";
import type { Request, Response, NextFunction } from "express";

export const usersController = {
  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.session.userId;
      if (!userId) {
        throw new UnauthorizedError("Usuario no autorizado");
      }

      const { email, password } = userUpdateSchema.parse(req.body);

      const payload: { email?: string; password?: string } = {};
      if (email) payload.email = email;
      if (password) payload.password = password;
      const updatedUser = await usersService.updateUserData(userId, payload);

      return res.status(200).json({
        message: "El usuario se actualizo correctamente",
        user: updatedUser,
      });
    } catch (error) {
      return next(error);
    }
  },
};
