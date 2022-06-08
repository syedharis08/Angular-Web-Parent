import {
    Component,
    Input,
    Output,
    ViewChild,
    ElementRef,
    ChangeDetectorRef,
    EventEmitter,
    ContentChildren,
    QueryList,
    ViewContainerRef,
    Renderer,
    NgZone
} from '@angular/core';
import { Store } from '@ngrx/store';
import * as auth from '../../../../auth/state/auth.actions';
import * as session from '../../state/book-session.actions';
import { Observable } from 'rxjs/Observable';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator, NameValidator } from '../../theme/validators';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import 'style-loader!./select-tutor-details.scss';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { TutorService } from '../../../../services/tutor-service/tutor.service';
import { AuthService } from '../../../../auth/service/auth-service/auth.service';
import { LoginDialog } from '../../../../auth/model/session-login-dialog/session-login-dialog.component';
import { CompleteProfileDialog } from '../../../../auth/model/complete-profile-dialog/complete-profile-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs/Rx';
import { BaImageLoaderService, BaThemePreloader, BaThemeSpinner } from '../../../../theme/services';
import { BookSessionService } from '../../../../services/session-service/session.service';
import * as  tutor from '../../../../publicPages/tutor/state/tutor.actions';
import { CommonErrorDialog } from '../../../../auth/model/common-error-dialog/common-error-dialog';
import { CommonService } from '../../../../services/common.service';

@Component({
    selector: 'select-tutor-details',
    templateUrl: './select-tutor-details.html'
})
export class SelectTutorDetails {

    public storeData: Subscription;
    public tutorStore: Subscription;
    public tutor_id: any;
    public userData: any;
    public count;
    public tutorLength;
    public tutor_details_ratings;
    public limit = 5;
    public skip = 0;
    public tutor_details;
    public canBookSession: boolean = false;
    public tutor_image = '/assets/img/user.png';
    public certi_bgCheck = '/assets/img/background-checked.svg';
    public certi_degCheck = '/assets/img/degree-icon-1.svg';
    public certi_sylCheck = '/assets/img/certified-in-sylvan-method.svg';
    public certi_stateCheck = '/assets/img/state-certified.svg';
    public onlineSessions = '/assets/img/online.svg';
    addressDataStore: Subscription;
    step1Data: string;
    showAddressPopError: boolean;
    sessionsWithTutor: boolean = false;
    showAlternatePrice: boolean;
    showNationWide: boolean;
    hasPartnerCode: boolean;
    hourlyRate: string;
    isSessionOnline = false;
    isRateChargeSuppressNow = false;

