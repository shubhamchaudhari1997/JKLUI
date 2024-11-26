export interface AuthResponse {
  email: string;
  expiryDate: string;
  isSuccess: boolean;
  message: string;
  token: string;
  userId: string;
  userType: number;
} 