export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

export const mockUsers: User[] = [
  { id: "1", name: "田中太郎", email: "tanaka@example.com", role: "admin" },
  { id: "2", name: "佐藤花子", email: "sato@example.com", role: "user" },
  { id: "3", name: "鈴木一郎", email: "suzuki@example.com", role: "user" },
  { id: "4", name: "高橋美咲", email: "takahashi@example.com", role: "admin" },
];
