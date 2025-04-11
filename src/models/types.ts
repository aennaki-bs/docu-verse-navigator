
// Common types used across the application
export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
}
