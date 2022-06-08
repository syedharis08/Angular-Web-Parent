import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroup } from '@angular/forms';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Effect, Actions } from '@ngrx/effects';
import * as session from './state/session-report.actions';

@Component({
    selector: 'disputes',
    templateUrl: `./disputes.html`
})
export class Disputes {


    constructor(private store: Store<any>, private router: Router) {
        localStorage.removeItem('page');

    }

    ngOnInit() { }

}