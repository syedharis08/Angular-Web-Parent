import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ParentService } from '../../../services/parent-service/parent.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as profile from './profile.actions';
import * as auth from '../../../auth/state/auth.actions';
import { BaThemeSpinner } from '../../../theme/services';
import { MatDialog } from '@angular/material';
import { PopUpOtpService } from '../../../auth/model/popup-otp/popup-otp.service';
import { PopUpService } from '../../../auth/model/popup/popup.service';
import { CommonErrorDialog } from '../../../auth/model/common-error-dialog/common-error-dialog';

@Injectable()
export class ProfileEffects {

    newPhone: any;
    public newEmail;
    childAdress: boolean = false;

    @Effect({dispatch: false})
    getparentProfile$ = this.actions$
        .ofType('GET_PARENT_PROFILE')
        .do((action) => {
            this._spinner.show();
            this.parentService.getProfile(action.payload).subscribe((result) => {
                    this._spinner.hide();
                    if (result.statusCode == 200) {
                        if (result.data && result.data != undefined) {
                            localStorage.setItem('parentId', result.data._id);
                            localStorage.setItem('timezoneOffsetZone', result.data.metaData.timezoneOffsetZone);
                        }
                        if (result.data && result.data != undefined && result.data.students && result.data.students != undefined && result.data.students.length > 0 && result.data.parent && result.data.parent != undefined && result.data.parent.addresses && result.data.parent.addresses.length > 0) {
                            this.parentService.childAdress = true;
                        }

                        this.store.dispatch({
                            type: profile.actionTypes.GET_PARENT_PROFILE_SUCCESS,
                            payload: result
                        });
                    }
                }, (error) => {
                    this._spinner.hide();
                    if (error.statusCode == 401) {
                        this.store.dispatch(new auth.AuthLogoutAction(error));
                    } else if (error.message != undefined) {
                        let dialogRef = this.dialog.open(CommonErrorDialog, {
                            data: {message: error.message}
                        });
                    }
                });
        });

    @Effect({dispatch: false})
    updateProfile$ = this.actions$
        .ofType('UPDATE_PARENT_PROFILE')
        .do((action) => {
            this._spinner.show();
            this.newEmail = action.payload.changedEmail;
            this.newPhone = action.payload.changedPhoneNumber;
            this.parentService.updateProfile(action.payload.updates).subscribe((result) => {
                    this._spinner.hide();
                    if (result.statusCode == 200) {
                        ga('send', {
                            hitType: 'event',
                            eventCategory: 'Parent Profile',
                            eventAction: 'Save Profile ',
                            eventLabel: 'Save Profile '
                        });
                        if (result && result.data) {
                            if (this.newPhone) {
                                this.popupOtp.showPopup('We need to verify your phone number');
                            } else if (this.newEmail) {
                                this.popup.showPopup('error-custom', 3000, 'Verify Account', false);
                            }
                            this.store.dispatch({
                                type: profile.actionTypes.UPDATE_PARENT_PROFILE_SUCCESS,
                                payload: result
                            });
                        }
                    }
                }, (error) => {
                    this._spinner.hide();
                    if (error.statusCode == 401) {
                        this.store.dispatch(new auth.AuthLogoutAction(error));
                    } else if (error.message != undefined) {
                        let dialogRef = this.dialog.open(CommonErrorDialog, {
                            data: {message: error.message}
                        });
                    }
                }
            );
        });
    @Effect({dispatch: false})
    OTP: Observable<Action> = this.actions$
        .ofType(profile.actionTypes.AUTH_OTP)
        .do(action => {
            this._spinner.show();
            this.parentService.otp(action.payload).subscribe((result) => {
                    this._spinner.hide();
                    if (result.statusCode === 200) {
                        // this.toastrService.clear();
                        // this.toastrService.success(result.message || 'OTP is Verified', 'Success');
                        this.store.dispatch({
                            type: profile.actionTypes.AUTH_OTP_SUCCESS,
                            payload: result
                        });

                    } else {
                    }
                }
                , (error) => {
                    // this.popupOtp.hidePopup();
                    this.store.dispatch({
                        type: profile.actionTypes.CLEAN_FIELD,
                    });
                    this._spinner.hide();
                    if (error.statusCode == 401) {
                        this.store.dispatch(new auth.AuthLogoutAction(error));
                    } else if (error.message != undefined) {
                        let dialogRef = this.dialog.open(CommonErrorDialog, {
                            data: {message: error.message}
                        });
                    }
                    // this.toastrService.error(error.message || 'Wrong OTP', 'Error');
                    // this.store.dispatch(new auth.AuthLogoutAction(error));

                }
            );
        });
    @Effect({dispatch: false})
    faq: Observable<Action> = this.actions$
        .ofType(profile.actionTypes.FAQ)
        .do(action => {
            this._spinner.show();
            this.parentService.faq().subscribe((result) => {
                    this._spinner.hide();
                    if (result.statusCode === 200) {
                        this.store.dispatch({
                            type: profile.actionTypes.FAQ_SUCCESS,
                            payload: result.data
                        });
                    } else {
                    }
                }
                , (error) => {
                    this._spinner.hide();
                    if (error.statusCode == 401) {
                        this.store.dispatch(new auth.AuthLogoutAction(error));
                    } else if (error.message != undefined) {
                        let dialogRef = this.dialog.open(CommonErrorDialog, {
                            data: {message: error.message}
                        });
                    }
                }
            );
        });

