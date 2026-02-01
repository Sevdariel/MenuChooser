import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import {
  email,
  form,
  FormField,
  required,
  submit,
} from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { ErrorDirective } from '../../core/validation/error-directive/error.directive';
import { ValidationService } from '../../core/validation/service/validation.service';
import { AccountService } from '../../shared/account/account.service';
import { ILogin } from './models/login.model';

@Component({
  selector: 'mc-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ErrorDirective,
    FormField,
  ],
})
export class LoginComponent {
  public validationService = inject(ValidationService);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  private loginModel = signal<ILogin>({
    email: '',
    password: '',
    rememberMe: false,
  });

  public signalForm = form(this.loginModel, (schemaPath) => {
    (required(schemaPath.email, { message: 'Email is required' }),
      email(schemaPath.email, {
        message: 'Invalid email address format. Try again.',
      }),
      required(schemaPath.password, { message: 'Password is required' }));
  });

  public onSubmit(event: Event) {
    event.preventDefault();
    submit(this.signalForm, async () => this.login());
  }

  public login() {
    if (this.signalForm().valid()) {
      const loginDto = this.loginModel();
      this.accountService
        .login(loginDto)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.router.navigateByUrl('home'));
    }
  }
}
