import { Component, Renderer, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as   tutor from '../../../publicPages/tutor/state/tutor.actions';
import { Router } from '@angular/router';

@Component({
    selector: 'common-error-dialog',
    templateUrl: './common-error-dialog.html',
    styleUrls: ['./common-error-dialog.scss']
})

export class CommonErrorDialog {
    public commonData: any;
    public title: string;
    public message: string;
    distanceError: boolean;
    stopScrolling: boolean;
    OnlyClose: boolean;

    constructor(public dialogRef: MatDialogRef<CommonErrorDialog>,
                @Inject(MAT_DIALOG_DATA) public data: any, private renderer: Renderer,
                private dialog: MatDialog, private router: Router, private store: Store<any>) {
        if (localStorage.getItem('promoStopScrolling')) {
            this.stopScrolling = true;
            localStorage.removeItem('promoStopScrolling');
        }
        if (this.data != undefined) {
            this.message = this.data.message;
            if (this.data.data) {
                this.distanceError = true;
            }
            if (this.data.data == 'selectTutor') {
                this.OnlyClose = true;
            }
        }
    }

    closeDialog() {
        this.dialog.closeAll();
        this.dialogRef.afterClosed().subscribe(() => {
            if (this.stopScrolling) {
            } else {
                let el = $('#moveUp');
                $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
                    el.focus();
                });
            }
        });
        this.store.dispatch({
            type: tutor.actionTypes.ADDRESS_LOCATION,
            payload: {closeAddress: true}
        });
    }

    closeDialog1() {
        this.dialog.closeAll();
        this.dialogRef.afterClosed().subscribe(() => {
            if (this.stopScrolling) {
            } else {
                let el = $('#moveUp');
                $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
                    el.focus();
                });
            }
        });
        this.store.dispatch({
            type: tutor.actionTypes.ADDRESS_LOCATION,
            payload: {closeAddress: true}
        });
        if (this.distanceError)
            this.router.navigate(['/home/browse-tutor']);
    }

    continueBooking() {
        this.store.dispatch({
            type: tutor.actionTypes.ADDRESS_LOCATION,
            payload: {continueBooking: true}
        });
    }

    onSubmit(value) {
    }

}
