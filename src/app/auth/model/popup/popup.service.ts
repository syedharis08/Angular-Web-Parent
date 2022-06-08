import { Injectable } from '@angular/core';

@Injectable()
export class PopUpService {

    constructor() { }

    showPopup(type, timeout, message, bool) {
        let ele = document.getElementById('popup-cnt');
        let icon = document.getElementById('pop-icon');
        switch (type) {
            case 'success':
                ele.classList.add('success');
                icon.classList.add('ion-android-done');
                break;
            case 'info':
                ele.classList.add('info');
                icon.classList.add('ion-information-circled');
                break;
            case 'error-custom':
                ele.classList.add('error-custom');
                icon.classList.add('fa-exclamation-circle');
                break;
            default:
                icon.classList.add('ion-alert-circled');
        }
        document.getElementById('popup-comp').style.display = 'block';
        document.getElementById('popup-message').innerText = message;
        ele.classList.toggle('active');

        if (timeout >= 0) {
            setTimeout(() => {
                //this.hidePopup();
            }, timeout);
        }

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