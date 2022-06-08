import { FormControl } from '@angular/forms';
export class EmailValidator {

    static email(control: FormControl): { [s: string]: boolean } {

        let EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (control.value && control.value !== '' && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
            return { invalid: true };
        }
    }
    static cardNumber(control: FormControl): { [s: string]: boolean } {

        let CARD_NUMBER_REGEXP = /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
    
        if (control.value && control.value !== '' && ( !CARD_NUMBER_REGEXP.test(control.value))) {
          return { invalid : true };
        }
      }
}