    @Effect({dispatch: false})
    updatePassword: Observable<Action> = this.actions$
        .ofType(profile.actionTypes.UPDATE_PASSWORD)
        .do(action => {
            this._spinner.show();
            this.parentService.updatePassword(action.payload).subscribe((result) => {
                    this._spinner.hide();
                    if (result.statusCode === 200) {
                        let dialogRef = this.dialog.open(CommonErrorDialog, {
                            data: {message: 'Your password has been successfully updated.'}
                        });
                        this.store.dispatch({
                            type: profile.actionTypes.UPDATE_PASSWORD_SUCCESS,
                            payload: result
                        });
                    } else {
                    }
                }, (error) => {
                    this._spinner.hide();
                    if (error.statusCode == 401) {
                        this.store.dispatch(new auth.AuthLogoutAction(error));
                    } else if (error.message != undefined) {
                        let dialogRef = this.dialog.open(CommonErrorDialog, {
                            data: {message: error.message}
                        });
                    }
                }
            );
        });

    @Effect({dispatch: false})
    OtpSuccess: Observable<Action> = this.actions$
        .ofType(profile.actionTypes.AUTH_OTP_SUCCESS)
        .do((action) => {
            this.popupOtp.hidePopup();
            if (this.newEmail && this.newEmail != undefined) {
                this.popup.showPopup('error-custom', 3000, 'Verify Account', false);
            }
            let fd = new FormData();
            fd.append('deviceType', 'WEB');
            this.store.dispatch({
                type: profile.actionTypes.GET_PARENT_PROFILE,
                payload: fd
            });
        });

    @Effect({dispatch: false})
    AddAddrses: Observable<Action> = this.actions$
        .ofType(profile.actionTypes.ADD_ADDRESS)
        .do(action => {
            this._spinner.show();
            this.parentService.addAddress(action.payload).subscribe((result) => {
                    this._spinner.hide();
                    if (result.statusCode === 200) {
                        ga('send', {
                            hitType: 'event',
                            eventCategory: 'Add Location',
                            eventAction: 'Save Location',
                            eventLabel: 'Save Location'
                        });
                        this.store.dispatch({
                            type: profile.actionTypes.ADDRESS_ADD_SUCCESS,
                            payload: result
                        });

                    } else {
                    }
                }
                , (error) => {
                    this._spinner.hide();
                    this.dialog.closeAll();
                    if (error.statusCode == 401) {
                        this.store.dispatch(new auth.AuthLogoutAction(error));
                    } else if (error.statusCode == 400) {
                        if (error.message != undefined) {
                            let dialogRef = this.dialog.open(CommonErrorDialog, {
                                data: {message: error.message}
                            });
                        }
                    } else {
                        let dialogRef = this.dialog.open(CommonErrorDialog, {
                            data: {message: error.message}
                        });
                    }

                }
            );
        });
    @Effect({dispatch: false})
    getRefferal: Observable<Action> = this.actions$
        .ofType(profile.actionTypes.GET_REFERRAL_AMOUNT)
        .do(action => {
            this._spinner.show();
            this.parentService.getRefferal().subscribe((result) => {
                    this._spinner.hide();
                    if (result.statusCode === 200) {
                        this.store.dispatch({
                            type: profile.actionTypes.GET_REFERRAL_AMOUNT_SUCCESS,
                            payload: result.data
                        });
                    } else {
                    }
                }
                , (error) => {
                    this._spinner.hide();
                    if (error.statusCode == 401) {
                        this.store.dispatch(new auth.AuthLogoutAction(error));
                    } else if (error.message != undefined) {
                        let dialogRef = this.dialog.open(CommonErrorDialog, {
                            data: {message: error.message}
                        });
                    }
                }
            );
        });

