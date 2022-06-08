import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as app from './app.actions';
import * as auth from '../auth/state/auth.actions';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { cloneDeep, random } from 'lodash';

const types = ['success', 'error', 'info', 'warning'];

@Injectable()
export class AppEffects {
    options: ToastrConfig;
    private lastInserted: number[] = [];
    typeOfUser;
    constructor(
        private toastrService: ToastrService,
        private actions$: Actions,
        private router: Router,
        private activeModal: NgbActiveModal,
        private store: Store<any>,
        // private booking_service:booking_service,

        // private serviceprovider_service:serviceprovider_service,
        //  private driver_service:driver_service,
    ) { }

    @Effect({ dispatch: false })
    redirectDashboard: Observable<Action> = this.actions$
        .ofType(app.actionTypes.APP_REDIRECT_DASHBOARD)
        .do(() => this.router.navigate(['/', 'home']));

    @Effect({ dispatch: false })
    redirectLogin: Observable<Action> = this.actions$
        .ofType(app.actionTypes.APP_REDIRECT_LOGIN)
        .do(() => this.router.navigate(['/', 'login']));

    @Effect({ dispatch: false })
    redirectRouter: Observable<Action> = this.actions$
        .ofType(app.actionTypes.APP_REDIRECT_ROUTER)
        .do(() => this.router.navigate(['/', 'router']));

    @Effect({ dispatch: false })
    appRefresh$ = this.actions$
        .ofType('APP_RELOAD')
        // FIXME: I miss UI-Routers $state.reload() - find an angular way of doing this
        .do(() => window.location.reload());

    @Effect({ dispatch: false })
    appAuthenticationFail$ = this.actions$
        .ofType('APP_AUTHENTICATION_FAIL')
        .do(() => {
            this.store.dispatch(new auth.AuthLogoutAction());
         
        });

    @Effect({ dispatch: false })
    appSideBarChange$ = this.actions$
        .ofType('APP_SIDE_BAR')
        .do(() => {
        });

    @Effect({ dispatch: false })
    appMenuActive$ = this.actions$
        .ofType('APP_ACTIVE_MENU_ITEM')
        .do(() => {
        });

    @Effect({ dispatch: false })
    appInternetNotWorking$ = this.actions$
        .ofType('APP_INTERNET_NOT_WORKING')
        .do((payload) => {
            let message = '<h5>Try</h5><ul><h5><li>Checking the network cables, modem and router</li><li>Reconnecting to Wi-Fi</li></h5></ul>';
            let title = 'No Internet Connection';
            const opt = cloneDeep(this.options);
            this.toastrService.clear();
            const inserted = this.toastrService[types[1]](message, title, opt);
            if (inserted) {
                this.lastInserted.push(inserted.toastId);
            }
        });
}

