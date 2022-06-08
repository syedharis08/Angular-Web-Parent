import { Component, ViewChild, ElementRef, Renderer, Inject } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { BaThemeSpinner } from '../../../../theme/services';
import { EmailValidator } from '../../../../theme/validators';
import { Store } from '@ngrx/store';
import * as auth from '../../../../auth/state/auth.actions';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import * as   tutor from '../../../publicPages/tutor/state/tutor.actions';
import { BookSessionService } from '../../../services/session-service/session.service';
import * as _ from 'lodash';

@Component({
    selector: 'check-tutor-dialog',
    templateUrl: './check-tutor-dialog.html',
    styleUrls: ['./../common-error-dialog/common-error-dialog.scss']
})

export class CheckTutorDialog {
    sessionServiceData: any[];
    public commonData: any;
    public title: string;
    public index: any;
    public sessionData: any;
    public message: string;
    distanceError: boolean;
    selectedSessionData: any;

    constructor(private fb: FormBuilder,
                public dialogRef: MatDialogRef<CheckTutorDialog>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private renderer: Renderer,
                private dialog: MatDialog,
                private store: Store<any>,
                private sessionService: BookSessionService
    ) {
        this.sessionServiceData = this.sessionService.getSessionData();
        if (localStorage.getItem('finalSlot')) {
            this.sessionData = JSON.parse(localStorage.getItem('finalSlot'));
        }

        this.selectedSessionData = data.temp;
        this.index = data.index;
        if (this.data != undefined) {
            this.message = this.data.message;
            if (this.data.data) {
                this.distanceError = true;
            }
        }

    }

    closeDialog() {
        this.dialog.closeAll();
        this.dialogRef.afterClosed().subscribe(() => {
            let el = $('#moveUp');
            $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
                el.focus();
            });

        });
    }

    continueBooking() {
        let session;
        let data = this.sessionService.getSessionData();
        for (let i = 0; i < data.length; i++) {
            if (this.index == i) {
                session = data[i];
                data.splice(this.index, 1);
            }
        }

        let tempCount: any = data.length;
        localStorage.setItem('totalSessions', tempCount);

        this.sessionService.setSessionData(data);
        if (localStorage.getItem('finalSlot') && localStorage.getItem('finalSlot').length && this.selectedSessionData.slots[0]) {

            let k = this.search(this.selectedSessionData.slots[0], JSON.parse(localStorage.getItem('finalSlot')));
            if (k != undefined) {
                let newArray = JSON.parse(localStorage.getItem('finalSlot'));
                let spliceData = newArray.splice(k, 1);
                localStorage.setItem('finalSlot', JSON.stringify(newArray));
            }
        }
        this.sessionService.setErrorMessage(false, false);
        let newdata = this.sessionService.getSessionData();
        let length = (newdata.length).toString();
        this.sessionService.setSessionLength(length);
        this.closeDialog();
    }

    search(_id, myArray) {
        for (let i = 0; i < myArray.length; i++) {
            if (myArray[i][0]._id === _id) {
                return i;
            }
        }
    }
}
