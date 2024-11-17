import { JwtPayload } from "jwt-decode";

export interface AccessTokenPayload extends JwtPayload {
    nameid: number,
    unique_name: string,
    email: string,
    role: string,
  }