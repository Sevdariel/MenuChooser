import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs';
import { ValidationService } from '../../core/validation/service/validation.service';
import { IForgotPasswordDto, IResetPasswordSendDto } from '../../shared/account/account-dto.model';
import { AccountService } from '../../shared/account/account.service';

@Component({
  selector: 'mc-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  standalone: false,
  providers: [MessageService]
})
export class ForgotPasswordComponent implements OnInit {

  public isReset = signal(false);

  public formGroup!: FormGroup<{ email: FormControl<string> }>;
  public validationService = inject(ValidationService);
  private accountService = inject(AccountService);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.formGroup = new FormGroup({
      email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    })
  }

  public forgotPassword() {
    if (!this.formGroup.controls.email.value) {
      return this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Passwords don\'t match', life: 3000 })
    }

    const forgotPasswordDto: IForgotPasswordDto = {
      email: this.formGroup.controls.email.value,
      clientURI: window.location.origin,
    }

    this.accountService.forgotPassword(forgotPasswordDto).pipe(
      tap((resetPasswordDto: IResetPasswordSendDto) => this.isReset.set(resetPasswordDto.isReset)),
      tap(() => this.formGroup.controls.email.setValue('')),
      takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
