import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  email,
  form,
  FormField,
  maxLength,
  minLength,
  required,
  submit
} from '@angular/forms/signals';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { tap } from 'rxjs';
import { ErrorDirective } from '../../core/validation/error-directive/error.directive';
import { ValidationService } from '../../core/validation/service/validation.service';
import { IUserRegisterDto } from '../../shared/account/account-dto.model';
import { AccountService } from './../../shared/account/account.service';

@Component({
  selector: 'mc-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  standalone: true,
  imports: [
    FormField,
    ErrorDirective,
    MessageModule,
    CommonModule,
    CheckboxModule,
    FloatLabelModule,
    InputTextModule,
    ToastModule,
  ],
  providers: [MessageService],
})
export class SignUpComponent {
  public validationService = inject(ValidationService);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private messageService = inject(MessageService);

  private signUpModel = signal<IUserRegisterDto & { repeatPassword: string }>({
    username: '',
    email: '',
    password: '',
    repeatPassword: '',
    termsOfUse: false,
    privacyPolicy: false,
  });

  protected signalForm = form(this.signUpModel, (schemaPath) => {
    required(schemaPath.username, { message: 'Username is required' });
    minLength(schemaPath.username, 5, {
      message: 'Username must be at least 5 characters',
    });
    maxLength(schemaPath.username, 128, {
      message: 'Username must be at most 128 characters',
    });
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Email is invalid' });
    required(schemaPath.password, { message: 'Password is required' });
    required(schemaPath.repeatPassword, {
      message: 'Repeat password is required',
    });
    required(schemaPath.termsOfUse, { message: 'Terms of use is required' });
    required(schemaPath.privacyPolicy, {
      message: 'Privacy policy is required',
    });
  });

  protected onSubmit(event: Event) {
    event.preventDefault();
    submit(this.signalForm, async () => {
      this.signUp();
    });
  }

  public signUp() {
    if (!this.signalForm().valid()) {
      return this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Sign up form contains errors',
        life: 3000,
      });
    }

    if (this.signUpModel().password !== this.signUpModel().repeatPassword) {
      return this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Passwords do not match',
        life: 3000,
      });
    }

    this.accountService
      .register(this.signUpModel())
      .pipe(
        tap(() => {
          this.signUpModel.set({
            username: '',
            email: '',
            password: '',
            repeatPassword: '',
            termsOfUse: false,
            privacyPolicy: false,
          });
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.router.navigate(['/account/login']));
  }

  protected isFieldInvalid = (formField: any): boolean =>
    formField.errors().length > 0 && formField.touched();
}
