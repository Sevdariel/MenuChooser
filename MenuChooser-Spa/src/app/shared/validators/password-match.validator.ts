import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";

// export const fieldMatchValidator(parentName: string, childName: string): ValidatorFn = () {
//     return (control: AbstractControl): ValidationErrors | null => {

//         const parent = control.get(parentName);
//         if (control.get(parent).value === child.value) {
//             return null;
//         } else {
//             return {
//                 sameValues: true
//             }
//         }
//     }
// }

export function fieldMatchValidator(parentName: string, childName: string) {
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

        return null;
    }
}