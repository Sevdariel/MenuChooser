import { Injectable } from '@angular/core';
import { Form, FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {

  constructor() { }

  public validateFormGroup(formGroup: FormGroup) {
    console.log('kappa')
    console.log('formGroup', formGroup)
    Object.keys(formGroup.controls).forEach(control => this.setControlErrorMessage(formGroup.controls[control] as FormControl))
  }

  private setControlErrorMessage(formControl: FormControl) {
    console.log('setControlErrorMessage formControl', formControl)
  }
}
