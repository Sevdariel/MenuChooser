import { AbstractControl, ValidatorFn } from "@angular/forms";

export function fieldMatchValidator(parentName: string, childName: string): ValidatorFn | null {
    return (group: AbstractControl) => {
        const parentControl = group.get(parentName);
        const childControl = group.get(childName);

        if (!parentControl || !childControl) {
            return null;
        } else if (childControl.errors && !childControl.errors['sameValues']) {
            return null
        }

        if (parentControl.value !== childControl.value)
            childControl.setErrors({ sameValues: true })
        else {
            childControl.setErrors(null);
        }

        return null;
    }
}