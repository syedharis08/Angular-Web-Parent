import { Component } from '@angular/core';
import { GlobalState } from '../../../global.state';
import 'style-loader!./baPageTop.scss';
import { Store } from '@ngrx/store';
import * as auth from '../../../auth/state/auth.actions';
import { JwtHelper } from 'angular2-jwt';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import * as profile from '../../../pages/profile/state/profile.actions';
import { LogoutDialog } from '../../../auth/model/logout/logout.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CompleteProfileDialog } from '../../../auth/model/complete-profile-dialog/complete-profile-dialog.component';
import { LoginDialog } from '../../../auth/model/session-login-dialog/session-login-dialog.component';
import { BookSessionService } from '../../../services/session-service/session.service';
import { AuthService } from '../../../auth/service/auth-service/auth.service';
import { TutorService } from '../../../services/tutor-service/tutor.service';
import { AllSessionService } from '../../../services/all-sessions-service/all-sessions.service';
import { Subscription } from 'rxjs';
import { NoHourAvailable } from '../../../auth/model/no-hour-available/no-hour-available';
import { CommonService } from '../../../services/common.service';
import { CONSTANT } from '../../../shared/constant/constant';
import { NoTodayHourAvailable } from '../../../auth/model/no-today-hour-available';

@Component({
    selector: 'ba-page-top',
    templateUrl: './baPageTop.html'
})
export class BaPageTop {

    wordPressLink: string;
    public isScrolled: boolean;
    public isMenuCollapsed: boolean = false;
    public jwtHelper: JwtHelper = new JwtHelper();
    public user;
    storeData: Subscription;
    public authStore;
    userInfo;
    public name;
    public profilePicture;
    login: boolean = false;
    canBookSession: boolean = false;
    isRateChargeSuppressNow: boolean = false;
    collapseButton: boolean = false;
    public profile_image = '/assets/img/user.png';

    constructor(private _state: GlobalState, private store: Store<any>, private router: Router,
                private sessionService: BookSessionService, private authService: AuthService,
                private tutorService: TutorService, public allSessionService: AllSessionService,
                private dialog: MatDialog, public commonService: CommonService) {
        this.login = false;
        this.canBookSession = false;
        this.storeData = this.store.select('profile').subscribe((res: any) => {
            if (res) {

                if (res.userData && res.userData.data) {
                    this.userInfo = res.userData.data;
                    this.checkIsSuppressNow();
                    this.name = this.userInfo.firstName;
                    this.profilePicture = (this.userInfo.profilePicture && this.userInfo.profilePicture.thumbnail != null) ? this.userInfo.profilePicture.thumbnail : this.profile_image;
                    if (this.userInfo.students && this.userInfo.students.length > 0 && this.userInfo.parent && this.userInfo.parent.addresses && this.userInfo.parent.addresses.length > 0) {
                        // this.canBookSession = true;
                        this.canBookSession = this.commonService.checkChildDOB(this.userInfo);
                    }
                    if ((this.userInfo.marketData && (this.userInfo.marketData.marketName == 'Nationwide'))) {
                        localStorage.setItem('isByPassMarket', 'true');
                        localStorage.setItem('hasPartnerCode', 'false');
                        localStorage.setItem('isNationWide', 'false');
                        localStorage.setItem('onlyNationWide', 'true');
                        localStorage.setItem('marketName', 'Nationwide');
                        localStorage.removeItem('endDateCode');
                        localStorage.setItem('isNationWide', 'true');

                        if (this.userInfo.partnercode && this.userInfo.partnercode) {

                            localStorage.setItem('isNationWide', 'true');
                            localStorage.removeItem('onlyNationWide');
                            localStorage.setItem('hasPartnerCode', 'true');
                            // localStorage.setItem('isNationWide', 'false');

                            if (this.userInfo.partnercode && this.userInfo.partnercode && this.userInfo.partnercode[0].endTime) {
                                localStorage.setItem('endDateCode', this.userInfo.partnercode[0].endTime);
                            }

                        }
                    } else if (this.userInfo.partnercode && this.userInfo.partnercode) {
                        localStorage.removeItem('onlyNationWide');

                        localStorage.setItem('hasPartnerCode', 'true');
                        // localStorage.setItem('isNationWide', 'false');

                        if (this.userInfo.partnercode && this.userInfo.partnercode && this.userInfo.partnercode[0].endTime) {
                            localStorage.setItem('endDateCode', this.userInfo.partnercode[0].endTime);
                        }

                    } else {
                        localStorage.removeItem('onlyNationWide');
                        localStorage.setItem('hasPartnerCode', 'false');
                        localStorage.setItem('isNationWide', 'false');
                        localStorage.removeItem('endDateCode');
                        localStorage.removeItem('marketName');
                    }

                }
            }
        });
    }

