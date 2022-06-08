import { Injectable } from '@angular/core';
import { CommonService } from '../common.service';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environment/environment';
import 'rxjs/add/operator/map';
import { ApiService } from '../api-service/api.service';

@Injectable()
export class NotificationService {
    authRequired;
    utcOffset;
    constructor(private commonService: CommonService, public http: Http, private apiService: ApiService) { }

    getNotificationById(data) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.GET_NOTIFICATION_BY_ID + '?id=' + data.notificationId;
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }
    getAllNotifications(payload) {
        let skip = (payload.currentPage - 1) * payload.limit;
        let url = environment.APP.API_URL + environment.APP.GET_ALL_NOTIFICATION + '?limit=' + payload.limit + '&skip=' + skip;
        this.authRequired = true;
        this.utcOffset = false;
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }
    seeAllNotification(data){
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.SEE_ALL_NOTIFICATION + data;
        return this.apiService.putApi(url, data, this.authRequired, this.utcOffset);
    }
    clearAllNotifications() {
        let url = environment.APP.API_URL + environment.APP.CLEAR_ALL_NOTIFICATION;
        this.authRequired = true;
        this.utcOffset = false;
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);

    }

    readNotification(data) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.READ_NOTIFICATION + data;
        return this.apiService.putApi(url, data, this.authRequired, this.utcOffset);
    }
    rescheduleBooking(data) {
        let fd = new FormData();
        fd.append('action', data.action)
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.ACCEPT_REJECT_BOOKING + data.bookingId;
        return this.apiService.putApi(url, fd, this.authRequired, this.utcOffset);
    }

    // clearNotifications(data) {
    //     this.authRequired = true;
    //     this.utcOffset = false;
    //     let url = environment.APP.API_URL + environment.APP.CLEAR_NOTIFICATIONS;
    //     return this.apiService.putApi(url, data, this.authRequired, this.utcOffset);
    // }

    // acceptInvitaion(data) {
    //     this.authRequired = true;
    //     this.utcOffset = false;
    //     let url = environment.APP.API_URL + environment.APP.ACCEPT_INVITATION;
    //     return this.apiService.postApi(url, data, this.authRequired, this.utcOffset);
    // }

    readAllNotification() {
        let data = { markAllAsRead: true };
        let url = environment.APP.API_URL + environment.APP.READ_NOTIFICATION;
        this.authRequired = true;
        this.utcOffset = false;
        return this.apiService.putApi(url, data, this.authRequired, this.utcOffset);
    }

    getUserById(data) {
        let url = environment.APP.API_URL + environment.APP.GET_ALL_USER_BY_ID + '?userID=' + data;
        this.authRequired = true;
        this.utcOffset = false;
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    getBookingById(data) {
        let url = environment.APP.API_URL + environment.APP.GET_BOOKING_BY_ID + '?id=' + data;
        this.authRequired = true;
        this.utcOffset = false;
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
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
