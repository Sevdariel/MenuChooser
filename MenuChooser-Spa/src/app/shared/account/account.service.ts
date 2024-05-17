import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { filter, map } from 'rxjs';
import { IUser, IUserLoginDto } from './account-dto.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private baseUrl = `api/account/`
  private currentUser = signal({});
  public loggedUser = this.currentUser.asReadonly();

  constructor(private httpClient: HttpClient) { }

  public login(userDto: IUserLoginDto) {
    return this.httpClient.post<IUser>(`${this.baseUrl}/login`, userDto)
      .pipe(
        filter(logedUser => !!logedUser),
        map(logedUser => this.setCurrentUser(logedUser)));
  }

  private setCurrentUser(user: IUser) {
    this.currentUser.set(user);
  }
}
