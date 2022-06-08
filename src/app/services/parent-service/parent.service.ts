import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Subject } from 'rxjs/Rx';
import { environment } from '../../environment/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ApiService } from '../api-service/api.service';

@Injectable()
export class ParentService {
    authRequired;
    childAdress: boolean = false;
    utcOffset;
    profileData: any;
    public profileDataArray: any = new Subject();

    constructor(public http: Http, private apiService: ApiService) {}

    public profile = {
        sp_image: File,
        sp_image_file: File
    };

    updateProfile(payload) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.UPDATE_PARENT_PROFILE;
        return this.apiService.putApi(url, payload, this.authRequired, this.utcOffset);
    };

    addChild(payload) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.ADD_CHILD;
        return this.apiService.postFileApi(url, payload, this.authRequired, this.utcOffset);
    };

    editAddress(data) {
        let url;
        url = environment.APP.API_URL + environment.APP.EDIT_ADDRESS + data.addressId;
        this.authRequired = true;
        this.utcOffset = false;
        return this.apiService.putApi(url, data.address, this.authRequired, this.utcOffset);
    }

    getRefferal() {
        let url;
        url = environment.APP.API_URL + environment.APP.GET_REFFERAL;
        this.authRequired = true;
        this.utcOffset = false;
        if (localStorage.getItem('tutor_Id') && localStorage.getItem('totalSessions')) {
            let t_id = localStorage.getItem('tutor_Id');
            let sessions = localStorage.getItem('totalSessions');
            let t_sessions = parseInt(sessions, 10);
            url += '?tutorId=' + t_id + '&totalSessions=' + t_sessions;

        }
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);

    }

    getProfile(data) {

        let url;
        url = environment.APP.API_URL + environment.APP.PARENT_PROFILE;
        this.authRequired = true;
        this.utcOffset = true;
        return this.apiService.postFileApi(url, data, this.authRequired, this.utcOffset);
    };

    addAddress(data) {
        let url;
        url = environment.APP.API_URL + environment.APP.ADD_ADDRESS;
        this.authRequired = true;
        this.utcOffset = false;
        return this.apiService.postFileApi(url, data, this.authRequired, this.utcOffset);
    };

    otp(data) {

        let url = environment.APP.API_URL + environment.APP.CONFIRM_SIGNUP_OTP_API;
        this.authRequired = true;
        this.utcOffset = false;
        return this.apiService.putFileApi(url, data, this.authRequired, this.utcOffset);

    }

    faq() {
        let url;
        url = environment.APP.API_URL + environment.APP.FAQ;
        this.authRequired = false;
        this.utcOffset = false;
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    resendOtp(data) {
        this.authRequired = true;
        this.utcOffset = false;
        let formData = new FormData();
        formData.append('type', data);
        let url = environment.APP.API_URL + environment.APP.RESEND_OTP_API;
        return this.apiService.putFileApi(url, formData, this.authRequired, this.utcOffset);
    }

    updatePassword(data) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.CHANGE_PASSWORD;
        return this.apiService.putFileApi(url, data, this.authRequired, this.utcOffset);
    }

    deleteChild(payload) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.DELETE_CHILD + payload;
        return this.apiService.deleteApi(url, payload, this.authRequired, this.utcOffset);
    };

    deleteAddress(data) {
        let fd = new FormData();
        let parentId = localStorage.getItem('parentId');
        let value = {'parentId': parentId};

        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.DELETE_ADDRESS + data;
        return this.apiService.deleteApiDel(url, value, this.authRequired, this.utcOffset);
    };

    editChild(data) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.EDIT_CHILD + data.id;
        return this.apiService.putFileApi(url, data.formData, this.authRequired, this.utcOffset);
    }

    setProfileData(data) {
        this.profileData = data;
        this.profileDataArray.next(data);
    }

    getProfileData() {
        return this.profileData;
    }

}



