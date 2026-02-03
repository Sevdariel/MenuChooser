import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  email,
  form,
  FormField,
  required,
  submit,
  minLength,
  maxLength,
} from '@angular/forms/signals';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs';
import { ValidationService } from '../../core/validation/service/validation.service';
import { IUserRegisterDto } from '../../shared/account/account-dto.model';
import { AccountService } from './../../shared/account/account.service';
import { ErrorDirective } from '../../core/validation/error-directive/error.directive';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';

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
    required(schemaPath.username);
    minLength(schemaPath.username, 5);
    maxLength(schemaPath.username, 128);
    required(schemaPath.email);
    email(schemaPath.email);
    required(schemaPath.password);
    required(schemaPath.repeatPassword);
    required(schemaPath.termsOfUse);
    required(schemaPath.privacyPolicy);
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

    // Additional validation for password match
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
}
