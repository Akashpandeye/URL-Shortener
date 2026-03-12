export interface ShortLink {
  id: string;
  shortCode: string;
  targetUrl: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface CreateUrlFormData {
  url: string;
  code?: string;
}
