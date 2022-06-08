import { ApiService } from '../api-service/api.service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../environment/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class PaymentService {
    authRequired;
    utcOffset;
    getId;
    tutorDetails;

    constructor(public http: Http, private apiService: ApiService) {
    }

    addNewCard(payload) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.ADD_CARD_API;
        return this.apiService.postApi(url, payload, this.authRequired, this.utcOffset);

    }

    deleteCard(payload) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.DELETE_CARD_API + '/' + payload;
        return this.apiService.deleteApi(url, payload, this.authRequired, this.utcOffset);

    }

    setdefaultCard(payload) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.DEFAULT_CARD_API + '/' + payload;
        return this.apiService.putFileApi(url, payload, this.authRequired, this.utcOffset);

    }

    changePaymentMode(payload) {
        // payload: {selectedCard:fd,booking_Id:bookingId}
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.CHANGE_PAYMENT_MODE + payload.booking_Id;
        return this.apiService.putFileApi(url, payload.selectedCard, this.authRequired, this.utcOffset);

    }

    updateCard(value) {
        this.authRequired = true;
        this.utcOffset = false;
        let fd = new FormData();
        fd.append('expYear', value.expiryYear);
        fd.append('expMonth', value.expiryMonth);
        fd.append('name', value.cardHolderName);

        fd.append('city', value.city);
        fd.append('state', value.state);
        fd.append('addressLine1', value.addressLine1);
        if (value.addressLine2) {
            fd.append('addressLine2', value.addressLine2);
        }
        fd.append('zipCode', value.zipcode);
        let url = environment.APP.API_URL + environment.APP.UPDATE_CARD_API + '/' + value.cardId;
        return this.apiService.putApi(url, fd, this.authRequired, this.utcOffset);
    }

    changeCardForUpcoming(payload, bookingId) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.CHANGE_CARD_FOR_UPCOMING + '/' + bookingId;
        return this.apiService.putFileApi(url, payload, this.authRequired, this.utcOffset);

    }
}
