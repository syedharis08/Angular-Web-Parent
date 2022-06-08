import { BaThemeSpinner } from './../../../../../theme/services/baThemeSpinner/baThemeSpinner.service';
import { CalendarEventService } from './../../../../../services/calender-service/calendar-event.service';
import {  } from './../components/calender-event/calendar-event.service';
import { get } from 'lodash';
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { cloneDeep, random } from 'lodash';
import * as app from '../../../../../state/app.actions';
import * as schedular from './schedular.actions';
import * as session from './../../../state/book-session.actions';

const types = ['success', 'error', 'info', 'warning'];

@Injectable()
export class SchedularEffects {
public step2Data;


    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private router: Router,
        private toastrService: ToastrService,
        private calendarEventService: CalendarEventService,
        private _spinner: BaThemeSpinner
    ) {
    }

}

