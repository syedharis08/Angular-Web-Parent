import { ApiService } from './api-service/api.service';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as auth from '../auth/state/auth.actions';
import { environment } from '../environment/environment';
import { CONSTANT } from '../shared/constant/constant';
import * as moment from 'moment';

@Injectable()
export class CommonService {
    utcOffset: boolean;
    authRequired: boolean;
    private url = environment.APP.API_URL;
    public socket;
    public isDesktop;
    CONSTANT = CONSTANT;

    constructor(private store: Store<any>, private apiservice: ApiService) {
        this.store.select('auth').subscribe((res: any) => {
            if (res.loggedIn === true) {
            }
        });
    }

    checkIsSuppress(userData) {

        let obj: any = {
            isRateChargeSuppress: false,
            isRateChargeSuppressNow: false,
            isReservationHoursAvail: false,
        };
        obj.isRateChargeSuppress = userData.partnershipCode && userData.partnershipCode.length && userData.partnershipCode[0].isRateChargeSuppress;
        if (obj.isRateChargeSuppress) {
            if (!userData.parent.isParentOutOfTutoringHours) {
                obj.isRateChargeSuppressNow = true;
                if (userData.parent.sessionCreditsFromExternalApi && userData.parent.sessionCreditsFromExternalApi.length) {
                    let sessionCreditsFromExternalApi = JSON.parse(JSON.stringify(userData.parent.sessionCreditsFromExternalApi.sort((a, b) => a.endDate - b.endDate)));
                    let filteredReservation = sessionCreditsFromExternalApi.filter(ele =>
                        ele.numberOfTutoringHours > 0
                    );
                    if (filteredReservation && filteredReservation.length) {
                        obj.isReservationHoursAvail = true;
                    }
                }
            }
        }
        return obj;
    }

    checkChildDOB(user) {
        let isChildDOB = false;
        user.students.forEach((val) => {
            if (val.dob) {
                isChildDOB = true;
            }
        });
        return isChildDOB;
    }

    checkIsCanada(data) {
        let isCanada = false;
        if (data.parent.addresses.length && data.parent.addresses[0].country == 'Canada') {
            isCanada = true;
        }
        return isCanada;
    }

    getSocketConnection() {
        return this.socket;
    }

    contactForm(payload) {
        this.authRequired = false;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.CONTACT_API;
        return this.apiservice.postApi(url, payload, this.authRequired, this.utcOffset);
    }

    checkBrowser() {
        this.isDesktop = typeof window.orientation !== 'undefined' || typeof window.orientation !== undefined;
    }

    sortByEndDate(arr) {
        arr.forEach((val) => {
            val.endDate = new Date(val.endDate);
        });
        return arr.sort((a, b) => a.endDate - b.endDate);
    }

    noOfNonExpiredHours(arr) {
        let showNumberOfTutoringHours = 0;
        if (arr && arr.length) {
            arr.forEach((val) => {
                if (val.numberOfTutoringHours > 0) {
                    let currentDate = new Date(moment().format('YYYY-MM-DD' + '[T23:59:59.999Z]'));
                    let tempEndDate = new Date(new Date(val.endDate));
                    if (currentDate < tempEndDate) {
                        showNumberOfTutoringHours = showNumberOfTutoringHours + val.numberOfTutoringHours;
                    }
                }
            });
        }
        return showNumberOfTutoringHours;
    }

    openLinkInNewTab(url: any) {
        window.open(url, '_blank');
    }

}
