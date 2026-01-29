import { signal } from "@angular/core";

export interface ILogin {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const login = signal<ILogin>({
  email: '',
  password: '',
  rememberMe: false
});