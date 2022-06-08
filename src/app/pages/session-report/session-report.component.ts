import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroup } from '@angular/forms';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Effect, Actions } from '@ngrx/effects';
import * as session from './state/session-report.actions';

@Component({
    selector: 'session-report',
    templateUrl: `./session-report.html`
})
export class SessionReport {


    constructor(private store: Store<any>, private router: Router) {
        // window.scroll(0, 0);
        localStorage.removeItem('page');

        let el = $('#moveUp');
        $('html,body').animate({ scrollTop: (el.offset().top - 50) }, 'slow', () => {
          el.focus();
        });
    }

    ngOnInit() { }

}