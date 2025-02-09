import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, catchError, filter, tap, throwError } from 'rxjs';
import { IForgotPasswordDto, IResetPasswordDto, IResetPasswordSendDto, IUserLoginDto, IUserRegisterDto } from './account-dto.model';
import { IUser, StorageUser } from './account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private baseUrl = `api/account`
  private currentUser = signal<IUser | undefined>(undefined);
  public loggedUser = this.currentUser.asReadonly();

  constructor(private httpClient: HttpClient) {
    // Todo: Do przerobienia aby zapewnić pełną ilość danych zalogowanego użytkownika
    if (!!localStorage.getItem('user')) {
      this.currentUser.set(JSON.parse(localStorage.getItem('user')!))
    } else if (!!sessionStorage.getItem('user')) {
      this.currentUser.set(JSON.parse(sessionStorage.getItem('user')!))
    }
  }

  public register(userRegisterDto: IUserRegisterDto) {
    return this.httpClient.post<IUser>(`${this.baseUrl}/register`, userRegisterDto)
      .pipe(
        filter(registeredUser => !!registeredUser),
        tap(loggedUser => this.setStorageUser(loggedUser, false)),
      );
  }

  public login(userLoginDto: IUserLoginDto) {
    return this.httpClient.post<IUser>(`${this.baseUrl}/login`, userLoginDto)
      .pipe(
        filter(loggedUser => !!loggedUser),
        tap(loggedUser => this.setStorageUser(loggedUser, userLoginDto.rememberMe)),
      );
  }

  public forgotPassword(forgotPasswordDto: IForgotPasswordDto): Observable<IResetPasswordSendDto> {
    return this.httpClient.post<IResetPasswordSendDto>(`${this.baseUrl}/forgot-password`, forgotPasswordDto)
      .pipe(
        filter(resetPasswordDto => !!resetPasswordDto));
  }

  public resetPassword(resetPasswordDto: IResetPasswordDto) {
    console.log('resetPassword', resetPasswordDto);
    return this.httpClient.post<IResetPasswordDto>(`${this.baseUrl}/reset-password`, resetPasswordDto);
  }

  public logout() {
    if (!!localStorage.getItem('user')) {
      localStorage.removeItem('user');
    } else if (!!sessionStorage.getItem('user')) {
      sessionStorage.removeItem('user');
    }

    this.currentUser.set(undefined);
  }

  private setStorageUser(user: IUser, rememberMe: boolean) {
    const storageUser: StorageUser = {
      email: user.email,
      token: user.token,
    }
    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(storageUser));
    } else {
      sessionStorage.setItem('user', JSON.stringify(storageUser));
    }

    this.setCurrentUser(user);
  }

  private setCurrentUser(user: IUser) {
    this.currentUser.set(user);
  }
}
