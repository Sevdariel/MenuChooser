import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { errorMessages } from './error-messages';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {

  public getErrorMessage(abstractControl: AbstractControl, parentName?: string): string | null {
    if (!!abstractControl.errors) {
      return this.replacePlaceholder(Object.keys(abstractControl.errors)
        .map(error => errorMessages[error])[0], parentName);
    }

    return null;
  }

  public showError(formControl: AbstractControl): boolean {
    return formControl.invalid && !!formControl.errors && formControl.touched;
  }

  private replacePlaceholder(errorMessage: string, parentName?: string): string {
    return !!parentName ? errorMessage.replace('{{parentName}}', parentName) : errorMessage;
  }
}
