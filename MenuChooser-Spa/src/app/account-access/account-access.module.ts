import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountAccessRoutingModule } from './account-access-routing.module';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    AccountAccessRoutingModule,
    ReactiveFormsModule,
  ]
})
export class AccountAccessModule { }
