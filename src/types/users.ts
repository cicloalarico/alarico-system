
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  password: string;
  department?: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  confirmPassword?: string;
}
