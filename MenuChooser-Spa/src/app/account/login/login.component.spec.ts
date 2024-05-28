import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { IUserLoginDto } from '../../shared/account/account-dto.model';
import { AccountModule } from '../account.module';
import { LoginComponent } from './login.component';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const correctUser: IUserLoginDto = {
    email: 'email@email.com',
    password: 'password',
    rememberMe: false,
  };

  beforeEach(async () => {


    await TestBed.configureTestingModule({
      imports: [
        AccountModule,
        HttpClientModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('component should have formGroup', () => {
    const formGroup = component.formGroup;
    expect(formGroup).toBeTruthy();
  })

  it('email formControl should be invalid when email is not provided', () => {
    const emailFormControl = component.formGroup.controls['email'];
    emailFormControl.setValue('');

    expect(emailFormControl.invalid).toEqual(true);
  })

  it('email formControl should show required error when no input', () => {
    console.log('fixture.debugElement', fixture.debugElement)
    component.formGroup.controls['email'].setValue('');
    component.formGroup.markAllAsTouched();
    const emailErrorMessageElement = fixture.debugElement.query(By.css('[data-testid="emailErrorMessage"]'));
    console.log('emailErrorMessageElement', emailErrorMessageElement)
  })

  it('email formControl should show type error when value is not email')

  it('password formControl should be invalid when email is not provided')

  it('password formControl should show required error when no input')

  it('email and password should show error when sign in button clicked')

  it('api call should happen once when sign in button clicked and form is valid')
});
