import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'mc-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  public formGroup!: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      login: new FormControl('',Validators.required),
      password: new FormControl('', Validators.required),
    });
  }
}
