import { Component, ViewChild, ElementRef, Renderer, Inject, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { BaThemeSpinner } from '../../../../theme/services';
import { EmailValidator } from '../../../../theme/validators';
import 'style-loader!./booking-reschedule-popup.scss';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import * as auth from '../../../../auth/state/auth.actions';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as notification from '../../state/notification.actions';
import { ContactTutorDialog } from '../../../../pages/all-sessions/components/contact-tutor/contact-tutordialog.component';
import { Subscription } from 'rxjs';
import { CancelSessionPoliciesDialog } from '../../../all-sessions/components/cancel-session-policies/cancel-session-policies-dialog.component';
import { CancelDialog } from '../../../book-session/components/schedular/components/cancellation/cancel.component';
import { Router } from '@angular/router';
import { AcceptBookingHoursAvailableComponent } from '../../../../shared/components/accept-booking-hours-available/accept-booking-hours-available.component';
import { NoHourAvailable } from '../../../../auth/model/no-hour-available/no-hour-available';
import * as profile from '../../../profile/state/profile.actions';
import * as sessionsDetails from '../../../all-sessions/state/all-sessions.actions';
import { CommonService } from '../../../../services/common.service';
import * as _ from 'lodash';
import { NoReservationHourAvailable } from '../../../../auth/model/no-reservation-hour-available/no-reservation-hour-available';

@Component({
    selector: 'booking-reschedule-popup',
    templateUrl: './booking-reschedule-popup.html'
})

export class BookingReschedule implements OnInit {
    rescheduleEndTime: string;
    rescheduleStartTime: string;
    notificationType: any;
    public startTime: any;
    public endTime: any;
    public notificationStore: Subscription;
    public profileStore: Subscription;
    public notificationData: any;
    timeDifference: number;
    isRateChargeSuppress = false;
    cancelPolicy: any;
    userData: any;
    isRateChargeSuppressNow: any;
    notification_type: any;

    constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, private baThemeSpinner: BaThemeSpinner,
                private toastrService: ToastrService, private renderer: Renderer, private router: Router,
                private dialog: MatDialog, private store: Store<any>, public commonService: CommonService
    ) {
        if (data && data != undefined) {
            this.notificationData = data;
            let notificationId = data._id;
            this.store.dispatch({
                type: notification.actionTypes.GET_NOTIFICATION_BY_ID,
                payload: {notificationId: data._id}
            });

            if (moment(this.notificationData.booking.startTime).month() == 4) {
                this.startTime = moment(this.notificationData.booking.startTime).format('MMM D, YYYY | h:mmA');

            } else {
                this.startTime = moment(this.notificationData.booking.startTime).format('MMM. D, YYYY | h:mmA');

            }
            this.endTime = moment(this.notificationData.booking.endTime).format('h:mmA ');
            if (this.notificationData.booking.rescheduleData && this.notificationData.booking.rescheduleData != undefined) {

                if (moment(this.notificationData.booking.rescheduleData.startTime).month() == 4) {
                    this.rescheduleStartTime = moment(this.notificationData.booking.rescheduleData.startTime).format('MMM D, YYYY | h:mmA');
                } else {
                    this.rescheduleStartTime = moment(this.notificationData.booking.rescheduleData.startTime).format('MMM. D, YYYY | h:mmA');
                }
                this.rescheduleEndTime = moment(this.notificationData.booking.rescheduleData.endTime).format('h:mmA ');
            }

        }
        this.notificationStore = this.store.select('notification').subscribe((res: any) => {
            if (res.notificationByIdSuccess && res.notificationByIdSuccess != undefined && res.notificationByIdSuccess.data && res.notificationByIdSuccess.data != undefined && res.notificationByIdSuccess.data.booking && res.notificationByIdSuccess.data.booking != undefined) {
                this.notificationType = res.notificationByIdSuccess.data.booking.status;
                this.notification_type = res.notificationByIdSuccess.data.type;
                // this.notificationData=res.notificationByIdSuccess.data
            }
        });

        this.profileStore = this.store.select('profile').subscribe((res: any) => {
            if (res) {
                if (res.userData && res.userData.data) {
                    if (res.userData.data.metaData) {
                        this.userData = res.userData.data;
                        this.checkIsSuppress();
                    }
                }

            }
        });

    }

    ngOnInit(): void {
        let fd = new FormData();
        fd.append('deviceType', 'WEB');
        this.store.dispatch({
            type: profile.actionTypes.GET_PARENT_PROFILE,
            payload: fd
        });
    }

    closeDialog() {
        this.dialog.closeAll();
    }

    contact() {
        this.dialog.closeAll();
        if (this.notificationData && this.notificationData.booking != undefined) {
            let data = this.notificationData.booking._id;
            if (data != undefined) {
                let ref = this.dialog.open(ContactTutorDialog, {
                    data: data
                });
            } else {

            }

        }

    }

    declineReschedule(data) {
        this.store.dispatch({
            type: notification.actionTypes.ACCEPT_RESCHEDULE_REQUEST,
            payload: {bookingId: data, action: 'REJECT'}
        });
    }

    acceptReschedule(data) {
        this.store.dispatch({
            type: notification.actionTypes.ACCEPT_RESCHEDULE_REQUEST,
            payload: {bookingId: data, action: 'ACCEPT'}
        });
    }

    givePaymentForTutor(data, type) {
        this.dialog.closeAll();

        if (type == 'reject') {
            this.dialog.open(CancelSessionPoliciesDialog, {
                data: {
                    data: 'declineReason',
                    bookingId: data.booking ? data.booking._id : data._id
                }
            });
        } else {

            if (this.checkSuppressCases(data.booking)) {
                return;
            }

            if (this.isRateChargeSuppress && this.userData.parent.numberOfTutoringHours > 0 &&
                !this.userData.parent.isParentOutOfTutoringHours) {
                let matDialogRef = this.dialog.open(AcceptBookingHoursAvailableComponent, {
                    data: {
                        modalData: this.userData
                    }
                });
                matDialogRef.disableClose = true;//disable default close operation
                matDialogRef.afterClosed().subscribe(result => {
                    if (result === 'no') {
                        this.givePaymentForTutor(this.notificationData.booking, 'reject');
                    } else if (result === 'yes') {
                        this.bookingAcceptApiHit(data);
                    }
                });
            }

            if (this.isRateChargeSuppress && this.userData.parent.isParentOutOfTutoringHours) {
                this.bookingAcceptApiHit(data);
            }
            return;
        }
    }

    checkSuppressCases(data?) {
        if (data) {
            if (this.isRateChargeSuppress && this.userData.parent.numberOfTutoringHours > 0 && !this.userData.parent.isParentOutOfTutoringHours) {
                if (this.userData.parent.sessionCreditsFromExternalApi && this.userData.parent.sessionCreditsFromExternalApi.length) {
                    let sessionCreditsFromExternalApi = JSON.parse(JSON.stringify(this.commonService.sortByEndDate(this.userData.parent.sessionCreditsFromExternalApi)));
                    let filteredReservation = sessionCreditsFromExternalApi.filter(ele =>
                        ele.numberOfTutoringHours > 0
                    );
                    if (filteredReservation && filteredReservation.length) {
                        let lastItem: any = _.last(filteredReservation);
                        if (data.startTimeL > lastItem.endDate) {
                            this.dialog.open(NoReservationHourAvailable, {
                                data: {
                                    userData: this.userData
                                },
                                panelClass: 'contentHieght'
                            });
                            return true;
                        }
                    }
                }
            }
        }
        if (this.isRateChargeSuppress && this.userData.parent.numberOfTutoringHours == 0 && !this.userData.parent.isParentOutOfTutoringHours) {
            this.dialog.open(NoHourAvailable, {
                data: {userData: this.userData},
                panelClass: 'contentHieght'
            });
            return true;
        }
    }

    checkIsSuppress() {
        this.isRateChargeSuppress = this.commonService.checkIsSuppress(this.userData).isRateChargeSuppress;
        this.isRateChargeSuppressNow = this.commonService.checkIsSuppress(this.userData).isRateChargeSuppressNow;
    }

    bookingAcceptApiHit(data) {

        localStorage.setItem('estimatedPrice', data.booking.payments.projectedAmount);
        localStorage.setItem('totalSessions', '1');
        localStorage.setItem('tutor_Id', data.tutor._id);
        // this.startTime = moment(this.bookingDetails.startTime).format("MMM. D, YYYY | h:mmA")
        localStorage.setItem('startTimeBooking', moment(data.booking.startTime).format('MMM. D, YYYY | h:mmA'));
        localStorage.setItem('endTimeBooking', moment(data.booking.endTime).format('h:mmA'));
        localStorage.setItem('bookingId', data.booking._id);

        let finalStartTime = new Date(data.booking.startTime);

        let curTime = new Date();

        let diff = (curTime.getTime() - finalStartTime.getTime()) / 1000;

        diff /= (60 * 60);
        this.timeDifference = Math.abs(Math.round(diff));
        this.cancelPolicy = data.booking.cancellationPolicy.cancelsLessThan;
        if (this.cancelPolicy && this.cancelPolicy != undefined) {
            if ((this.timeDifference < this.cancelPolicy)) {

                let dialogRef = this.dialog.open(CancelDialog, {
                    data: 'backToApiHit'
                });

                // dialogRef.afterClosed().subscribe(result => {
                //     if (result === 'yes') {
                //         // this.bookingAcceptApiHit(data);
                //         this.acceptBookingOfIsSuppress();
                //     }
                // });

                dialogRef.afterClosed().subscribe(result => {
                    if (result === 'yes') {
                        // this.bookingAcceptApiHit(data);
                        if (this.isRateChargeSuppressNow) {
                            this.acceptBookingOfIsSuppress();
                        } else {
                            this.router.navigate(['/pages/all-sessions/Select-payment']);
                        }
                    }
                });

            } else {
                if (this.isRateChargeSuppress && !this.userData.parent.isParentOutOfTutoringHours) {
                    this.acceptBookingOfIsSuppress();
                } else {
                    this.dialog.closeAll();
                    this.router.navigate(['/pages/all-sessions/Select-payment']);
                }

                // this.router.navigate(['/pages/all-sessions/Select-payment']);

            }
        }

    }

    acceptBookingOfIsSuppress() {
        const fd = new FormData();
        fd.append('action', 'ACCEPT');
        let completeBookingData = {
            FormData: fd,
            bookingId: this.notificationData.booking._id
        };
        this.store.dispatch({
            type: sessionsDetails.actionTypes.ACCEPT_TUTOR_BOOKING,
            payload: completeBookingData
        });
    }

    // old flow
    // givePaymentForTutor(data, type) {
    //     if (type == 'reject') {
    //         this.dialog.open(CancelSessionPoliciesDialog, {
    //             data: {
    //                 data: 'declineReason',
    //                 bookingId: data.booking._id
    //             }
    //         });
    //     } else {
    //         // this.bookSessionService.setTrackPageRefresh(true);
    //         localStorage.setItem('estimatedPrice', data.booking.payments.projectedAmount);
    //         localStorage.setItem('totalSessions', '1');
    //         localStorage.setItem('tutor_Id', data.tutor._id);
    //         // this.startTime = moment(this.bookingDetails.startTime).format("MMM. D, YYYY | h:mmA")
    //         localStorage.setItem('startTimeBooking', moment(data.booking.startTime).format('MMM. D, YYYY | h:mmA'));
    //         localStorage.setItem('endTimeBooking', moment(data.booking.endTime).format('h:mmA'));
    //         localStorage.setItem('bookingId', data.booking._id);
    //         let finalStartTime = new Date(data.booking.startTime);
    //
    //         let curTime = new Date();
    //
    //         let diff = (curTime.getTime() - finalStartTime.getTime()) / 1000;
    //
    //         diff /= (60 * 60);
    //         this.timeDifference = Math.abs(Math.round(diff));
    //         this.cancelPolicy = data.booking.cancellationPolicy.cancelsLessThan;
    //         if (this.cancelPolicy && this.cancelPolicy != undefined) {
    //             if ((this.timeDifference < this.cancelPolicy)) {
    //
    //                 let dialogRef = this.dialog.open(CancelDialog, {
    //                     data: 'fromTutor'
    //                 });
    //             } else {
    //                 this.dialog.closeAll();
    //                 this.router.navigate(['/pages/all-sessions/Select-payment']);
    //
    //             }
    //         }
    //
    //     }
    // }
}
