import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { FieldTree, form, FormField } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { ErrorDirective } from '../../core/validation/error-directive/error.directive';
import { ValidationService } from '../../core/validation/service/validation.service';
import { IUserLoginDto } from '../../shared/account/account-dto.model';
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
export class LoginComponent implements OnInit {
  public validationService = inject(ValidationService);
  private formBuilder = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  public formGroup!: FormGroup;
  public signalForm!: FieldTree<ILogin>;

  private loginModel = signal<ILogin>({
    email: '',
    password: '',
    rememberMe: false,
  });

  public ngOnInit(): void {
    this.signalForm = form(this.loginModel);
    this.formGroup = this.formBuilder.nonNullable.group({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', { validators: Validators.required }),
      rememberMe: new FormControl(false),
    });
  }

  public login() {
    console.log('this.signalForm', this.signalForm);
    console.log('this.signalForm.email()', this.signalForm.email());
    console.log('this.signalForm.password()', this.signalForm.password());
    console.log('this.signalForm.rememberMe()', this.signalForm.rememberMe());
    this.formGroup.markAllAsTouched();

    if (this.formGroup.valid) {
      this.accountService
        .login(this.createUserLoginDto())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.router.navigateByUrl(''));
    }
  }

  private createUserLoginDto(): IUserLoginDto {
    return {
      email: this.formGroup.controls['email'].value,
      password: this.formGroup.controls['password'].value,
      rememberMe: this.formGroup.controls['rememberMe'].value,
    };
  }
}
