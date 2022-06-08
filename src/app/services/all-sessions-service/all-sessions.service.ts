import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environment/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ApiService } from '../api-service/api.service';

@Injectable()
export class AllSessionService {
    bookAgainAddress: any;
    authRequired;
    utcOffset;
    addedSubjects;
    selectedChild = '';
    singleSessionUrl = '';
    selectedAddress = '';
    public bookingId = '';
    cardToken: any;
    public setBookAgainData = '';
    public setBookAgain_address = '';
    public anyPastBooking: boolean = false;
    track: any;

    constructor(public http: Http, private apiService: ApiService) {
        // this.selectedChild;
        // this.selectedAddress;
        // this.bookingId;
    }

    setBookAgain(data) {
        this.setBookAgainData = data;
    }

    getBookingAgainData() {
        return this.setBookAgainData;
    }

    setBookAgainAddress(data) {
        this.bookAgainAddress = data;

    }

    setTrackPageRefresh(data) {
        this.track = data;
    }

    getTrackPageRefresh() {
        return this.track;
    }

    getBookAgainAddress() {
        return this.bookAgainAddress;
    }

    getAllReports(payload) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.GET_SESSION_REPORTS + '?limit=' + payload.limit + '&skip=' + payload.skip;
        ;
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    checkTutorLive(payload) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.CHECK_TUTOR_LIVE + '?tutorId=' + payload.tutorId + '&parentId=' + payload.parentId;
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    checkBookings() {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.CHECK_BOOKINGS;
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    getSessionCount(data) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.GET_BOOKING_COUNT + '?type=' + data.type;
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    getAllSessions(data) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.GET_ALL_SESSIONS + '?type=' + data.type + '&limit=' + data.limit + '&skip=' + data.skip;
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    getAllInvoices(data) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.INVOICE_LIST + '?limit=' + data.limit + '&skip=' + data.skip;

        if (data.studentId) {
            url += '&studentId=' + data.studentId;
        }
        if (data.startTime) {
            url += '&startTime=' + data.startTime;
        }

        if (data.endTime) {
            url += '&endTime=' + data.endTime;
        }

        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    getInvoiceCount(data) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.INVOICE_COUNT + '?';

        if (data.formData.studentId) {
            url += '&studentId=' + data.formData.studentId;
        }
        if (data.formData.startTime) {
            url += '&startTime=' + data.formData.startTime;
        }

        if (data.formData.endTime) {
            url += '&endTime=' + data.formData.endTime;
        }


        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    getBookingById(data) {

        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.GET_BOOKING_BY_ID + '?bookingId=' + data;
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    getAllReportsCount() {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.GET_SESSION_REPORTS_COUNT;
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    getCancellationPolicy() {
        this.authRequired = false;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.FAQ;
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    cancelBookingById(payload) {
        let fd = new FormData();
        fd.append('reason', payload.reason);
        fd.append('tutorNoShow', payload.tutorNoShow);
        if (payload.additionalDetails != '' && payload.additionalDetails != undefined) {
            fd.append('additionalDetails', payload.additionalDetails);
        }
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.CANCEL_BOOKING_BY_ID + '/' + payload.bookingId;
        return this.apiService.putApi(url, fd, this.authRequired, this.utcOffset);
    }

    cancelTutorBookingById(payload) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.CANCEL_TUTOR_BOOKING_BY_ID + '/' + payload.bookingId;
        return this.apiService.putApi(url, payload.FormData, this.authRequired, this.utcOffset);
    }

    acceptTutorBooking(payload) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.CANCEL_TUTOR_BOOKING_BY_ID + '/' + payload.bookingId;
        return this.apiService.putApi(url, payload.FormData, this.authRequired, this.utcOffset);
    }

    addSubjects(data) {
        this.addedSubjects = data;
    }

    rateTutor(payload) {
        let fd = new FormData();
        if (payload && payload != undefined) {

            if (payload.rating && payload.rating != undefined) {
                fd.append('rating', payload.rating);
            }

            if (payload.feedback && payload.feedback != '' && payload.feedback != undefined) {
                fd.append('feedback', payload.feedback);
            }
        }

        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.RATE_AND_APPROVE + payload.bookingId;
        return this.apiService.putApi(url, fd, this.authRequired, this.utcOffset);
    };

    getDisputeById(data) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.DISPUTE_BY_ID + '?disputeId=' + data;
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    onlyRateTutor(payload) {
        let fd = new FormData();
        if (payload && payload != undefined) {

            if (payload.rating && payload.rating != undefined) {
                fd.append('rating', payload.rating);
            }

            if (payload.feedback && payload.feedback != '' && payload.feedback != undefined) {
                fd.append('feedback', payload.feedback);
            }
        }

        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.FEEDBACK_TUTOR + payload.bookingId;
        return this.apiService.putApi(url, fd, this.authRequired, this.utcOffset);
    };

    // getQualification(payload) {
    //     let url;
    //     url = environment.APP.API_URL + environment.APP.GET_QUALIFICATION;
    //     url += '?isDeleted=' + payload.isDeleted;
    //     this.authRequired = true;
    //     this.utcOffset = false;
    //     return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    // };

    // getExpertise(payload) {
    //     let url;
    //     url = environment.APP.API_URL + environment.APP.GET_EXPERTISE;
    //     url += '?isDeleted=' + payload.isDeleted;
    //     this.authRequired = true;
    //     this.utcOffset = false;
    //     return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    // };

    // getEquipments(payload) {
    //     let url;
    //     url = environment.APP.API_URL + environment.APP.GET_EQUIPMENTS;
    //     //url += '?isDeleted=' + payload.isDeleted;
    //     this.authRequired = true;
    //     this.utcOffset = false;
    //     return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    // };

    // setServiceRadii(payload) {
    //     this.authRequired = true;
    //     this.utcOffset = false;
    //     let url = environment.APP.API_URL + environment.APP.SET_SERVICE_RADII;
    //     return this.apiService.postApi(url, payload, this.authRequired, this.utcOffset);
    // };

    // addMachine(payload) {
    //     this.authRequired = true;
    //     this.utcOffset = false;
    //     let url = environment.APP.API_URL + environment.APP.ADD_MACHINE;
    //     return this.apiService.postApi(url, payload, this.authRequired, this.utcOffset);
    // };

    // updateQualification(payload) {
    //     this.authRequired = true;
    //     this.utcOffset = false;
    //     let url = environment.APP.API_URL + environment.APP.UPDATE_QUALIFICATION;
    //     return this.apiService.putApi(url, payload, this.authRequired, this.utcOffset);
    // };

    // uploadFile(payload) {
    //     this.authRequired = false;
    //     this.utcOffset = false;
    //     let url = environment.APP.API_URL + environment.APP.UPLOAD_FILE;
    //     return this.apiService.postFileApi(url, payload, this.authRequired, this.utcOffset);
    // }

}



