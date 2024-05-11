import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountAccessRoutingModule } from './account-access-routing.module';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorDirective } from '../core/validation/error-directive/error.directive';

@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    ErrorDirective,
    CommonModule,
    AccountAccessRoutingModule,
    ReactiveFormsModule,
  ]
})
export class AccountAccessModule { }
