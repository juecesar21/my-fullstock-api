import { usersRepository } from "@/repositories/users.repository.js";
import { ConflictError, NotFoundError } from "@/shared/errors.js";
import { hashPassword } from "@/shared/hash.js";

export const usersService = {
  async getUserByEmail(email: string) {
    const user = await usersRepository.findByEmail(email);

    return user;
  },

  async createUser(email: string, password: string) {
    const existingUser = await usersService.getUserByEmail(email);

    if (existingUser) {
      throw new ConflictError("Correo electrónico ya registrado");
    }

    const hashedPassword = await hashPassword(password);
    const user = await usersRepository.create({
      email,
      password: hashedPassword,
    });

    return user;
  },

  async getUserById(id: number) {
    const user = await usersRepository.findById(id);
    return user;
  },
  async updateUserData(
    id: number,
    data: Partial<{ email: string; password: string }>
  ) {
    const user = await usersRepository.findById(id);
    if (!user) {
      throw new NotFoundError("Usuario no encontrado");
    }
    if (data.email) {
      const existingUser = await usersRepository.findByEmail(data.email);
      if (existingUser && existingUser.id !== id) {
        throw new ConflictError("Correo electrónico ya registrado");
      }
    }

    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    const updateUser = await usersRepository.updateUserData(id, data);
    return updateUser;
  },
};
