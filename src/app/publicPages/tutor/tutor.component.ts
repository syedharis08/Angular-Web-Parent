import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Effect, Actions } from '@ngrx/effects';
//  import * as profile from './state/profile.actions';

@Component({
    selector: 'tutor',
    template: `
    <div>
   
        <router-outlet></router-outlet>

    </div>
    `
})
export class Tutor {


    constructor(private store: Store<any>, private router: Router) {
      
     }

    ngOnInit() { }

}