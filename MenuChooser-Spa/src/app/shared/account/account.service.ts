import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IUser } from './account-dto.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private currentUserSource = new BehaviorSubject<IUser | null>(null);
  public currentUser$ = this.currentUserSource.asObservable();

  constructor() { }

  public login() {
    this.setCurrentUser({
      token: 'token',
      username: 'username',
    });
  }

  private setCurrentUser(user: IUser) {
    this.currentUserSource.next(user);
  }
}
