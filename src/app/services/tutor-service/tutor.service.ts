import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../environment/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ApiService } from '../api-service/api.service';
import * as moment from 'moment';

@Injectable()
export class TutorService {
    filterZipCode: any;
    obj: any;
    locaionMarket: any;
    userName: any;
    rating: any;
    setgrades: any;
    distanceSelected: any;
    selectedSubjects: any;
    startTime: any;
    endTime: any;
    hourlyRate: { min: any; max: any; };
    authRequired;
    utcOffset;
    getId;
    tutorDetails;
    parentSubject = [];
    setqual: any;
    sylvanCertifiedValue: any;
    onlineSessionValue: any;
    stateCertifiedValue: any;
    sortFilter: any;
    startDate: string;
    endDate: string;
    date: any;
    duration: any;
    startTimeHours: any;
    endTimeHours: any;
    endTimeMinutes: any;
    startTimeMinutes: any;
    startTimeAp: any;
    endTimeAp: any;
    timeToShowEnd: string;
    timeToShowStart: string;
    filterCount: any;

    constructor(public http: Http, private apiService: ApiService) {
    }

    setFilterZipCode(data) {
        this.filterZipCode = data;
    }

    getFilterZipCodeDetails() {
        return this.filterZipCode;
    }

    setLocationMarket(location) {
        this.locaionMarket = location;
    }

    getLocationMarket() {
        return this.locaionMarket;
    }

    getLatLong(payload) {
        let fd = new FormData();

        fd.append('zipcode', payload);
        let url = environment.APP.GET_LAT_LONG + payload + '/degrees';
        this.authRequired = false;
        this.utcOffset = false;

        return this.apiService.postFileApiLatLong(url, this.authRequired, this.utcOffset);
    }

    setUserName(name) {
        this.userName = name;
    }

    setSylvanCertifiedValue(sylvanCertifiedValue) {
        this.sylvanCertifiedValue = sylvanCertifiedValue;
    }

    getSylvanCertifiedValue() {
        return this.sylvanCertifiedValue;
    }

    getOnlineSessionValue() {
        return this.onlineSessionValue;
    }

    setStateCertifiedValue(sylvanCertifiedValue) {
        this.stateCertifiedValue = sylvanCertifiedValue;
    }

    setOnlineSessionValue(sessionVal) {
        this.onlineSessionValue = sessionVal;
    }

    getStateCertifiedValue() {
        return this.stateCertifiedValue;
    }

    setSort(sortFilter) {
        this.sortFilter = sortFilter;
    }

    getSort() {
        return this.sortFilter;
    }

    getName() {
        return this.userName;
    }

    setRating(rating) {
        this.rating = rating;
    }

    getRatings() {
        return this.rating;
    }

    setDistance(distance) {

        this.distanceSelected = distance;
    }

    getDistance() {
        return this.distanceSelected;
    }

    setHourlyRate(min, max) {
        this.hourlyRate = {
            min: min,
            max: max
        };
    }

    getHourlyRate() {
        return this.hourlyRate;
    }

    setSubjects(selectedSubjects) {
        this.selectedSubjects = selectedSubjects;
    }

    getSelectedSubjects() {
        return this.selectedSubjects;
    }

    setGrade(grades) {
        this.setgrades = grades;
    }

    setQual(qual) {
        this.setqual = qual;
    }

    getGrades() {
        return this.setgrades;
    }

