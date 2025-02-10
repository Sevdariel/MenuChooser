import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { filter, Observable, tap } from 'rxjs';
import { AuthService } from '../../core/authorization/auth.service';
import { IForgotPasswordDto, IResetPasswordDto, IResetPasswordSendDto, IUserLoginDto, IUserRegisterDto } from './account-dto.model';
import { ITokenDto, IUser } from './account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private httpClient = inject(HttpClient);
  private authService = inject(AuthService);

  private baseUrl = `api/account`
  private currentUser = signal<IUser | undefined>(undefined);
  public loggedUser = this.currentUser.asReadonly();

  public register(userRegisterDto: IUserRegisterDto) {
    return this.httpClient.post<ITokenDto>(`${this.baseUrl}/register`, userRegisterDto)
      .pipe(
        tap(tokenDto => this.authService.setToken(tokenDto.token)),
      );
  }

  public login(userLoginDto: IUserLoginDto) {
    return this.httpClient.post<ITokenDto>(`${this.baseUrl}/login`, userLoginDto)
      .pipe(
        tap(tokenDto => this.authService.setToken(tokenDto.token, userLoginDto.rememberMe)),
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
}
