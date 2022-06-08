import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
// import * as profile from '../../state/profile.actions';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator, NameValidator } from '../../../../theme/validators';
import { ActivatedRoute } from '@angular/router';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
// import * as auth from '../../../auth/state/auth.actions';
// import 'style-loader!./completed-booking-dialog.scss';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { BookSessionService } from '../../../../services/session-service/session.service';
@Component({
    selector: 'completed-booking-dialog',
    templateUrl: `./completed-booking-dialog.html`,
    styleUrls: ['./completed-booking-dialog.scss']
})


export class CompletedBookingDialog {


    constructor(public dialogRef: MatDialogRef<CompletedBookingDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private router: Router,
        private store: Store<any>,
        private sessionService: BookSessionService,
        private toastrService: ToastrService) {




    }
    closeDialog() {
        localStorage.setItem("goToUpcoming", "true")


        this.dialogRef.close();

        // window.scroll(0, 0)
        let el = $('#moveUp');
        $('html,body').animate({ scrollTop: (el.offset().top - 50) }, 'slow', () => {
            el.focus();
        });

        if (localStorage.getItem('bookingDetails')) {
            localStorage.removeItem('bookingDetails');
        }
        if (localStorage.getItem('defaultCard')) {
            localStorage.removeItem('defaultCard');
        }
        if (localStorage.getItem('step3Data')) {
            localStorage.removeItem('step3Data');
        }
        if (localStorage.getItem('PROMOCODE')) {
            localStorage.removeItem('PROMOCODE');
        }

        if (localStorage.getItem('steponeData')) {
            localStorage.removeItem('steponeData');
        }
        if (localStorage.getItem('refferAmount')) {
            localStorage.removeItem('refferAmount');
        }
        if (localStorage.getItem('tuorId_Reschedule')) {
            localStorage.removeItem('tuorId_Reschedule');
        }
        if (localStorage.getItem('Rescheduled_Data')) {
            localStorage.removeItem('Rescheduled_Data')
        }
        if (localStorage.getItem('promoVal')) {
            localStorage.removeItem('promoVal')
        }
        if (localStorage.getItem('slotSelected')) {
            localStorage.removeItem('slotSelected');
        }
        this.sessionService.userName = undefined;
        this.sessionService.rating = undefined;
        this.sessionService.distanceSelected = 100;
        this.sessionService.setHourlyRate(10, 200);
        this.dialogRef.afterClosed().subscribe(() => {
            this.dialogRef = null;
            this.router.navigate(['/pages/all-sessions/sessions']);
            // window.scrollTo(0, 0);
        });



    }
    goToSessions() {
        localStorage.setItem("goToUpcoming", "true")
        this.sessionService.userName = undefined;
        this.sessionService.rating = undefined;
        this.sessionService.distanceSelected = 100;
        this.sessionService.setHourlyRate(10, 200);
        this.dialogRef.close();

        if (localStorage.getItem('bookingDetails')) {
            localStorage.removeItem('bookingDetails');
        }
        if (localStorage.getItem('PROMOCODE')) {
            localStorage.removeItem('PROMOCODE');
        }
        if (localStorage.getItem('defaultCard')) {
            localStorage.removeItem('defaultCard');
        }
        if (localStorage.getItem('step3Data')) {
            localStorage.removeItem('step3Data');
        }
        if (localStorage.getItem('steponeData')) {
            localStorage.removeItem('steponeData');
        }
        if (localStorage.getItem('slotSelected')) {
            localStorage.removeItem('slotSelected');
        }
        if (localStorage.getItem('refferAmount')) {
            localStorage.removeItem('refferAmount');
        }
        if (localStorage.getItem('tuorId_Reschedule')) {
            localStorage.removeItem('tuorId_Reschedule');
        }
        if (localStorage.getItem('Rescheduled_Data')) {
            localStorage.removeItem('Rescheduled_Data')
        }
        if (localStorage.getItem('promoVal')) {
            localStorage.removeItem('promoVal')
        }
        this.dialogRef.afterClosed().subscribe(() => {
            this.dialogRef = null;
            this.router.navigate(['/pages/all-sessions/sessions']);
            // window.scrollTo(0, 0);

        });
    }
    ngOnInit() {

    }





}