    @Effect({dispatch: false})
    EditAddrses: Observable<Action> = this.actions$
        .ofType(profile.actionTypes.EDIT_ADDRESS)
        .do(action => {
            this._spinner.show();
            this.parentService.editAddress(action.payload).subscribe((result) => {
                    this._spinner.hide();
                    if (result.statusCode === 200) {
                        if (localStorage.getItem('editAddressId')) {
                            localStorage.removeItem('editAddressId');
                        }
                        this.store.dispatch({
                            type: profile.actionTypes.EDIT_ADDRESS_SUCCESS,
                            payload: result
                        });
                    }
                }, (error) => {
                    this._spinner.hide();
                    if (error.statusCode == 401) {
                        this.store.dispatch(new auth.AuthLogoutAction(error));
                    } else if (error.statusCode == 400) {
                        this.dialog.closeAll();
                        if (error.message != undefined) {
                            let dialogRef = this.dialog.open(CommonErrorDialog, {
                                data: {message: error.message}
                            });
                        }
                    } else {
                        let dialogRef = this.dialog.open(CommonErrorDialog, {
                            data: {message: error.message}
                        });
                    }

                }
            );
        });
    @Effect({dispatch: false})
    updateProfileSuccess$ = this.actions$
        .ofType('UPDATE_PARENT_PROFILE_SUCCESS')
        .do((action) => {
            let fd = new FormData();
            fd.append('deviceType', 'WEB');
            this.store.dispatch({
                type: profile.actionTypes.GET_PARENT_PROFILE,
                payload: fd
            });

        });
    @Effect({dispatch: false})
    updatePasswordSuccess$ = this.actions$
        .ofType('UPDATE_PASSWORD_SUCCESS')
        .do((action) => {

            this.router.navigate(['/pages/profile/parent-profile']);

        });
    @Effect({dispatch: false})
    gottoBrowseTutor$ = this.actions$
        .ofType('GO_TO_BROWSE_TUTOR')
        .do((action) => {
            this.router.navigate(['/home/browse-tutor']);
        });
    @Effect({dispatch: false})
    addSuccess$ = this.actions$
        .ofType('ADDRESS_ADD_SUCCESS')
        .do((action) => {
            this.dialog.closeAll();
            if (localStorage.getItem('addSessionAddress') && localStorage.getItem('addSessionAddress') === 'true') {
                localStorage.removeItem('addSessionAddress');
                this.router.navigate(['/pages/book-session/session']);

            } else {
                this.router.navigate(['/pages/profile/parent-profile']);
            }
        });

    @Effect({dispatch: false})
    editSuccess$ = this.actions$
        .ofType('EDIT_ADDRESS_SUCCESS')
        .do((action) => {
            this.dialog.closeAll();
            if (localStorage.getItem('editAddressId')) {
                localStorage.removeItem('editAddressId');
            }

            this.router.navigate(['/pages/profile/parent-profile']);

        });

    @Effect({dispatch: false})
    resendOtp: Observable<Action> = this.actions$
        .ofType(profile.actionTypes.AUTH_RESEND_OTP)
        .do((action: any) => {
            this._spinner.show();
            this.parentService.resendOtp(action.payload).subscribe((result) => {
                    this._spinner.hide();
                    if (result.statusCode === 200 || result.statusCode === 201) {
                        this.store.dispatch({
                            type: profile.actionTypes.CLEAN_FIELD,
                        });
                        // this.toastrService.clear();
                        // this.toastrService.success(result.message || 'OTP sent', 'Success');
                    } else {
                        this.popupOtp.hidePopup();

                    }
                }
                , (error) => {
                    this._spinner.hide();
                    this.popupOtp.hidePopup();
                    if (error.statusCode == 401) {
                        this.store.dispatch(new auth.AuthLogoutAction(error));
                    }
                    this.store.dispatch({
                        type: profile.actionTypes.CLEAN_FIELD
                    });

                }
            );
        });

