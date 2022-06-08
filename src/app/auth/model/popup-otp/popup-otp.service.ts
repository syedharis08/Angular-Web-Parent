import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import * as auth from '../../state/auth.actions';
import * as app from '../../../state/app.actions';
// import { LoaderService } from '../loader/loader.service';
// import { PopUpGlamService } from '../popup-glam/popup-glam.service';

@Injectable()
export class PopUpOtpService {

    public message;

    constructor(private store: Store<any>,
    // private loader: LoaderService,
    // private popupGlam: PopUpGlamService,
    private router: Router) {
        // this.store
        //     .select('auth')
        //     .subscribe((res: any) => {
        //     });
    }

    showPopup(message) {
        this.message = message;
        let ele = document.getElementById('popup-surcharge-cnt');
        let icon = document.getElementById('pop-icon');
        ele.classList.add('error-custom');
        document.getElementById('popup-surcharge-comp').style.display = 'block';
        document.getElementById('popup-surcharge-message').innerText = message;
        ele.classList.toggle('active');
    }
    hidePopup() {
        let ele = document.getElementById('popup-surcharge-cnt');
        let icon = document.getElementById('pop-icon');
        icon.classList.remove('ion-alert-circled', 'ion-android-done', 'ion-information-circled');
        ele.classList.toggle('active');
        document.getElementById('popup-surcharge-message').innerText = '';
        document.getElementById('popup-surcharge-comp').style.display = 'none';
    }
    // action() {
    //     let redirect = 'pages/checkout1/stepone';
    //     this.router.navigate([redirect]);

    //     // this.popupGlam.hidePopup();
    //     $('body').removeClass('modal-open');
    //     // this.loader.hideLoader();
    //     this.hidePopup();
    // }
}
