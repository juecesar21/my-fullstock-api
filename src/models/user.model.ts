export interface User {
  id: number;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export type UserDto = Omit<User, "password">;

export function toUserDto(user: User): UserDto {
  const { password: _, ...userDto } = user;
  return userDto;
}
