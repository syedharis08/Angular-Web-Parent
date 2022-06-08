import { FormControl } from '@angular/forms';
export class CountryCodeValidator {

    static countryCode(control: FormControl): { [s: string]: boolean } {

        let COUNTRY_CODE_REGEXP = /^(\+?\d{1,3}|\d{1,4})$/;

        if (control.value && control.value !== '' && (!COUNTRY_CODE_REGEXP.test(control.value))) {
            return { invalidCountryCode: true };
        }
    }

    static phoneNumber(control: FormControl): { [s: string]: boolean } {

        let PHONE_NUMBER_REGEXP = /^(0|[1-9][0-9]*)$/;

        if (control.value && control.value !== '' && (!PHONE_NUMBER_REGEXP.test(control.value))) {
            return { invalidPhoneNumber: true };
        }
    }

    static phoneNumberFull(control: FormControl): { [s: string]: boolean } {

        let PHONE_NUMBER_REGEXP = /^(\+?\d{1,3}|\d{1,4})?(0|[1-9][0-9]*)$/;

        if (control.value && control.value !== '' && (!PHONE_NUMBER_REGEXP.test(control.value))) {
            return { invalidPhoneNumber: true };
        }
    }
}