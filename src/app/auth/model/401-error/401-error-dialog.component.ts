import { Component, Inject } from '@angular/core';
import 'style-loader!./401-error-dialog.scss';
import {  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'error-dialog',
    templateUrl: './401-error-dialog.html',
})

export class ErrorDialog {
    public commonData: any;
    public title: string;

    constructor(public dialogRef: MatDialogRef<ErrorDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    onSubmit(value) {
    }

    reload() {
        let expireToken = localStorage.getItem('token');
        let bookingData = localStorage.getItem('bookingAvailable');
        if (document.cookie) {
            let domainParts = window.location.host.split('.');
            domainParts.shift();
            let domain = '.' + domainParts.join('.');
            let expireDate = new Date();
            let d = expireDate.toUTCString();
            document.cookie = 'tokenSylvanParent=' + expireToken + ';domain=' + domain + ';expires=' + d + '; SameSite=Strict; secure';
            document.cookie = 'bookingData=' + bookingData + ';domain=' + domain + ';expires=' + d + '; SameSite=Strict; secure';
        }
        localStorage.removeItem('token');
        localStorage.clear();
        window.location.reload();
    }

}
