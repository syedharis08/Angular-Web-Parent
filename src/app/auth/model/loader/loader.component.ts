import { Component } from '@angular/core';
@Component({
    selector: 'loader',
    styleUrls: ['loader.scss'],
    templateUrl: './loader.component.html'
})

export class LoaderComponent {
    hideLoader() {
        // let ele = document.getElementById('popup-cnt');
        // let icon = document.getElementById('pop-icon');
        // icon.classList.remove('ion-alert-circled', 'ion-android-done', 'ion-information-circled');
        // ele.classList.toggle('active');
        // ele.classList.remove('success');
        // document.getElementById('popup-message').innerText = '';
        document.getElementById('loader-comp').style.display = 'none';
    }
}