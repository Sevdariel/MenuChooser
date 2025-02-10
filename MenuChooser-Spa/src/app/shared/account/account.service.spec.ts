import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { asyncData, asyncError } from '../../core/tests/tests-async-helper-functions';
import { IUserLoginDto, IUserRegisterDto } from './account-dto.model';
import { AccountService } from './account.service';
import { IUser } from './account.model';

describe('AccountService', () => {
  let accountService: AccountService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  const expectedUser: IUser = {
    username: 'username',
    email: 'email@email.com',
    token: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJlbWFpbEBlbWFpbC5jb20iLCJuYmYiOjE3MTYzNzA4ODUsImV4cCI6MTcxNjk3NTY4NSwiaWF0IjoxNzE2MzcwODg1fQ.vXKFlUq36Ubs1tb3XXE-9srD46k32lPLZhPsK6DX1apyzUiute4UQdrGveRJgcliXfGfxQUizKlNJmjC9OGqRw',
  }

  const loginDto: IUserLoginDto = {
    email: 'email@email.com',
    password: 'password',
    rememberMe: false,
  }

  const registerDto: IUserRegisterDto = {
    email: 'email@email.com',
    password: 'password',
    privacyPolicy: true,
    repeatPassword: 'password',
    termsOfUse: false,
    username: 'username'
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    accountService = new AccountService(httpClientSpy);
  });

  it('should be created', () => {
    expect(accountService).toBeTruthy();
  });

  it('login should return expected user', (done: DoneFn) => {
    httpClientSpy.post.and.returnValue(asyncData(expectedUser));

    accountService.login(loginDto)
      .subscribe(loggedUser => {
        expect(loggedUser).withContext('expected user').toEqual(expectedUser);
        done();
      });
  })

  it('register should return expected user', (done: DoneFn) => {
    httpClientSpy.post.and.returnValue(asyncData(expectedUser));

    accountService.register(registerDto)
      .subscribe(registeredUser => {
        expect(registeredUser).withContext('expected user').toEqual(expectedUser);
        done();
      });
  })

  it('login with rememberMe = true should save user to localStorage', (done: DoneFn) => {
    httpClientSpy.post.and.returnValue(asyncData(expectedUser));

    loginDto.rememberMe = true;
    accountService.login(loginDto).subscribe(() => {
      done();
      let storage = JSON.parse(localStorage.getItem('user')!) as IUser;
      expect(storage).toEqual(expectedUser);
    });
  })

  it('login with rememberMe = false should save user to sessionStorage', (done: DoneFn) => {
    httpClientSpy.post.and.returnValue(asyncData(expectedUser));

    accountService.login(loginDto).subscribe(() => done());

    let storage = JSON.parse(sessionStorage.getItem('user')!) as IUser;
    expect(storage).toEqual(expectedUser);
  })

  it('register should return account exists error message', (done: DoneFn) => {
    const errorResponse = new HttpErrorResponse({
      error: 'Account Exists',
      status: 400,
      statusText: 'Bad Request'
    });

    httpClientSpy.post.and.returnValue(asyncError(errorResponse));

    accountService.register(registerDto)
      .subscribe({
        next: () => done.fail('should have failed with the 400 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).withContext('status').toEqual(errorResponse.status);
          expect(error.error).withContext('error').toEqual(errorResponse.error);
          expect(error.statusText).withContext('statusText').toEqual(errorResponse.statusText);
          done();
        },
      });
  })

  it('register should return username already taken error message', (done: DoneFn) => {
    const errorResponse = new HttpErrorResponse({
      error: 'Username already taken',
      status: 400,
      statusText: 'Bad Request'
    });

    httpClientSpy.post.and.returnValue(asyncError(errorResponse));

    accountService.register(registerDto)
      .subscribe({
        next: () => done.fail('should have failed with the 400 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).withContext('status').toEqual(errorResponse.status);
          expect(error.error).withContext('error').toEqual(errorResponse.error);
          expect(error.statusText).withContext('statusText').toEqual(errorResponse.statusText);
          done();
        },
      });
  })

  it('login should return unauthorized when email doesnt exist', (done: DoneFn) => {
    const errorResponse = new HttpErrorResponse({
      error: 'Invalid email',
      status: 401,
      statusText: 'Unauthorized'
    });

    httpClientSpy.post.and.returnValue(asyncError(errorResponse));

    accountService.login(loginDto)
      .subscribe({
        next: () => done.fail('should have failed with the 400 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).withContext('status').toEqual(errorResponse.status);
          expect(error.error).withContext('error').toEqual(errorResponse.error);
          expect(error.statusText).withContext('statusText').toEqual(errorResponse.statusText);
          done();
        },
      });
  })

  it('login should return unauthorized when password is invalid', (done: DoneFn) => {
    const errorResponse = new HttpErrorResponse({
      error: 'Invalid password',
      status: 401,
      statusText: 'Unauthorized'
    });

    httpClientSpy.post.and.returnValue(asyncError(errorResponse));

    accountService.login(loginDto)
      .subscribe({
        next: () => done.fail('should have failed with the 400 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).withContext('status').toEqual(errorResponse.status);
          expect(error.error).withContext('error').toEqual(errorResponse.error);
          expect(error.statusText).withContext('statusText').toEqual(errorResponse.statusText);
          done();
        },
      });
  })
});
