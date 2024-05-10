import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../core/validation/service/validation.service';
import { AccountService } from '../../shared/account/account.service';
import { ILoginForm } from './models/login.model';

@Component({
  selector: 'mc-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {

  public formGroup!: FormGroup;

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
    this.validationService.validateFormGroup(this.formGroup);
  }
}
