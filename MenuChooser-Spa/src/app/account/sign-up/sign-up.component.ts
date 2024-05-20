import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationService } from '../../core/validation/service/validation.service';
import { IUserRegisterDto } from '../../shared/account/account-dto.model';
import { AccountService } from '../../shared/account/account.service';
import { fieldMatchValidator } from '../../shared/validators/field-match.validator';

@Component({
  selector: 'mc-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent implements OnInit {

  public formGroup!: FormGroup;
  private destroyRef = inject(DestroyRef);

  constructor(
    public validationService: ValidationService,
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.nonNullable.group({
      username: new FormControl('', { validators: [Validators.required, Validators.minLength(5), Validators.minLength(128)] }),
      email: new FormControl('', { validators: [Validators.required, Validators.email] }),
      password: new FormControl('', { validators: Validators.required }),
      repeatPassword: new FormControl('', { validators: Validators.required }),
      termsOfUse: new FormControl(false, { validators: Validators.required }),
      privacyPolicy: new FormControl(false),
    }, { validators: fieldMatchValidator('password', 'repeatPassword') });
  }

  public signUp() {
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
      repeatPassword: this.formGroup.controls['repeatPassword'].value,
      termsOfUse: this.formGroup.controls['termsOfUse'].value,
      privacyPolicy: this.formGroup.controls['privacyPolicy'].value,
    }
  }
}
