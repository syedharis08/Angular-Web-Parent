import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth-guard.service';
import { AllSessionService } from '../../../services/all-sessions-service/all-sessions.service';
@Injectable()
export class AuthGuardDriver implements CanActivate {
    constructor(private authService: AuthService, private router: Router, private sessionService: AllSessionService, private authguard: AuthGuard) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;
        return this.checkLogin(url);
    }

    checkLogin(url): boolean {
        if (this.authService.login()) {
            // if(this.authguard.checkUpcomingBookings){
            //     return true;
            // }
            // this.router.navigate(['/pages/all-sessions/sessions'])
            return true;
        }
        else {

        }

        // Navigate to the login page with extras
        this.router.navigate(['/home']);
        return false;
    }


}


