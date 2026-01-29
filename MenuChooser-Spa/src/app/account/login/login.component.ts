import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ErrorDirective } from '../../core/validation/error-directive/error.directive';
import { ValidationService } from '../../core/validation/service/validation.service';
import { IUserLoginDto } from '../../shared/account/account-dto.model';
import { AccountService } from '../../shared/account/account.service';

@Component({
    selector: 'mc-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink,
        ErrorDirective
    ]
})
export class LoginComponent implements OnInit {

  public formGroup!: FormGroup;
  private destroyRef = inject(DestroyRef);

  constructor(
    public validationService: ValidationService,
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private router: Router,
  ) { }

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.nonNullable.group({
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
        ).subscribe(() => this.router.navigateByUrl(''));
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
