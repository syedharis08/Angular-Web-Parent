import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ContactTutorDialog } from '../../../all-sessions/components/contact-tutor/contact-tutordialog.component';
import { AuthService } from '../../../../auth/service/auth-service/auth.service';
import * as notification from '../../state/notification.actions';
import 'style-loader!./all-notifications.scss';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import { AllSessionService } from '../../../../services/all-sessions-service/all-sessions.service';

@Component({
    selector: 'all-notifications',
    templateUrl: 'all-notifications.html',
})
export class AllNotifications {

    public notifications;
    public page = 1;
    public limit = 10;
    public pageIndex = 0;
    public count: number;
    public allNotifications;
    public unreadNotificationCount;
    public startTime;
    public endTime;
    public length;
    public notificationsArray = [];
    public notify: any;
    public pageSizeOptions = [25, 50, 100, 500];

    constructor(private store: Store<any>,
                private router: Router,
                private dialog: MatDialog,
                private authService: AuthService,
                private sessionService: AllSessionService
    ) {
        localStorage.removeItem('page');

        ga('send', {
            hitType: 'event',
            eventCategory: 'Navigation',
            eventAction: 'Notifications Inbox',
            eventLabel: 'Notifications Inbox'
        });
        // window.scroll(0, 0);

        // this.limit = this.pageSize;
        if (this.authService.isLoggedIn) {
            this.store.dispatch({
                type: notification.actionTypes.GET_ALL_NOTIFICATIONS,
                payload: {
                    currentPage: this.page,
                    limit: this.limit
                }
            });
        }
        this.store
            .select('notification')
            .subscribe((res: any) => {
                if (res.allNotifications && res.allNotifications != undefined) {
                    if (res.allNotifications.data && res.allNotifications.data != undefined) {
                        this.allNotifications = res.allNotifications.data.notifications;
                        this.count = res.allNotifications.data.totalCount;
                    }
                    this.notificationsArray = [];
                    if (this.allNotifications && this.allNotifications != undefined) {
                        this.allNotifications.forEach((element) => {
                            this.notify = {
                                notifications: '',
                                startTime: '',
                                endTime: '',
                            };
                            this.notify.notifications = element;
                            let title = element.type;
                            if (element != undefined && element.booking != undefined) {
                                switch (title) {
                                    case 'RESCHEDULE_ACCEPTED_BY_TUTOR': {
                                        if (moment(element.booking.startTime).month() == 4) {
                                            this.notify.startTime = moment(element.booking.startTime).format('MMM D, YYYY | h:mmA');
                                        } else {
                                            this.notify.startTime = moment(element.booking.startTime).format('MMM. D, YYYY | h:mmA');
                                        }
                                        this.notify.endTime = moment(element.booking.endTime).format('h:mmA ');
                                        break;
                                    }
                                    case 'CANCEL_BOOKING_BY_PARENT': {
                                        if (moment(element.booking.startTime).month() == 4) {
                                            this.notify.startTime = moment(element.booking.startTime).format('MMM D, YYYY | h:mmA');
                                        } else {
                                            this.notify.startTime = moment(element.booking.startTime).format('MMM. D, YYYY | h:mmA');
                                        }
                                        this.notify.endTime = moment(element.booking.endTime).format('h:mmA ');
                                        break;
                                    }
                                    case 'RESCHEDULE_REQUEST_BY_PARENT': {
                                        this.notify.startTime = moment(element.booking.startTime).format('MMM. D, YYYY | h:mmA');
                                        if (moment(element.booking.startTime).month() == 4) {
                                            this.notify.startTime = moment(element.booking.startTime).format('MMM D, YYYY | h:mmA');
                                        } else {
                                            this.notify.startTime = moment(element.booking.startTime).format('MMM. D, YYYY | h:mmA');
                                        }
                                        this.notify.endTime = moment(element.booking.endTime).format('h:mmA ');
                                        break;
                                    }
                                    case 'START_SESSION': {
                                        if (moment(element.booking.sessionStartTime ? element.booking.sessionStartTime : element.booking.startTime).month() == 4) {
                                            this.notify.startTime = moment(element.booking.sessionStartTime ? element.booking.sessionStartTime : element.booking.startTime).format('MMM D, YYYY | h:mmA');
                                        } else {
                                            this.notify.startTime = moment(element.booking.sessionStartTime ? element.booking.sessionStartTime : element.booking.startTime).format('MMM. D, YYYY | h:mmA');
                                        }
                                        this.notify.endTime = '';
                                        break;
                                    }
                                    case 'ON_THE_WAY': {
                                        this.notify.startTime = moment(element.booking.startTime).format('MMM. D, YYYY | h:mmA');
                                        if (moment(element.booking.startTime).month() == 4) {
                                            this.notify.startTime = moment(element.booking.startTime).format('MMM D, YYYY | h:mmA');
                                        } else {
                                            this.notify.startTime = moment(element.booking.startTime).format('MMM. D, YYYY | h:mmA');
                                        }
                                        this.notify.endTime = moment(element.booking.endTime).format('h:mmA ');
                                        break;
                                    }
                                    case 'END_SESSION': {
                                        if (moment(element.booking.sessionStartTime ? element.booking.sessionStartTime : element.booking.startTime).month() == 4) {
                                            this.notify.startTime = moment(element.booking.sessionStartTime ? element.booking.sessionStartTime : element.booking.startTime).format('MMM D, YYYY | h:mmA');

                                        } else {
                                            this.notify.startTime = moment(element.booking.sessionStartTime ? element.booking.sessionStartTime : element.booking.startTime).format('MMM. D, YYYY | h:mmA');

                                        }
                                        this.notify.endTime = moment(element.booking.sessionEndTime ? element.booking.sessionEndTime : element.booking.endTime).format('h:mmA ');
                                        break;
                                    }
                                    case 'RAISE_DISPUTE': {
                                        if (moment(element.booking.sessionStartTime ? element.booking.sessionStartTime : element.booking.startTime).month() == 4) {
                                            this.notify.startTime = moment(element.booking.sessionStartTime ? element.booking.sessionStartTime : element.booking.startTime).format('MMM D, YYYY | h:mmA');

                                        } else {
                                            this.notify.startTime = moment(element.booking.sessionStartTime ? element.booking.sessionStartTime : element.booking.startTime).format('MMM. D, YYYY | h:mmA');

                                        }
                                        this.notify.endTime = moment(element.booking.sessionEndTime ? element.booking.sessionEndTime : element.booking.endTime).format('h:mmA ');
                                        break;
                                    }
                                    case 'SESSION_FEEDBACK': {
                                        if (moment(element.booking.sessionStartTime ? element.booking.sessionStartTime : element.booking.startTime).month() == 4) {
                                            this.notify.startTime = moment(element.booking.sessionStartTime ? element.booking.sessionStartTime : element.booking.startTime).format('MMM D, YYYY | h:mmA');

                                        } else {
                                            this.notify.startTime = moment(element.booking.sessionStartTime ? element.booking.sessionStartTime : element.booking.startTime).format('MMM. D, YYYY | h:mmA');

                                        }
                                        this.notify.endTime = moment(element.booking.sessionEndTime ? element.booking.sessionEndTime : element.booking.endTime).format('h:mmA ');
                                        break;
                                    }
                                    case 'RATING': {
                                        if (moment(element.booking.sessionStartTime ? element.booking.sessionStartTime : element.booking.startTime).month() == 4) {
                                            this.notify.startTime = moment(element.booking.sessionStartTime ? element.booking.sessionStartTime : element.booking.startTime).format('MMM D, YYYY | h:mmA');

                                        } else {
                                            this.notify.startTime = moment(element.booking.sessionStartTime ? element.booking.sessionStartTime : element.booking.startTime).format('MMM. D, YYYY | h:mmA');

                                        }
                                        this.notify.endTime = moment(element.booking.sessionEndTime ? element.booking.sessionEndTime : element.booking.endTime).format('h:mmA ');
                                        break;
                                    }
                                    case 'BOOKING_COMPLETED': {
                                        if (moment(element.booking.sessionStartTime ? element.booking.sessionStartTime : element.booking.startTime).month() == 4) {
                                            this.notify.startTime = moment(element.booking.sessionStartTime ? element.booking.sessionStartTime : element.booking.startTime).format('MMM D, YYYY | h:mmA');

                                        } else {
                                            this.notify.startTime = moment(element.booking.sessionStartTime ? element.booking.sessionStartTime : element.booking.startTime).format('MMM. D, YYYY | h:mmA');

                                        }
                                        this.notify.endTime = moment(element.booking.sessionEndTime ? element.booking.sessionEndTime : element.booking.endTime).format('h:mmA ');
                                        break;
                                    }
                                    case 'SESSION_REMINDER_BEFORE_48_HOURS': {
                                        this.notify.startTime = moment(element.booking.startTime).format('MMM. D, YYYY | h:mmA');
                                        if (moment(element.booking.startTime).month() == 4) {
                                            this.notify.startTime = moment(element.booking.startTime).format('MMM D, YYYY | h:mmA');

                                        } else {
                                            this.notify.startTime = moment(element.booking.startTime).format('MMM. D, YYYY | h:mmA');

                                        }
                                        this.notify.endTime = moment(element.booking.endTime).format('h:mmA ');
                                        break;
                                    }
                                    case 'PARENT_NO_SHOW': {
                                        this.notify.startTime = moment(element.booking.startTime).format('MMM. D, YYYY | h:mmA');
                                        if (moment(element.booking.startTime).month() == 4) {
                                            this.notify.startTime = moment(element.booking.startTime).format('MMM D, YYYY | h:mmA');

                                        } else {
                                            this.notify.startTime = moment(element.booking.startTime).format('MMM. D, YYYY | h:mmA');

                                        }
                                        this.notify.endTime = moment(element.booking.endTime).format('h:mmA ');
                                        break;
                                    }
                                    case 'PARENT_LATE_CANCELLATION': {
                                        this.notify.startTime = moment(element.booking.startTime).format('MMM. D, YYYY | h:mmA');
                                        if (moment(element.booking.startTime).month() == 4) {
                                            this.notify.startTime = moment(element.booking.startTime).format('MMM D, YYYY | h:mmA');

                                        } else {
                                            this.notify.startTime = moment(element.booking.startTime).format('MMM. D, YYYY | h:mmA');

                                        }
                                        this.notify.endTime = moment(element.booking.endTime).format('h:mmA ');
                                        break;
                                    }
                                    case 'CREDIT_CARD_CHARGED_AFTER_24_HOURS': {
                                        this.notify.startTime = moment(element.booking.startTime).format('MMM. D, YYYY | h:mmA');
                                        if (moment(element.booking.startTime).month() == 4) {
                                            this.notify.startTime = moment(element.booking.startTime).format('MMM D, YYYY | h:mmA');

                                        } else {
                                            this.notify.startTime = moment(element.booking.startTime).format('MMM. D, YYYY | h:mmA');

                                        }
                                        this.notify.endTime = moment(element.booking.endTime).format('h:mmA ');
                                        break;
                                    }

                                    default: {
                                        this.notify.startTime = moment(element.booking.startTime).format('MMM. D, YYYY | h:mmA');
                                        if (moment(element.booking.startTime).month() == 4) {
                                            this.notify.startTime = moment(element.booking.startTime).format('MMM D, YYYY | h:mmA');

                                        } else {
                                            this.notify.startTime = moment(element.booking.startTime).format('MMM. D, YYYY | h:mmA');

                                        }
                                        this.notify.endTime = moment(element.booking.endTime).format('h:mmA ');
                                        break;
                                    }

                                }
                            }
                            this.notificationsArray.push(this.notify);
                        });
                    }
                }
            });
    }

