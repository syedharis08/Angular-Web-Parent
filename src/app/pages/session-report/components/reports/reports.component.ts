import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { MatDialog } from '@angular/material';
import * as sessionsDetails from '../../../all-sessions/state/all-sessions.actions';
import { ContactTutorDialog } from '../../../all-sessions/components/contact-tutor/contact-tutordialog.component';
import 'style-loader!./reports.component.scss';
import * as moment from 'moment';
import { NoHourAvailable } from '../../../../auth/model/no-hour-available/no-hour-available';

@Component({
    selector: 'reports',
    templateUrl: `./reports.component.html`
})
export class Reports implements OnDestroy {
    comments: any;
    userData: any;
    report_endTime: string;
    report_startTime: string;
    public sessionStore: Subscription;
    public profileStore: Subscription;
    public report;
    public bookingId;
    public showDetailFeedback: boolean = false;

    constructor(private store: Store<any>, private router: Router, private fb: FormBuilder, private dialog: MatDialog) {
        if (localStorage.getItem('report_id') && localStorage.getItem('report_id') != undefined) {
            this.bookingId = localStorage.getItem('report_id');
        }
        if (this.bookingId && this.bookingId != undefined) {
            this.store.dispatch({
                type: sessionsDetails.actionTypes.GET_BOOKING_BY_ID,
                payload: this.bookingId
            });
        }

        this.profileStore = this.store.select('profile').subscribe((res: any) => {
            if (res) {

                if (res.userData && res.userData.data) {
                    this.userData = res.userData.data;
                }

            }
        });

        this.sessionStore = this.store.select('sessionsDetails').subscribe((res: any) => {
            if (res) {
                if (res.bookingById && res.bookingById != undefined) {
                    this.report = res.bookingById;
                    if (this.report != undefined) {
                        // this.report_startTime = moment(this.report.sessionStartTime).format("MMM. D, YYYY | h:mmA");
                        if (moment(this.report.sessionStartTime).month() == 4) {
                            this.report_startTime = moment(this.report.sessionStartTime).format('MMM D, YYYY | h:mmA');
                        } else {
                            this.report_startTime = moment(this.report.sessionStartTime).format('MMM. D, YYYY | h:mmA');
                        }
                        this.report_endTime = moment(this.report.sessionEndTime).format('h:mmA ');

                    }
                    if (res.bookingById && res.bookingById != undefined && res.bookingById.sessionFeedback != undefined) {
                        if (res.bookingById.sessionFeedback.documents && res.bookingById.sessionFeedback.documents.length > 0 || res.bookingById.sessionFeedback.comments != undefined) {
                            this.showDetailFeedback = true;
                        }
                    }
                }
            }
        });

    }

    contact() {
        if (localStorage.getItem('report_id')) {
            let data = localStorage.getItem('report_id');
            let ref = this.dialog.open(ContactTutorDialog, {
                data: data
            });
        }
    }

    ngOnDestroy() {
        if (this.profileStore) {
            this.profileStore.unsubscribe();
        }
        if (this.sessionStore) {
            this.sessionStore.unsubscribe();
        }
    }

    checkSuppressCases() {
        let isRateChargeSuppress = this.userData.partnershipCode && this.userData.partnershipCode.length && this.userData.partnershipCode[0].isRateChargeSuppress;
        if (isRateChargeSuppress && this.userData.parent.numberOfTutoringHours == 0 && !this.userData.parent.isParentOutOfTutoringHours) {
            this.dialog.open(NoHourAvailable, {
                data: {userData: this.userData, bookAgainText: true},
                panelClass: 'contentHieght'
            });
            return true;
        }
    }

    bookSession() {
        if (this.checkSuppressCases()) {
            return;
        }
        this.router.navigate(['/pages/book-session/session']);
    }

    ngOnInit() {
        // window.scroll(0, 0);
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
    }

    openFeedback() {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Session Feedback',
            eventAction: 'Open Session Feedback',
            eventLabel: 'Open Session Feedback'
        });
        this.router.navigate(['/pages/session-reports/full-report']);
    }

    ngAfterViewInit() {

    }

}

