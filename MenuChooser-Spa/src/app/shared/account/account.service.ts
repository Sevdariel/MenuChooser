import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, catchError, filter, tap, throwError } from 'rxjs';
import { IUser, IUserLoginDto, IUserRegisterDto } from './account-dto.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private baseUrl = `api/account`
  private currentUser = signal<IUser | undefined>(undefined);
  public loggedUser = this.currentUser.asReadonly();

  constructor(private httpClient: HttpClient) {
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
        catchError(this.handleError())
      );
  }

  public login(userLoginDto: IUserLoginDto) {
    return this.httpClient.post<IUser>(`${this.baseUrl}/login`, userLoginDto)
      .pipe(
        filter(loggedUser => !!loggedUser),
        tap(loggedUser => this.setStorageUser(loggedUser, userLoginDto.rememberMe)),
        catchError(this.handleError())
      );
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
    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.setItem('user', JSON.stringify(user));
    }

    this.setCurrentUser(user);
  }

  private setCurrentUser(user: IUser) {
    this.currentUser.set(user);
  }

  private handleError<T>() {
    return (error: HttpErrorResponse): Observable<T> => {
      return throwError(() => error);
    };
  }
}
