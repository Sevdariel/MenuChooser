interface IErrorMessages {
    [key: string]: string;
}

export const errorMessages: IErrorMessages = {
    'required': 'This field is required',
    'email': 'Invalid email address format. Try again.',
    'sameValues': 'The value differs from the value in the {{parentName}} field.'
}