    browseTutor(payload) {

        let p_id;
        if (localStorage.getItem('parentId') && localStorage.getItem('parentId') != undefined) {
            p_id = localStorage.getItem('parentId');
        }
        this.authRequired = false;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.BROWSE_TUTOR + payload.area;

        if (localStorage.getItem('isNationWide') == 'true') {
            url += '&isTutorOfferOnlineClasses=' + true;
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
                url += '&grades=' + JSON.stringify(payload.filters.grade);
            }

            if (payload.filters.distance != '' && payload.filters.distance != undefined) {

                url += '&distance=' + payload.filters.distance;
            } else if (payload.filters.distance === 0) {
                url += '&distance=' + 0;

            }
            if (payload.filters.ratings) {
                url += '&ratings=' + payload.filters.ratings;
            }
            if (payload.filters.sortType) {
                url += '&sortType=' + payload.filters.sortType;
            }
            if (payload.filters.sylvanCertifiedValue) {
                url += '&sylvanCertified=' + payload.filters.sylvanCertifiedValue;
            }
            if (payload.filters.onlineSession) {
                if (!url.includes('isTutorOfferOnlineClasses')) {
                    url += '&isTutorOfferOnlineClasses=' + true;
                }
            }
            if (payload.filters.startTime) {
                url += '&startTime=' + payload.filters.startTime;
            }
            if (payload.filters.endTime) {
                url += '&endTime=' + payload.filters.endTime;
            }
            if (payload.filters.duration) {
                url += '&duration=' + payload.filters.duration;
            }
            if (payload.filters.stateCertifiedValue) {
                url += '&stateCertified=' + payload.filters.stateCertifiedValue;
            }
            if (payload.filters.tutorName) {
                url += '&name=' + encodeURIComponent(payload.filters.tutorName);
            }
            if (payload.filters.city) {
                url += '&city=' + payload.filters.city;
            }
            if (p_id && p_id != undefined) {
                url += '&userId=' + p_id;
            }

        } else {

        }
        if (payload.zipcodeSearch != undefined) {
            url += '&zipcodeSearch=' + payload.zipcodeSearch;
        }
        if (payload.searchType != undefined) {
            url += '&searchType=' + payload.searchType;
        }
        url += '&limit=' + payload.limit + '&skip=' + payload.skip;

        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    browseTutorMarket(payload) {
        let p_id;
        if (localStorage.getItem('parentId') && localStorage.getItem('parentId') != undefined) {
            p_id = localStorage.getItem('parentId');
        }
        this.authRequired = false;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.BROWSE_TUTOR_MARKET;
        if (payload.filters && payload.filters.marketId != undefined) {
            url += '?marketId=' + payload.filters.marketId;
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
            if (payload.filters.sortType) {
                url += '&sortType=' + payload.filters.sortType;
            }
            if (payload.filters.grade) {
                url += '&grades=' + JSON.stringify(payload.filters.grade);
            }
            if (payload.filters.startTime) {
                url += '&startTime=' + payload.filters.startTime;
            }
            if (payload.filters.endTime) {
                url += '&endTime=' + payload.filters.endTime;
            }
            if (payload.filters.duration) {
                url += '&duration=' + payload.filters.duration;
            }
            if (payload.filters.ratings) {
                url += '&ratings=' + payload.filters.ratings;
            }
            if (payload.filters.tutorName) {
                url += '&name=' + encodeURIComponent(payload.filters.tutorName);
            }
            if (payload.filters.sylvanCertifiedValue) {
                url += '&sylvanCertified=' + payload.filters.sylvanCertifiedValue;
            }
            if (payload.filters.onlineSession) {
                url += '&isTutorOfferOnlineClasses=' + payload.filters.onlineSession;
            }
            if (payload.filters.stateCertifiedValue) {
                url += '&stateCertified=' + payload.filters.stateCertifiedValue;
            }
            if (payload.filters.city) {
                url += '&city=' + payload.filters.city;
            }
            if (p_id && p_id != undefined) {
                url += '&userId=' + p_id;
            }

        } else {

        }
        if (payload.searchType != undefined) {
            url += '&searchType=' + payload.searchType;
        }
        if (payload.zipcodeSearch && payload.zipcodeSearch != undefined) {
            url += '&zipcodeSearch=' + payload.zipcodeSearch;
        }
        url += '&limit=' + payload.limit + '&skip=' + payload.skip;

        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    sendTutorId(data) {
        if (data && data != undefined) {
            this.tutorDetails = data;
        }
    }

    getCount(payload) {
        let p_id;
        if (localStorage.getItem('parentId') && localStorage.getItem('parentId') != undefined) {
            p_id = localStorage.getItem('parentId');
        }
        this.authRequired = false;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.GET_COUNT + payload.area;
        if (localStorage.getItem('isNationWide') == 'true') {
            url += '&isTutorOfferOnlineClasses=' + true;
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
                url += '&grades=' + JSON.stringify(payload.filters.grade);
            }

            if (payload.filters.sylvanCertifiedValue) {
                url += '&sylvanCertified=' + payload.filters.sylvanCertifiedValue;
            }
            if (payload.filters.onlineSession) {
                if (payload.filters.onlineSession) {
                    if (!url.includes('isTutorOfferOnlineClasses')) {
                        url += '&isTutorOfferOnlineClasses=' + true;
                    }
                }
                // url += '&isTutorOfferOnlineClasses=' + payload.filters.onlineSession;
            }
            if (payload.filters.stateCertifiedValue) {
                url += '&stateCertified=' + payload.filters.stateCertifiedValue;
            }
            if (payload.filters.distance) {
                url += '&distance=' + payload.filters.distance;
            } else if (payload.filters.distance === 0) {
                url += '&distance=' + 0;

            }

            if (payload.filters.ratings) {
                url += '&ratings=' + payload.filters.ratings;
            }
            if (payload.filters.tutorName) {
                url += '&name=' + encodeURIComponent(payload.filters.tutorName);
            }
            if (payload.filters.city) {
                url += '&city=' + payload.filters.city;
            }
            if (payload.filters.startTime) {
                url += '&startTime=' + payload.filters.startTime;
            }
            if (payload.filters.endTime) {
                url += '&endTime=' + payload.filters.endTime;
            }
            if (payload.filters.duration) {
                url += '&duration=' + payload.filters.duration;
            }
            if (p_id && p_id != undefined) {
                url += '&userId=' + p_id;
            }

        }
        if (payload.searchType != undefined) {
            url += '&searchType=' + payload.searchType;
        }
        if (payload.limit != undefined && payload.skip != undefined) {
            url += '&limit=' + payload.limit + '&skip=' + payload.skip;

        }

        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    getMarketCount(payload) {
        let p_id;
        if (localStorage.getItem('parentId') && localStorage.getItem('parentId') != undefined) {
            p_id = localStorage.getItem('parentId');
        }
        this.authRequired = false;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.GET_COUNT_MARKET;
        if (payload.filters && payload.filters.marketId != undefined) {
            url += '?marketId=' + payload.filters.marketId;
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
                url += '&grades=' + JSON.stringify(payload.filters.grade);
            }
            // if (payload.filters.distance) {
            //     url += '&distance=' + payload.filters.distance;
            // } else if (payload.filters.distance === 0) {
            //     url += '&distance=' + 0;

            // }

            if (payload.filters.sylvanCertifiedValue) {
                url += '&sylvanCertified=' + payload.filters.sylvanCertifiedValue;
            }
            if (payload.filters.onlineSession) {

                url += '&isTutorOfferOnlineClasses=' + payload.filters.onlineSession;
            }
            if (payload.filters.stateCertifiedValue) {
                url += '&stateCertified=' + payload.filters.stateCertifiedValue;
            }
            if (payload.filters.ratings) {
                url += '&ratings=' + payload.filters.ratings;
            }
            if (payload.filters.tutorName) {
                url += '&name=' + encodeURIComponent(payload.filters.tutorName);
            }
            if (payload.filters.city) {
                url += '&city=' + payload.filters.city;
            }
            if (p_id && p_id != undefined) {
                url += '&userId=' + p_id;
            }

        }
        if (payload.searchType != undefined) {
            url += '&searchType=' + 'BROWSE_TUTORS';
        }
        url += '&limit=' + payload.limit + '&skip=' + payload.skip;

        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    getSubjects() {

        this.authRequired = false;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.GET_SUBJECTS;

        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    getTutorSubjects(data) {

        this.authRequired = false;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.GET_TUTOR_SUBJECTS + '?tutorId=' + data;

        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    getTutorAddressStudents(data) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.GET_TUTOR_ADDRESS_STUDENTS + '?tutorId=' + data;
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    loginByUserName(data) {
        this.authRequired = false;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.LOGIN;
        return this.apiService.postApi1(url, data, false, false);
    }

    getTutorDetails(data) {
        this.authRequired = false;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.GET_TUTOR_DETAILS + '?tutorId=' + data;
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    getTutorRatings(data) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.GET_TUTOR_RATINGS + '?tutorId=' + data.tutorId + '&limit=' + data.limit + '&skip=' + data.skip;
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    getTutorRatingsByUID(data) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.GET_TUTOR_RATINGS_BY_UID + '?tutorId=' + data.tutorId + '&limit=' + data.limit + '&skip=' + data.skip;
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    getTutorRatingsCount(data) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.RATINGS_COUNT + '?tutorId=' + data;
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    getTutorRatingsCountByUId(data) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.RATINGS_COUNT_BY_UID + '?tutorId=' + data;
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    sendId(id) {

        this.getId = id;
    }

    checkDayLightTimeZone(timezone) {
        let isDst = moment().isDST();
        let updated;
        if (isDst) {
            updated = timezone.replace('DT', 'ST');
        } else {
            updated = timezone.replace('ST', 'DT');
        }
        return updated;
    }
}