    getDetails(data) {
        this.sessionService.bookingId = data;
        localStorage.setItem('bookingId', data);
        this.router.navigate(['/pages/all-sessions/session-details']);
    }

    contactTutor(data) {
        let ref = this.dialog.open(ContactTutorDialog, {
            data: data
        });
    }

    pageChanged(page) {
        this.page = page;
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
        if (this.authService.isLoggedIn) {
            this.store.dispatch({
                type: notification.actionTypes.GET_ALL_NOTIFICATIONS,
                payload: {
                    currentPage: this.page,
                    limit: this.limit
                }
            });
        }
    }

    selectNo(no) {
        this.limit = no;
        if (this.authService.isLoggedIn) {
            this.store.dispatch({type: notification.actionTypes.GET_ALL_NOTIFICATIONS, payload: {currentPage: this.page, limit: this.limit}});
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

    pageChange(page) {
        if (this.authService.isLoggedIn) {
            this.store.dispatch({
                type: notification.actionTypes.GET_ALL_NOTIFICATIONS,
                payload: {
                    currentPage: page.pageIndex + 1,
                    limit: page.pageSize
                }
            });
            // this.pageSize = page.pageSize;
        }
    }

    // goToLastPage(index) {
    //     this._paginator.pageIndex = Math.ceil(this.length / this.pageSize) - 1;
    //     let page = {
    //         pageIndex: Math.ceil(this.length / this.pageSize) - 1,
    //         pageSize: this.pageSize,
    //         length: this.length
    //     };
    //     this.pageChange(page);
    //     this._paginator._changePageSize(this.pageSize);
    // }

    // goToFirstPage(index) {
    //     this._paginator.pageIndex = 0;
    //     let page = {
    //         pageIndex: 0,
    //         pageSize: this.pageSize,
    //         length: this.length
    //     };
    //     this.pageChange(page);
    //     this._paginator._changePageSize(this.pageSize);
    // }

}
