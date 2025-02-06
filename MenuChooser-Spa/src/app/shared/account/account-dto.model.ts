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

export interface IForgotPasswordDto {
    email: string;
    clientURI: string;
}

export interface IResetPasswordSendDto {
    isReset: boolean;
}

export interface IResetPasswordDto {
    token: string;
    email: string;
    password: string;
    confirmPassword: string;
}