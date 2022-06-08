import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AuthHttp, JwtHelper } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import * as io from 'socket.io-client';
import { environment } from '../../../environment/environment';
import 'rxjs/add/operator/map';
import { ApiService } from '../../../services/api-service/api.service';

@Injectable()
export class UserService {
    authRequired;
    utcOffset;
    constructor(public http: Http, public authHttp: AuthHttp, public jwtHelper: JwtHelper, private apiService: ApiService) {
    }

    logoutUser() {
        this.authRequired = true;
        this.utcOffset = false;
        let data = '';
        let url = environment.APP.API_URL + environment.APP.LOGOUT_API;
        return this.apiService.postApi(url, data, this.authRequired, this.utcOffset);
    }

    getLatLong(payload) {
        let fd = new FormData();

        fd.append('zipcode', payload);
        let url = environment.APP.GET_LAT_LONG + payload + "/degrees";
        this.authRequired = false;
        this.utcOffset = false;

        return this.apiService.postFileApiLatLong(url, this.authRequired, this.utcOffset);
    }

    browseTutor(payload) {

        this.authRequired = false;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.BROWSE_TUTOR + payload.area;
        let p_id;
        if (localStorage.getItem('parentId') && localStorage.getItem('parentId') != undefined) {
            p_id = localStorage.getItem('parentId');
        }
        if (payload.filters) {
            if (payload.filters.subjects && payload.filters.subjects.length > 0) {


                url += '&subjects=' + JSON.stringify(payload.filters.subjects);


            }
            if (payload.filters.minHourlyRate) {
                url += '&minHourlyRate=' + payload.filters.minHourlyRate;
            }
            if (payload.filters.maxHourlyRate) {
                url += '&maxHourlyRate=' + payload.filters.maxHourlyRate;
            }
            if (payload.filters.grade) {
                url += '&grade=' + payload.filters.grade;
            }
            if (payload.filters.distance) {
                url += '&distance=' + payload.filters.distance;
            }
            if (payload.filters.ratings) {
                url += '&ratings=' + payload.filters.ratings;
            }
            if (payload.filters.tutorName) {
                url += '&name=' + encodeURIComponent(payload.filters.tutorName);
            }
            if (p_id && p_id != undefined) {
                url += '&userId=' + p_id;
            }

        }
        else {

        }
        url += '&limit=' + payload.limit + '&skip=' + payload.skip;


        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }
    getCount(payload) {

        this.authRequired = false;
        this.utcOffset = false;
        let p_id;
        if (localStorage.getItem('parentId') && localStorage.getItem('parentId') != undefined) {
            p_id = localStorage.getItem('parentId');
        }
        let url = environment.APP.API_URL + environment.APP.GET_COUNT + payload.area;
        if (payload.filters) {
            if (payload.filters.subjects && payload.filters.subjects.length > 0) {

                url += '&subjects=' + JSON.stringify(payload.filters.subjects);

            }
            if (payload.filters.minHourlyRate) {
                url += '&minHourlyRate=' + payload.filters.minHourlyRate;
            }
            if (payload.filters.maxHourlyRate) {
                url += '&maxHourlyRate=' + payload.filters.maxHourlyRate;
            }
            if (payload.filters.grade) {
                url += '&grade=' + payload.filters.grade;
            }
            if (payload.filters.distance) {
                url += '&distance=' + payload.filters.distance;
            }
            if (payload.filters.ratings) {
                url += '&ratings=' + payload.filters.ratings;
            }
            if (payload.filters.tutorName) {
                url += '&name=' +encodeURIComponent(payload.filters.tutorName)
            }
            if (p_id && p_id != undefined) {
                url += '&userId=' + p_id;
            }

        }
        url += '&limit=' + payload.limit + '&skip=' + payload.skip;
        // url += '?userId=' + payload.userId;
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }
    getSubjects() {

        this.authRequired = false;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.GET_SUBJECTS;


        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }



}
