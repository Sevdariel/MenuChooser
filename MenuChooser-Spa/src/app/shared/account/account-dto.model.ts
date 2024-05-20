export interface IUser {
    email: string;
    token: string;
}

export interface IUserLoginDto {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface IUserRegisterDto {
    username: string;
    email: string;
    password: string;
    repeatPassword: string;
    termsOfUse: boolean;
    privacyPolicy: boolean;
}