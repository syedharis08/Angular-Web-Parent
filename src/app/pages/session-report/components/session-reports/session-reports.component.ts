import { Component, OnInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import {
    MatSort,
    MatDialog,
    MatPaginator
} from '@angular/material';
import * as reports from '../../state/session-report.actions';
import * as app from '../../../../state/app.actions';
import { BaThemeSpinner } from '../../../../theme/services';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { TutorService } from '../../../../services/tutor-service/tutor.service';
import { BookSessionService } from '../../../../services/session-service/session.service'
import 'style-loader!./session-reports.scss';
import { Subscription } from 'rxjs/Rx';
import * as moment from 'moment';

@Component({
    selector: 'session-reports',
    templateUrl: './session-reports.html',
})

export class SessionReports {
    public skip: number = 0;
    public page = 1;
    public limit = 5;
    public count = 0;
    public sessionStore: Subscription;
    public reports;
    constructor(
        private store: Store<any>,
        private modalService: NgbModal,
        private router: Router,
        private fb: FormBuilder,
        private toastrService: ToastrService,
        public dialog: MatDialog,
        public tutorService: TutorService,
        public sessionService: BookSessionService,



    ) {
        // window.scroll(0, 0);
        let el = $('#moveUp');
        $('html,body').animate({ scrollTop: (el.offset().top - 50) }, 'slow', () => {
            el.focus();
        });
        this.store.dispatch({
            type: reports.actionTypes.GET_ALL_REPORTS,
            payload: { limit: this.limit, skip: this.skip }

        });
        this.sessionStore = this.store
            .select('reports')
            .subscribe((res: any) => {
                if (res) {
                    this.count = 0;
                    if (res.reports && res.reports != undefined) {
                        if (res.reports.bookings && res.reports.bookings != undefined)
                            this.reports = res.reports.bookings;
                        if (res.reportsCount && res.reportsCount != undefined) {
                            this.count = res.reportsCount.count;
                        }
                    }
                }
            });
    }
    pageChanged(page) {
        // window.scroll(0, 0)
        let el = $('#moveUp');
        $('html,body').animate({ scrollTop: (el.offset().top - 50) }, 'slow', () => {
            el.focus();
        });
        this.page = page;
        this.skip = (this.page - 1) * this.limit;

        this.store.dispatch({
            type: reports.actionTypes.GET_ALL_REPORTS,
            payload: { limit: this.limit, skip: this.skip }

        });

    }
    singleReport(id) {

        localStorage.setItem('report_id', id);
        this.router.navigate(['/pages/session-reports/single-report'])
    }
    selectNo(no) {
        this.limit = no;
        this.store.dispatch({
            type: reports.actionTypes.GET_ALL_REPORTS,
            payload: { limit: this.limit, skip: this.skip }
        });
        // this.store.dispatch({ type: notification.actionTypes.GET_ALL_NOTIFICATIONS, payload: { currentPage: this.page, limit: this.limit } });

    }

    checkTime(startTime) {
        return moment(startTime).format("h:mmA");
        // moment(this.report.endTime).format("h:mmA ");
    }
    checkDate(startTime) {
        if(moment(startTime).month()==4)
        {
            return moment(startTime).format("MMM D, YYYY");

        }
        else
        {
            return moment(startTime).format("MMM. D, YYYY");

        }
        // moment(this.report.endTime).format("h:mmA ");
    }
    checkEndTime(endTime) {
        return moment(endTime).format("h:mmA ");
        //
    }
}
