import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environment/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ApiService } from '../api-service/api.service';
import { Subject } from 'rxjs/Subject';
import { throwMatDialogContentAlreadyAttachedError } from '@angular/material';

@Injectable()
export class BookSessionService {
    sessionlength: any;

    duration: any = 1;
    rating: any;
    promoValue: any;
    finalData: any;
    distanceSelected: any;
    setTableIndexValue: any;
    calenderData: any;
    hourlyRate: { min: any; max: any; };
    userName: any;
    setIndexStepper: number = 0;
    authRequired;
    utcOffset;
    addedSubjects;
    selectedChild = '';
    selectedAddress = '';
    childInformation = '';
    sessionData;
    promoIndex;
    errorMsg1: boolean;
    errorMsg2: boolean;
    checkedaddress = '';
    selectedAddress_id = '';
    stepData: any;
    step2Data: any;
    alreadyAddedSubjects = [];
    sessionLengthArray = [];
    step3Data: any;
    public changeStep: any = new Subject();
    public newSessionDataArray: any = new Subject();
    public finalArray: any = new Subject();
    public step: any = new Subject();
    public errorMsgSub: any = new Subject();
    public goForward: any = new Subject();
    public tutorSelected: boolean = false;
    stepperTwoData = '';
    public slotsArray: any;
    track: any;
    sortFilter: any;
    startTimeAp: any;
    endTimeAp: any;
    endTimeMinutes: any;
    startTimeMinutes: any;
    endTimeHours: any;
    startTimeHours: any;
    startDate: string;
    date: any;
    endDate: string;
    stateCertifiedValue: any;
    sylvanCertifiedValue: any;
    timeToShowEnd: string;
    timeToShowStart: string;
    filterCount: any;
    flexibility: any;
    // onlineBoking: boolean;
    onlineBooking: boolean;
    onlineSessionValue: any;

    constructor(public http: Http, private apiService: ApiService) {

    }

    updateStepperIndex(index: number) {
        this.setIndexStepper = index;
        this.changeStep.next(index);
    }

    setDistance(distance) {
        this.distanceSelected = distance;
    }

    setCalenderData(data) {
        this.calenderData = data;
    }

    getCalenderData() {
        return this.calenderData;
    }

    getDistance() {
        return this.distanceSelected;
    }

    setUserName(name) {
        this.userName = name;
    }

    setPromoValue(value) {
        this.promoValue = value;
    }

    setSylvanCertifiedValue(sylvanCertifiedValue) {
        this.sylvanCertifiedValue = sylvanCertifiedValue;
    }

    setOnlineSessionValue(sessionVal) {
        this.onlineSessionValue = sessionVal;
    }

    getSylvanCertifiedValue() {
        return this.sylvanCertifiedValue;
    }

    setStateCertifiedValue(sylvanCertifiedValue) {
        this.stateCertifiedValue = sylvanCertifiedValue;
    }

    getStateCertifiedValue() {
        return this.stateCertifiedValue;
    }

    getOnlineSessionValue() {
        return this.onlineSessionValue;
    }

    getPromoValue() {
        return this.promoValue;
    }

    getUserName() {
        return this.userName;
    }

    setHourlyRate(min, max) {
        this.hourlyRate = {
            min: min,
            max: max
        };
    }

    setPromoIndex(index) {
        this.promoIndex = index;
    }

    getpromoIndex() {
        return this.promoIndex;
    }

    setDuration(duration) {
        this.duration = duration;
    }

    setSessionLength(length) {
        this.sessionlength = length;
    }

    setSort(sortFilter) {
        this.sortFilter = sortFilter;
    }

    getSort() {
        return this.sortFilter;
    }

    getSessionLength() {
        return this.sessionlength;
    }

    setSessionData(data) {
        this.sessionLengthArray = data;
        this.newSessionDataArray.next(data);
    }

    setPromoData(data) {
        this.finalData = data;
        this.finalArray.next(data);
    }

    getPromoData() {
        return this.finalData;
    }

    setTableIndex(index) {
        this.setTableIndexValue = index;
    }

    setSlotsArray(data) {
        this.slotsArray = data;
    }

    setTrackPageRefresh(data) {
        this.track = data;
    }

    getTrackPageRefresh() {
        return this.track;
    }

    setErrorMessage(msg1, msg2) {
        this.errorMsg1 = msg1;
        this.errorMsgSub.next(msg1);
        this.errorMsg2 = msg2;
        this.goForward.next(msg2);
    }

    getSlotsArray() {
        return this.slotsArray;
    }

    getTableIndex() {
        return this.setTableIndexValue;
    }

    getSessionData() {
        return this.sessionLengthArray;
    }

    getDuration() {
        return this.duration;
    }

    getHourlyRate() {
        return this.hourlyRate;
    }

    getIndex() {
        return this.setIndexStepper;
    }

    setRating(rating) {
        this.rating = rating;
    }

    getRatings() {
        return this.rating;
    }

    // stepOne Data
    stepOneData(data) {
        // this.step.next(data)
        this.stepData = data;
        // this.step.next(this.stepData)
    }

    alreadyAddSubjects(subjects) {
        this.alreadyAddedSubjects.push(subjects);
    }

    getAddedSubjects() {
        return this.alreadyAddedSubjects;
    }

    getStepperOneData() {
        return this.stepData;
    }

    // StepTwo Data
    stepTwoData(data) {
        this.step2Data = data;
    }

    getStepTwoData() {

        return this.step2Data;
    }