    ngOnInit() {
        if (process.env.ENV == 'development') {
            this.wordPressLink = CONSTANT.wordPressDevLink;
        }
        if (process.env.ENV == 'production') {
            this.wordPressLink = CONSTANT.wordPressQualLink;
        }
        if (process.env.ENV == 'demo') {
            this.wordPressLink = CONSTANT.wordPressDemoLink;
        }
        if (process.env.ENV == 'test') {
            this.wordPressLink = CONSTANT.wordPressTestLink;
        }
        if (process.env.ENV == 'live') {
            this.wordPressLink = CONSTANT.wordPressLiveLink;
        }
        if (localStorage.getItem('token') && localStorage.getItem('token') != null && localStorage.getItem('token') != undefined) {
            this.login = true;
            let fd = new FormData();
            fd.append('deviceType', 'WEB');
            localStorage.setItem('login', 'yes');
            this.store.dispatch({
                type: profile.actionTypes.GET_PARENT_PROFILE,
                payload: fd
            });
            this.store.dispatch({
                type: auth.actionTypes.AUTH_LOGGED_IN
            });

        } else {
            localStorage.removeItem('login');
            this.login = false;
        }
    }

    checkIsSuppressNow() {
        if (this.userInfo.partnershipCode && this.userInfo.partnershipCode.length && this.userInfo.partnershipCode[0].isRateChargeSuppress) {
            this.isRateChargeSuppressNow = true;
            if (this.userInfo.parent.isParentOutOfTutoringHours) {
                this.isRateChargeSuppressNow = false;
            } else {
                this.isRateChargeSuppressNow = true;
            }
        } else {
            this.isRateChargeSuppressNow = false;
        }
    }

    goToParentPanel() {
        if (document.getElementById('navbarNavDropdownButton')) {
            let elements = document.getElementById('navbarNavDropdownButton');
            elements.classList.remove('show');
        }
        if (process.env.ENV == 'development') {
            window.open(CONSTANT.signInPanelUrlInDev, '_blank');
        }
        if (process.env.ENV == 'test') {
            window.open(CONSTANT.signInPanelUrlInTest, '_blank');
        }
        if (process.env.ENV == 'production') {
            window.open(CONSTANT.signInPanelUrlInQual, '_blank');
        }
        if (process.env.ENV == 'demo') {
            window.open(CONSTANT.signInPanelUrlInDemo, '_blank');
        }
        if (process.env.ENV == 'live') {
            window.open(CONSTANT.signInPanelUrlInLive, '_blank');
        }

    }

    goToDispute() {
        if (document.getElementById('navbarNavDropdownButonLogin')) {
            let elements = document.getElementById('navbarNavDropdownButonLogin');
            elements.classList.remove('show');
        }
        this.router.navigate(['/pages/disputes/all-disputes']);
    }

    becomeTutor() {
        if (document.getElementById('navbarNavDropdownButton')) {
            let elements = document.getElementById('navbarNavDropdownButton');
            elements.classList.remove('show');
        }
        let url = this.wordPressLink + 'become-a-tutor/';
        window.open(url, '_blank'); //prod
        // window.location.href = 'https://sylvanqual-wordpress.clicklabs.in/become-a-tutor/';
    }

    sylvanMethod() {
        if (document.getElementById('navbarNavDropdownButton')) {
            let elements = document.getElementById('navbarNavDropdownButton');
            elements.classList.remove('show');
        }
        let url = this.wordPressLink + 'the-sylvan-method/';
        window.open(url, '_blank'); //prod
        // window.location.href = 'https://sylvanqual-wordpress.clicklabs.in/the-sylvan-method/';
    }

