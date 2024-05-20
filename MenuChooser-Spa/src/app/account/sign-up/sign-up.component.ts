import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ISignUpForm } from './models/signup.model';
import { ValidationService } from '../../core/validation/service/validation.service';
import { fieldMatchValidator } from '../../shared/validators/field-match.validator';

@Component({
  selector: 'mc-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent implements OnInit {

  public formGroup!: FormGroup;

  constructor(
    public validationService: ValidationService,
    private formBuilder: FormBuilder,
  ) { }

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.nonNullable.group<ISignUpForm>({
      username: new FormControl('', { validators: [Validators.required, Validators.minLength(5), Validators.minLength(128)] }),
      email: new FormControl('', { validators: [Validators.required, Validators.email] }),
      password: new FormControl('', { validators: Validators.required }),
      repeatPassword: new FormControl('', { validators: Validators.required }),
    }, { validators: fieldMatchValidator('password', 'repeatPassword') });
  }

  public signUp() {
    console.log('sign up')
  }
}
