import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { IUserLoginDto } from '../../shared/account/account-dto.model';
import { LoginComponent } from './login.component';
import { By } from '@angular/platform-browser';
import { AccountService } from '../../shared/account/account.service';
import { ValidationService } from '../../core/validation/service/validation.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let accountServiceSpy: jasmine.SpyObj<AccountService>;
  const correctUser: IUserLoginDto = {
    email: 'email@email.com',
    password: 'password',
    rememberMe: false,
  };

  beforeEach(async () => {
    accountServiceSpy = jasmine.createSpyObj('AccountService', ['login', 'register']);

    await TestBed.configureTestingModule({
    imports: [
      LoginComponent,
      RouterTestingModule
    ],
    providers: [
      provideHttpClient(withInterceptorsFromDi()),
      ValidationService,
      { provide: AccountService, useValue: accountServiceSpy }
    ]
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
    // console.log('fixture.debugElement', fixture.debugElement)
    component.formGroup.controls['email'].setValue('');
    component.formGroup.markAllAsTouched();
    const emailErrorMessageElement = fixture.debugElement.query(By.css('[data-testid="emailErrorMessage"]'));
    // console.log('emailErrorMessageElement', emailErrorMessageElement)
  })

  it('email formControl should show type error when value is not email')

  it('password formControl should be invalid when email is not provided')

  it('password formControl should show required error when no input')

  it('email and password should show error when sign in button clicked')

  it('api call should happen once when sign in button clicked and form is valid')

  it('sign in button clicked', () => {
    const debugElement = fixture.debugElement.query(By.css('#signIn'));
    
    debugElement.triggerEventHandler('click', null);

    expect(accountServiceSpy.login).toHaveBeenCalled();

    // expect(debugElement.triggerEventHandler('click', null)).toHaveBeenCalled();
  })
});
