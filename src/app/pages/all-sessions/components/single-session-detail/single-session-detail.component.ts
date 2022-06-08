import { RatingDialog } from '../rating/rating.component';
import { RaiseDisputeDialog } from '../raise-dispute/raise-dispute.component';
import {
    Component, AfterContentChecked, OnInit, AfterViewInit,
    Renderer, NgZone
} from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import * as sessionsDetails from './../../state/all-sessions.actions';
import { AllSessionService } from '../../../../services/all-sessions-service/all-sessions.service';
import { CancelSessionDialog } from '../cancel-session/cancel-session-dialog.component';
import { Subscription } from 'rxjs/Rx';
import { MatDialog } from '@angular/material';
import { ContactTutorDialog } from '../contact-tutor/contact-tutordialog.component';
import * as reschedular from './../re-schedular/state/re-schedular.actions';
import * as notification from '../../../../pages/notification/state/notification.actions';
import * as moment from 'moment';
import { BookSessionService } from '../../../../services/session-service/session.service';
import { CancelSessionPoliciesDialog } from '../cancel-session-policies/cancel-session-policies-dialog.component';
import { CancelDialog } from '../../../book-session/components/schedular/components/cancellation/cancel.component';
import { CommonErrorDialog } from '../../../../auth/model/common-error-dialog/common-error-dialog';
import * as profile from '../../../profile/state/profile.actions';
import { AcceptBookingHoursAvailableComponent } from '../../../../shared/components/accept-booking-hours-available/accept-booking-hours-available.component';
import { NoHourAvailable } from '../../../../auth/model/no-hour-available/no-hour-available';
import { CommonService } from '../../../../services/common.service';
import * as _ from 'lodash';
import { NoReservationHourAvailable } from '../../../../auth/model/no-reservation-hour-available/no-reservation-hour-available';
import { NoTodayHourAvailable } from '../../../../auth/model/no-today-hour-available';

@Component({
    selector: 'single-session-detail',
    templateUrl: `./single-session-detail.component.html`,
    styleUrls: ['./single-session-detail.component.scss']
})
export class SingleSessionDetail implements OnInit, AfterViewInit, AfterContentChecked {

    actualStartTime: string;
    actualEndTime: string;
    adjustedAmount: any;
    isRateChargeSuppress = false;
    isRateChargeSuppressNow = false;
    projectedAmount: any;
    public rescheduleTimeDifference: boolean = false;
    public cancelPolicy: any;
    public timeDifference: number;
    public timeDifference1: number;
    public bookingId;
    public feedbackVisible: boolean = false;
    public twentyFourCheck: boolean = false;
    public sessionStore: Subscription;
    public bookingDetails: any = {};
    public reschedule_tutor_id;
    public duration;
    public bookAgainShow: boolean = false;
    public durationToshow;
    public statusMsg: string;
    public ETA_distance;
    public hours = 48;
    public reschedule_heading: boolean = false;
    public startTime;
    public endTime;
    public ETA_duration;
    cancelReason: any;
    public noShowAmount: any;
    public rescheduleVisible: boolean = false;
    public tutorRating;
    public rate;
    public showFullName: boolean = false;
    public holdFail;
    public actualOrignalTime: boolean = false;
    public ParentlocationDetail;
    public canRateTutor: boolean = false;
    public showApproveTutor: boolean = false;
    public canApproveTutor: boolean = false;
    public tutor_locationDetail;
    public acceptDeclineVisible;
    public hold_fail: boolean = false;
    public color: any;
    public showEstimated: boolean = false;
    public showAdjustment: boolean = false;
    public showFinalAmount: boolean = false;
    public showChangePayment: boolean = false;
    public totalAmount;
    userData: any;
    public ouside48hrs: boolean = false;
    public raiseDisputeVisible: boolean = false;
    public distanceMatrixService: google.maps.DistanceMatrixService = new google.maps.DistanceMatrixService();
    public cancelVisible: boolean = false;
    checkPaymentStatus: number = 0;
    paymentBtn: boolean;
    faqStore: Subscription;
    parentContact: any;
    showAmount = true;

