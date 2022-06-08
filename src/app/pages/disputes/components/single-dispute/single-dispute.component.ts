import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Rx';
import * as disputes from '../../state/disputes.actions';
import 'style-loader!./single-dispute.scss';

@Component({
    selector: 'single-dispute',
    templateUrl: `./single-dispute.html`
})
export class SingleDispute {
    public sessionStore: Subscription;
    public report;
    public dispute;
    public bookingId;
    public subNames = [];
    public dispute_id;

    constructor(private store: Store<any>) {

        if (localStorage.getItem('disputes') && localStorage.getItem('disputes') != undefined) {
            this.dispute_id = localStorage.getItem('disputes');
        }

        if (this.dispute_id != undefined) {
            this.store.dispatch({
                type: disputes.actionTypes.GET_DISPUTE_BY_ID,
                payload: this.dispute_id
            });
        }
        this.sessionStore = this.store
            .select('disputes')
            .subscribe((res: any) => {
                if (res) {
                    if (res.disputeById && res.disputeById != undefined) {
                        this.dispute = res.disputeById[0];
                        this.subNames = [];
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

