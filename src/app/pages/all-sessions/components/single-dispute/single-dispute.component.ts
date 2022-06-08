import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {  FormBuilder } from '@angular/forms';
import {  Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { MatDialog } from '@angular/material';
import * as sessionsDetails from './../../state/all-sessions.actions';
import * as moment from 'moment';
import 'style-loader!./single-dispute.scss';

@Component({
    selector: 'single-dispute',
    templateUrl: `./single-dispute.html`
})
export class SingleDispute {
    endTime: string;
    startTime: string;
    public sessionStore: Subscription;
    public report;
    public dispute;
    public bookingId;
    public subNames = [];
    public dispute_id;

    constructor(private store: Store<any>) {
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
        if (localStorage.getItem('bookingId') && localStorage.getItem('bookingId') != undefined) {
            this.dispute_id = localStorage.getItem('bookingId');
        }

        if (this.dispute_id != undefined) {
            this.store.dispatch({
                type: sessionsDetails.actionTypes.GET_DISPUTE_BY_ID,
                payload: this.dispute_id
            });
        }
        this.sessionStore = this.store
            .select('sessionsDetails')
            .subscribe((res: any) => {
                if (res) {
                    if (res.disputeById && res.disputeById != undefined) {
                        this.dispute = res.disputeById[0];
                        if (this.dispute && this.dispute.createdAt) {
                            this.dispute.createdAt = moment.utc(this.dispute.createdAt).format('lll');
                        }
                        this.subNames = [];
                        if (this.dispute != undefined) {
                            this.startTime = moment(this.dispute.bookingId.startTime).format('MMM. D, YYYY | h:mmA');
                            this.endTime = moment(this.dispute.bookingId.endTime).format('h:mmA');
                        }
                        if (this.dispute.bookingId != undefined && this.dispute.bookingId.subjects != undefined) {
                            this.dispute.bookingId.subjects.forEach((element) => {
                                if (element.subcategories && element.subcategories.length > 0) {
                                    this.subNames.push(element.subcategories.name);
                                }
                            });
                        }
                    }
                }
            });
    }

    ngOnInit() {
    }

}

