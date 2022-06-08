import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Effect, Actions } from '@ngrx/effects';
import * as profile from './state/profile.actions';

@Component({
    selector: 'profile',
    template: `
        <div class="container">

            <router-outlet></router-outlet>

        </div>
    `
})
export class Profile {

    constructor(private store: Store<any>, private router: Router) {
        localStorage.removeItem('page');

    }

    go() {
        this.router.navigate(['/pages/profile/change-password']);
    }

    ngOnInit() {
    }

}
