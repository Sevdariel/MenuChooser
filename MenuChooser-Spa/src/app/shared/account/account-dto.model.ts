export interface IUser {
    email: string;
    token: string;
}

export interface IUserLoginDto {
    email: string;
    password: string;
    rememberMe: boolean;
}