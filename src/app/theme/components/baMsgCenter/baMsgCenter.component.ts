import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonService } from '../../../services/common.service';
import { BaMsgCenterService } from './baMsgCenter.service';
import * as notification from '../../state/notification.actions';

@Component({
    selector: 'ba-msg-center',
    providers: [BaMsgCenterService],
    styleUrls: ['./baMsgCenter.scss'],
    templateUrl: './baMsgCenter.html'
})
export class BaMsgCenter {

    public notifications;
    public page = 1;
    public limit = 10;
    public count: number;
    public activeNotification;
    public unreadNotificationCount;

    constructor(private _baMsgCenterService: BaMsgCenterService, private commonService: CommonService, private store: Store<any>) {

        this.store
            .select('notification')
            .subscribe((res: any) => {
                this.notifications = res.notifications;
                this.count = res.count;
                this.activeNotification = (res.activeNotification) ? res.activeNotification : null;
                this.unreadNotificationCount = res.unreadNotificationCount;
            });

        this.commonService.getSocketConnection().on('connect', (socket) => {
        });

        this.commonService.getSocketConnection().on('notification', (data) => {
            if (data.notification && data.unreadNotificationCount) {
                this.notifications.unshift(data.notification);
                this.notifications.pop();
                this.store.dispatch({
                    type: notification.actionTypes.PUSH_NOTIFICATION, payload: {
                        notification: this.notifications,
                        unreadNotificationCount: data.unreadNotificationCount
                    }
                });
            }
        });
    }

    read(data) {
        this.store.dispatch({type: notification.actionTypes.READ_NOTIFICATION, payload: data});
    }

}
