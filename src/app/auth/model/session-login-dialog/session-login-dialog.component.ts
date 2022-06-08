import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import 'style-loader!./session-login-dialog.scss';
import { CONSTANT } from '../../../shared/constant/constant';

@Component({
    selector: 'login-dialog',
    templateUrl: './session-login-dialog.html'

})

export class LoginDialog {

    constructor(public dialogRef: MatDialogRef<LoginDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.login();

    }

    closeDialog() {
        this.dialogRef.close();
    }

    ngOnInit() {
    }

    login() {
        if (process.env.ENV == 'development') {
            if (localStorage.getItem('tutorUId1')) {
                window.location.href = CONSTANT.signInPanelUrlInDev + '?tutorId=' + localStorage.getItem('tutorUId1'); //test
            } else {
                window.location.href = CONSTANT.signInPanelUrlInDev; //test
            }
        }
        if (process.env.ENV == 'test') {
            if (localStorage.getItem('tutorUId1')) {
                window.location.href = CONSTANT.signInPanelUrlInTest + '?tutorId=' + localStorage.getItem('tutorUId1'); //test
            } else {
                window.location.href = CONSTANT.signInPanelUrlInTest; //test
            }
        }
        if (process.env.ENV == 'production') {
            if (localStorage.getItem('tutorUId1')) {
                window.location.href = CONSTANT.signInPanelUrlInQual + '?tutorId=' + localStorage.getItem('tutorUId1'); //test
            } else {
                window.location.href = CONSTANT.signInPanelUrlInQual; //test
            }
        }
        if (process.env.ENV == 'demo') {
            if (localStorage.getItem('tutorUId1')) {
                window.location.href = CONSTANT.signInPanelUrlInDemo + '?tutorId=' + localStorage.getItem('tutorUId1'); //test
            } else {
                window.location.href = CONSTANT.signInPanelUrlInDemo; //test
            }
        }
        if (process.env.ENV == 'live') {
            if (localStorage.getItem('tutorUId1')) {
                window.location.href = CONSTANT.signInPanelUrlInLive + '?tutorId=' + localStorage.getItem('tutorUId1'); //test
            } else {
                window.location.href = CONSTANT.signInPanelUrlInLive; //test
            }
        }
    }

}
