import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroup } from '@angular/forms';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Effect, Actions } from '@ngrx/effects';
 import * as session from './state/all-sessions.actions';

@Component({
    selector: 'all-sessions',
    templateUrl: `./all-sessions.html`
})
export class AllSession {


    constructor(private store: Store<any>, private router: Router) {
        // window.scroll(0, 0);
        localStorage.removeItem('page');
        
     }

    ngOnInit() { }

}