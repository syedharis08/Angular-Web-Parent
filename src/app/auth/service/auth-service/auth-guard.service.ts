import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Store } from '@ngrx/store';
import { BaImageLoaderService, BaThemePreloader, BaThemeSpinner } from '../../../theme/services';
import { Subscription } from 'rxjs/Rx';
import * as sessionsDetails from './../../../pages/all-sessions/state/all-sessions.actions';
import { AllSessionService } from '../../../services/all-sessions-service/all-sessions.service';
@Injectable()
export class AuthGuard implements CanActivate {
    public sessionStore: Subscription
    public booking: boolean = false;
    constructor(private authService: AuthService, private router: Router, private store: Store<any>, private _spinner: BaThemeSpinner, private allSession: AllSessionService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;
        return this.checkLogin(url);
    }

    checkLogin(url): boolean {
        if (this.authService.login()) {
            return true;
        }
        // Navigate to the login page with extras
        this.router.navigate(['/home']);
        return false;
    }
    // checkUpcomingBookings() {
    //     this._spinner.show();
    //     // if (this.authService.login()) {
    //         this.allSession.checkBookings().subscribe((result) => {

    //             if (result.statusCode === 200) {
    //                 this._spinner.hide();
    //                 if (result.data != undefined) {
    //                     this.booking=result.data.upcomingSession;
    //                     return this.booking;
    //                 }
    //             }
    //             else {
    //                 this._spinner.hide();
    //                 this.booking=false;
    //                 return this.booking
    //             }

    //         })
    //         this._spinner.hide();
    //         return this.booking
    //     // }

    // }
}


