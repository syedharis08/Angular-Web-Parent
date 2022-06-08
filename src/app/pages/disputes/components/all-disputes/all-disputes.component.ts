import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import * as disputes from '../../state/disputes.actions';

import 'style-loader!./all-disputes.scss';
import { Subscription } from 'rxjs/Rx';

@Component({
    selector: 'all-disputes',
    templateUrl: './all-disputes.html',
})

export class AllDisputes {
    public sessionStore: Subscription;
    public reports;
    public disputes;
    public page = 1;
    public skip = 0;
    public limit = 10;
    public count;

    constructor(
        private store: Store<any>, private modalService: NgbModal, private router: Router,
        public dialog: MatDialog,
    ) {

        this.store.dispatch({
            type: disputes.actionTypes.GET_ALL_DISPUTES,
            payload: {
                skip: this.skip,
                limit: this.limit
            }
        });
        this.sessionStore = this.store
            .select('disputes')
            .subscribe((res: any) => {
                if (res) {

                    if (res.allDisputes && res.allDisputes != undefined && res.allDisputes.disputes != undefined) {
                        this.disputes = res.allDisputes.disputes;

                    }
                    if (res.disputeCount && res.disputeCount != undefined) {
                        this.count = res.disputeCount.count;

                    }
                }
            });
    }

    pageChanged(page) {
        this.page = page;

        this.store.dispatch({
            type: disputes.actionTypes.GET_ALL_DISPUTES,
            payload: {
                skip: this.skip,
                limit: this.limit
            }
        });
        // this.store.dispatch({ type: notification.actionTypes.GET_ALL_NOTIFICATION, payload: { currentPage: this.page, limit: this.limit } });
        // this.store.dispatch({ type: booking.actionTypes.APP_GETALL_BOOKING, payload: {currentPage:this.page,limit:this.limit,type:"all"} })

    }

    selectNo(no) {
        this.limit = no;

        this.store.dispatch({
            type: disputes.actionTypes.GET_ALL_DISPUTES,
            payload: {
                skip: this.skip,
                limit: this.limit
            }
        });

    }

    singleDispute(dispute) {
        localStorage.setItem('disputes', dispute);
        this.router.navigate(['/pages/disputes/single-dispute']);

    }
}
