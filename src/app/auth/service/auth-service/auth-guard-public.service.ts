import { Injectable, OnInit, AfterViewInit } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth-guard.service';
import { AllSessionService } from '../../../services/all-sessions-service/all-sessions.service';
import { Store } from '@ngrx/store';
import { BaImageLoaderService, BaThemePreloader, BaThemeSpinner } from '../../../theme/services';
import { Subscription } from 'rxjs/Rx';
import * as sessionsDetails from './../../../pages/all-sessions/state/all-sessions.actions';

@Injectable()
export class AuthGuardPublic implements CanActivate {
    public booking: boolean = false;
    constructor(private authService: AuthService, private router: Router, private authguard: AuthGuard, private store: Store<any>, private _spinner: BaThemeSpinner, private allSession: AllSessionService) {
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;
        return this.checkLogin(url);
    }

    checkLogin(url): boolean {

        if (this.authService.login()) {

            if (localStorage.getItem('bookingAvailable') != undefined && localStorage.getItem('bookingAvailable') === "true") {
                return true;
            } else {
                return true;
            }


        }
        // Not authorized
        else {
            return true;
        }

    }


}


