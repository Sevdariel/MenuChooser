import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { ValidationService } from '../../core/validation/service/validation.service';
import { IForgotPasswordDto, IResetPasswordSendDto } from '../../shared/account/account-dto.model';
import { AccountService } from '../../shared/account/account.service';

@Component({
    selector: 'mc-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.scss',
    standalone: false
})
export class ForgotPasswordComponent implements OnInit {

  public isReset = signal(false);

  public formGroup!: FormGroup<{ email: FormControl<string> }>;
  public validationService = inject(ValidationService);
  public formBuilder = inject(FormBuilder);
  public accountService = inject(AccountService);
  public router = inject(Router);

  private destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.formGroup = new FormGroup({
      email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    })
  }

  public forgotPassword() {
    const forgotPasswordDto: IForgotPasswordDto = {
      email: this.formGroup.controls.email.value,
      clientURI: this.router.url,
    }

    this.accountService.forgotPassword(forgotPasswordDto).pipe(
      tap((resetPasswordDto: IResetPasswordSendDto) => this.isReset.set(resetPasswordDto.isReset)),
      tap(() => this.formGroup.controls.email.setValue('')),
      takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
