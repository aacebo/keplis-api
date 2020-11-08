export interface IAuthPayload {
  readonly id: string;
  readonly email: string;
  readonly username: string;
  iat?: number;
}