    constructor(private store: Store<any>, public zone: NgZone, private bookSessionService: BookSessionService,
                private renderer: Renderer, private router: Router, private fb: FormBuilder,
                private sessionService: AllSessionService, private dialog: MatDialog,
                public commonService: CommonService) {

        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });

        this.twentyFourCheck = false;
        this.hold_fail = false;
        this.showChangePayment = false;
        this.ouside48hrs = false;
        this.raiseDisputeVisible = false;
        this.canRateTutor = false;
        if (this.sessionService.bookingId) {
            this.bookingId = this.sessionService.bookingId;
        } else {
            if (localStorage.getItem('bookingId')) {
                this.bookingId = localStorage.getItem('bookingId');
            } else {
                this.bookingId = '';
            }
        }
        if (this.bookingId) {
            this.store.dispatch({
                type: sessionsDetails.actionTypes.GET_BOOKING_BY_ID,
                payload: this.bookingId
            });
        }
        this.faqStore = this.store.select('profile').subscribe((res: any) => {
            if (res) {
                if (res.faq) {
                    if (res.faq.parentContact) {
                        this.parentContact = res.faq.parentContact.phoneNumber;
                    }
                    if (res.faq.tutorContact) {
                    }
                }

                if (res.userData && res.userData.data) {
                    if (res.userData.data.metaData) {
                        this.userData = res.userData.data;
                        this.checkIsSuppress();
                        this.isRateChargeSuppressNow = this.commonService.checkIsSuppress(this.userData).isRateChargeSuppressNow;
                    }
                }

            }
        });
        this.sessionStore = this.store.select('sessionsDetails').subscribe((res: any) => {
            if (res) {
                if (res.tutorLive) {
                    if (!res.tutorLive.isTutorOfferOnlineClasses) {
                        this.bookSessionService.onlineBooking = false;
                        localStorage.removeItem('isTutorOfferOnlineClasses');
                        if (localStorage.getItem('isSessionOnline') == 'true') {
                            localStorage.removeItem('book_again_address');

                        }
                    } else {
                        localStorage.setItem('isTutorOfferOnlineClasses', 'true');
                    }
                    if (res.tutorLive.tutorIsLive)
                        this.router.navigate(['/pages/book-session/session']);
                    this.store.dispatch({
                        type: sessionsDetails.actionTypes.CHECK_TUTOR_LIVE_SUCCESS,
                        payload: null
                    });

                }
                if (res.bookingById && res.bookingById != undefined) {
                    this.bookingDetails = res.bookingById;
                    this.checkShowAmount();
                    if (this.bookingDetails && this.bookingDetails != undefined) {
                        this.showApproveTutor = this.bookingDetails.isRated;
                    }
                    if (this.bookingDetails.cancellationPolicy != undefined) {
                        this.cancelPolicy = this.bookingDetails.cancellationPolicy.cancelsLessThan;
                    }
                    if (this.bookingDetails.payments && this.bookingDetails.payments != undefined) {
                        this.duration = this.bookingDetails.payments.duration;
                        localStorage.setItem('duration', this.duration);
                        this.totalAmount = this.bookingDetails.payments.actualAmount;
                        this.projectedAmount = this.bookingDetails.payments.projectedAmount;
                        if (this.bookingDetails.payments.amountCharged != undefined) {
                            this.noShowAmount = this.bookingDetails.payments.amountCharged;
                        }
                        if (this.bookingDetails.payments.noShow != undefined) {
                            this.cancelReason = this.bookingDetails.payments.noShow;
                        }
                        this.adjustedAmount = this.totalAmount - this.projectedAmount;
                    }
                    if (this.bookingDetails && this.bookingDetails != undefined && this.bookingDetails.locationDetails != undefined && this.bookingDetails.locationDetails.location != undefined) {
                        this.ParentlocationDetail = this.bookingDetails.locationDetails.location;
                    }
                    if (this.bookingDetails && this.bookingDetails != undefined && this.bookingDetails.tutorLocation != undefined) {
                        this.tutor_locationDetail = this.bookingDetails.tutorLocation;
                    }
                    if (this.bookingDetails.startTime != undefined && this.bookingDetails.endTime != undefined) {
                        let curTime = new Date();
                        let finalStartTime = new Date(this.bookingDetails.startTime);
                        let diff = (curTime.getTime() - finalStartTime.getTime()) / 1000;

                        diff /= (60 * 60);
                        this.timeDifference = Math.abs(diff);
                        if (this.cancelPolicy && this.cancelPolicy != undefined) {
                            if (this.timeDifference >= this.cancelPolicy) {
                                this.rescheduleTimeDifference = true;
                            } else {
                                this.rescheduleTimeDifference = false;
                            }
                        }
                    }

                    if (this.bookingDetails && this.bookingDetails.tutorId && this.bookingDetails.tutorId != undefined && this.bookingDetails.tutorId.tutor && this.bookingDetails.tutorId.tutor != undefined) {
                        this.tutorRating = this.bookingDetails.tutorId.tutor.avgRating;
                        if (this.bookingDetails.partnershipCode) {
                            this.rate = parseInt(this.bookingDetails.partnershipCode.hourlyRate, 10);
                        } else {
                            this.rate = this.bookingDetails.tutorId.tutor.hourlyRate;

                        }

                    }
                    if (this.bookingDetails && this.bookingDetails != undefined && this.bookingDetails.payments && this.bookingDetails.payments != undefined) {
                        this.holdFail = this.bookingDetails.payments.paymentStatus;

                    }
                    if (this.ParentlocationDetail && this.ParentlocationDetail != undefined && this.tutor_locationDetail && this.tutor_locationDetail != undefined) {

                        let distanceMatrixRequest = {
                            origins: [new google.maps.LatLng(this.ParentlocationDetail.coordinates[1], this.ParentlocationDetail.coordinates[0])],
                            // destinations: [new google.maps.LatLng(42.880230, -78.878738)],
                            destinations: [new google.maps.LatLng(this.tutor_locationDetail.coordinates[1], this.tutor_locationDetail.coordinates[0])],
                            travelMode: 'DRIVING'
                        };
                        this.getEta(distanceMatrixRequest);
                    }

                    if (this.bookingDetails && this.bookingDetails != undefined) {
                        let now = moment();
                        let startDate = moment(this.bookingDetails.startTime);
                        // let difference = startDate.diff(now, 'hours');
                        // |(startTime >= moment(new Date()).add(48, 'hours').toDate()))
                        let time = moment(new Date()).add(48, 'hours').toDate();

                        if (this.bookingDetails.startTime >= (moment(new Date()).add(48, 'hours').toDate().toISOString())) {
                            this.ouside48hrs = true;
                        } else {
                            this.ouside48hrs = false;

                        }

                        localStorage.setItem('ouside48hrs', JSON.stringify(this.ouside48hrs));
                        this.checkPaymentstatus();

                        if (this.bookingDetails.payments != undefined && this.bookingDetails.payments.holdFailedAt != undefined) {
                            let holdfail = this.bookingDetails.payments.holdFailedAt;
                            let current = moment();
                            let holdFailDate = moment(holdfail);

                            let twentyFourHourCheck = holdFailDate.diff(current, 'hours');
                            if (twentyFourHourCheck <= 24 && this.bookingDetails.payments.paymentStatus === 'HOLD_FAILED') {
                                this.twentyFourCheck = true;
                            } else {
                                this.twentyFourCheck = false;

                            }

                        }
                        switch (this.bookingDetails.status) {
                            case 'NEW': {
                                this.statusMsg = 'Pending';
                                this.color = '#d9ab28';
                                this.reschedule_heading = false;
                                this.cancelVisible = true;
                                this.rescheduleVisible = false;
                                this.hold_fail = true;
                                this.showFinalAmount = false;
                                this.showAdjustment = false;
                                this.showEstimated = true;
                                this.showChangePayment = true;

                                this.canRateTutor = false;
                                this.feedbackVisible = false;
                                this.canApproveTutor = false;
                                this.actualOrignalTime = false;
                                this.bookAgainShow = false;
                                if (moment(this.bookingDetails.startTime).month() == 4) {
                                    this.startTime = moment(this.bookingDetails.startTime).format('MMM D, YYYY | h:mmA');
                                } else {
                                    this.startTime = moment(this.bookingDetails.startTime).format('MMM. D, YYYY | h:mmA');

                                }
                                // this.startTime = moment(this.bookingDetails.startTime).format("MMM. D, YYYY | h:mmA");
                                this.endTime = moment(this.bookingDetails.endTime).format('h:mmA');
                                this.acceptDeclineVisible = false;
                                this.showFullName = false;
                                this.durationToshow = this.bookingDetails.payments ? this.bookingDetails.payments.duration : '';
                                break;
                            }
                            case 'NEW_TUTOR': {
                                this.statusMsg = 'Pending Request from Tutor';
                                this.color = '#d9ab28';
                                this.reschedule_heading = false;
                                this.cancelVisible = false;
                                this.rescheduleVisible = false;
                                this.hold_fail = true;
                                this.showFinalAmount = false;
                                this.showAdjustment = false;
                                this.showEstimated = true;
                                this.showChangePayment = false;
                                this.paymentBtn = true;
                                this.canRateTutor = false;
                                this.feedbackVisible = false;
                                this.canApproveTutor = false;
                                this.raiseDisputeVisible = false;
                                this.actualOrignalTime = false;
                                this.bookAgainShow = false;
                                if (moment(this.bookingDetails.startTime).month() == 4) {
                                    this.startTime = moment(this.bookingDetails.startTime).format('MMM D, YYYY | h:mmA');
                                } else {
                                    this.startTime = moment(this.bookingDetails.startTime).format('MMM. D, YYYY | h:mmA');

                                }
                                // this.startTime = moment(this.bookingDetails.startTime).format("MMM. D, YYYY | h:mmA");
                                this.endTime = moment(this.bookingDetails.endTime).format('h:mmA');
                                this.acceptDeclineVisible = false;
                                this.showFullName = false;
                                this.durationToshow = this.bookingDetails.payments ? this.bookingDetails.payments.duration : '';
                                break;
                            }
                            case 'ACCEPTED_BY_TUTOR': {
                                this.statusMsg = 'Accepted';
                                this.feedbackVisible = false;
                                this.canRateTutor = false;
                                this.hold_fail = true;
                                this.color = '#227B14';
                                this.showFinalAmount = false;
                                this.showEstimated = true;
                                this.cancelVisible = true;
                                this.reschedule_heading = false;
                                this.rescheduleVisible = true;
                                this.bookAgainShow = false;
                                this.showChangePayment = true;
                                this.actualOrignalTime = false;
                                this.canApproveTutor = false;
                                if (moment(this.bookingDetails.startTime).month() == 4) {
                                    this.startTime = moment(this.bookingDetails.startTime).format('MMM D, YYYY | h:mmA');
                                } else {
                                    this.startTime = moment(this.bookingDetails.startTime).format('MMM. D, YYYY | h:mmA');

                                }
                                // this.startTime = moment(this.bookingDetails.startTime).format("MMM. D, YYYY | h:mmA")
                                this.endTime = moment(this.bookingDetails.endTime).format('h:mmA');
                                this.acceptDeclineVisible = false;
                                this.showFullName = true;
                                if (this.bookingDetails.parentPromoDiscount && this.bookingDetails.parentPromoDiscount != undefined) {
                                    // this.adjustedAmount = this.adjustedAmount - this.bookingDetails.parentPromoDiscount.discount
                                    this.showAdjustment = true;

                                }
                                if (this.bookingDetails.parentReferral && this.bookingDetails.parentReferral != undefined) {
                                    this.showAdjustment = true;

                                    // this.adjustedAmount = this.adjustedAmount - this.bookingDetails.parentReferral.discount
                                }
                                this.durationToshow = this.bookingDetails.payments ? this.bookingDetails.payments.duration : '';
                                break;
                            }
                            case 'ACCEPTED_BY_PARENT': {
                                this.statusMsg = 'Accepted';
                                this.feedbackVisible = false;
                                this.canRateTutor = false;
                                this.hold_fail = true;
                                this.color = '#227B14';
                                this.showFinalAmount = false;
                                this.showEstimated = true;
                                this.cancelVisible = true;
                                this.reschedule_heading = false;
                                this.rescheduleVisible = true;
                                this.bookAgainShow = false;
                                this.showChangePayment = true;
                                this.actualOrignalTime = false;
                                this.canApproveTutor = false;
                                if (moment(this.bookingDetails.startTime).month() == 4) {
                                    this.startTime = moment(this.bookingDetails.startTime).format('MMM D, YYYY | h:mmA');
                                } else {
                                    this.startTime = moment(this.bookingDetails.startTime).format('MMM. D, YYYY | h:mmA');

                                }
                                // this.startTime = moment(this.bookingDetails.startTime).format("MMM. D, YYYY | h:mmA")
                                this.endTime = moment(this.bookingDetails.endTime).format('h:mmA');
                                this.acceptDeclineVisible = false;
                                this.showFullName = true;
                                if (this.bookingDetails.parentPromoDiscount && this.bookingDetails.parentPromoDiscount != undefined) {
                                    // this.adjustedAmount = this.adjustedAmount - this.bookingDetails.parentPromoDiscount.discount
                                    this.showAdjustment = true;

                                }
                                if (this.bookingDetails.parentReferral && this.bookingDetails.parentReferral != undefined) {
                                    this.showAdjustment = true;

                                    // this.adjustedAmount = this.adjustedAmount - this.bookingDetails.parentReferral.discount
                                }
                                this.durationToshow = this.bookingDetails.payments ? this.bookingDetails.payments.duration : '';
                                break;
                            }
                            case 'RESCHEDULE_ACCEPTED': {
                                this.actualOrignalTime = false;
                                this.statusMsg = 'Accepted';
                                this.feedbackVisible = false;
                                this.cancelVisible = true;

                                this.color = '#227B14';
                                this.reschedule_heading = false;
                                this.canRateTutor = false;
                                this.showEstimated = true;
                                this.showFinalAmount = false;
                                this.showChangePayment = true;

                                if (this.bookingDetails.parentPromoDiscount && this.bookingDetails.parentPromoDiscount != undefined) {
                                    // this.adjustedAmount = this.adjustedAmount - this.bookingDetails.parentPromoDiscount.discount
                                    this.showAdjustment = true;

                                } else {
                                    this.showAdjustment = false;

                                }
                                if (this.bookingDetails.parentReferral && this.bookingDetails.parentReferral != undefined) {
                                    this.showAdjustment = true;

                                    // this.adjustedAmount = this.adjustedAmount - this.bookingDetails.parentReferral.discount
                                } else {
                                    this.showAdjustment = false;

                                }
                                this.hold_fail = true;
                                this.cancelVisible = true;
                                this.bookAgainShow = false;
                                this.rescheduleVisible = true;
                                if (moment(this.bookingDetails.startTime).month() == 4) {
                                    this.startTime = moment(this.bookingDetails.startTime).format('MMM D, YYYY | h:mmA');
                                } else {
                                    this.startTime = moment(this.bookingDetails.startTime).format('MMM. D, YYYY | h:mmA');

                                }
                                // this.startTime = moment(this.bookingDetails.startTime).format("MMM. D, YYYY | h:mmA")
                                this.endTime = moment(this.bookingDetails.endTime).format('h:mmA');
                                this.acceptDeclineVisible = false;
                                this.showFullName = true;
                                this.durationToshow = this.bookingDetails.payments ? this.bookingDetails.payments.duration : '';
                                this.canApproveTutor = false;
                                break;
                            }
                            case 'REJECTED_BY_TUTOR': {
                                this.actualOrignalTime = false;
                                this.feedbackVisible = false;
                                this.statusMsg = 'Declined by Tutor';
                                this.color = '#e1134f';
                                this.showFinalAmount = false;
                                this.showChangePayment = false;

                                this.cancelVisible = false;
                                this.reschedule_heading = false;
                                this.rescheduleVisible = false;
                                this.bookAgainShow = true;
                                this.canRateTutor = false;
                                this.canApproveTutor = false;
                                this.showEstimated = true;
                                this.hold_fail = false;
                                if (moment(this.bookingDetails.startTime).month() == 4) {
                                    this.startTime = moment(this.bookingDetails.startTime).format('MMM D, YYYY | h:mmA');
                                } else {
                                    this.startTime = moment(this.bookingDetails.startTime).format('MMM. D, YYYY | h:mmA');

                                }
                                // this.startTime = moment(this.bookingDetails.startTime).format("MMM. D, YYYY | h:mmA")
                                this.endTime = moment(this.bookingDetails.endTime).format('h:mmA');
                                this.showFullName = false;
                                this.acceptDeclineVisible = false;
                                this.durationToshow = this.bookingDetails.payments ? this.bookingDetails.payments.duration : '';
                                break;
                            }
                            case 'REJECTED_BY_PARENT': {
                                this.actualOrignalTime = false;
                                this.feedbackVisible = false;
                                this.statusMsg = 'Declined';
                                this.color = '#e1134f';
                                this.showFinalAmount = false;
                                this.showChangePayment = false;

                                this.cancelVisible = false;
                                this.reschedule_heading = false;
                                this.rescheduleVisible = false;
                                this.bookAgainShow = true;
                                this.canRateTutor = false;
                                this.canApproveTutor = false;
                                this.showEstimated = true;
                                this.hold_fail = false;
                                if (moment(this.bookingDetails.startTime).month() == 4) {
                                    this.startTime = moment(this.bookingDetails.startTime).format('MMM D, YYYY | h:mmA');
                                } else {
                                    this.startTime = moment(this.bookingDetails.startTime).format('MMM. D, YYYY | h:mmA');

                                }
                                // this.startTime = moment(this.bookingDetails.startTime).format("MMM. D, YYYY | h:mmA")
                                this.endTime = moment(this.bookingDetails.endTime).format('h:mmA');
                                this.showFullName = false;
                                this.acceptDeclineVisible = false;
                                this.durationToshow = this.bookingDetails.payments ? this.bookingDetails.payments.duration : '';
                                break;
                            }
                            case 'RESCHEDULE_REJECTED': {
                                this.statusMsg = 'Accepted';
                                // this.color = '#e1134f';
                                this.color = '#227B14';
                                this.cancelVisible = true;
                                this.showEstimated = true;
                                this.showChangePayment = true;

                                this.showFinalAmount = false;
                                if (this.bookingDetails.parentPromoDiscount && this.bookingDetails.parentPromoDiscount != undefined) {
                                    // this.adjustedAmount = this.adjustedAmount - this.bookingDetails.parentPromoDiscount.discount
                                    this.showAdjustment = true;

                                } else {
                                    this.showAdjustment = false;

                                }
                                if (this.bookingDetails.parentReferral && this.bookingDetails.parentReferral != undefined) {
                                    this.showAdjustment = true;

                                    // this.adjustedAmount = this.adjustedAmount - this.bookingDetails.parentReferral.discount
                                } else {
                                    this.showAdjustment = false;

                                }
                                this.canRateTutor = false;
                                this.hold_fail = true;
                                this.reschedule_heading = false;
                                this.bookAgainShow = false;
                                this.feedbackVisible = false;
                                this.showFullName = false;
                                this.rescheduleVisible = true;
                                if (moment(this.bookingDetails.startTime).month() == 4) {
                                    this.startTime = moment(this.bookingDetails.startTime).format('MMM D, YYYY | h:mmA');
                                } else {
                                    this.startTime = moment(this.bookingDetails.startTime).format('MMM. D, YYYY | h:mmA');

                                }
                                // this.startTime = moment(this.bookingDetails.startTime).format("MMM. D, YYYY | h:mmA")
                                this.endTime = moment(this.bookingDetails.endTime).format('h:mmA');
                                this.acceptDeclineVisible = false;
                                this.canApproveTutor = false;
                                this.acceptDeclineVisible = false;
                                this.durationToshow = this.bookingDetails.payments ? this.bookingDetails.payments.duration : '';
                                this.actualOrignalTime = false;
                                break;
                            }

                            case 'CANCELLED_BY_PARENT': {
                                this.statusMsg = 'Canceled ';
                                this.color = '#e1134f';
                                this.canRateTutor = false;
                                this.showFullName = false;
                                this.showEstimated = true;
                                this.showFinalAmount = true;
                                this.showAdjustment = true;
                                this.showChangePayment = false;

                                // this.adjustedAmount = '-' + this.totalAmount;
                                if (this.bookingDetails.startTime != undefined && this.bookingDetails.cancelledAt != undefined) {
                                    let cancelTime = new Date(this.bookingDetails.cancelledAt);

                                    let finalStartTime = new Date(this.bookingDetails.startTime);
                                    let diff = (finalStartTime.getTime() - cancelTime.getTime()) / 1000;

                                    diff /= (60 * 60);
                                    this.timeDifference = Math.abs(Math.round(diff));
                                    if (this.bookingDetails.rescheduleRejectedAt) {
                                        let rescheduleRejectedAt = new Date(this.bookingDetails.rescheduleRejectedAt);
                                        let differ = (rescheduleRejectedAt.getTime() - cancelTime.getTime()) / 1000;

                                        diff /= (60 * 60);
                                        this.timeDifference1 = Math.abs(Math.round(diff));
                                    }
                                    if (this.cancelPolicy && this.cancelPolicy != undefined) {
                                        if (this.timeDifference > this.cancelPolicy) {
                                            this.adjustedAmount = ('-' + this.totalAmount);
                                            this.totalAmount = 0;
                                            // this.rescheduleTimeDifference = true;
                                        }

                                    }
                                    if (this.cancelReason === 'TUTOR_NO_SHOW' && this.noShowAmount != undefined && this.projectedAmount != undefined) {

                                        this.totalAmount = this.noShowAmount;
                                        this.adjustedAmount = this.totalAmount - this.projectedAmount;
                                    } else if ((this.cancelReason != 'TUTOR_NO_SHOW') && (this.bookingDetails.rescheduleRejectedBy == 'BY_PARENT') && (this.timeDifference <= this.cancelPolicy) && (this.timeDifference1 <= this.cancelPolicy)) {
                                        this.totalAmount = this.noShowAmount;

                                        this.adjustedAmount = this.totalAmount - this.projectedAmount;
                                    }

                                }

                                this.cancelVisible = false;
                                this.reschedule_heading = false;
                                this.rescheduleVisible = false;
                                this.feedbackVisible = false;
                                this.bookAgainShow = true;
                                this.hold_fail = false;
                                if (moment(this.bookingDetails.startTime).month() == 4) {
                                    this.startTime = moment(this.bookingDetails.startTime).format('MMM D, YYYY | h:mmA');
                                } else {
                                    this.startTime = moment(this.bookingDetails.startTime).format('MMM. D, YYYY | h:mmA');

                                }
                                // this.startTime = moment(this.bookingDetails.startTime).format("MMM. D, YYYY | h:mmA")
                                this.endTime = moment(this.bookingDetails.endTime).format('h:mmA');
                                this.canApproveTutor = false;

                                this.durationToshow = this.bookingDetails.payments ? this.bookingDetails.payments.duration : '';
                                this.acceptDeclineVisible = false;
                                this.actualOrignalTime = false;
                                break;
                            }

                            case 'CANCELLED_BY_TUTOR': {
                                this.statusMsg = 'Canceled by Tutor';
                                this.color = '#e1134f';
                                this.cancelVisible = false;
                                this.showAdjustment = true;
                                this.showEstimated = true;
                                this.showFinalAmount = true;
                                this.showChangePayment = false;

                                this.showAdjustment = true;
                                if (this.bookingDetails.payments.noShow === undefined && this.bookingDetails.payments.noShow != 'PARENT_NO_SHOW') {
                                    this.adjustedAmount = ('-' + this.totalAmount);
                                    this.totalAmount = 0;

                                }
                                this.feedbackVisible = false;
                                this.reschedule_heading = false;
                                this.bookAgainShow = true;
                                this.canApproveTutor = false;
                                this.canRateTutor = false;
                                this.showFullName = false;
                                this.hold_fail = false;
                                this.rescheduleVisible = false;
                                if (moment(this.bookingDetails.startTime).month() == 4) {
                                    this.startTime = moment(this.bookingDetails.startTime).format('MMM D, YYYY | h:mmA');
                                } else {
                                    this.startTime = moment(this.bookingDetails.startTime).format('MMM. D, YYYY | h:mmA');

                                }
                                // this.startTime = moment(this.bookingDetails.startTime).format("MMM. D, YYYY | h:mmA")
                                this.endTime = moment(this.bookingDetails.endTime).format('h:mmA');
                                this.acceptDeclineVisible = false;
                                this.durationToshow = this.bookingDetails.payments ? this.bookingDetails.payments.duration : '';
                                this.actualOrignalTime = false;
                                break;
                            }
                            case 'DISPUTE_RAISED': {
                                this.statusMsg = 'Dispute Raised';
                                this.color = '#f15d25';
                                this.cancelVisible = false;
                                this.showFullName = false;
                                this.canRateTutor = false;
                                this.hold_fail = false;
                                this.bookAgainShow = false;
                                this.actualOrignalTime = true;
                                this.reschedule_heading = false;
                                this.feedbackVisible = true;
                                this.showEstimated = false;
                                this.showAdjustment = true;
                                this.totalAmount = 'Pending Dispute Resolution';
                                this.adjustedAmount = 'Pending Dispute Resolution';
                                this.rescheduleVisible = false;
                                this.showChangePayment = false;

                                this.canApproveTutor = false;
                                if (moment(this.bookingDetails.startTime).month() == 4) {
                                    this.actualStartTime = moment(this.bookingDetails.startTime).format('MMM D, YYYY | h:mmA');
                                } else {
                                    this.actualStartTime = moment(this.bookingDetails.startTime).format('MMM. D, YYYY | h:mmA');

                                }
                                // this.actualStartTime = moment(this.bookingDetails.startTime).format("MMM. D, YYYY | h:mmA")
                                this.actualEndTime = moment(this.bookingDetails.endTime).format('h:mmA');
                                if (moment(this.bookingDetails.sessionStartTime).month() == 4) {
                                    this.startTime = moment(this.bookingDetails.sessionStartTime).format('MMM D, YYYY | h:mmA');
                                } else {
                                    this.startTime = moment(this.bookingDetails.sessionStartTime).format('MMM. D, YYYY | h:mmA');

                                }
                                // this.startTime = moment(this.bookingDetails.sessionStartTime).format("MMM. D, YYYY | h:mmA")
                                this.endTime = moment(this.bookingDetails.sessionEndTime).format('h:mmA');

                                // this.actualStartTime = moment(this.bookingDetails.startTime).format("MMM. D, YYYY | h:mmA");
                                // this.actualEndTime = moment(this.bookingDetails.endTime).format("h:mmA");
                                // this.startTime = moment(this.bookingDetails.startTime).format("MMM. D, YYYY | h:mmA")
                                // this.endTime = moment(this.bookingDetails.endTime).format("h:mmA")
                                // this.startTime = this.bookingDetails.startTime
                                // this.endTime = this.bookingDetails.endTime;
                                this.acceptDeclineVisible = false;
                                this.durationToshow = this.bookingDetails.payments ? this.bookingDetails.payments.duration : '';
                                break;
                            }
                            case 'CANCELLED_BY_ADMIN': {
                                this.statusMsg = 'Canceled';
                                this.color = '#e1134f';
                                this.canRateTutor = false;
                                this.cancelVisible = false;
                                this.hold_fail = false;
                                this.canApproveTutor = false;
                                this.showEstimated = true;
                                this.showAdjustment = false;
                                this.showChangePayment = false;
                                this.bookAgainShow = false;
                                this.rescheduleVisible = false;
                                this.reschedule_heading = false;
                                this.feedbackVisible = false;
                                this.showFullName = false;
                                if (moment(this.bookingDetails.startTime).month() == 4) {
                                    this.startTime = moment(this.bookingDetails.startTime).format('MMM D, YYYY | h:mmA');
                                } else {
                                    this.startTime = moment(this.bookingDetails.startTime).format('MMM. D, YYYY | h:mmA');

                                }
                                // this.startTime = moment(this.bookingDetails.startTime).format("MMM. D, YYYY | h:mmA")
                                this.endTime = moment(this.bookingDetails.endTime).format('h:mmA');
                                // this.startTime = this.bookingDetails.startTime;
                                // this.endTime = this.bookingDetails.endTime;
                                this.acceptDeclineVisible = false;
                                this.actualOrignalTime = false;
                                this.durationToshow = this.bookingDetails.payments ? this.bookingDetails.payments.duration : '';
                                break;
                            }
                            case 'SESSION_STARTED': {
                                this.statusMsg = 'Session Started';
                                this.color = '#227B14';
                                this.showFinalAmount = false;
                                this.showAdjustment = false;
                                this.showChangePayment = false;

                                this.canApproveTutor = false;
                                this.cancelVisible = false;
                                this.feedbackVisible = false;
                                this.canRateTutor = false;
                                this.rescheduleVisible = false;
                                this.bookAgainShow = false;
                                this.reschedule_heading = false;
                                this.showFullName = true;
                                this.hold_fail = false;
                                this.showEstimated = true;
                                // this.startTime = this.bookingDetails.sessionStartTime;
                                if (moment(this.bookingDetails.startTime).month() == 4) {
                                    this.startTime = moment(this.bookingDetails.startTime).format('MMM D, YYYY | h:mmA');
                                } else {
                                    this.startTime = moment(this.bookingDetails.startTime).format('MMM. D, YYYY | h:mmA');

                                }
                                // this.startTime = moment(this.bookingDetails.sessionStartTime).format("MMM. D, YYYY | h:mmA")
                                this.endTime = '';
                                this.acceptDeclineVisible = false;
                                this.actualOrignalTime = false;
                                this.durationToshow = this.bookingDetails.payments ? this.bookingDetails.payments.duration : '';
                                break;
                            }
                            case 'HOLD_FAIL': {
                                this.statusMsg = 'Hold Failed';
                                this.color = '#227B14';
                                this.cancelVisible = false;
                                this.canApproveTutor = false;
                                this.canRateTutor = false;
                                this.hold_fail = true;
                                this.feedbackVisible = false;
                                this.rescheduleVisible = false;
                                this.actualOrignalTime = false;
                                this.showFullName = false;
                                this.reschedule_heading = false;
                                this.bookAgainShow = false;
                                if (moment(this.bookingDetails.startTime).month() == 4) {
                                    this.startTime = moment(this.bookingDetails.startTime).format('MMM D, YYYY | h:mmA');
                                } else {
                                    this.startTime = moment(this.bookingDetails.startTime).format('MMM. D, YYYY | h:mmA');
                                }
                                this.endTime = moment(this.bookingDetails.endTime).format('h:mmA');
                                this.acceptDeclineVisible = false;
                                this.durationToshow = this.bookingDetails.payments ? this.bookingDetails.payments.duration : '';
                                break;
                            }
                            case 'RESCHEDULE_REQUEST_BY_PARENT': {
                                this.statusMsg = 'Reschedule Request';
                                this.color = '#5a5a5a';
                                this.cancelVisible = true;
                                this.actualOrignalTime = true;
                                this.feedbackVisible = false;
                                this.canApproveTutor = false;
                                this.bookAgainShow = false;
                                this.reschedule_heading = true;
                                this.canRateTutor = false;
                                this.showEstimated = true;
                                this.showFinalAmount = false;
                                this.showAdjustment = false;
                                this.showChangePayment = true;

                                this.showFullName = true;
                                this.hold_fail = true;
                                this.rescheduleVisible = true;

                                this.actualStartTime = moment(this.bookingDetails.startTime).format('MMM. D, YYYY | h:mmA');
                                if (moment(this.bookingDetails.startTime).month() == 4) {
                                    this.actualStartTime = moment(this.bookingDetails.startTime).format('MMM D, YYYY | h:mmA');
                                } else {
                                    this.actualStartTime = moment(this.bookingDetails.startTime).format('MMM. D, YYYY | h:mmA');

                                }
                                // this.actualStartTime = moment(this.bookingDetails.startTime).format("MMM. D, YYYY | h:mmA")
                                this.actualEndTime = moment(this.bookingDetails.endTime).format('h:mmA');
                                this.startTime = moment(this.bookingDetails.rescheduleData ? this.bookingDetails.rescheduleData.startTime : this.bookingDetails.startTime).format('MMM. D, YYYY | h:mmA');
                                if (moment(this.bookingDetails.rescheduleData ? this.bookingDetails.rescheduleData.startTime : this.bookingDetails.startTime).month() == 4) {
                                    this.startTime = moment(this.bookingDetails.rescheduleData ? this.bookingDetails.rescheduleData.startTime : this.bookingDetails.startTime).format('MMM D, YYYY | h:mmA');
                                } else {
                                    this.startTime = moment(this.bookingDetails.rescheduleData ? this.bookingDetails.rescheduleData.startTime : this.bookingDetails.startTime).format('MMM. D, YYYY | h:mmA');

                                }

                                this.actualEndTime = moment(this.bookingDetails.endTime).format('h:mmA');
                                this.durationToshow = this.bookingDetails.payments ? this.bookingDetails.payments.duration : '';
                                // this.startTime = moment(this.bookingDetails.rescheduleData ? this.bookingDetails.rescheduleData.startTime : this.bookingDetails.startTime).format("MMM. D, YYYY | h:mmA")
                                this.endTime = moment(this.bookingDetails.rescheduleData ? this.bookingDetails.rescheduleData.endTime : this.bookingDetails.endTime).format('h:mmA');
                                this.acceptDeclineVisible = false;

                                break;
                            }
                            case 'RESCHEDULE_REQUEST_BY_TUTOR': {
                                this.statusMsg = 'Reschedule Request By Tutor';
                                this.color = '#5a5a5a';
                                this.showFullName = true;
                                this.cancelVisible = false;
                                this.showEstimated = true;
                                this.showFinalAmount = false;
                                this.showAdjustment = false;
                                this.showChangePayment = true;

                                this.canRateTutor = false;
                                this.actualOrignalTime = true;
                                this.hold_fail = true;
                                this.feedbackVisible = false;
                                this.reschedule_heading = true;
                                this.canApproveTutor = false;
                                this.bookAgainShow = false;
                                this.durationToshow = this.bookingDetails.payments ? this.bookingDetails.payments.duration : '';
                                this.rescheduleVisible = false;
                                if (moment(this.bookingDetails.startTime).month() == 4) {
                                    this.actualStartTime = moment(this.bookingDetails.startTime).format('MMM D, YYYY | h:mmA');
                                } else {
                                    this.actualStartTime = moment(this.bookingDetails.startTime).format('MMM. D, YYYY | h:mmA');

                                }
                                // this.actualStartTime = moment(this.bookingDetails.startTime).format("MMM. D, YYYY | h:mmA")
                                this.actualEndTime = moment(this.bookingDetails.endTime).format('h:mmA');
                                // this.startTime = moment(this.bookingDetails.rescheduleData ? this.bookingDetails.rescheduleData.startTime : this.bookingDetails.startTime).format("MMM. D, YYYY | h:mmA")
                                if (moment(this.bookingDetails.rescheduleData ? this.bookingDetails.rescheduleData.startTime : this.bookingDetails.startTime).month() == 4) {
                                    this.startTime = moment(this.bookingDetails.rescheduleData ? this.bookingDetails.rescheduleData.startTime : this.bookingDetails.startTime).format('MMM D, YYYY | h:mmA');
                                } else {
                                    this.startTime = moment(this.bookingDetails.rescheduleData ? this.bookingDetails.rescheduleData.startTime : this.bookingDetails.startTime).format('MMM. D, YYYY | h:mmA');

                                }
                                this.actualEndTime = moment(this.bookingDetails.endTime).format('h:mmA');
                                this.acceptDeclineVisible = true;
                                this.endTime = moment(this.bookingDetails.rescheduleData ? this.bookingDetails.rescheduleData.endTime : this.bookingDetails.endTime).format('h:mmA');
                                // this.startTime = this.bookingDetails.rescheduleData ? this.bookingDetails.rescheduleData.startTime : this.bookingDetails.startTime
                                // this.endTime = this.bookingDetails.rescheduleData ? this.bookingDetails.rescheduleData.endTime : this.bookingDetails.endTime
                                break;
                            }

                            case 'ON_THE_WAY': {
                                this.statusMsg = 'On The Way';
                                this.color = '#e88420';
                                this.bookAgainShow = false;
                                this.canRateTutor = false;
                                this.durationToshow = this.bookingDetails.payments ? this.bookingDetails.payments.duration : '';
                                this.cancelVisible = true;
                                this.feedbackVisible = false;
                                this.hold_fail = false;
                                this.reschedule_heading = false;
                                this.showEstimated = true;
                                this.showFinalAmount = false;
                                this.showAdjustment = false;
                                this.showChangePayment = true;

                                this.actualOrignalTime = false;
                                this.rescheduleVisible = false;
                                this.showFullName = true;
                                this.startTime = moment(this.bookingDetails.startTime).format('MMM. D, YYYY | h:mmA');
                                this.endTime = moment(this.bookingDetails.endTime).format('h:mmA');
                                this.acceptDeclineVisible = false;
                                this.canApproveTutor = false;
                                break;
                            }
                            case 'FINISHED': {
                                this.statusMsg = 'Finished';
                                this.color = '#227B14';
                                this.bookAgainShow = true;
                                this.canRateTutor = false;
                                this.cancelVisible = false;
                                this.actualOrignalTime = true;
                                this.showEstimated = true;
                                this.showAdjustment = true;
                                this.showFinalAmount = true;
                                this.hold_fail = false;
                                this.feedbackVisible = true;
                                this.durationToshow = this.bookingDetails.payments ? this.bookingDetails.payments.actualSessionTime : '';
                                this.rescheduleVisible = false;
                                this.showFullName = true;
                                this.showChangePayment = false;

                                this.canApproveTutor = true;
                                this.reschedule_heading = false;
                                // this.actualStartTime = moment(this.bookingDetails.startTime).format("MMM. D, YYYY | h:mmA")
                                if (moment(this.bookingDetails.startTime).month() == 4) {
                                    this.actualStartTime = moment(this.bookingDetails.startTime).format('MMM D, YYYY | h:mmA');
                                } else {
                                    this.actualStartTime = moment(this.bookingDetails.startTime).format('MMM. D, YYYY | h:mmA');

                                }
                                // this.actualStartTime = moment(this.bookingDetails.startTime).format("MMM. D, YYYY | h:mmA")
                                this.actualEndTime = moment(this.bookingDetails.endTime).format('h:mmA');
                                if (moment(this.bookingDetails.sessionStartTime).month() == 4) {
                                    this.startTime = moment(this.bookingDetails.sessionStartTime).format('MMM D, YYYY | h:mmA');
                                } else {
                                    this.startTime = moment(this.bookingDetails.sessionStartTime).format('MMM. D, YYYY | h:mmA');

                                }
                                this.actualEndTime = moment(this.bookingDetails.endTime).format('h:mmA');
                                // this.startTime = moment(this.bookingDetails.sessionStartTime).format("MMM. D, YYYY | h:mmA")
                                this.endTime = moment(this.bookingDetails.sessionEndTime).format('h:mmA');
                                this.acceptDeclineVisible = false;
                                this.raiseDisputeVisible = true;
                                // this.totalAmount = this.bookingDetails.payments ? this.bookingDetails.payments.actualAmount : 0;
                                break;
                            }
                            case 'COMPLETED': {
                                this.statusMsg = 'Completed';
                                this.color = '#227B14';
                                this.cancelVisible = false;
                                this.feedbackVisible = true;
                                this.showEstimated = true;
                                this.showFinalAmount = true;
                                this.showAdjustment = true;
                                this.showFullName = true;
                                this.bookAgainShow = true;
                                this.canRateTutor = true;
                                this.actualOrignalTime = true;
                                this.reschedule_heading = false;
                                this.showChangePayment = false;
                                this.hold_fail = false;
                                this.canApproveTutor = false;
                                this.rescheduleVisible = false;
                                // this.actualStartTime = moment(this.bookingDetails.startTime).format("MMM. D, YYYY | h:mmA")
                                if (moment(this.bookingDetails.startTime).month() == 4) {
                                    this.actualStartTime = moment(this.bookingDetails.startTime).format('MMM D, YYYY | h:mmA');
                                } else {
                                    this.actualStartTime = moment(this.bookingDetails.startTime).format('MMM. D, YYYY | h:mmA');
                                }
                                // this.actualStartTime = moment(this.bookingDetails.startTime).format("MMM. D, YYYY | h:mmA")
                                this.actualEndTime = moment(this.bookingDetails.endTime).format('h:mmA');
                                if (moment(this.bookingDetails.sessionStartTime).month() == 4) {
                                    this.startTime = moment(this.bookingDetails.sessionStartTime).format('MMM D, YYYY | h:mmA');
                                } else {
                                    this.startTime = moment(this.bookingDetails.sessionStartTime).format('MMM. D, YYYY | h:mmA');

                                }
                                this.actualEndTime = moment(this.bookingDetails.endTime).format('h:mmA');
                                this.durationToshow = this.bookingDetails.payments ? this.bookingDetails.payments.actualSessionTime : '';
                                // this.startTime = moment(this.bookingDetails.sessionStartTime).format("MMM. D, YYYY | h:mmA")
                                this.endTime = moment(this.bookingDetails.sessionEndTime).format('h:mmA');
                                this.acceptDeclineVisible = false;
                                this.raiseDisputeVisible = false;
                                this.totalAmount = this.bookingDetails.payments ? (this.bookingDetails.payments.actualAmount + (this.bookingDetails.payments.partialAmountCharged || 0)) : 0;

                                break;
                            }
                            default: {
                                this.statusMsg = 'Pending';
                                this.canRateTutor = false;
                                this.color = '#d9ab28';
                                this.cancelVisible = false;
                                this.showFullName = false;
                                this.showEstimated = false;
                                this.showFinalAmount = false;
                                this.showAdjustment = false;
                                this.showChangePayment = false;

                                this.actualOrignalTime = false;
                                this.reschedule_heading = false;
                                this.canApproveTutor = false;
                                this.bookAgainShow = false;
                                this.hold_fail = false;
                                this.rescheduleVisible = false;
                                this.feedbackVisible = false;
                                this.startTime = moment(this.bookingDetails.startTime).format('MMM. D, YYYY | h:mmA');
                                this.endTime = moment(this.bookingDetails.endTime).format('h:mmA');
                                this.acceptDeclineVisible = false;
                                this.raiseDisputeVisible = false;
                                this.durationToshow = this.bookingDetails.payments ? this.bookingDetails.payments.duration : '';
                            }
                                break;

                        }

                    }
                    if (this.bookingDetails && this.bookingDetails != undefined) {
                        this.reschedule_tutor_id = this.bookingDetails.tutorId ? this.bookingDetails.tutorId._id : '';
                    }

                }

            }

        });

    }

    getDistanceMatrix(distanceMatrixService, request): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            try {
                distanceMatrixService.getDistanceMatrix(request, (response, status) => {
                    if (!response) {
                        reject();
                    } else if (response.error) {
                        reject(response.error);
                    } else {
                        resolve(response);
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    getEta(request) {
        this.getDistanceMatrix(this.distanceMatrixService, request).then((response) => {
            this.zone.run(() => {
                if (response && response.rows) {
                    if (response.rows[0] && response.rows[0].elements && response.rows[0].elements[0] && response.rows[0].elements[0].duration) {
                        this.ETA_distance = response.rows[0].elements[0].distance.text;
                        this.ETA_duration = response.rows[0].elements[0].duration.text;
                    } else {

                    }
                }
            });
        }).catch(() => {

        });
    }

    ngOnInit() {
        this.store.dispatch({
            type: profile.actionTypes.FAQ
        });
        let fd = new FormData();
        fd.append('deviceType', 'WEB');
        this.store.dispatch({
            type: profile.actionTypes.GET_PARENT_PROFILE,
            payload: fd
        });
    }

    checkBookingStatus(status) {

        console.log(status, 'statusstatus');

        let urlArr: any = ['ACCEPTED_BY_TUTOR', 'ACCEPTED_BY_PARENT', 'RESCHEDULE_ACCEPTED', 'RESCHEDULE_REQUEST_BY_PARENT',
            'RESCHEDULE_REJECTED', 'SESSION_STARTED', 'RESCHEDULE_REQUEST_BY_TUTOR'];
        if (urlArr.includes(status)) {
            return true;
        }
    }

    checkPaymentstatus() {
        if (this.bookingDetails && this.bookingDetails != undefined && this.bookingDetails.payments && this.bookingDetails.payments.paymentStatus == 'HOLD_SUCCESS') {
            this.checkPaymentStatus = 1;
        } else if (this.bookingDetails && this.bookingDetails != undefined && this.bookingDetails.payments && this.bookingDetails.payments.paymentStatus == 'HOLD_FAILED') {
            this.checkPaymentStatus = 2;
        } else {
            this.checkPaymentStatus = 0;
        }
    }

    roundOff(rating) {
        let rate = Math.round(rating);
        let multiplier = Math.pow(10, 1 || 0);
        return Math.round(rating * multiplier) / multiplier;
    }

    assesment(id) {
        localStorage.setItem('report_id', id);
        this.router.navigate(['pages/session-reports/single-report']);
    }

    cancelSession() {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Upcoming Session',
            eventAction: 'Cancel Session',
            eventLabel: 'Cancel Session'
        });
        let ref = this.dialog.open(CancelSessionDialog);
    }

    contactTutor(data) {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Session Summary',
            eventAction: 'Contact Tutor',
            eventLabel: 'Contact Tutor'
        });
        let ref = this.dialog.open(ContactTutorDialog, {
            data: data
        });
    }

    viewDispute(data) {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Session Summary',
            eventAction: 'View Dispute',
            eventLabel: 'View Dispute'
        });
        this.router.navigate(['pages/all-sessions/dispute-detail']);

    }

    givePaymentForTutor(data, type) {

        if (type == 'reject') {
            this.dialog.open(CancelSessionPoliciesDialog, {
                data: {
                    data: 'declineReason',
                    bookingId: data._id
                }
            });
        } else {
            if (this.checkSuppressCases(false, data)) {
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
                        this.givePaymentForTutor(this.bookingDetails, 'reject');
                    } else if (result === 'yes') {
                        this.bookingAcceptApiHit(data);
                    }
                });
            }
            if ((this.isRateChargeSuppress && this.userData.parent.isParentOutOfTutoringHours) || !this.isRateChargeSuppress) {
                this.bookingAcceptApiHit(data);
            }
            return;

        }
    }

    bookingAcceptApiHit(data) {

        this.bookSessionService.setTrackPageRefresh(true);
        localStorage.setItem('estimatedPrice', data.payments.projectedAmount);
        localStorage.setItem('totalSessions', '1');
        localStorage.setItem('tutor_Id', data.tutorId._id);
        localStorage.setItem('startTimeBooking', this.startTime);
        localStorage.setItem('endTimeBooking', this.endTime);
        localStorage.setItem('bookingId', data._id);
        if (this.startTime != undefined) {
            let finalStartTime = new Date(data.startTime);

            let curTime = new Date();

            let diff = (curTime.getTime() - finalStartTime.getTime()) / 1000;

            diff /= (60 * 60);
            this.timeDifference = Math.abs(Math.round(diff));

            if (this.cancelPolicy && this.cancelPolicy != undefined) {
                if ((this.timeDifference < this.cancelPolicy)) {

                    let dialogRef = this.dialog.open(CancelDialog, {
                        data: 'backToApiHit'
                    });

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
                        this.router.navigate(['/pages/all-sessions/Select-payment']);
                    }

                }
            }

        }
    }

    acceptBookingOfIsSuppress() {
        const fd = new FormData();
        fd.append('action', 'ACCEPT');
        let completeBookingData = {
            FormData: fd,
            bookingId: this.bookingDetails._id
        };
        this.store.dispatch({
            type: sessionsDetails.actionTypes.ACCEPT_TUTOR_BOOKING,
            payload: completeBookingData
        });
    }

    declineReschedule(data) {

        this.store.dispatch({
            type: notification.actionTypes.ACCEPT_RESCHEDULE_REQUEST,
            payload: {bookingId: data, action: 'REJECT'}
        });
        this.router.navigate(['pages/all-sessions/sessions']);
    }

    acceptReschedule(data) {
        this.store.dispatch({
            type: notification.actionTypes.ACCEPT_RESCHEDULE_REQUEST,
            payload: {bookingId: data, action: 'ACCEPT'}
        });
        this.router.navigate(['pages/all-sessions/sessions']);
    }

    raiseDispute(bookingID) {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Session Summary',
            eventAction: 'Raise a Dispute',
            eventLabel: 'Raise a Dispute'
        });
        let ref = this.dialog.open(RaiseDisputeDialog, {
            data: bookingID
        });

    }

    goToPayment(bookingDetails) {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Upcoming Session',
            eventAction: 'Change Payment Method',
            eventLabel: 'Change Payment Method'
        });
        if (bookingDetails.payments != undefined) {
            localStorage.setItem('cardPaymentId', bookingDetails.payments.cardId);
        }
        localStorage.setItem('changePayment', 'true');

        // localStorage.setItem("cardId",)

        this.router.navigate(['/pages/payments']);
    }

    bookSession() {
        localStorage.removeItem('tutor_Id');
        localStorage.removeItem('steponeData');
        this.sessionService.addedSubjects = undefined;
        this.bookSessionService.checkedaddress = undefined;
        this.bookSessionService.selectedAddress_id = undefined;
        this.sessionService.selectedChild = undefined;
        this.bookSessionService.selectedChild = undefined;
        // this.sessionService.addSubjects=undefined
        this.bookSessionService.addedSubjects = undefined;
        this.sessionService.setBookAgain(undefined);
        this.bookSessionService.selectedAddress = undefined;
        this.sessionService.setBookAgainAddress(undefined);
        this.sessionService.setBookAgain_address = undefined;
        this.sessionService.bookAgainAddress = undefined;
        this.bookSessionService.setSessionLength('1');
        this.bookSessionService.stepOneData(undefined);

        // this.sessionService = null;
        this.bookSessionService.alreadyAddedSubjects = undefined;
        this.bookSessionService.setSessionLength('1');
        this.router.navigate(['/pages/book-session/session']);
    }

    approveTutor(sendData) {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Session Summary',
            eventAction: 'Review & Approve',
            eventLabel: 'Review & Approve'
        });
        let data = {
            data: sendData,
            tutorApproved: false,
            tutorRated: this.showApproveTutor
        };
        let ref = this.dialog.open(RatingDialog, {
            data: data
        });
    }

    rateTutor(sendData) {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Session Summary',
            eventAction: 'Rate Your Tutor',
            eventLabel: 'Rate Your Tutor'
        });
        let data = {
            data: sendData,
            tutorApproved: true,
            tutorRated: this.showApproveTutor
        };
        let ref = this.dialog.open(RatingDialog, {
            data: data
        });
    }

    ngAfterContentChecked() {

    }

    checkSuppressCases(bookAgain?, data?) {

        // for bh wxpiring modal new checks
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

        if (this.isRateChargeSuppress && !this.userData.parent.isParentOutOfTutoringHours) {

            let length = this.commonService.noOfNonExpiredHours(this.userData.parent.sessionCreditsFromExternalApi);
            if (length === 0 && this.userData.parent.numberOfTutoringHours > 0) {
                this.dialog.open(NoTodayHourAvailable, {
                    data: {userData: this.userData},
                    panelClass: 'contentHieght'
                });
                return true;
            } else {
                if (this.userData.parent.numberOfTutoringHours == 0 && !this.userData.parent.isParentOutOfTutoringHours) {
                    this.dialog.open(NoHourAvailable, {
                        data: {
                            userData: this.userData,
                            bookAgainText: bookAgain
                        },
                        panelClass: 'contentHieght'
                    });
                    return true;
                }
            }
        }

    }

    bookAgain(booking) {

        if (this.checkSuppressCases(true)) {
            return;
        }
        if (booking.partnershipCode) {

            let obj = booking.tutorId.partnershipCode.find((o, i) => {
                if (o.partnercode === booking.partnershipCode.partnercode) {
                    return true; // stop searching
                }

            });
            if (!obj || !JSON.parse(localStorage.getItem('hasPartnerCode'))) {
                let dialogRef = this.dialog.open(CommonErrorDialog, {
                    data: {message: 'Oops! It looks like either you or your tutor are no longer associated with this partnership. Please contact the Customer Success team at ' + this.parentContact + ' for support.'}
                });

                return;
            }
            // else if()
        }
        // else if(localStorage.getItem('marketName')=='Nationwide' && booking.tutorId.marketData && booking.tutorId.marketData.marketName!=localStorage.getItem('marketName')){
        //     let dialogRef = this.dialog.open(CommonErrorDialog, {
        //         data: { message: 'Oops! It looks like either you or your tutor are no longer associated with this partnership. Please contact the Customer Success team at '+this.parentContact+' for support.' }
        //     });
        //     return;
        // }

        this.bookSessionService.selectedAddress_id = undefined;

        this.sessionService.addedSubjects = undefined;
        this.bookSessionService.addedSubjects = undefined;
        this.bookSessionService.alreadyAddedSubjects = undefined;

        this.store.dispatch({
            type: sessionsDetails.actionTypes.CHECK_TUTOR_LIVE,
            payload: {
                tutorId: booking.tutorId._id,
                parentId: booking.parentId._id
            }
        });
        localStorage.setItem('book_again', JSON.stringify(booking));
        ga('send', {
            hitType: 'event',
            eventCategory: 'Session Summary',
            eventAction: 'Book Again',
            eventLabel: 'Book Again'
        });
        let setAddess = {
            latitude: (booking.locationDetails.location && booking.locationDetails.location.coordinates) ? booking.locationDetails.location.coordinates[1] : '',
            longitude: (booking.locationDetails.location && booking.locationDetails.location.coordinates) ? booking.locationDetails.location.coordinates[0] : '',
            zipCode: booking.locationDetails ? booking.locationDetails.zipCode : '',
            addressLine1: booking.locationDetails ? booking.locationDetails.addressLine1 : '',
            addressLine2: booking.locationDetails ? booking.locationDetails.addressLine2 : '',
            city: booking.locationDetails ? booking.locationDetails.city : '',
            state: booking.locationDetails ? booking.locationDetails.state : '',
            country: booking.locationDetails ? booking.locationDetails.country : '',
            label: booking.locationDetails ? booking.locationDetails.label : '',
            _id: booking.locationDetails ? booking.locationDetails._id : ''
            // parentTimezoneOffsetZone: booking.locationDetails.parentTimezoneOffsetZone ? booking.locationDetails.parentTimezoneOffsetZone : 'America/New_york'
        };
        this.sessionService.setBookAgain(JSON.stringify(booking));
        this.bookSessionService.selectedAddress = JSON.stringify(setAddess);
        this.sessionService.setBookAgainAddress(JSON.stringify(setAddess));
        this.sessionService.setBookAgain_address = JSON.stringify(setAddess);
        this.bookSessionService.setSessionLength('1');
        // this.bookSessionService.setSessionLength('1');
        //toCheckSessionOnline
        if (booking.isSessionOnline) {
            this.bookSessionService.onlineBooking = true;
            localStorage.setItem('isTutorOfferOnlineClasses', 'true');
            localStorage.setItem('isSessionOnline', 'true');
        } else {
            this.bookSessionService.onlineBooking = false;
            localStorage.removeItem('isTutorOfferOnlineClasses');
            localStorage.removeItem('isSessionOnline');
        }
        localStorage.setItem('book_again_address', JSON.stringify(setAddess));

        let tutorid = booking.tutorId._id;
        if (tutorid != undefined) {
            localStorage.setItem('tutor_Id', tutorid);
        }
        // if(booking.tutorId.)
        // {

        // }
        this.bookSessionService.tutorSelected = true;

    }

    ngAfterViewInit() {

    }

    reschedule() {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Upcoming Session',
            eventAction: 'Reschedule Session',
            eventLabel: 'Reschedule Session'
        });
        let rescheduleData = {
            id: this.reschedule_tutor_id,
            duration: this.duration
        };
        localStorage.setItem('tuorId_Reschedule', JSON.stringify(rescheduleData));

        if (this.bookingDetails.partnershipCode) {
            localStorage.setItem('partnerEndTime', this.bookingDetails.partnershipCode.partnercodeId.endTime);
        } else {
            localStorage.removeItem('partnerEndTime');
        }

        if (this.isRateChargeSuppressNow) {
            let sessionCreditsFromExternalApi = JSON.parse(JSON.stringify(this.commonService.sortByEndDate(this.userData.parent.sessionCreditsFromExternalApi)));
            let lastItem: any = _.last(sessionCreditsFromExternalApi);
            if (this.bookingDetails.reservationEndDate) {
                localStorage.setItem('endDateCode', this.bookingDetails.reservationEndDate);
                console.log(this.bookingDetails.reservationEndDate, 'reservationEndDatereservationEndDate');
            } else if (lastItem) {
                localStorage.setItem('endDateCode', lastItem.endDate);
            }
        }

        this.store.dispatch({
            type: reschedular.actionTypes.RESCHEDULE_BOOKING_DATA,
            payload: rescheduleData
        });

        this.router.navigate(['/pages/all-sessions/reschedule-session']);

    }

    checkIsSuppress() {
        this.isRateChargeSuppress = this.userData.partnershipCode && this.userData.partnershipCode.length && this.userData.partnershipCode[0].isRateChargeSuppress;
        // this.isRateChargeSuppressNow = !(this.isRateChargeSuppress && this.userData.parent.isParentOutOfTutoringHours);
    }

    checkShowAmount() {
        this.showAmount = false;

        if (this.userData.partnershipCode && this.userData.partnershipCode.length && this.userData.partnershipCode[0].isRateChargeSuppress) {
            if (!this.userData.parent.isParentOutOfTutoringHours) {
                if (this.bookingDetails.sessionRequestedBy === 'PARENT') {
                    // this.showAmount = false;
                    // if (this.bookingDetails.status === 'NEW') {
                    //     this.showAmount = false;
                    // } else {
                    if (this.bookingDetails.isBookingUseCredits) {
                        this.showAmount = false;
                    } else {
                        this.showAmount = true;
                    }
                    // }
                }
                if (this.bookingDetails.sessionRequestedBy === 'TUTOR') {
                    if (this.bookingDetails.status === 'NEW_TUTOR') {
                        this.showAmount = false;
                    } else {
                        if (this.bookingDetails.isBookingUseCredits) {
                            this.showAmount = false;
                        } else {
                            this.showAmount = true;
                        }
                    }
                }
            }

            if (this.userData.parent.isParentOutOfTutoringHours) {
                if (this.bookingDetails.sessionRequestedBy === 'PARENT') {
                    // this.showAmount = true;
                    //
                    // if (this.bookingDetails.status === 'NEW') {
                    //
                    //     if (this.bookingDetails.isBookingUseCredits) {
                    //         this.showAmount = false;
                    //     } else {
                    //         this.showAmount = true;
                    //     }
                    //
                    //     // this.showAmount = false;
                    // } else {
                    if (this.bookingDetails.isBookingUseCredits) {
                        this.showAmount = false;
                    } else {
                        this.showAmount = true;
                    }
                    // }

                }
                if (this.bookingDetails.sessionRequestedBy === 'TUTOR') {
                    if (this.bookingDetails.status === 'NEW_TUTOR') {
                        this.showAmount = true;
                    } else {
                        if (this.bookingDetails.isBookingUseCredits) {
                            this.showAmount = false;
                        } else {
                            this.showAmount = true;
                        }
                    }
                }
            }
        } else {
            if (this.bookingDetails.status === 'NEW_TUTOR') {
                this.showAmount = true;
            } else {
                if (this.bookingDetails.isBookingUseCredits) {
                    this.showAmount = false;
                } else {
                    this.showAmount = true;
                }
            }
            // this.showAmount = true;
        }

    }

    // checkShowAmount() {
    //
    //     this.showAmount = false;
    //
    //     if (this.userData.partnershipCode && this.userData.partnershipCode.length && this.userData.partnershipCode[0].isRateChargeSuppress) {
    //         if (!this.userData.parent.isParentOutOfTutoringHours) {
    //             if (this.bookingDetails.sessionRequestedBy === 'PARENT') {
    //                 this.showAmount = false;
    //             }
    //             if (this.bookingDetails.sessionRequestedBy === 'TUTOR') {
    //                 if (this.bookingDetails.status === 'NEW_TUTOR') {
    //                     this.showAmount = false;
    //                 } else {
    //                     if (this.bookingDetails.isBookingUseCredits) {
    //                         this.showAmount = false;
    //                     } else {
    //                         this.showAmount = true;
    //                     }
    //
    //                 }
    //             }
    //         }
    //
    //         if (this.userData.parent.isParentOutOfTutoringHours) {
    //             if (this.bookingDetails.sessionRequestedBy === 'PARENT') {
    //                 this.showAmount = true;
    //             }
    //             if (this.bookingDetails.sessionRequestedBy === 'TUTOR') {
    //                 if (this.bookingDetails.status === 'NEW_TUTOR') {
    //                     this.showAmount = true;
    //                 } else {
    //                     if (this.bookingDetails.isBookingUseCredits) {
    //                         this.showAmount = false;
    //                     } else {
    //                         this.showAmount = true;
    //                     }
    //
    //                 }
    //             }
    //         }
    //     } else {
    //         this.showAmount = true;
    //     }
    //
    // }

    ngOnDestroy() {
        this.sessionService.singleSessionUrl = this.router.url;
        if (this.sessionStore && this.sessionStore != undefined) {
            this.sessionStore.unsubscribe();
        }
    }
}
