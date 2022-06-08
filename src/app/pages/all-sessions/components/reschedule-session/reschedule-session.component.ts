import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TutorService } from '../../../../services/tutor-service/tutor.service';
import { BookSessionService } from '../../../../services/session-service/session.service';
import 'style-loader!./reschedule-session.scss';
import moment1 from 'moment-timezone';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { CommonService } from '../../../../services/common.service';
import * as moment from 'moment';

@Component({
    selector: 'reschedule-session',
    templateUrl: './reschedule-session.html'
})

export class RescheduleSession {
    browserTz: any = moment1.tz.guess();
    bookingTz: any;
    showTzMsg: boolean;
    profileStore: Subscription;
    sessionStore: Subscription;
    endDateCode = '';
    userData: any = {};

    constructor(public dialog: MatDialog, public tutorService: TutorService, public sessionService: BookSessionService,
                private store: Store<any>, public commonService: CommonService) {

        this.profileStore = this.store.select('profile').subscribe((res: any) => {
            if (res) {
                if (res.userData && res.userData.data) {
                    if (res.userData.data.metaData) {
                        this.userData = res.userData.data;
                        if (this.commonService.checkIsSuppress(this.userData).isRateChargeSuppressNow) {
                            if (localStorage.getItem('endDateCode')) {
                                if (moment(localStorage.getItem('endDateCode')).diff(moment(), 'days') < 120) {
                                    this.endDateCode = localStorage.getItem('endDateCode');
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    ngOnInit() {
        if (localStorage.getItem('timezoneOffsetZone')) {
            this.checkTimeZone();
        }
    }

    checkTimeZone() {
        this.browserTz = moment1.tz(this.browserTz).format('z');
        if (localStorage.getItem('timezoneOffsetZone')) {
            this.bookingTz = moment1.tz(localStorage.getItem('timezoneOffsetZone')).format('z');
            if (this.bookingTz != this.browserTz) {
                if (this.bookingTz != this.tutorService.checkDayLightTimeZone(this.browserTz)) {
                    this.showTzMsg = true;
                } else {
                    this.showTzMsg = false;
                }
            } else {
                this.showTzMsg = false;
            }
        }
    }

    ngOnDestroy() {
        if (this.sessionStore) {
            this.sessionStore.unsubscribe();
        }
    }

}
