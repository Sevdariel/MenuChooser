import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Toast } from 'primeng/toast';
import { ErrorDirective } from '../core/validation/error-directive/error.directive';
import { AccountRoutingModule } from './account-routing.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignUpComponent } from './sign-up/sign-up.component';

@NgModule({
  declarations: [
    LoginComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
  ],
  imports: [
    ErrorDirective,
    CommonModule,
    AccountRoutingModule,
    ReactiveFormsModule,
    Toast,
  ]
})
export class AccountModule { }
