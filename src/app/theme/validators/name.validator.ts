import { FormControl } from '@angular/forms';

export class NameValidator {

    static nameValid(control: FormControl): { [s: string]: boolean } {

        let NAME = /^[a-zA-Z ]*$/;

        if (control.value && control.value !== '' && !NAME.test(control.value)) {
            return { invalidName: true };
        }
    }

    static password(control: FormControl): { [s: string]: boolean } {

        let PASSWORD = /^(?=.*[^a-zA-Z])(?=.*[a-z])(?=.*[A-Z])\S{8,}$/;
        // let PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})$/;
        if (control.value && control.value !== '' && !PASSWORD.test(control.value)) {
            return { invalidPassword: true };
        }
    }
    static phone(control: FormControl): { [s: string]: boolean } {
       
                let PHONE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/;
                // let PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})$/;
                if (control.value && control.value !== '' && !PHONE.test(control.value)) {
                    return { invalidPassword: true };
                }
            }
    static username(control: FormControl): { [s: string]: boolean } {
        
                let USERNAME = /^(?=.*[0-9])(?=.*[a-zA-Z]).{6,20}$/;
                // let PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})$/;
                if (control.value && control.value !== '' && !USERNAME.test(control.value)) {
                    return { invaliduserName: true };
                }
            }
            static seltBox(c: FormControl) {
                return c.value != 'select' ? null :  { 'selInvalid' :true} ;
            }
}
