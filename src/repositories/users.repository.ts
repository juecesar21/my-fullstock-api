import { query } from "@/db/index.js";
import type { User } from "@/models/user.model.js";

export const usersRepository = {
  async findByEmail(email: string): Promise<User | null> {
    const result = await query<User>("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0] || null;
  },

  async create(user: { email: string; password: string }): Promise<User> {
    const result = await query<User>(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [user.email, user.password]
    );

    /*
      If the insertion fails, pg will throw an error.
      If we reach this point, the insert succeeded and result.rows[0] is guaranteed to exist.
    */
    return result.rows[0]!;
  },

  async findById(id: number): Promise<User | null> {
    const result = await query<User>("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0] || null;
  },
};