    @Effect({dispatch: false})
    resendOtpSuccess: Observable<Action> = this.actions$
        .ofType(profile.actionTypes.AUTH_RESEND_OTP_SUCCESS)
        .do((action: any) => {
            this.popupOtp.hidePopup();
        });
    @Effect({dispatch: false})
    addChild$ = this.actions$
        .ofType('ADD_CHILD')
        .do((action) => {
            this._spinner.show();
            this.parentService.addChild(action.payload).subscribe((result) => {

                    this._spinner.hide();
                    if (result.statusCode == 200) {

                        ga('send', {
                            hitType: 'event',
                            eventCategory: 'Add Child',
                            eventAction: 'Save Child',
                            eventLabel: 'Save Child'
                        });

                        this.store.dispatch({
                            type: profile.actionTypes.ADD_CHILD_SUCCESS,
                            payload: result
                        });

                    } else {

                    }

                }
                , (error) => {
                    this._spinner.hide();
                    if (error.statusCode == 401) {
                        this.store.dispatch(new auth.AuthLogoutAction(error));
                    } else if (error.message != undefined) {
                        let dialogRef = this.dialog.open(CommonErrorDialog, {
                            data: {message: error.message}
                        });
                    }
                }
            );
        });
    @Effect({dispatch: false})
    deleteChild: Observable<Action> = this.actions$
        .ofType(profile.actionTypes.DELETE_CHILD)
        .do((action: any) => {
            this._spinner.show();
            this.parentService.deleteChild(action.payload).subscribe((result) => {
                    this._spinner.hide();
                    if (result.statusCode === 200 || result.statusCode === 201) {
                        this.dialog.closeAll();
                        let fd = new FormData();
                        fd.append('deviceType', 'WEB');
                        this.store.dispatch({
                            type: profile.actionTypes.GET_PARENT_PROFILE,
                            payload: fd
                        });
                    } else {
                    }
                }
                , (error) => {
                    this.dialog.closeAll();
                    this._spinner.hide();

                    if (error.statusCode == 401) {
                        this.store.dispatch(new auth.AuthLogoutAction(error));
                    } else if (error.message != undefined) {
                        let dialogRef = this.dialog.open(CommonErrorDialog, {
                            data: {message: error.message}
                        });
                    }

                }
            );
        });
    @Effect({dispatch: false})
    addChildSuccess$ = this.actions$
        .ofType('ADD_CHILD_SUCCESS')
        .do((action) => {
            this.dialog.closeAll();
            if (localStorage.getItem('goFromSession') && localStorage.getItem('goFromSession') === 'true') {
                localStorage.removeItem('goFromSession');
                this.router.navigate(['/pages/book-session/session']);

            } else {
                this.router.navigate(['/pages/profile/parent-profile']);
                let fd = new FormData();
                fd.append('deviceType', 'WEB');
                this.store.dispatch({
                    type: profile.actionTypes.GET_PARENT_PROFILE,
                    payload: fd
                });
            }

        });
    @Effect({dispatch: false})
    deleteAddress: Observable<Action> = this.actions$
        .ofType(profile.actionTypes.DELETE_ADDRESS)
        .do((action: any) => {
            this._spinner.show();
            this.parentService.deleteAddress(action.payload).subscribe((result) => {
                    this._spinner.hide();
                    if (result.statusCode === 200 || result.statusCode === 201) {
                        this.dialog.closeAll();
                        let fd = new FormData();
                        fd.append('deviceType', 'WEB');
                        this.store.dispatch({
                            type: profile.actionTypes.GET_PARENT_PROFILE,
                            payload: fd
                        });
                    } else {
                    }
                }
                , (error) => {
                    this._spinner.hide();
                    if (error.statusCode == 401) {
                        this.store.dispatch(new auth.AuthLogoutAction(error));
                    } else if (error.message) {
                        this.dialog.closeAll();
                        let dialogRef = this.dialog.open(CommonErrorDialog, {
                            data: {message: error.message}
                        });
                    }
                }
            );
        });
    @Effect({dispatch: false})
    editChild$ = this.actions$
        .ofType('EDIT_CHILD')
        .do((action) => {
            this._spinner.show();
            this.parentService.editChild(action.payload).subscribe((result) => {
                    this._spinner.hide();
                    if (result.statusCode == 200) {
                        this.dialog.closeAll();
                        this.store.dispatch({
                            type: profile.actionTypes.EDIT_CHILD_SUCCESS,
                            payload: result
                        });

                    }
                }
                , (error) => {
                    this._spinner.hide();
                    if (error.statusCode == 401) {
                        this.store.dispatch(new auth.AuthLogoutAction(error));
                    } else if (error.message) {
                        this.dialog.closeAll();
                        let dialogRef = this.dialog.open(CommonErrorDialog, {
                            data: {message: error.message}
                        });
                    }

                }
            );
        });
    @Effect({dispatch: false})
    editChildSuccess$ = this.actions$
        .ofType('EDIT_CHILD_SUCCESS')
        .do((action) => {
            let fd = new FormData();
            fd.append('deviceType', 'WEB');
            this.store.dispatch({
                type: profile.actionTypes.GET_PARENT_PROFILE,
                payload: fd
            });
            setTimeout(() => {
                this.router.navigate(['/pages/profile/parent-profile']);

            }, 1);
            this.parentService.profileData = undefined;

        });

    constructor(
        private actions$: Actions,
        public zone: NgZone,
        private store: Store<any>,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private toastrService: ToastrService,
        private parentService: ParentService,
        private _spinner: BaThemeSpinner,
        private dialog: MatDialog,
        private popupOtp: PopUpOtpService,
        private popup: PopUpService
    ) {
    }

}

