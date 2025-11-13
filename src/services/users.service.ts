import { usersRepository } from "@/repositories/users.repository.js";
import { ConflictError } from "@/shared/errors.js";
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
};
