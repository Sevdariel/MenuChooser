import { TestBed } from '@angular/core/testing';

import { ValidationService } from './validation.service';
import { FormControl, Validators } from '@angular/forms';
import { errorMessages } from './error-messages';

describe('ValidationService', () => {
  let validationService: ValidationService;
  let formControl: FormControl;
  let parentName: 'formControlName';

  beforeEach(() => {
    TestBed.configureTestingModule({});
    validationService = TestBed.inject(ValidationService);

    formControl = new FormControl();

    formControl.setValidators(Validators.required);
  });

  it('should be created', () => {
    expect(validationService).toBeTruthy();
  });

  it('showError should return false when control has required validator and set value', () => {
    formControl.setValue('kappa');
    formControl.markAsTouched();

    expect(validationService.showError(formControl)).toEqual(false);
  })

  it('showError should return false when control is invalid and is not touched', () => {
    formControl.setValue('');

    expect(validationService.showError(formControl)).toEqual(false);
  })

  it('showError should return true when control is invalid and touched', () => {
    formControl.setValue('');
    formControl.markAsTouched();

    expect(validationService.showError(formControl)).toEqual(true);
  })

  it('getErrorMessage should return null when control is valid', () => {
    formControl.setValue('kappa');

    expect(validationService.getErrorMessage(formControl)).toBeNull();
  })

  it('getErrorMessage should return required error message when value is required', () => {
    formControl.setValue('');

    expect(validationService.getErrorMessage(formControl)).toEqual(errorMessages['required']);
  })

  it('getErrorMessage should replace placeholder when it exist and parentName is given', () => {
    formControl.setErrors({ sameValues: true });

    expect(validationService.getErrorMessage(formControl, parentName)).toEqual(errorMessages['sameValues']);
  })
});
