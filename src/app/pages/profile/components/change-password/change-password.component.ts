import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as auth from '../../../../auth/state/auth.actions';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator, NameValidator } from '../../../../theme/validators';
import { ActivatedRoute } from '@angular/router';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import 'style-loader!./change-password.scss';
import { AbstractClassPart } from '@angular/compiler/src/output/output_ast';
import * as profile from '../../state/profile.actions';

@Component({
    selector: 'change-password',
    templateUrl: './change-password.html',
    styleUrls: ['./change-password.scss']
})
export class ChangePassword {

    public form: FormGroup;
    public passwords: FormGroup;
    public password: AbstractControl;
    public repeatPassword: AbstractControl;
    public oldPassword: AbstractControl;

    constructor(
        private fb: FormBuilder,
        private store: Store<any>,
        private route: ActivatedRoute,
        private toastrService: ToastrService) {
        // window.scroll(0, 0);
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });

        this.form = fb.group({
            'oldPassword': ['', Validators.compose([Validators.required])],
            'passwords': fb.group({
                'password': ['', Validators.compose([Validators.required, Validators.minLength(8), NameValidator.password])],
                'repeatPassword': ['', Validators.compose([Validators.required])]
            }, {validator: EqualPasswordsValidator.validate('password', 'repeatPassword')})

        });
        this.passwords = <FormGroup>this.form.controls['passwords'];
        this.password = this.passwords.controls['password'];
        this.repeatPassword = this.passwords.controls['repeatPassword'];
        this.oldPassword = this.form.controls['oldPassword'];

    }

//Forms Validation
    private fireAllErrors(formGroup: FormGroup) {
        let keys = Object.keys(formGroup.controls);
        keys.forEach((field: any) => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({onlySelf: true});
                control.markAsDirty({onlySelf: true});
            } else if (control instanceof FormGroup) {
                this.fireAllErrors(control);
            } else if (control instanceof FormArray) {
                (<FormArray>control).controls.forEach((element: FormGroup) => {
                    this.fireAllErrors(element);
                });
            }
        });
    }

    submit(value) {

        let fd = new FormData();
        if (this.form.valid) {
            if (value) {
                fd.append('oldPassword', value.oldPassword);
                fd.append('newPassword', value.passwords.password);
            }

            this.store.dispatch({
                type: profile.actionTypes.UPDATE_PASSWORD,
                payload: fd
            });
        } else {

            let control;
            Object.keys(this.form.controls).reverse().forEach((field) => {
                if (this.form.get(field).invalid) {
                    control = this.form.get(field);
                    control.markAsDirty();
                }
            });

            if (control) {
                let el = $('.ng-invalid:not(form):first');
                $('html,body').animate({scrollTop: (el.offset().top - 200)}, 'slow', () => {
                    el.focus();
                });
            }

        }

    }

}



