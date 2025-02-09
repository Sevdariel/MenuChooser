export interface IUser {
    username: string;
    email: string;
    token: string;
}

export type StorageUser = Pick<IUser, 'email' | 'token'>;