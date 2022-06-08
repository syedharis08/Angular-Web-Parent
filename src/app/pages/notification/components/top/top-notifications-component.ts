import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../../auth/service/auth-service/auth.service';
import { NotificationService } from '../../../../services/notification-service';
import { BaMsgCenterService } from '../../../../theme/components/baMsgCenter/baMsgCenter.service';
import { DataService } from '../../../../services/data-service/data.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { JwtHelper } from 'angular2-jwt';
import { ConfirmInvitationDialog } from '../../../confirm-invitation-dialog/confirm-invitation-dialog.component';
import * as notification from '../../state/notification.actions';
import { Subscription } from 'rxjs/Rx';

@Component({
    selector: 'top-notification',
    styleUrls: ['top-notifications.scss'],
    templateUrl: './top-notifications.html'
})

export class TopNotifications {

    public notifications = [];
    public toastId;
    public page = 1;
    public limit = 30;
    allNotifications = [];
    notify;
    public count: number;
    public allComingNotifications = [];
    public socketgetNotification;
    public unreadNotificationCount: any;
    public pushedNotifications = [];
    public notificationStore: Subscription;

    constructor(private authService: AuthService,
                private store: Store<any>,
                private toastrService: ToastrService,
                private router: Router,
                // private dataService: DataService,
                private dialog: MatDialog,
                private msgCenter: BaMsgCenterService) {
        this.pushedNotifications = [];
        // if(this.authService.isLoggedIn){
        this.socketgetNotification = this.msgCenter.getNotifications('notification').subscribe((message: any) => {
            this.store.dispatch({
                type: notification.actionTypes.GET_ALL_NOTIFICATIONS,
                payload: {
                    currentPage: this.page,
                    limit: this.limit
                }
            });
        });
        if (this.authService.login()) {
            this.store.dispatch({
                type: notification.actionTypes.GET_ALL_NOTIFICATIONS,
                payload: {
                    currentPage: this.page,
                    limit: this.limit
                }
            });
        }

        this.notificationStore = this.store.select('notification').subscribe((res: any) => {

            if (res.pushedNotification && res.pushedNotification != undefined) {
                this.pushedNotifications = res.pushedNotification.notification;

            }
            this.allComingNotifications = [];
            if (res.allNotifications && res.allNotifications != undefined && res.allNotifications.data && res.allNotifications.data != undefined) {
                this.allComingNotifications = res.allNotifications.data.notifications;
                this.unreadNotificationCount = res.allNotifications.data.unreadCount;

            }
        });


    }

    // clearAllNotification() {
    //     this.store.dispatch({ type: notification.actionTypes.CLEAR_NOTIFICATION });
    // }
    goToAllNotification() {
        // this.store.dispatch({ type: notification.actionTypes.SEE_ALL_NOTIFICATION });
        this.store.dispatch({
            type: notification.actionTypes.SEE_ALL_NOTIFICATION
        });
        if (document.getElementById('navbarNavDropdownButonLogin')) {
            let elements = document.getElementById('navbarNavDropdownButonLogin');
            elements.classList.remove('show');
        }

        this.router.navigate(['/pages/notification/all-notifications']);
    }

    closeMenu() {
        if (document.getElementById('navbarNavDropdownButonLogin')) {
            let elements = document.getElementById('navbarNavDropdownButonLogin');
            elements.classList.remove('show');
        }
    }

    read(data) {
        this.closeMenu();
        let eventType = data.type;
        let id = data._id;
        if (data && data != undefined && data.isRead == false) {
            this.store.dispatch({type: notification.actionTypes.READ_NOTIFICATION, payload: id});
        }
        if (data && data != undefined) {
            switch (eventType) {
                case 'BOOKING_ACCEPTED':
                    this.store.dispatch({type: notification.actionTypes.POPUP_BOOKING_ACCEPTED, payload: data});
                    break;
                case 'CANCEL_BOOKING_BY_TUTOR':
                    this.store.dispatch({
                        type: notification.actionTypes.POPUP_BOOKING_CANCELLED_BY_TUTOR,
                        payload: data
                    });
                    break;
                case 'RESCHEDULE_REQUEST_BY_TUTOR':
                    this.store.dispatch({type: notification.actionTypes.POPUP_RESCHEDULE_REQUEST, payload: data});
                    break;
                case 'CREATE_BOOKING_BY_TUTOR':
                    this.store.dispatch({type: notification.actionTypes.POPUP_RESCHEDULE_REQUEST, payload: data});
                    break;
                case 'RESCHEDULE_ACCEPTED':
                    this.store.dispatch({type: notification.actionTypes.POPUP_BOOKING_ACCEPTED, payload: data});
                    break;
                case 'BOOKING_REJECTED':
                    this.store.dispatch({type: notification.actionTypes.POPUP_BOOKING_REJECTED, payload: data});
                    break;
                case 'RESCHEDULE_REJECTED':
                    this.store.dispatch({type: notification.actionTypes.POPUP_BOOKING_REJECTED, payload: data});
                    break;
                case 'END_SESSION':
                    this.store.dispatch({type: notification.actionTypes.POPUP_RATING, payload: data});
                    break;
                default:
                    this.store.dispatch({type: notification.actionTypes.COMMON_NOTIFICATION_POPUP, payload: data});
                    break;
            }
        } else {
            return;
        }
    }

    ngOnDestroy() {
        if (this.notificationStore) {
            this.notificationStore.unsubscribe();
        }
    }

    getDuration(time) {
        let timeOfEvent = (new Date()).getTime() - (new Date(time)).getTime();
        let timeDiffMinutes = timeOfEvent / 60000;
        let timeDiffhours = timeDiffMinutes / 60;
        let timeDiffDays = timeDiffhours / 24;
        let timeDiffString = timeDiffMinutes.toString();
        if (timeDiffhours < 1) {
            if (timeDiffMinutes < 2) {
                return '1 min';
            } else {
                return Math.floor(timeDiffMinutes).toString() + ' min';
            }
        } else if (timeDiffDays < 1) {
            if (timeDiffhours < 2) {
                return '1 hr';
            } else {
                return Math.floor(timeDiffhours).toString() + ' hrs';
            }
        } else {
            return false;
        }
    }
}

