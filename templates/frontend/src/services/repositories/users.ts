import { mockUsers } from "../../mocks/users";
import type { User } from "../../mocks/users";

export const getUsers = async (): Promise<User[]> => mockUsers;

export const getUserById = async (id: string): Promise<User | undefined> =>
  mockUsers.find((u) => u.id === id);
