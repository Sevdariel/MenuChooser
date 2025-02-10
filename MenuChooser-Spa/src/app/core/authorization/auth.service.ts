import { Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { IUser } from '../../shared/account/account.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'auth_token';

  private currentUser = signal<IUser | undefined>(undefined);
  public loggedUser = this.currentUser.asReadonly();
  private rememberMe = signal(false);

  constructor() {
    this.loadUserFromStorage();
  }

  public setToken(token: string, rememberMe = false) {
    localStorage.setItem(this.tokenKey, token);
    this.rememberMe.set(rememberMe);
    this.updateUserFromToken(token);
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  public logout() {
    if (this.isTokenExpired(this.getToken()!)) {
      localStorage.removeItem(this.tokenKey);
    }

    if (!this.rememberMe) {
      localStorage.removeItem(this.tokenKey);
    }

    if (!!localStorage.getItem(this.tokenKey)) {
      localStorage.removeItem(this.tokenKey);
    }

    this.currentUser.set(undefined);
  }

  public getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  private loadUserFromStorage() {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      this.updateUserFromToken(token);
    }
  }

  private isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp) {
        return decoded.exp * 1000 < Date.now();
      }
      return false;
    } catch (error) {
      return true;
    }
  }

  private updateUserFromToken(token: string) {
    try {
      const decoded: any = jwtDecode(token);
      this.currentUser.set({
        email: decoded.email,
        username: decoded.preferred_username,
      });
      this.rememberMe.set(true);
    } catch (error) {

    }
  }
}
