import { query } from "@/db/index.js";
import type { User } from "@/models/user.model.js";
import type { QueryResultRow } from "pg";

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

  async updateUserData(
    id: number,
    data: Partial<User>
  ): Promise<QueryResultRow | undefined> {
    const result = await query(
      `UPDATE users SET ${Object.keys(data)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(", ")} WHERE id = $${Object.keys(data).length + 1}
      RETURNING id, email, created_at, updated_at`,
      [...Object.values(data), id]
    );
    return result.rows[0];
  },
};
