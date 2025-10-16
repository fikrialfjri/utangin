export class UserResponse {
  username: string;
  full_name: string;
  email: string;
  balance: number;
}

export class AuthResponse {
  access_token: string;
  user: UserResponse;
}