    parent() {
        if (document.getElementById('navbarNavDropdownButton')) {
            let elements = document.getElementById('navbarNavDropdownButton');
            elements.classList.remove('show');
        }
        let url = this.wordPressLink + 'how-it-works-parents/';
        window.open(url, '_blank'); //prod
        // window.location.href = ' https://sylvanqual-wordpress.clicklabs.in/parent/';
    }

    tutor() {
        if (document.getElementById('navbarNavDropdownButton')) {
            let elements = document.getElementById('navbarNavDropdownButton');
            elements.classList.remove('show');
        }
        let url = this.wordPressLink + 'how-it-works-tutors/';
        window.open(url, '_blank'); //prod

        // window.location.href = ' https://sylvanqual-wordpress.clicklabs.in/tutor/';
    }

    subjects() {
        if (document.getElementById('navbarNavDropdownButton')) {
            let elements = document.getElementById('navbarNavDropdownButton');
            elements.classList.remove('show');
        }
        let url = this.wordPressLink + 'our-subjects/';
        window.open(url, '_blank'); //prod
        // window.location.href = ' https://sylvanqual-wordpress.clicklabs.in/our-subjects/';
    }

    browseTutor() {
        this.tutorService.getId = '';
        this.sessionService.addedSubjects = '';
        this.sessionService.selectedChild = '';
        this.sessionService.selectedAddress = null;
        this.sessionService.checkedaddress = '';
        // this.allSessionService.setBookAgain('');
        this.allSessionService.setBookAgainAddress('');
        this.sessionService.childInformation = '';
        this.sessionService.setDuration(1);
        this.sessionService.setSessionLength('1');
        if (localStorage.getItem('PROMOCODE') != undefined) {
            localStorage.removeItem('PROMOCODE');
        }
        if (localStorage.getItem('promoVal') != undefined) {
            localStorage.removeItem('promoVal');
        }
        if (localStorage.getItem('goBack') != undefined) {
            localStorage.removeItem('goBack');
        }
        if (localStorage.getItem('promoHash') != undefined) {
            localStorage.removeItem('promoHash');
        }
        if (localStorage.getItem('bookingHash') != undefined) {
            localStorage.removeItem('bookingHash');
        }
        // this.allSessionService.getId
        this.allSessionService.setBookAgain_address = '';
        localStorage.removeItem('goFromSession');
        // this.sessionService.sessionData;
        this.sessionService.selectedAddress_id = '';
        this.sessionService.onlineBooking = false;
        if (localStorage.getItem('tutor_Id')) {
            localStorage.removeItem('tutor_Id');
        }
        if (localStorage.getItem('book_again') != undefined) {
            localStorage.removeItem('book_again');
        }
        // let bookingData = localStorage.getItem('bookingAvailable');
        // if (document.cookie) {
        //     let domainParts = window.location.host.split('.');
        //     domainParts.shift();
        //     let domain = '.' + domainParts.join('.');
        //     let expireDate = new Date();
        //     let d = expireDate.toUTCString();
        //     document.cookie = 'bookingData=' + bookingData + ';domain=' + domain + ';expires=' + d + ';';

        // }
        if (localStorage.getItem('bookingAvailable')) {

            localStorage.removeItem('bookingAvailable');
        }
        if (document.getElementById('navbarNavDropdownButonLogin')) {
            let elements = document.getElementById('navbarNavDropdownButonLogin');
            elements.classList.remove('show');
        }
        this.router.navigate(['/home/browse-tutor']);
    }

    collapseNavFunction() {
        this.collapseButton = !this.collapseButton;

        if (document.getElementById('navbarNavDropdownButonLogin') && this.collapseButton == false) {
            let elements = document.getElementById('navbarNavDropdownButonLogin');
            elements.classList.add('show');
        }
        if (document.getElementById('navbarNavDropdownButonLogin') && this.collapseButton == true) {
            let elements = document.getElementById('navbarNavDropdownButonLogin');
            elements.classList.remove('show');
        }

    }

    toggleMenu() {
        this.isMenuCollapsed = !this.isMenuCollapsed;
        this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
        return false;
    }

