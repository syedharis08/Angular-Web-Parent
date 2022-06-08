import { Component, NgZone, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import * as tutor from '../../state/tutor.actions';
import { ToastrService } from 'ngx-toastr';
import 'style-loader!./tutor-details.scss';
import { Router } from '@angular/router';
import { TutorService } from '../../../../services/tutor-service/tutor.service';
import { AuthService } from '../../../../auth/service/auth-service/auth.service';
import { LoginDialog } from '../../../../auth/model/session-login-dialog/session-login-dialog.component';
import { CompleteProfileDialog } from '../../../../auth/model/complete-profile-dialog/complete-profile-dialog.component';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs/Rx';
import { BookSessionService } from '../../../../services/session-service/session.service';
import { AllSessionService } from '../../../../services/all-sessions-service/all-sessions.service';
import { NoHourAvailable } from '../../../../auth/model/no-hour-available/no-hour-available';
import { CommonService } from '../../../../services/common.service';
import { NoTodayHourAvailable } from '../../../../auth/model/no-today-hour-available';

@Component({
    selector: 'tutor-details',
    template: require('./tutor-details.html')
})
export class TutorDetails {

    ishourlyRate = false;
    myhourlyRate: any;
    public storeData: Subscription;
    public tutorStore: Subscription;
    public tutor_id: any;
    public limit = 5;
    public skip = 0;
    public tutorLength;
    public count;
    public tutor_details_ratings: any;
    public tutor_details;
    public canBookSession: boolean = false;
    public tutor_image = '/assets/img/user.png';
    public certi_bgCheck = '/assets/img/background-checked.svg';
    public certi_degCheck = '/assets/img/degree-icon-1.svg';
    public certi_sylCheck = '/assets/img/certified-in-sylvan-method.svg';
    public certi_stateCheck = '/assets/img/state-certified.svg';
    public onlineSessions = '/assets/img/online.svg';
    public progressBarData: any;
    public cancellationPolicy;
    tutor_UId: string;
    showNationWide: boolean;
    hasPartnerCode: boolean;
    isRateChargeSuppressNow = false;
    hourlyRate: string;
    userData: any = [];

    constructor(private store: Store<any>, public zone: NgZone, private tutorService: TutorService,
                private toastrService: ToastrService, private router: Router, public allSessionService: AllSessionService,
                private checkLogin: AuthService, private sessionService: BookSessionService, private dialog: MatDialog,
                public commonService: CommonService
    ) {
        if (localStorage.getItem('isNationWide') == 'true') {
            this.showNationWide = true;
            this.hasPartnerCode = false;

            if (localStorage.getItem('hasPartnerCode') == 'true') {
                this.hourlyRate = JSON.parse(localStorage.getItem('hourlyRate'));
                this.hasPartnerCode = true;
            }
        } else if (localStorage.getItem('hasPartnerCode') == 'true') {
            this.hasPartnerCode = true;
            this.hourlyRate = JSON.parse(localStorage.getItem('hourlyRate'));
        } else {
            this.showNationWide = false;
            this.hasPartnerCode = false;
        }

        document.cookie = 'tutorId' + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
        this.canBookSession = false;
        if (this.tutorService.getId && this.tutorService.getId != undefined)
            this.tutor_id = this.tutorService.getId;
        else {
            this.tutor_id = localStorage.getItem('tutor_Id');

        }
        if (localStorage.getItem('tutorUId')) {
            this.tutor_UId = localStorage.getItem('tutorUId');
            this.store.dispatch({
                type: tutor.actionTypes.GET_TUTOR_DETAILS_BY_UID,
                payload: this.tutor_UId
            });
            this.store.dispatch({
                type: tutor.actionTypes.GET_TUTOR_RATINGS_BY_UID,
                payload: {tutorId: this.tutor_UId, limit: this.limit, skip: this.skip}
            });
            localStorage.removeItem('tutorUId');
        } else {
            if (this.tutor_id && this.tutor_id != undefined) {
                this.store.dispatch({
                    type: tutor.actionTypes.GET_TUTOR_DETAILS,
                    payload: this.tutor_id
                });
                this.store.dispatch({
                    type: tutor.actionTypes.GET_TUTOR_RATINGS,
                    payload: {tutorId: this.tutor_id, limit: this.limit, skip: this.skip}
                });
            }
        }

        this.tutorStore = this.store.select('tutor').subscribe((res: any) => {
            if (res) {
                if (res && res.tutorDetails && res.tutorDetails != undefined) {
                    this.tutor_details = res.tutorDetails.data;
                    if (this.tutor_details && this.tutor_details.tutor && this.tutor_details.tutor != undefined && this.tutor_details.tutor.cancellationPolicy && this.tutor_details.tutor.cancellationPolicy != undefined) {
                        this.cancellationPolicy = this.tutor_details.tutor.cancellationPolicy;
                        if (this.cancellationPolicy && this.cancellationPolicy != undefined) {
                            localStorage.setItem('cancelPolicy', JSON.stringify(this.cancellationPolicy));
                        }
                    }
                    if (this.tutor_details.tutor.tutorId) {
                        localStorage.setItem('tutorUId1', this.tutor_details.tutor.tutorId);
                        localStorage.setItem('tutor_Id', this.tutor_details._id);
                    }
                }

                if (res && res.tutorratings && res.tutorratings != undefined && res.tutorratings.data != undefined) {
                    this.tutor_details_ratings = res.tutorratings.data.ratings;
                    this.progressBarData = res.tutorratings.data.ratingCounts;
                    this.tutorLength = this.tutor_details_ratings.length;
                }
                if (res && res.ratingsCount && res.ratingsCount != undefined && res.ratingsCount.data != undefined) {
                    this.count = res.ratingsCount.data.count;

                }

            }
        });
        this.storeData = this.store.select('profile').subscribe((res: any) => {
            if (res) {
                if (res.userData && res.userData.data && res.userData.data != undefined) {
                    let user = res.userData.data;
                    this.userData = res.userData.data;
                    this.checkIsSuppress();
                    if (user.students && user.students.length > 0 && user.parent && user.parent.addresses && user.parent.addresses.length > 0) {
                        this.canBookSession = this.commonService.checkChildDOB(user);
                    }
                }
            }
        });

        if (localStorage.getItem('ishourlyRate')) {
            this.ishourlyRate = true;
            this.myhourlyRate = localStorage.getItem('ishourlyRate');
        }

    }

    @HostListener('window:popstate', ['$event'])
    onPopState(event) {
        localStorage.removeItem('tutor_detail');
    }

    checkIsSuppress() {
        if (this.userData.partnershipCode && this.userData.partnershipCode.length && this.userData.partnershipCode[0].isRateChargeSuppress) {
            this.isRateChargeSuppressNow = true;
            if (this.userData.parent.isParentOutOfTutoringHours) {
                this.isRateChargeSuppressNow = false;
            } else {
                this.isRateChargeSuppressNow = true;
            }
        } else {
            this.isRateChargeSuppressNow = false;
        }
    }

    moveToRating() {
        let el = $('.thisPlace');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
    }

    checkSuppressCases() {
        if (this.userData.partnershipCode && this.userData.partnershipCode.length && this.userData.partnershipCode[0].isRateChargeSuppress) {
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
                        data: {userData: this.userData, bookAgainText: true},
                        panelClass: 'contentHieght'
                    });
                    return true;
                }
            }
        }
    }

    bookSession() {
        if (this.checkSuppressCases()) {
            return;
        }

        if (this.tutor_details.tutor.isTutorOfferOnlineClasses) {
            localStorage.setItem('isTutorOfferOnlineClasses', 'true');
        } else {
            localStorage.removeItem('isTutorOfferOnlineClasses');
        }
        ga('send', {
            hitType: 'event',
            eventCategory: 'Tutor Long Profile',
            eventAction: 'Book a Session',
            eventLabel: 'Book a Session'
        });
        if (this.checkLogin.login()) {
            if (localStorage.getItem('slotSelected') != undefined) {
                localStorage.removeItem('slotSelected');
            }
            if (localStorage.getItem('finalData')) {
                localStorage.removeItem('finalData');
            }
            if (localStorage.getItem('totalSessions')) {
                localStorage.removeItem('totalSessions');
            }
            if (localStorage.getItem('finalSlot')) {
                localStorage.removeItem('finalSlot');
            }
            if (localStorage.getItem('index')) {
                localStorage.removeItem('index');
            }
            if (localStorage.getItem('goBack')) {
                localStorage.removeItem('goBack');
            }
            if (localStorage.getItem('steponeData')) {
                localStorage.removeItem('steponeData');
            }
            if (localStorage.getItem('promoHash')) {
                localStorage.removeItem('promoHash');
            }
            if (this.canBookSession) {
                if (localStorage.getItem('PROMOCODE') != undefined) {
                    localStorage.removeItem('PROMOCODE');
                }
                if (localStorage.getItem('promoVal') != undefined) {
                    localStorage.removeItem('promoVal');
                }
                this.router.navigate(['/pages/book-session']);
                this.sessionService.updateStepperIndex(0);
                // this.sessionService.changeStep.next(0);
                this.sessionService.addedSubjects = '';
                this.sessionService.selectedChild = '';
                this.sessionService.selectedAddress = null;
                this.allSessionService.setBookAgain('');
                this.allSessionService.setBookAgain_address = '';
                this.sessionService.flexibility = '';
                this.sessionService.childInformation = '';
                this.sessionService.setTrackPageRefresh(true);
                this.sessionService.checkedaddress = '';
                this.sessionService.tutorSelected = true;
                localStorage.removeItem('goFromSession');
                this.sessionService.selectedAddress_id = '';
                this.sessionService.onlineBooking = false;

            } else {
                this.sessionService.tutorSelected = true;
                let ref = this.dialog.open(CompleteProfileDialog);
            }

        } else {
            let dialogRef = this.dialog.open(LoginDialog);
        }
    }

    showTooltip1() {
        if (document.getElementById('tooltipbg')) {
            let elements = document.getElementById('tooltipbg');
            elements.style.display = 'block';
        }
    }

    loadMore() {

        this.skip = 0;
        this.limit = this.limit + 5;
        this.store.dispatch({
            type: tutor.actionTypes.GET_TUTOR_RATINGS,
            payload: {tutorId: localStorage.getItem('tutor_Id'), limit: this.limit, skip: this.skip}
        });

    }

    checkExist(data) {
        if (data) {
            return data;
        } else {
            return 0;
        }
    }

    roundOff(rating) {
        let rate = Math.round(rating);
        let multiplier = Math.pow(10, 1 || 0);
        return Math.round(rating * multiplier) / multiplier;
    }

    ngOnDestroy() {
        if (this.tutorStore && this.tutorStore != undefined) {
            this.tutorStore.unsubscribe();
        }
        if (this.storeData && this.storeData != undefined) {
            this.storeData.unsubscribe();
        }
    }
}
