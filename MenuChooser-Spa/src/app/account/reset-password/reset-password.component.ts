import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AccountService } from '../../shared/account/account.service';
import { IResetPasswordDto } from '../../shared/account/account-dto.model';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type ResetPasswordFormType = {
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
};

@Component({
  selector: 'mc-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private accountService = inject(AccountService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  public formGroup!: FormGroup<ResetPasswordFormType>;

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.nonNullable.group({
      password: new FormControl(),
      confirmPassword: new FormControl(),
    })
  }

  public resetPassword() {
    if (this.formGroup.controls.password.value !== this.formGroup.controls.confirmPassword.value)
      return;

    const resetPasswordDto: IResetPasswordDto = {
      password: this.formGroup.controls.password.value,
      confirmPassword: this.formGroup.controls.confirmPassword.value,
      email: this.activatedRoute.snapshot.queryParamMap.get('email')!,
      token: this.activatedRoute.snapshot.queryParamMap.get('token')!,
    }

    this.accountService.resetPassword(resetPasswordDto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.router.navigate(['account/login']));
  }
}