    goToOnboard() {
        if (document.getElementById('navbarNavDropdownButton')) {
            let elements = document.getElementById('navbarNavDropdownButton');
            elements.classList.remove('show');
        }
        if (process.env.ENV == 'development') {
            window.open(CONSTANT.signInPanelUrlInDev);
        }
        if (process.env.ENV == 'test') {
            window.open(CONSTANT.signInPanelUrlInTest);
        }
        if (process.env.ENV == 'production') {
            window.open(CONSTANT.signInPanelUrlInQual);
        }
        if (process.env.ENV == 'demo') {
            window.open(CONSTANT.signInPanelUrlInDemo);
        }
        if (process.env.ENV == 'live') {
            window.open(CONSTANT.signInPanelUrlInLive);
        }
    }

    scrolledChanged(isScrolled) {
        if (this.isScrolled != undefined) {
            this.isScrolled = isScrolled;
        }
    }

    closeMenu() {
        if (document.getElementById('navbarNavDropdownButonLogin')) {
            let elements = document.getElementById('navbarNavDropdownButonLogin');
            elements.classList.remove('show');
        }
    }

    goToSignup() {
        if (document.getElementById('navbarNavDropdownButton')) {
            let elements = document.getElementById('navbarNavDropdownButton');
            elements.classList.remove('show');
        }
        if (process.env.ENV == 'development') {
            window.open(CONSTANT.signInPanelUrlInDev + '?tab=signup');
        }
        if (process.env.ENV == 'test') {
            window.open(CONSTANT.signInPanelUrlInTest + '?tab=signup');
        }
        if (process.env.ENV == 'production') {
            window.open(CONSTANT.signInPanelUrlInQual + '?tab=signup');
        }
        if (process.env.ENV == 'demo') {
            window.open(CONSTANT.signInPanelUrlInDemo + '?tab=signup');
        }
        if (process.env.ENV == 'live') {
            window.open(CONSTANT.signInPanelUrlInLive + '?tab=signup');
        }
    }

    logout() {
        if (document.getElementById('navbarNavDropdownButonLogin')) {
            let elements = document.getElementById('navbarNavDropdownButonLogin');
            elements.classList.remove('show');
        }
        let dialogRef = this.dialog.open(LogoutDialog);
    }

