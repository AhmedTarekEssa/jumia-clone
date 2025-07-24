export interface LoginDto{
    email: string | null;
    password: string | null;
}

export interface EmailCheckDto {
    email: string;
}

export interface OtpVerifyDto{
    email: string;
    otpCode: string;
}

export interface PasswordSetupDto {
     firstName: string;
  lastName: string;
  birthDate: string;      // string in ISO format (e.g., '2000-01-01')
  gender: string;
  address: string;
    email: string;
    password: string;
    confirmPassword: string;
    otpCode: string;
}
export interface CreateSellerDto {
     firstName: string;
  lastName: string;
  birthDate: string;      // string in ISO format (e.g., '2000-01-01')
  gender: string;
  address: string;
    email: string;
    password: string;
    confirmPassword: string;
    BussinessDiscreption: string;
    BussinessLogo: string;
    otpCode: string;

}

export interface User {
    token: string;
    message: string;
    userId: string;
    email: string;
    userName: string;
}

export interface UserInfo{
    userId: string;
    email: string;
    userName: string;
    role?: string | string[];
}

export interface AuthResponse {
    message: string;
    token?: string;
}