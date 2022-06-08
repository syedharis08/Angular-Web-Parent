import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

@Component({
    selector: 'cancel-dialog',
    template: `
        <div style="float:right;padding:0px" mat-dialog-title>
            <button (click)="closeDialog()" style="border:none" class="close-btn" mat-button mat-dialog-close>
                <img src="assets/img/close.png">
            </button>
        </div>
        <mat-dialog-content>
            <div class="canelPolicyPop">
                <h2 class="headings text-center">Cancelation Policy</h2>
                <div class="col-lg-12 col-sm-12 col-xs-12 col-md-12 text-center">
                <span *ngIf="!showBtns"> <p class="dialogText">
                You are requesting a session within this tutor’s cancelation window. Please note that if you need to cancel your session, you will be charged in accordance with your tutor’s cancelation policy.
                </p> </span>
                    <span *ngIf="showBtns"> <p class="dialogText">
                You are accepting a session request within this tutor’s cancelation window. Please note that if you need to cancel this session, you will be charged in accordance with your tutor’s cancelation policy.    </p></span>
                </div>
                <div class="row justify-content-center ">
                    <div *ngIf="!showBtns" class="mt-4  col-lg-12 col-md-12 col-sm-12 text-center">
                        <button class="pinkButton " (click)="closeDialog()">OK</button>
                    </div>

                    <div *ngIf="showBtns" class="row text-center mt-4 mb-4">
                        <div class="mt-2 col-lg-4 col-md-4 col-sm-12 col-xs-12" style="display:flex">
                            <a class="pink-link" style="text-decoration:none;"
                               style="color:#e1134f;margin:auto; font-family:'ProximaNova-Bold';font-size:18px;"
                               (click)="closeDialog()"> Cancel </a>
                        </div>

                        <div class=" col-lg-4 col-md-4 col-sm-12 col-xs-12 mt-2 ">
                            <button (click)="letsGoForPayment()" class="pinkButton pointer">Accept Request <span
                                style="color:white;margin-right:6px;float:right;"> <i class="fa fa-lg fa-arrow-right"
                                                                                      aria-hidden="true"></i> </span>
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </mat-dialog-content>

    `,
    styleUrls: ['./cancel.scss']
})

export class CancelDialog {
    showBtns: boolean;

    constructor(public dialogRef: MatDialogRef<CancelDialog>,
                public dialogRef1: MatDialog,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private router: Router,
                private store: Store<any>
    ) {
        this.showBtns = false;
        if (data == 'fromTutor') {
            this.showBtns = true;
        }
        if (data == 'backToApiHit') {
            this.showBtns = true;
        }
    }

    closeDialog() {
        this.dialogRef.close();
        // window.scroll(0,0);
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
    }

    letsGoForPayment() {
        if (this.data === 'backToApiHit') {
            this.dialogRef.close('yes');
        } else {
            this.dialogRef1.closeAll();
            this.router.navigate(['/pages/all-sessions/Select-payment']);
        }
    }

    ngOnInit() {
    }

}