    // StepthreeData
    stepThreeData(data) {
        this.step3Data = data;
    }

    getStepThreeData() {

        return this.step3Data;
    }

    getStepperFullData() {
        let fullData = {
            stepOne: this.stepData,
            stepTwo: this.step2Data
        };
        return fullData;
    }

    getTutorRatings(data) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.GET_TUTOR_RATINGS + '?tutorId=' + data.tutorId + '&limit=' + data.limit + '&skip=' + data.skip;
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    getStudentList() {
        this.authRequired = true;
        this.utcOffset = false;
        // let url = environment.APP.API_URL + environment.APP.STUDENT_LIST + '?getAll=true&limit=50&skip=0' + '&parentId=' + localStorage.getItem('parentId');
        let url = environment.APP.API_URL + environment.APP.STUDENT_LIST + '?getAll=true&limit=50&skip=0';
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    checkTutorAvailability(data) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.CHECK_TUTOR_AVAILABILITY + '?tutorId=' + data.tutorId + '&duration=' + data.duration + '&totalSessions=' + data.totalSessions;
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    getTutorRatingsCount(data) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.RATINGS_COUNT + '?tutorId=' + data;
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    createBooking(payload) {
        this.authRequired = true;
        this.utcOffset = true;
        let url = environment.APP.API_URL + environment.APP.CREATE_BOOKING;
        return this.apiService.postApi1(url, payload, this.authRequired, this.utcOffset);
    };

    setpOneData(data) {

        if (data && data != undefined) {
            this.sessionData = data.duration;
        } else {
            this.sessionData = '';
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
            if (payload.filters.duration) {
                url += '&duration=' + payload.filters.duration;
            }
            if (payload.filters.startTime) {
                url += '&startTime=' + payload.filters.startTime;
            }
            if (payload.filters.endTime) {
                url += '&endTime=' + payload.filters.endTime;
            }
            // if (payload.filters.sortType) {
            //     url += '&sortType=' + payload.filters.sortType;
            // }
            if (payload.filters.sylvanCertifiedValue) {
                url += '&sylvanCertified=' + payload.filters.sylvanCertifiedValue;
            }
            if (payload.filters.stateCertifiedValue) {
                url += '&stateCertified=' + payload.filters.stateCertifiedValue;
            }
            if (payload.filters.onlineSession) {
                url += '&isTutorOfferOnlineClasses=' + payload.filters.onlineSession;
            }
            if (payload.filters.grade) {
                url += '&grades=' + JSON.stringify(payload.filters.grade);
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
            if (payload.searchType != undefined) {
                url += '&searchType=' + payload.searchType;
            }
            if (p_id && p_id != undefined) {
                url += '&userId=' + p_id;
            }

        }
        url += '&limit=' + payload.limit + '&skip=' + payload.skip;

        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
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
            if (payload.filters.duration) {
                url += '&duration=' + payload.filters.duration;
            }
            if (payload.filters.startTime) {
                url += '&startTime=' + payload.filters.startTime;
            }
            if (payload.filters.endTime) {
                url += '&endTime=' + payload.filters.endTime;
            }
            if (payload.filters.sortType) {
                url += '&sortType=' + payload.filters.sortType;
            }
            if (payload.filters.sylvanCertifiedValue) {
                url += '&sylvanCertified=' + payload.filters.sylvanCertifiedValue;
            }
            if (payload.filters.stateCertifiedValue) {
                url += '&stateCertified=' + payload.filters.stateCertifiedValue;
            }
            if (payload.filters.onlineSession) {
                url += '&isTutorOfferOnlineClasses=' + payload.filters.onlineSession;
            }
            if (payload.filters.maxHourlyRate) {
                url += '&maxHourlyRate=' + payload.filters.maxHourlyRate;
            }
            if (payload.filters.grade) {
                url += '&grades=' + JSON.stringify(payload.filters.grade);
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
            if (payload.searchType != undefined) {
                url += '&searchType=' + payload.searchType;
            }
            if (p_id && p_id != undefined) {
                url += '&userId=' + p_id;
            }

            if (payload.totalSessions != undefined) {
                url += '&totalSessions=' + payload.totalSessions;
            }

        } else {

        }
        url += '&limit=' + payload.limit + '&skip=' + payload.skip;

        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    getTutorDetails(data) {
        this.authRequired = false;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.GET_TUTOR_DETAILS + '?tutorId=' + data;
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    getTutorDetailsByUId(data) {
        this.authRequired = false;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.GET_TUTOR_DETAILS_BY_UID + '?userId=' + data;
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

    editChild(data) {

        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.EDIT_CHILD + data.id;
        return this.apiService.putFileApi(url, data.formData, this.authRequired, this.utcOffset);
    }

    addSubjects(data) {
        this.addedSubjects = data;
    }

    contactTutor(data) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.CONTACT_TUTOR_API;
        return this.apiService.putFileApi(url, data, this.authRequired, this.utcOffset);
    }

    raiseDispute(data) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.DISPUTE_API;
        return this.apiService.postApi(url, data, this.authRequired, this.utcOffset);
    }

    generatePdfService(fd) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.GENERATE_PDF;
        return this.apiService.postApi(url, fd, this.authRequired, this.utcOffset);
    }

    getStudentUpcoming(data) {
        this.authRequired = true;
        this.utcOffset = false;
        let url = environment.APP.API_URL + environment.APP.STUDENT_UPCOMING_SESSION + '?studentId=' + data.studentId;
        return this.apiService.getApi(url, this.authRequired, this.utcOffset);
    }

}



