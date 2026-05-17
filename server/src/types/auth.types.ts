export enum UserRole {
  ADMIN = 'admin',
  SALES_USER = 'sales_user',
}

export interface IUserPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}
