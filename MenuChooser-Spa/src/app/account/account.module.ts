import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { ErrorDirective } from '../core/validation/error-directive/error.directive';
import { AccountRoutingModule } from './account-routing.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignUpComponent } from './sign-up/sign-up.component';

@NgModule({
  declarations: [
    SignUpComponent,
    ResetPasswordComponent,
  ],
  imports: [
    ErrorDirective,
    CommonModule,
    AccountRoutingModule,
    ReactiveFormsModule,
    ToastModule,
    MessageModule,
    InputTextModule,
    FloatLabelModule,
    CheckboxModule,
  ]
})
export class AccountModule { }
