import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IUser, IUserLoginDto } from './account-dto.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private baseUrl = `api/account/`
  private currentUserSource = new BehaviorSubject<IUser | null>(null);
  public currentUser$ = this.currentUserSource.asObservable();

  constructor(private httpClient: HttpClient) { }

  public login(userDto: IUserLoginDto) {
    console.log('kappa')
    return this.httpClient.post<IUserLoginDto>(`${this.baseUrl}/login`, userDto);
  }

  private setCurrentUser(user: IUser) {
    this.currentUserSource.next(user);
  }
}
