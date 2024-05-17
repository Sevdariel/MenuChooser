import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../core/validation/service/validation.service';
import { IUserLoginDto } from '../../shared/account/account-dto.model';
import { AccountService } from '../../shared/account/account.service';
import { ILoginForm } from './models/login.model';

@Component({
  selector: 'mc-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {

  public formGroup!: FormGroup;
  private destroyRef = inject(DestroyRef);

  constructor(
    public validationService: ValidationService,
    private formBuilder: FormBuilder,
    private accountService: AccountService,
  ) { }

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.nonNullable.group<ILoginForm>({
      email: new FormControl('', { validators: [Validators.required, Validators.email] }),
      password: new FormControl('', { validators: Validators.required }),
      rememberMe: new FormControl(false),
    });
  }

  public login() {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.valid) {
      this.accountService.login(this.createUserLoginDto())
        .pipe(
          takeUntilDestroyed(this.destroyRef),
        ).subscribe();
    }
  }

  private createUserLoginDto(): IUserLoginDto {
    return {
      email: this.formGroup.controls['email'].value,
      password: this.formGroup.controls['password'].value,
      rememberMe: this.formGroup.controls['rememberMe'].value
    };
  }
}
