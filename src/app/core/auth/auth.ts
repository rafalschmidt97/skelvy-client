export interface AuthDto {
  accountCreated: boolean;
  accessToken: string;
  refreshToken: string;
}

export interface TokenDto {
  accessToken: string;
  refreshToken: string;
}
