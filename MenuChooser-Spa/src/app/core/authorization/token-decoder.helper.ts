import { jwtDecode } from "jwt-decode";

export function getEmailFromToken(token: string): string {
    const decoded: any = jwtDecode(token);
    return decoded.email;
}