import { toUserDto } from "@/models/user.model.js";
import { loginSchema, registerSchema } from "@/schemas/auth.schemas.js";
import { usersService } from "@/services/users.service.js";
import { UnauthorizedError } from "@/shared/errors.js";
import { verifyPassword } from "@/shared/hash.js";
import { commitSession, destroySession } from "@/shared/session.js";
import type { NextFunction, Request, Response } from "express";

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = registerSchema.parse(req.body);

      const user = await usersService.createUser(email, password);

      await commitSession(req, { userId: user.id });

      return res.status(201).json({ data: toUserDto(user) });
    } catch (error) {
      return next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const user = await usersService.getUserByEmail(email);

      if (!user) {
        throw new UnauthorizedError(
          "Correo electrónico o contraseña inválidos"
        );
      }

      const isValidPassword = await verifyPassword(password, user.password);

      if (!isValidPassword) {
        throw new UnauthorizedError(
          "Correo electrónico o contraseña inválidos"
        );
      }

      await commitSession(req, { userId: user.id });

      return res.status(200).json({ data: toUserDto(user) });
    } catch (error) {
      return next(error);
    }
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.session.userId;
      if (!userId) {
        throw new UnauthorizedError("Usuario no autenticado");
      }

      const user = await usersService.getUserById(userId);
      if (!user) {
        throw new UnauthorizedError("Usuario no encontrado");
      }

      return res.status(200).json({ data: toUserDto(user) });
    } catch (error) {
      return next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      await destroySession(req);
      return res.sendStatus(204);
    } catch (error) {
      return next(error);
    }
  },
};
