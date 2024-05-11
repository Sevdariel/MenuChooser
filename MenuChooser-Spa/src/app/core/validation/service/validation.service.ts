import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { errorMessages } from './error-messages';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {

  public getErrorMessage(abstractControl: AbstractControl): string | null{
    if (!!abstractControl.errors) {
      return Object.keys(abstractControl.errors).map(error => errorMessages[error])[0];
    }

    return null;
  }

  public showError(formControl: AbstractControl): boolean {
    return formControl.invalid && !!formControl.errors && formControl.touched;
  }
}
