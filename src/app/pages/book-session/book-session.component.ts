import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroup } from '@angular/forms';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Effect, Actions } from '@ngrx/effects';
 import * as session from './state/book-session.actions';

@Component({
    selector: 'book-session',
    templateUrl: `./book-session.html`
})
export class BookSession {


    constructor(private store: Store<any>, private router: Router) {
     
     }

    ngOnInit() { }

}