    constructor(private fb: FormBuilder, private store: Store<any>, public zone: NgZone, private tutorService: TutorService,
                private toastrService: ToastrService, private router: Router, private checkLogin: AuthService, private spinner: BaThemeSpinner,
                private dialog: MatDialog, private sessionService: BookSessionService, public commonService: CommonService
    ) {

        let steponeData = JSON.parse(localStorage.getItem('steponeData'));

        this.isSessionOnline = steponeData.isSessionOnline == 'true' || steponeData.isSessionOnline == true;
        if (localStorage.getItem('isNationWide') == 'true') {
            this.showNationWide = true;
            this.hasPartnerCode = false;
            if (localStorage.getItem('hasPartnerCode') == 'true') {
                // this.showNationWide = false;
                this.hourlyRate = JSON.parse(localStorage.getItem('hourlyRate'));
                this.hasPartnerCode = true;
            }
        } else if (localStorage.getItem('hasPartnerCode') == 'true') {
            // this.showNationWide = false;
            this.hasPartnerCode = true;
        } else {
            this.showNationWide = false;
            this.hasPartnerCode = false;
        }
        // window.scroll(0, 0);
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
        if (this.tutor_id && this.tutor_id != undefined) {
            this.store.dispatch({
                type: session.actionTypes.GET_TUTOR_DETAILS,
                payload: this.tutor_id
            });
            this.store.dispatch({
                type: session.actionTypes.SELECT_GET_TUTOR_RATINGS,
                payload: {tutorId: this.tutor_id, limit: this.limit, skip: this.skip}
            });
        }
        this.tutor_id = localStorage.getItem('tutor_Id');
        this.store.dispatch({
            type: tutor.actionTypes.GET_ADDRESS_STUDENTS,
            payload: this.tutor_id
        });

        this.tutorStore = this.store.select('session').subscribe((res: any) => {
            if (res) {

                if (res && res.tutorDetails && res.tutorDetails != undefined) {
                    this.tutor_details = res.tutorDetails.data;

                }
                if (res && res.tutorratings && res.tutorratings != undefined && res.tutorratings.data != undefined) {
                    this.tutor_details_ratings = res.tutorratings.data.ratings;
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
                    // if (user && user.students && user.students !=undefined && user.students.length >0)
                    // {

                    // }

                    if (user.students && user.students.length > 0 && user.cards && user.cards.length > 0 && user.parent && user.parent.addresses && user.parent.addresses.length > 0) {
                        // this.canBookSession = true;
                        this.canBookSession = this.commonService.checkChildDOB(user);
                    }
                }
            }
        });
        this.addressDataStore = this.store.select('tutor').subscribe((res: any) => {
            if (res) {
                if (res.parentDetails && res.parentDetails.data && res.parentDetails.data != undefined) {
                    if (res.parentDetails && res.parentDetails.data && res.parentDetails.data.sessionsWithTutor) {
                        this.sessionsWithTutor = true;
                    } else {
                        this.sessionsWithTutor = false;
                    }
                    if (localStorage.getItem('steponeData')) {
                        let addressToCompare = res.parentDetails.data.addresses;
                        let step1Data = JSON.parse(localStorage.getItem('steponeData'));
                        if (step1Data.address) {
                            this.step1Data = step1Data.address._id;
                            //   debugger;
                            let obj = addressToCompare.find((o, i) => {
                                if (o._id === this.step1Data) {
                                    if (o.withinTutorPreferredDistance === false) {
                                        this.showAddressPopError = true;
                                    } else {
                                        this.showAddressPopError = false;
                                    }
                                    return true; // stop searching
                                }
                            });
                        }
                    }

                    //   step1Data.address.id/
                }
                if (res.continueBooking && res.continueBooking.continueBooking) {
                    this.dialog.closeAll();
                    this.spinner.show();
                    this.sessionService.tutorSelected = true;
                    if (localStorage.getItem('PROMOCODE') != undefined) {
                        localStorage.removeItem('PROMOCODE');
                    }
                    if (localStorage.getItem('promoVal') != undefined) {
                        localStorage.removeItem('promoVal');
                    }
                    this.sessionService.updateStepperIndex(1);
                    this.router.navigate(['/pages/book-session/session']).then(() => {
                        this.sessionService.changeStep.next(1);
                    });
                }
            }
        });

    }

    checkIsSuppress() {
        if (this.userData.partnershipCode && this.userData.partnershipCode.length && this.userData.partnershipCode[0].isRateChargeSuppress) {
            // this.isRateChargeSuppressNow = true;
            this.isRateChargeSuppressNow = !this.userData.parent.isParentOutOfTutoringHours;
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

    selectTutor() {

        if (this.checkLogin.login()) {
            if (this.showAddressPopError && !this.sessionsWithTutor && !this.isSessionOnline) {
                this.zone.run(() => {
                    let dialogRef = this.dialog.open(CommonErrorDialog, {
                        data: {
                            message: 'Oops! If you are attempting to schedule an in-person session, based on this tutor’s Travel Policy, they may not be willing to offer tutoring at your chosen location. If you wish to continue with an in-person session request, we recommend choosing a location closer to the tutor to reduce travel distance. If you are scheduling an online session, please continue with your request.',
                            data: 'true',
                            inside: 'true'
                        }
                    });
                });
            } else {
                this.spinner.show();
                this.sessionService.tutorSelected = true;
                if (localStorage.getItem('PROMOCODE') != undefined) {
                    localStorage.removeItem('PROMOCODE');
                }
                if (localStorage.getItem('promoVal') != undefined) {
                    localStorage.removeItem('promoVal');
                }
                this.sessionService.updateStepperIndex(1);
                this.router.navigate(['/pages/book-session/session']).then(() => {
                    this.sessionService.changeStep.next(1);
                });
            }
        } else {
            this.spinner.hide();
            let dialogRef = this.dialog.open(LoginDialog);
        }
        this.spinner.hide();
    }

    loadMore() {
        this.skip = 0;
        this.limit = this.limit + 5;
        this.store.dispatch({
            type: session.actionTypes.SELECT_GET_TUTOR_RATINGS,
            payload: {tutorId: this.tutor_id, limit: this.limit, skip: this.skip}
        });
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
        this.addressDataStore.unsubscribe();
    }
}
