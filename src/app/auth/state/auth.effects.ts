import { get } from 'lodash';
import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../service/user-service/user.service';
import { AuthService } from '../service/auth-service/auth.service';

import { BaThemeSpinner } from '../../theme/services';
import { Router } from '@angular/router';
// import { LoaderComponent } from '../model/loader/loader.component';
// import { LoaderService } from '../model/loader/loader.service';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { PopUpService } from '../model/popup/popup.service';
import { PopUpOtpService } from '../model/popup-otp/popup-otp.service';
import { cloneDeep, random } from 'lodash';
import * as app from '../../state/app.actions';
import * as auth from './auth.actions';
import { log } from 'handlebars';
import * as profile from '../../pages/profile/state/profile.actions';
import { MatDialog } from '@angular/material';
import { FindTutor } from '../../publicPages/tutor/components/find-tutor-dialog';
import { ErrorDialog } from '../model/401-error/401-error-dialog.component';
import { CONSTANT } from '../../shared/constant/constant';

declare let ga: Function;
const types = ['success', 'error', 'info', 'warning'];

@Injectable()
export class AuthEffects {
    public storeData;
    public currentUser;
    public get_count;
    public socket;
    @Effect({dispatch: false})
    logout: Observable<Action> = this.actions$
        .ofType(auth.actionTypes.AUTH_LOGOUT)
        .do(() => {
            this.authService.disconnect();
            this.baThemeSpinner.show();
            this.UserService.logoutUser().subscribe((result) => {

                    if (result.statusCode === 200) {
                        this.baThemeSpinner.hide();
                        let expireToken = localStorage.getItem('token');
                        let bookingData = localStorage.getItem('bookingAvailable');
                        localStorage.removeItem('token');
                        if (localStorage.getItem('tutor_Id')) {
                            localStorage.removeItem('tutor_Id');
                        }
                        if (localStorage.getItem('bookingId')) {
                            localStorage.removeItem('bookingId');
                        }
                        if (localStorage.getItem('duration')) {
                            localStorage.removeItem('duration');
                        }
                        if (localStorage.getItem('zip_code')) {
                            localStorage.removeItem('zip_code');
                        }
                        if (localStorage.getItem('fixed_zip_code')) {
                            localStorage.removeItem('fixed_zip_code');
                        }
                        if (localStorage.getItem('token') === undefined) {
                            localStorage.removeItem('token');
                        }
                        if (document.cookie) {
                            let domainParts = window.location.host.split('.');
                            domainParts.shift();
                            let domain = '.' + domainParts.join('.');
                            let expireDate = new Date();
                            let d = expireDate.toUTCString();
                            document.cookie = 'tokenSylvanParent=' + expireToken + ';domain=' + domain + ';expires=' + d + '; SameSite=Strict; secure';
                            document.cookie = 'bookingData=' + bookingData + ';domain=' + domain + ';expires=' + d + '; SameSite=Strict; secure';
                        }
                        this.dialog.closeAll();
                        this.store.dispatch({
                            type: auth.actionTypes.AUTH_LOGOUT_SUCCESS,
                            payload: result
                        });

                    }
                    localStorage.clear();
                }
                , (error) => {
                    localStorage.clear();
                    this.baThemeSpinner.hide();
                    let dialogRef = this.dialog.open(ErrorDialog, {disableClose: true});
                    this.store.dispatch(new auth.AuthLogoutSuccessAction(error));
                }
            );
        });
    @Effect({dispatch: false})
    justlogout: Observable<Action> = this.actions$
        .ofType(auth.actionTypes.JUST_LOGOUT)
        .do(() => {
            this.baThemeSpinner.show();

            this.UserService.logoutUser().subscribe((result) => {

                    if (result.statusCode === 200) {
                        ga('send', {
                            hitType: 'event',
                            eventCategory: 'Navigation',
                            eventAction: 'Sign Out',
                            eventLabel: 'Avatar Sign Out'
                        });
                        this.baThemeSpinner.hide();
                        let expireToken = localStorage.getItem('token');
                        let bookingData = localStorage.getItem('bookingAvailable');

                        if (document.cookie) {
                            let domainParts = window.location.host.split('.');
                            domainParts.shift();
                            let domain = '.' + domainParts.join('.');
                            let expireDate = new Date();
                            let d = expireDate.toUTCString();
                            document.cookie = 'tokenSylvanParent=' + expireToken + ';domain=' + domain + ';expires=' + d + '; SameSite=Strict; secure';
                            document.cookie = 'bookingData=' + bookingData + ';domain=' + domain + ';expires=' + d + '; SameSite=Strict; secure';

                        }
                        localStorage.removeItem('token');
                        this.baThemeSpinner.hide();
                        this.dialog.closeAll();
                        if (process.env.ENV == 'development') {
                            window.location.href = CONSTANT.signInPanelUrlInDev; //dev
                        }
                        if (process.env.ENV == 'test') {
                            window.location.href = CONSTANT.signInPanelUrlInTest; //test
                        }
                        if (process.env.ENV == 'production') {
                            window.location.href = CONSTANT.signInPanelUrlInQual; //prod
                        }
                        if (process.env.ENV == 'demo') {
                            window.location.href = CONSTANT.signInPanelUrlInDemo; //demo
                        }
                        if (process.env.ENV == 'live') {
                            window.location.href = CONSTANT.signInPanelUrlInLive; //live
                        }

                    }
                    localStorage.clear();
                }
                , (error) => {
                    localStorage.clear();
                    this.baThemeSpinner.hide();
                    let dialogRef = this.dialog.open(ErrorDialog, {disableClose: true});
                    this.store.dispatch(new auth.AuthLogoutSuccessAction(error));
                }
            );
        });

    @Effect({dispatch: false})
    logoutSuccess: Observable<Action> = this.actions$
        .ofType(auth.actionTypes.AUTH_LOGOUT_SUCCESS)
        .do(action => {
            let dialogRef = this.dialog.open(ErrorDialog, {disableClose: true});
        });

    @Effect({dispatch: false})
    getCountSuccess: Observable<Action> = this.actions$
        .ofType('GET_COUNT_SUCCESS')
        .do((action) => {
        });

    @Effect({dispatch: false})
    loggedIn: Observable<Action> = this.actions$
        .ofType('AUTH_LOGGED_IN')
        .do((action) => {
        });

    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private dialog: MatDialog,
        public zone: NgZone,
        private UserService: UserService,
        private authService: AuthService,
        private popup: PopUpService,
        private popupOtp: PopUpOtpService,
        private baThemeSpinner: BaThemeSpinner,
        private router: Router,
        private toastrService: ToastrService,
    ) {
        this.storeData = this.store
            .select('auth')
            .subscribe((res: any) => {
                if (res.currentUser) {
                    this.currentUser = res.currentUser;
                }
            });
    }

}

