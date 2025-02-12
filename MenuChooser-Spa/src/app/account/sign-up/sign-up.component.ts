import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ValidationService } from '../../core/validation/service/validation.service';
import { IUserRegisterDto } from '../../shared/account/account-dto.model';
import { fieldMatchValidator } from '../../shared/validators/field-match.validator';
import { AccountService } from './../../shared/account/account.service';

@Component({
  selector: 'mc-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  standalone: false
})
export class SignUpComponent implements OnInit {

  public readonly validationService = inject(ValidationService);
  private readonly accountService = inject(AccountService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly messageService = inject(MessageService);

  public formGroup!: FormGroup;

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.nonNullable.group({
      username: new FormControl('', { validators: [Validators.required, Validators.minLength(5), Validators.maxLength(128)] }),
      email: new FormControl('', { validators: [Validators.required, Validators.email] }),
      password: new FormControl('', { validators: Validators.required }),
      repeatPassword: new FormControl('', { validators: Validators.required }),
      termsOfUse: new FormControl(false, { validators: Validators.required }),
      privacyPolicy: new FormControl(false, { validators: Validators.required }),
    }, { validators: fieldMatchValidator('password', 'repeatPassword') });
  }

  public signUp() {
    if (this.formGroup.invalid) {
      return this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Sign up form contains errors', life: 3000 })
    }

    this.accountService.register(this.createDto())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe(() => this.router.navigateByUrl(''));
  }

  private createDto(): IUserRegisterDto {
    return {
      email: this.formGroup.controls['email'].value,
      username: this.formGroup.controls['username'].value,
      password: this.formGroup.controls['password'].value,
      termsOfUse: this.formGroup.controls['termsOfUse'].value,
      privacyPolicy: this.formGroup.controls['privacyPolicy'].value,
    }
  }
}
