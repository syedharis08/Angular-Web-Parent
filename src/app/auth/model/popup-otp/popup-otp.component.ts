import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Rx';
import * as profile from './../../../pages/profile/state/profile.actions';
import { PopUpOtpService } from './popup-otp.service';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'pop-up-otp',
    styleUrls: ['popup-otp.scss'],
    templateUrl: './popup-otp.html'
})

export class PopUpOtpComponent {
    public form2: FormGroup;
    public profileStore: Subscription;
    public otp: AbstractControl;

    constructor(private store: Store<any>,
                private fb: FormBuilder,
                private popupOtp: PopUpOtpService) {

        this.profileStore = this.store
            .select('profile')
            .subscribe((res: any) => {
                if (res.clearFields) {
                    this.otp.reset();
                }
            });

        this.form2 = fb.group({
            'otp': ['', Validators.compose([Validators.required, Validators.maxLength(4), Validators.pattern(/^\d{4}$/)])]
        });
        this.otp = this.form2.controls['otp'];
    }

    hidePopup() {
        let ele = document.getElementById('popup-surcharge-cnt');
        let icon = document.getElementById('pop-surcharge-icon');
        ele.classList.toggle('active');
        document.getElementById('popup-surcharge-message').innerText = '';
        document.getElementById('popup-surcharge-comp').style.display = 'none';
    }

    onSubmit(formVal) {
        let formdata = new FormData();
        if (formVal) {
            formdata.append('otp', formVal.otp);
        }
        this.store.dispatch({
            type: profile.actionTypes.AUTH_OTP,
            payload: formdata
        });
    }

    resendOTP() {
        this.otp.reset();
        let data = 'RESEND_OTP';
        this.store.dispatch({
            type: profile.actionTypes.AUTH_RESEND_OTP,
            payload: data
        });
    }

    ngOnInit() {
        this.otp.reset();
    }

    ngOnDestroy() {
        this.otp.reset();
        if (this.profileStore && this.profileStore != undefined) {
            this.profileStore.unsubscribe();
        }
    }
}
