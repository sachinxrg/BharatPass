// TypeScript types for the Bharat Pass application

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  citizenId: string;
  name: string;
  maskedAadhaar: string;
  ekycVerified: boolean;
  role: string;
}

export interface OtpGenerateResponse {
  txnId: string;
  message: string;
}

export interface User {
  citizenId: string;
  name: string;
  maskedAadhaar: string;
  ekycVerified: boolean;
  role: string;
}
