import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Store } from '@ngrx/store';
import * as profile from '../../../pages/profile/state/profile.actions';

@Component({
    selector: 'pop-up',
    styleUrls: ['popup.scss'],
    templateUrl: './popup.component.html'
})

export class PopUpComponent {
    constructor(private router: Router,
                private store: Store<any>
    ) {

    }

    goToHome() {
        this.hidePopup();
        let fd = new FormData();
        fd.append('deviceType', 'WEB');
        this.store.dispatch({
            type: profile.actionTypes.GET_PARENT_PROFILE,
            payload: fd
        });

    }

    hidePopup() {
        let ele = document.getElementById('popup-cnt');
        let icon = document.getElementById('pop-icon');
        icon.classList.remove('ion-alert-circled', 'ion-android-done', 'ion-information-circled');
        ele.classList.toggle('active');
        ele.classList.remove('success');
        document.getElementById('popup-message').innerText = '';
        document.getElementById('popup-comp').style.display = 'none';
    }
}
