import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { filter, tap } from 'rxjs';
import { IUser, IUserLoginDto } from './account-dto.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private baseUrl = `api/account`
  private currentUser = signal<IUser | undefined>(undefined);
  public loggedUser = this.currentUser.asReadonly();

  constructor(private httpClient: HttpClient) { }

  public login(userDto: IUserLoginDto) {
    return this.httpClient.post<IUser>(`${this.baseUrl}/login`, userDto)
      .pipe(
        filter(loggedUser => !!loggedUser),
        tap(loggedUser => this.setCurrentUser(loggedUser)),
        tap(loggedUser => this.setStorageUser(loggedUser, userDto.rememberMe)));

  }

  private setStorageUser(user: IUser, rememberMe: boolean) {
    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.setItem('user', JSON.stringify(user));
    }
  }

  private setCurrentUser(user: IUser) {
    this.currentUser.set(user);
  }
}
