import { ApiService } from '../api-service/api.service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../environment/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class SelectPaymentService {
    authRequired;
    utcOffset;
    getId;
    tutorDetails;
    keep: any = true;

    constructor(public http: Http, private apiService: ApiService) {
    }

    applyPromoCode(promo) {
        let url;
        url = environment.APP.API_URL + environment.APP.APPLY_PROMOCODE + '?promocode=' + promo.promoCode + '&marketId=' + promo.marketId;
        this.authRequired = true;
        this.utcOffset = false;
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    checkMultiplePromocodes(promo) {
        let url;
        url = environment.APP.API_URL + environment.APP.CHECK_AVAILBILITY_OF_PROMOCODES;
        this.authRequired = true;
        this.utcOffset = false;
        return this.apiService.postApi(url, promo, this.authRequired, this.utcOffset);
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
        return this.apiService.putApi(url, payload, this.authRequired, this.utcOffset);

    }

    updateCard(value) {
        this.authRequired = true;
        this.utcOffset = false;
        let fd = new FormData();
        fd.append('expYear', value.expiryYear);
        fd.append('expMonth', value.expiryMonth);
        fd.append('city', value.city);
        fd.append('state', value.state);
        fd.append('name', value.cardHolderName);
        fd.append('addressLine1', value.addressLine1);
        if (value.addressLine2) {
            fd.append('addressLine2', value.addressLine2);
        }
        fd.append('zipCode', value.zipcode);
        let url = environment.APP.API_URL + environment.APP.UPDATE_CARD_API + '/' + value.cardId;
        return this.apiService.putApi(url, fd, this.authRequired, this.utcOffset);
    }

}
