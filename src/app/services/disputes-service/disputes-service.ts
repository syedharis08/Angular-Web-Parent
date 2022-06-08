import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environment/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ApiService } from '../api-service/api.service';

@Injectable()
export class DisputesService {
    authRequired;
    utcOffset;
    addedSubjects;
    
    public anyUpcomingBooking: boolean = false;
    constructor(public http: Http, private apiService: ApiService) {
        // this.selectedChild;
        // this.selectedAddress;
        // this.bookingId;
    }


    getDisputeById(data){
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.DISPUTE_BY_ID+'?disputeId='+data;
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }
    getAllDisputes(data) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.ALL_DISPUTES;
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }
  
   

    getAllDisputesCount() {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.GET_DISPUTES_COUNT;
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }


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



