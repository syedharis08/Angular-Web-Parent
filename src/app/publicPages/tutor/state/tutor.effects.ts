import { Injectable, NgZone } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { TutorService } from '../../../services/tutor-service/tutor.service';
import { AuthService } from '../../../auth/service/auth-service/auth.service';
import { BaThemeSpinner } from '../../../theme/services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as auth from './../../../auth/state/auth.actions';
import * as tutor from './tutor.actions';
import { MatDialog } from '@angular/material';
import { BrowseTuttorError450 } from '../../../auth/model/browse-tutor-450-error/browse-tutor-450-error-dialog.component';
import { BrowseTuttorError451 } from '../../../auth/model/browse-tutor-451-error/browse-tutor-451-error-dialog.component';
import { NoTutorDialog } from '../../../auth/model/no-tutor-dialog/no-tutor-dialog.component';
import { CommonErrorDialog } from '../../../auth/model/common-error-dialog/common-error-dialog';

@Injectable()
export class TutorEffects {
    public storeData;
    public currentUser;
    public get_count;
    public zipcode;
    public tutorId;
    public lat;
    loggedIn_Details;
    public lng;
    public filters: any;
    @Effect({dispatch: false})
    browseTutor$ = this.actions$
        .ofType('BROWSE_TUTORS')
        .do(action => {
            this.get_count = action.payload;
            this.loggedIn_Details = JSON.parse(action.payload.area);
            this.tutorService.browseTutor(action.payload).subscribe((result) => {
                    if (result.statusCode === 200) {

                        localStorage.setItem('zip_code', JSON.stringify(this.loggedIn_Details));
                        this.store.dispatch({
                            type: tutor.actionTypes.SET_ZIPCODE,
                            payload: this.loggedIn_Details.zipCode
                        });
                        this.store.dispatch({
                            type: tutor.actionTypes.BROWSE_TUTOR_SUCCESS,
                            payload: {result: result, countPayload: this.get_count}
                        });
                        if (result.data.length == 0 && (localStorage.getItem('token') === undefined || !localStorage.getItem('token'))) {
                            this.zone.run(() => {
                                let dialogRef = this.dialog.open(NoTutorDialog);
                            });
                        }
                    } else if (result.statusCode === 203) {
                        localStorage.setItem('zip_code', JSON.stringify(this.loggedIn_Details));
                        this.store.dispatch({
                            type: tutor.actionTypes.BROWSE_TUTOR_SUCCESS,
                            payload: {result: result, countPayload: this.get_count}
                        });
                        if (result.data.length == 0 && (localStorage.getItem('token') === undefined || !localStorage.getItem('token'))) {
                            this.zone.run(() => {
                                let dialogRef = this.dialog.open(NoTutorDialog);
                            });
                        }
                        if (result.message != undefined) {
                            this.zone.run(() => {
                                let dialogRef = this.dialog.open(CommonErrorDialog, {
                                    data: {message: result.message}
                                });
                            });
                        }
                    }
                }
                , (error) => {
                    this.baThemeSpinner.hide();
                    this.zone.run(() => {

                    });
                    this.store.dispatch({
                        type: tutor.actionTypes.BROWSE_TUTOR_ERROR,
                        payload: error
                    });
                    if (error.statusCode == 450) {
                        this.zone.run(() => {
                            this.store.dispatch({
                                type: tutor.actionTypes.BROWSE_TUTOR_ERROR,
                                payload: error
                            });

                            let dialogRef = this.dialog.open(BrowseTuttorError450);
                        });
                    } else if (error.statusCode == 451) {
                        this.zone.run(() => {
                            this.store.dispatch({
                                type: tutor.actionTypes.BROWSE_TUTOR_ERROR,
                                payload: error
                            });

                            let dialogRef = this.dialog.open(BrowseTuttorError451);
                        });
                    } else if (error.message != undefined) {
                        this.zone.run(() => {
                            this.store.dispatch({
                                type: tutor.actionTypes.BROWSE_TUTOR_ERROR,
                                payload: error
                            });

                            let dialogRef = this.dialog.open(CommonErrorDialog, {
                                data: {message: error.message}
                            });
                        });
                    }
                }
            );

        });
    @Effect({dispatch: false})
    browseTutorMarket$ = this.actions$
        .ofType('BROWSE_TUTORS_MARKET')
        .do(action => {
            this.get_count = action.payload;
            this.tutorService.browseTutorMarket(action.payload).subscribe((result) => {
                    if (result.statusCode === 200) {
                        this.store.dispatch({
                            type: tutor.actionTypes.BROWSE_TUTORS_MARKET_SUCCESS,
                            payload: {result: result, countPayload: this.get_count}
                        });
                        if (result.data.length == 0 && (localStorage.getItem('token') === undefined || !localStorage.getItem('token'))) {
                            this.zone.run(() => {
                                let dialogRef = this.dialog.open(NoTutorDialog);
                            });
                        }
                    }
                    if (result.statusCode === 203) {
                        this.store.dispatch({
                            type: tutor.actionTypes.BROWSE_TUTORS_MARKET_SUCCESS,
                            payload: {result: result, countPayload: this.get_count}
                        });
                        if (result.data.length == 0 && (localStorage.getItem('token') === undefined || !localStorage.getItem('token'))) {
                            this.zone.run(() => {
                                let dialogRef = this.dialog.open(NoTutorDialog);
                            });
                        }
                        if (result.message != undefined) {
                            this.zone.run(() => {
                                let dialogRef = this.dialog.open(CommonErrorDialog, {
                                    data: {message: result.message}
                                });
                            });
                        }
                    }
                }
                , (error) => {
                    this.baThemeSpinner.hide();
                    this.zone.run(() => {

                    });
                    this.store.dispatch({
                        type: tutor.actionTypes.BROWSE_TUTOR_ERROR,
                        payload: error
                    });

                    if (error.statusCode == 401) {
                        this.store.dispatch(new auth.AuthLogoutAction(error));
                    } else if (error.statusCode == 450) {
                        this.zone.run(() => {
                            let dialogRef = this.dialog.open(BrowseTuttorError450);
                        });
                    } else if (error.statusCode == 451) {
                        this.zone.run(() => {
                            let dialogRef = this.dialog.open(BrowseTuttorError451);
                        });
                    } else if (error.message != undefined) {
                        this.zone.run(() => {
                            let dialogRef = this.dialog.open(CommonErrorDialog, {
                                data: {message: error.message}
                            });
                        });
                    }
                }
            );

        });
    @Effect({dispatch: false})
    browseTutortMarketSuccess: Observable<Action> = this.actions$
        .ofType('BROWSE_TUTORS_MARKET_SUCCESS')
        .do((action) => {
            if (action.payload && action.payload != undefined) {
                this.store.dispatch({
                    type: tutor.actionTypes.GET_MARKET_COUNT,
                    payload: action.payload.countPayload
                });
            }
        });
    @Effect({dispatch: false})
    getMarketCount$ = this.actions$
        .ofType('GET_MARKET_COUNT')
        .do(action => {
            this.tutorService.getMarketCount(action.payload).subscribe((result) => {
                    if (result.statusCode === 200) {
                        this.store.dispatch({
                            type: tutor.actionTypes.GET_MARKET_COUNT_SUCCESS,
                            payload: result
                        });
                    } else {

                    }
                }
                , (error) => {
                    this.baThemeSpinner.hide();
                    // this.toastrService.clear();
                    // this.toastrService.error(error.message || 'User not found', 'Error');
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
    browseError$ = this.actions$
        .ofType('BROWSE_TUTOR_ERROR')
        .do(action => {
            this.store.dispatch({
                type: tutor.actionTypes.BROWSE_TUTOR_ERROR_SUCCESS,
            });
        });
    @Effect({dispatch: false})
    getMarketountSuccess: Observable<Action> = this.actions$
        .ofType('GET_MARKET_COUNT_SUCCESS')
        .do((action) => {
            this.zone.run(() => {
                if (action.payload != undefined && action.payload.data != undefined && action.payload.data.count != undefined && action.payload.data.count > 0) {
                    let count = action.payload.data.count;

                } else {

                }
            });
        });
    @Effect({dispatch: false})
    latLong: Observable<Action> = this.actions$
        .ofType(tutor.actionTypes.AUTH_GET_LAT_LONG)
        .do(action => {
            this.baThemeSpinner.show();
            let zip = action.payload.zip;
            this.filters = action.payload.filters;
            this.tutorService.getLatLong(action.payload.zip).subscribe((result) => {
                    this.baThemeSpinner.hide();
                    if (zip === result.zip_code) {
                        this.lat = result.lat;
                        this.lng = result.lng;
                        this.zipcode = result.zip_code;
                        let locationDetails = {
                            latitude: this.lat,
                            longitude: this.lng,
                            zipCode: this.zipcode,
                        };
                        this.store.dispatch({
                            type: tutor.actionTypes.SET_ZIPCODE,
                            payload: locationDetails.zipCode
                        });
                        this.store.dispatch({
                            type: tutor.actionTypes.AUTH_GET_LAT_LONG_SUCCESS,
                            payload: result
                        });
                    }
                }
                , (error) => {
                    this.baThemeSpinner.hide();
                }
            );
        });
    @Effect({dispatch: false})
    FirstlatLong: Observable<Action> = this.actions$
        .ofType(tutor.actionTypes.FIRST_GET_LAT_LONG)
        .do(action => {
            let zip = action.payload;
            this.tutorService.getLatLong(action.payload).subscribe((result) => {
                    this.baThemeSpinner.hide();
                    if (zip === result.zip_code) {
                        this.lat = result.lat;
                        this.lng = result.lng;
                        this.zipcode = result.zip_code;
                        let locationDetails = {
                            latitude: this.lat,
                            longitude: this.lng,
                            zipCode: this.zipcode,
                        };
                        localStorage.setItem('zip_code', JSON.stringify(locationDetails));
                        this.store.dispatch({
                            type: tutor.actionTypes.FIRST_GET_LAT_LONG_SUCCESS,
                            payload: result
                        });

                    } else {
                    }
                },
                (error) => {
                    this.baThemeSpinner.hide();
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
    getCount$ = this.actions$
        .ofType('GET_COUNT')
        .do(action => {
            this.tutorService.getCount(action.payload.count).subscribe((result) => {
                    if (result.statusCode === 200) {
                        this.store.dispatch({
                            type: tutor.actionTypes.GET_COUNT_SUCCESS,
                            payload: result
                        });
                    } else {

                    }
                }
                , (error) => {
                    this.baThemeSpinner.hide();
                    this.toastrService.clear();
                    this.store.dispatch({
                        type: tutor.actionTypes.BROWSE_TUTOR_ERROR,
                        payload: error
                    });
                    // this.toastrService.error(error.message || 'User not found', 'Error');
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
    getSubjects$ = this.actions$
        .ofType('GET_SUBJECTS')
        .do(action => {
            this.tutorService.getSubjects().subscribe((result) => {
                    if (result.statusCode === 200) {
                        this.store.dispatch({
                            type: tutor.actionTypes.GET_SUBJECTS_SUCCESS,
                            payload: result
                        });
                    } else {
                    }
                }
                , (error) => {
                    this.baThemeSpinner.hide();
                    // this.store.dispatch(new auth.AuthLogoutSuccessAction(error));
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
    getTutosSubjects$ = this.actions$
        .ofType('GET_TUTOR_SUBJECTS')
        .do(action => {
            this.tutorService.getTutorSubjects(action.payload).subscribe((result) => {
                    if (result.statusCode === 200) {
                        this.store.dispatch({
                            type: tutor.actionTypes.GET_TUTOR_SUBJECTS_SUCCESS,
                            payload: result
                        });
                    }

                }
                , (error) => {
                    this.baThemeSpinner.hide();
                    this.store.dispatch(new auth.AuthLogoutSuccessAction(error));
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
    getTutorDetail$ = this.actions$
        .ofType('GET_TUTOR_DETAILS')
        .do(action => {
            this.tutorService.getTutorDetails(action.payload).subscribe((result) => {
                    if (result.statusCode === 200) {
                        this.store.dispatch({
                            type: tutor.actionTypes.GET_TUTOR_DETAILS_SUCCESS,
                            payload: result
                        });
                    } else {
                    }
                }
                , (error) => {
                    this.baThemeSpinner.hide();
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
    getTutorAddressStudents$ = this.actions$
        .ofType('GET_ADDRESS_STUDENTS')
        .do(action => {
            this.tutorService.getTutorAddressStudents(action.payload).subscribe((result) => {
                    if (result.statusCode === 200) {
                        this.store.dispatch({
                            type: tutor.actionTypes.GET_ADDRESS_STUDENTS_SUCCESS,
                            payload: result
                        });
                    } else {
                    }
                }
                , (error) => {
                    this.baThemeSpinner.hide();
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
    getTutorratings$ = this.actions$
        .ofType('GET_TUTOR_RATINGS')
        .do(action => {
            this.tutorId = action.payload.tutorId;
            this.tutorService.getTutorRatings(action.payload).subscribe((result) => {
                    if (result.statusCode === 200) {
                        this.store.dispatch({
                            type: tutor.actionTypes.GET_TUTOR_RATING_SUCCESS,
                            payload: result
                        });
                        this.store.dispatch({
                            type: tutor.actionTypes.GET_TUTOR_RATING_COUNT,
                            payload: this.tutorId
                        });
                    } else {
                    }
                }
                , (error) => {
                    this.baThemeSpinner.hide();
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
    getTutorratingsbyUid$ = this.actions$
        .ofType('GET_TUTOR_RATINGS_BY_UID')
        .do(action => {
            this.tutorId = action.payload.tutorId;
            this.tutorService.getTutorRatingsByUID(action.payload).subscribe((result) => {

                    if (result.statusCode === 200) {
                        this.store.dispatch({
                            type: tutor.actionTypes.GET_TUTOR_RATING_SUCCESS,
                            payload: result
                        });
                        this.store.dispatch({
                            type: tutor.actionTypes.GET_TUTOR_RATING_COUNT_BY_UID,
                            payload: this.tutorId
                        });
                    } else {
                    }
                }
                , (error) => {
                    this.baThemeSpinner.hide();
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
    ratingSuccess$ = this.actions$
        .ofType('GET_TUTOR_RATING_SUCCESS')
        .do(action => {

        });
    @Effect({dispatch: false})
    setZipcode$ = this.actions$
        .ofType('SET_ZIPCODE')
        .do(action => {

        });
    @Effect({dispatch: false})
    ratingCount$ = this.actions$
        .ofType('GET_TUTOR_RATING_COUNT')
        .do(action => {
            this.tutorService.getTutorRatingsCount(action.payload).subscribe((result) => {
                    if (result.statusCode === 200) {
                        this.store.dispatch({
                            type: tutor.actionTypes.GET_TUTOR_RATING_SUCCESS_COUNT,
                            payload: result
                        });
                    } else {
                    }
                }
                , (error) => {
                    this.baThemeSpinner.hide();
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
    ratingCountUId$ = this.actions$
        .ofType('GET_TUTOR_RATING_COUNT_BY_UID')
        .do(action => {
            this.tutorService.getTutorRatingsCountByUId(action.payload).subscribe((result) => {
                    if (result.statusCode === 200) {
                        this.store.dispatch({
                            type: tutor.actionTypes.GET_TUTOR_RATING_SUCCESS_COUNT,
                            payload: result
                        });
                    } else {
                    }
                }
                , (error) => {
                    this.baThemeSpinner.hide();
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
    getCountSuccess: Observable<Action> = this.actions$
        .ofType('GET_COUNT_SUCCESS')
        .do((action) => {
            this.zone.run(() => {
                if (action.payload != undefined && action.payload.data != undefined && action.payload.data.count != undefined && action.payload.data.count > 0) {
                    let count = action.payload.data.count;

                } else {

                }
            });
        });
    @Effect({dispatch: false})
    getTutorDetailSuccess: Observable<Action> = this.actions$
        .ofType('GET_TUTOR_DETAILS_SUCCESS')
        .do((action) => {
        });

    @Effect({dispatch: false})
    lastLongSuccess: Observable<Action> = this.actions$
        .ofType('AUTH_GET_LAT_LONG_SUCCESS')
        .do((action) => {
            let locationDetails = {
                latitude: this.lat,
                longitude: this.lng,
                zipCode: this.zipcode,
            };
            let limit = 10;
            let page = 1;
            let skip = 0;
            this.tutorService.setFilterZipCode(JSON.stringify(locationDetails));
            this.dialog.closeAll();
            this.store.dispatch({
                type: tutor.actionTypes.BROWSE_TUTORS,
                payload: {area: JSON.stringify(locationDetails), limit: limit, skip: skip, filters: this.filters, zipcodeSearch: true, searchType: 'BROWSE_TUTORS'}
            });

        });
    @Effect({dispatch: false})
    fIRSTlastLongSuccess: Observable<Action> = this.actions$
        .ofType('FIRST_GET_LAT_LONG_SUCCESS')
        .do((action) => {
            let locationDetails = {
                latitude: this.lat,
                longitude: this.lng,
                zipCode: this.zipcode,
            };
            let limit = 10;
            let page = 1;
            let skip = 0;
            this.filters.minHourlyRate = 10;
            this.filters.maxHourlyRate = 200;
            this.filters.distance = 100;
            if (locationDetails != undefined) {
                localStorage.setItem('zip_code', JSON.stringify(locationDetails));
            }
            this.store.dispatch({
                type: tutor.actionTypes.SET_ZIPCODE,
                payload: locationDetails.zipCode
            });
            this.dialog.closeAll();
            this.store.dispatch({
                type: tutor.actionTypes.BROWSE_TUTORS,
                payload: {area: JSON.stringify(locationDetails), limit: limit, skip: skip, filters: this.filters, zipcodeSearch: true, searchType: 'BROWSE_TUTORS'}
            });

        });

    @Effect({dispatch: false})
    browseTutortSuccess: Observable<Action> = this.actions$
        .ofType('BROWSE_TUTOR_SUCCESS')
        .do((action) => {
                if (action.payload && action.payload != undefined && action.payload.countPayload != undefined) {
                    this.store.dispatch({
                        type: tutor.actionTypes.GET_COUNT,
                        payload: {count: action.payload.countPayload, searchType: 'BROWSE_TUTORS'}
                    });
                }
            }
            , (error) => {
                this.baThemeSpinner.hide();
                if (error.statusCode == 401) {
                    this.store.dispatch(new auth.AuthLogoutAction(error));
                } else if (error.message) {
                    this.dialog.closeAll();
                    let dialogRef = this.dialog.open(CommonErrorDialog, {
                        data: {message: error.message}
                    });
                }

            });

    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private tutorService: TutorService,
        private authService: AuthService,
        public zone: NgZone,
        // private breadcrumbService: BreadcrumbService,
        private baThemeSpinner: BaThemeSpinner,
        private router: Router,
        private toastrService: ToastrService,
        private dialog: MatDialog,
    ) {
        this.filters = {};
        this.storeData = this.store
            .select('auth')
            .subscribe((res: any) => {
                if (res.currentUser) {
                    this.currentUser = res.currentUser;
                }
            });
    }

}

