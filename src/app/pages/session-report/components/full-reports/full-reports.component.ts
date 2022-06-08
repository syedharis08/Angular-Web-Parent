import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {  FormBuilder } from '@angular/forms';
import {  Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { MatDialog } from '@angular/material';
import { CsvService } from 'angular2-json2csv';
import * as sessionsDetails from '../../../all-sessions/state/all-sessions.actions';
import 'style-loader!./full-reports.scss';

@Component({
    selector: 'full-reports',
    templateUrl: `./full-reports.html`
})
export class FullReports {
    public sessionStore: Subscription;
    public report;
    public bookingId;
    public comments: any;

    constructor(private store: Store<any>, private router: Router, private fb: FormBuilder, private dialog: MatDialog, private _csvService: CsvService) {
        if (localStorage.getItem('report_id') && localStorage.getItem('report_id') != undefined) {
            this.bookingId = localStorage.getItem('report_id');
        }
        if (this.bookingId && this.bookingId != undefined) {
            this.store.dispatch({
                type: sessionsDetails.actionTypes.GET_BOOKING_BY_ID,
                payload: this.bookingId
            });
        }

        this.sessionStore = this.store
            .select('sessionsDetails')
            .subscribe((res: any) => {
                if (res) {

                    if (res.bookingById && res.bookingById != undefined && res.bookingById.sessionFeedback != undefined) {
                        if (res.bookingById.sessionFeedback.documents && res.bookingById.sessionFeedback.documents.length > 0) {
                            this.report = res.bookingById.sessionFeedback.documents[0];
                        }
                        this.comments = res.bookingById.sessionFeedback.comments;
                    }
                }
            });

    }

    ngOnInit() {
        // window.scroll(0, 0);
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
    }

    openFeedback() {

    }

    downlad() {
    }

    downloadReport() {
        let a = $('<a/>', {
            style: 'display:none',
            href: this.report.url,
            target: '_blank',
            download: 'parentReport.csv',
        }).appendTo('body');
        a[0].click();
        a.remove();
    }

    ngAfterViewInit() {

    }

}

