import { Injectable } from '@angular/core';

@Injectable()
export class LoaderService {

    constructor() { }

    showLoader() {
        document.getElementById('loader-comp').style.display = 'block';
    }
    hideLoader() {
        document.getElementById('loader-comp').style.display = 'none';
    }
}