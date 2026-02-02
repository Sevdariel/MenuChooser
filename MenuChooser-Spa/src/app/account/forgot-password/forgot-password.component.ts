import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import {
  email,
  form,
  FormField,
  required,
  submit,
} from '@angular/forms/signals';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs';
import { ValidationService } from '../../core/validation/service/validation.service';
import {
  IForgotPasswordDto,
  IResetPasswordSendDto,
} from '../../shared/account/account-dto.model';
import { AccountService } from '../../shared/account/account.service';
import { ErrorDirective } from '../../core/validation/error-directive/error.directive';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mc-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  imports: [FormField, ErrorDirective, MessageModule, CommonModule],
  providers: [MessageService],
})
export class ForgotPasswordComponent {
  public isReset = signal(false);

  public formGroup!: FormGroup<{ email: FormControl<string> }>;
  public validationService = inject(ValidationService);
  private accountService = inject(AccountService);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);

  private forgotPasswordModel = signal<IForgotPasswordDto>({
    email: '',
    clientURI: window.location.origin,
  });

  protected signalForm = form(this.forgotPasswordModel, (schemaPath) => {
    (required(schemaPath.email), email(schemaPath.email));
  });

  protected onSubmit(event: Event) {
    event.preventDefault();
    submit(this.signalForm, async () => {
      this.forgotPassword();
    });
  }

  public forgotPassword() {
    if (!this.signalForm.email().value()) {
      return this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: "Passwords don't match",
        life: 3000,
      });
    }

    this.accountService
      .forgotPassword(this.forgotPasswordModel())
      .pipe(
        tap((resetPasswordDto: IResetPasswordSendDto) =>
          this.isReset.set(resetPasswordDto.isReset),
        ),
        tap(() =>
          this.forgotPasswordModel.set({
            email: '',
            clientURI: window.location.origin,
          }),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
