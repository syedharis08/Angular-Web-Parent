import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { ParentService } from '../../../services/parent-service/parent.service';
@Injectable()
export class AuthGuardCustomer implements CanActivate {
    constructor(private authService: AuthService, private router: Router, private parentService: ParentService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;
        return this.checkLogin(url);
    }

    // checkAdmin(url): boolean {
    //     if (this.authService.user.role === 'USER') {
    //         return true;
    //     }

    //     return false;
    // }

    checkLogin(url): boolean {

        if (this.authService.login()) {
            return true;
        }

        // Navigate to the login page with extras
        this.router.navigate(['/home']);
        return false;
    }
}