    goToChildSession() {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Navigation',
            eventAction: 'My Child\'s Sessions',
            eventLabel: 'My Child\'s Sessions'
        });
        if (document.getElementById('navbarNavDropdownButonLogin')) {
            let elements = document.getElementById('navbarNavDropdownButonLogin');
            elements.classList.remove('show');
            this.router.navigate(['/pages/all-sessions/sessions']);
        }

    }

    goToContact() {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Navigation',
            eventAction: 'Contact Us',
            eventLabel: 'Avatar Contact Us'
        });
        if (document.getElementById('navbarNavDropdownButonLogin')) {
            let elements = document.getElementById('navbarNavDropdownButonLogin');
            elements.classList.remove('show');
        }
        this.router.navigate(['/pages/contact-us']);
    }

    goToPayments() {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Navigation',
            eventAction: 'MyWallet',
            eventLabel: 'Avatar My Wallet'
        });
        if (document.getElementById('navbarNavDropdownButonLogin')) {
            let elements = document.getElementById('navbarNavDropdownButonLogin');
            elements.classList.remove('show');
        }
        this.router.navigate(['/pages/payments']);
    }

    goToParentProfile() {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Navigation',
            eventAction: 'Profile',
            eventLabel: 'Avatar My Profile'
        });
        if (document.getElementById('navbarNavDropdownButonLogin')) {
            let elements = document.getElementById('navbarNavDropdownButonLogin');
            elements.classList.remove('show');
        }
        this.router.navigate(['/pages/profile/parent-profile']);
    }

    referFriend() {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Navigation',
            eventAction: 'Refer a Friend',
            eventLabel: 'Refer a Friend'
        });
        this.router.navigate(['/pages/refer-friend']);

    }

    goToFeedback() {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Navigation',
            eventAction: 'Session Feedback',
            eventLabel: 'Session Feedback'
        });
        if (document.getElementById('navbarNavDropdownButonLogin')) {
            let elements = document.getElementById('navbarNavDropdownButonLogin');
            elements.classList.remove('show');
        }
        this.router.navigate(['/pages/session-reports/reports']);
    }

    goToSessionInvoice() {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Navigation',
            eventAction: 'Invoice',
            eventLabel: 'Invoice'
        });
        if (document.getElementById('navbarNavDropdownButonLogin')) {
            let elements = document.getElementById('navbarNavDropdownButonLogin');
            elements.classList.remove('show');
        }
        this.router.navigate(['/pages/all-sessions/session-invoice']);
    }

    faq() {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Navigation',
            eventAction: 'FAQ Parent',
            eventLabel: 'Help'
        });
        if (document.getElementById('navbarNavDropdownButonLogin')) {
            let elements = document.getElementById('navbarNavDropdownButonLogin');
            elements.classList.remove('show');
        }
        this.router.navigate(['/pages/faq']);
    }

    checkSuppressCases() {
        if (this.userInfo.partnershipCode && this.userInfo.partnershipCode.length && this.userInfo.partnershipCode[0].isRateChargeSuppress) {
            let length = this.commonService.noOfNonExpiredHours(this.userInfo.parent.sessionCreditsFromExternalApi);
            if (length === 0 && this.userInfo.parent.numberOfTutoringHours > 0) {
                this.dialog.open(NoTodayHourAvailable, {
                    data: {userData: this.userInfo},
                    panelClass: 'contentHieght'
                });
                return true;
            } else {
                if (this.userInfo.parent.numberOfTutoringHours == 0 && !this.userInfo.parent.isParentOutOfTutoringHours) {
                    this.dialog.open(NoHourAvailable, {
                        data: {userData: this.userInfo, bookAgainText: true},
                        panelClass: 'contentHieght'
                    });
                    return true;
                }
            }
        }
    }

    goToBookSesssion() {
        if (this.checkSuppressCases()) {
            return;
        }

        ga('send', {
            hitType: 'event',
            eventCategory: 'Navigation',
            eventAction: 'Book a Session',
            eventLabel: 'Book a Session'
        });
        if (document.getElementById('navbarNavDropdownButonLogin')) {
            let elements = document.getElementById('navbarNavDropdownButonLogin');
            elements.classList.remove('show');
        }
        if (this.login) {

            this.tutorService.getId = '';
            this.sessionService.addedSubjects = '';
            this.sessionService.selectedChild = '';
            this.sessionService.selectedAddress = null;
            this.sessionService.checkedaddress = '';
            this.sessionService.flexibility = '';
            this.allSessionService.setBookAgain('');
            this.sessionService.sessionLengthArray = [];
            this.sessionService.childInformation = '';
            this.sessionService.setSessionLength('1');
            this.sessionService.setDuration(1);
            // this.allSessionService.getId
            this.allSessionService.setBookAgain_address = '';
            localStorage.removeItem('goFromSession');
            if (localStorage.getItem('slotSelected') != undefined) {
                localStorage.removeItem('slotSelected');
            }
            if (localStorage.getItem('PROMOCODE') != undefined) {
                localStorage.removeItem('PROMOCODE');
            }
            if (localStorage.getItem('goBack') != undefined) {
                localStorage.removeItem('goBack');
            }
            if (localStorage.getItem('promoHash') != undefined) {
                localStorage.removeItem('promoHash');
            }
            if (localStorage.getItem('bookingHash') != undefined) {
                localStorage.removeItem('bookingHash');
            }
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

            this.sessionService.flexibility = '';
            // if (localStorage.getItem('steponeData')) {
            //     localStorage.removeItem('steponeData');
            // }

            // this.sessionService.sessionData;
            this.sessionService.selectedAddress_id = '';
            this.sessionService.onlineBooking = false;

            if (this.canBookSession) {
                if (localStorage.getItem('tutor_Id')) {
                    localStorage.removeItem('tutor_Id');
                }
                if (localStorage.getItem('book_again') != undefined) {
                    localStorage.removeItem('book_again');
                }

                this.router.navigate(['/pages/book-session/session']);
            } else {
                let dialogRef = this.dialog.open(CompleteProfileDialog);
            }
        } else {
            let dialogRef = this.dialog.open(LoginDialog);
        }
    }

    ngOnDestroy() {
        this.storeData.unsubscribe();
    }
}



