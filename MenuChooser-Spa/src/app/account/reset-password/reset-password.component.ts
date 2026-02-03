import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { tap } from 'rxjs';
import { ErrorDirective } from '../../core/validation/error-directive/error.directive';
import { ValidationService } from '../../core/validation/service/validation.service';
import { IResetPasswordDto } from '../../shared/account/account-dto.model';
import { AccountService } from '../../shared/account/account.service';
import { getEmailFromToken } from '../../core/authorization/token-decoder.helper';

@Component({
  selector: 'mc-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  imports: [FormField, ErrorDirective, MessageModule, CommonModule],
  providers: [MessageService],
})
export class ResetPasswordComponent {
  public validationService = inject(ValidationService);
  private accountService = inject(AccountService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  private resetPasswordModel = signal<IResetPasswordDto>({
    token: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  protected signalForm = form(this.resetPasswordModel, (schemaPath) => {
    required(schemaPath.password);
    required(schemaPath.confirmPassword);
  });

  protected onSubmit(event: Event) {
    event.preventDefault();
    submit(this.signalForm, async () => {
      this.resetPassword();
    });
  }

  public resetPassword() {
    if (
      this.resetPasswordModel().password !==
      this.resetPasswordModel().confirmPassword
    ) {
      return this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Passwords do not match',
        life: 3000,
      });
    }

    const token = this.activatedRoute.snapshot.queryParamMap.get('token');
    if (!token) {
      return this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid reset token',
        life: 3000,
      });
    }

    // Extract email from JWT token
    const email = getEmailFromToken(token);

    const resetPasswordDto: IResetPasswordDto = {
      password: this.resetPasswordModel().password,
      confirmPassword: this.resetPasswordModel().confirmPassword,
      email,
      token,
    };

    this.accountService
      .resetPassword(resetPasswordDto)
      .pipe(
        tap(() => {
          this.resetPasswordModel.set({
            token: '',
            email: '',
            password: '',
            confirmPassword: '',
          });
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.router.navigate(['/account/login']));
  }
}
