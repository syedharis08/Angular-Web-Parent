import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Effect, Actions } from '@ngrx/effects';
import * as sessionsDetails from './../../state/all-sessions.actions';
import { Subscription } from 'rxjs/Rx';
import 'style-loader!./session-details.scss';
import { AllSessionService } from '../../../../services/all-sessions-service/all-sessions.service';
import * as moment from 'moment';
import { BookSessionService } from '../../../../services/session-service/session.service';
@Component({
    selector: 'session-details',
    templateUrl: `./session-details.html`,
    styleUrls: ['./session-details.scss'],

})
export class SessionDetail {
    tableArray: any[];
    setIndex: number = 0;
    public sessionStore: Subscription;
    public upcomingSessions = [];
    public allUpcomingSessions = [];
    public allPastSessions = [];
    public tabIndex = 0;
    public showTabs: boolean = false
    public pastSessions = [];
    public up_limit: number = 5;
    public up_page: number = 1;
    public up_skip: number = 0;
    public past_limit: number = 5;
    public past_page: number = 1;
    public past_skip: number = 0;
    public up_count;
    public past_count;
    public status;
    public data: any;
    public past_show: boolean = false;
    public up_show: boolean = false;
    public past_data: any;


    constructor(private store: Store<any>, private router: Router, private fb: FormBuilder, private sessionService: AllSessionService, private bookingService: BookSessionService) {
        // if(this.sessionService.anyPastBooking && this.sessionService.anyPastBooking != undefined){
        //     this.setIndex=1;
        // } else{
        //     this.setIndex=0;
        // }
        // window.scroll(0, 0);
        if (localStorage.getItem('finalData')) {
            localStorage.removeItem('finalData');
        }
        if (localStorage.getItem('totalSessions')) {
            localStorage.removeItem('totalSessions')
        }
        if (localStorage.getItem('finalSlot')) {
            localStorage.removeItem('finalSlot');
        }
        if (localStorage.getItem('ub-emb-id')) {
            localStorage.removeItem('ub-emb-id')
        }
        if (localStorage.getItem('tutorUId')) {
            localStorage.removeItem('tutorUId')
        }
        localStorage.removeItem('steponeData');
        if (localStorage.getItem('tutorUID1')) {
            localStorage.removeItem('tutorUId1')
        }
        if (localStorage.getItem('tutor_Id')) {
            localStorage.removeItem('tutor_Id');
        }
        if (localStorage.getItem('index')) {
            localStorage.removeItem('index');
        }
        if (localStorage.getItem('goBack')) {
            localStorage.removeItem('goBack');
        }
        if (localStorage.getItem('promoHash')) {
            localStorage.removeItem('promoHash');
        }
        if (localStorage.getItem('bookingHash')) {
            localStorage.removeItem('bookingHash');
        }

        this.tableArray = [{ date: '', time: '', discount: '', refferal: '', total_amount: '', promocode: '' }];

        this.bookingService.setSessionData(this.tableArray);


        let el = $('#moveUp');
        $('html,body').animate({ scrollTop: (el.offset().top - 50) }, 'slow', () => {
            el.focus();
        });

        this.store.dispatch({
            type: sessionsDetails.actionTypes.CHECK_BOOKINGS
        });
        // this.store.dispatch({
        //     type: sessionsDetails.actionTypes.GET_ALL_UPCOMING_SESSIONS,
        //     payload: { type: 'UPCOMING', limit: this.up_limit, skip: this.up_skip }
        // });
        this.allUpcomingSessions = [];
        this.upcomingSessions = [];
        this.allPastSessions = [];
        this.pastSessions = [];
        this.sessionStore = this.store
            .select('sessionsDetails')
            .subscribe((res: any) => {
                if (res) {
                    ga('send', {
                        hitType: 'event',
                        eventCategory: 'Child Sessions',
                        eventAction: "Child Sessions",
                        eventLabel: "Child Sessions"
                    });
                    if (res.anyBookings && res.anyBookings != undefined && res.anyBookings.pastSession && !localStorage.getItem('goToUpcoming')) {
                        this.setIndex = 1;
                        this.showTabs = true;
                        // ga('send', {
                        //     hitType: 'event',
                        //     eventCategory: 'Child Sessions',
                        //     eventAction: "Child Sessions History",
                        //     eventLabel: "Child Sessions History"
                        // });

                    } else {
                        this.setIndex = 0;
                        // ga('send', {
                        //     hitType: 'event',
                        //     eventCategory: 'Upcoming Session',
                        //     eventAction: "OK Session",
                        //     eventLabel: "OK Session"
                        // });
                        this.showTabs = true;

                    }
                    this.allUpcomingSessions = [];
                    this.upcomingSessions = [];


                    if (res && res.upcoming && res.upcoming.bookings && res.upcoming.bookings != undefined) {
                        // window.scroll(0, 0);

                        this.allUpcomingSessions = [];
                        if (res.upcoming.bookings.length > 0) {
                            this.allUpcomingSessions = res.upcoming.bookings;
                            if (res.upcomingCount && res.upcomingCount != undefined) {
                                this.up_count = res.upcomingCount.count;
                            }

                            this.upcomingSessions = [];
                            if (this.allUpcomingSessions && this.allUpcomingSessions != undefined) {
                                this.allUpcomingSessions.forEach((element) => {
                                    this.data = {
                                        statusMsg: '',
                                        color: '',
                                        Bookings: '',
                                        past_show: '',
                                        startTime: '',
                                        endTime: ''

                                    };
                                    this.data.Bookings = element;
                                    if (moment(element.startTime).month() == 4) {
                                        this.data.startTime = moment(element.startTime).format("MMM D, YYYY | h:mmA");
                                    }
                                    else {
                                        this.data.startTime = moment(element.startTime).format("MMM. D, YYYY | h:mmA");
                                    }
                                    switch (element.status) {
                                        case 'NEW': {
                                            this.data.statusMsg = 'Pending';
                                            this.data.color = '#d9ab28';
                                            this.data.past_show = false;
                                            // this.data.startTime = element.startTime
                                            // this.data.endTime = element.endTime;
                                            this.data.endTime = moment(element.endTime).format("h:mmA ")
                                            break;
                                        }
                                        case 'NEW_TUTOR':
                                        {
                                            this.data.statusMsg = 'Pending Request from Tutor';
                                            this.data.color = '#d9ab28';
                                            this.data.past_show = false;
                                            // this.data.startTime = element.startTime
                                            // this.data.endTime = element.endTime;
                                            this.data.endTime = moment(element.endTime).format("h:mmA ")
                                            break;
                                        }
                                        case 'ACCEPTED_BY_TUTOR': {
                                            this.data.statusMsg = 'Accepted';
                                            this.data.color = '#227B14';
                                            this.data.past_show = true;
                                            // this.data.startTime = element.startTime
                                            // this.data.endTime = element.endTime;
                                            this.data.endTime = moment(element.endTime).format("h:mmA ")
                                            break;
                                        }
                                        case 'ACCEPTED_BY_PARENT': {
                                            this.data.statusMsg = 'Accepted';
                                            this.data.color = '#227B14';
                                            this.data.past_show = true;
                                            // this.data.startTime = element.startTime
                                            // this.data.endTime = element.endTime;
                                            this.data.endTime = moment(element.endTime).format("h:mmA ")
                                            break;
                                        }
                                        case 'RESCHEDULE_ACCEPTED': {
                                            this.data.statusMsg = 'Accepted';
                                            this.data.color = '#227B14';
                                            this.data.past_show = true;
                                            // this.data.startTime = element.startTime
                                            // this.data.endTime = element.endTime;
                                            this.data.endTime = moment(element.endTime).format("h:mmA ")

                                            break;
                                        }
                                        case 'REJECTED_BY_TUTOR': {
                                            this.data.statusMsg = 'Declined';
                                            this.data.color = '#e1134f';
                                            this.data.past_show = false;
                                            // this.data.startTime = element.startTime
                                            // this.data.endTime = element.endTime;
                                            this.data.endTime = moment(element.endTime).format("h:mmA ")
                                            break;
                                        }
                                        case 'REJECTED_BY_PARENT': {
                                            this.data.statusMsg = 'Declined';
                                            this.data.color = '#e1134f';
                                            this.data.past_show = false;
                                            // this.data.startTime = element.startTime
                                            // this.data.endTime = element.endTime;
                                            this.data.endTime = moment(element.endTime).format("h:mmA ")
                                            break;
                                        }
                                        case 'RESCHEDULE_REJECTED': {
                                            this.data.statusMsg = 'Accepted';
                                            // this.data.color = '#e1134f';
                                            this.data.color = '#227B14';

                                            this.data.past_show = false;
                                            // this.data.startTime = element.startTime
                                            // this.data.endTime = element.endTime;
                                            this.data.endTime = moment(element.endTime).format("h:mmA ")
                                            break;
                                        }

                                        case 'CANCELLED_BY_PARENT': {
                                            this.data.statusMsg = 'Canceled';
                                            this.data.color = '#e1134f';
                                            this.data.past_show = false;
                                            // this.data.startTime = element.startTime
                                            // this.data.endTime = element.endTime;
                                            if (moment(element.originalStartTime).month() == 4) {
                                                this.data.startTime = moment(element.originalStartTime).format("MMM D, YYYY | h:mmA");
                                            }
                                            else {
                                                this.data.startTime = moment(element.originalStartTime).format("MMM. D, YYYY | h:mmA");
                                            }
                                            this.data.endTime = moment(element.originalEndTime).format("h:mmA ")
                                            break;
                                        }
                                        case 'CANCELLED_BY_TUTOR': {
                                            this.data.statusMsg = 'Canceled By Tutor';
                                            this.data.color = '#e1134f';
                                            this.data.past_show = false;
                                            this.data.endTime = moment(element.endTime).format("h:mmA ")
                                            // this.data.startTime = element.startTime
                                            // this.data.endTime = element.endTime;
                                            break;
                                        }
                                        case 'CANCELLED_BY_ADMIN': {
                                            this.data.statusMsg = 'Canceled';
                                            this.data.color = '#e1134f';
                                            this.data.endTime = moment(element.endTime).format("h:mmA ")
                                            // this.data.startTime = element.startTime;
                                            // this.data.endTime = element.endTime;
                                            this.data.past_show = false;
                                            break;
                                        }
                                        case 'SESSION_STARTED':
                                            {
                                                this.data.statusMsg = 'Session Started';
                                                this.data.color = '#227B14';
                                                this.data.past_show = true;
                                                this.data.startTime = moment(element.sessionStartTime).format("MMM. D, YYYY | h:mmA")
                                                if (moment(element.sessionStartTime).month() == 4) {
                                                    this.data.startTime = moment(element.sessionStartTime).format("MMM D, YYYY | h:mmA");
                                                }
                                                else {
                                                    this.data.startTime = moment(element.sessionStartTime).format("MMM. D, YYYY | h:mmA");

                                                }
                                                // this.data.startTime = element.sessionStartTime;
                                                this.data.endTime = '';
                                                break;
                                            }
                                        case 'RESCHEDULE_REQUEST_BY_PARENT':
                                            {
                                                this.data.statusMsg = 'Reschedule Request';
                                                this.data.color = '#5a5a5a';
                                                this.data.past_show = true;
                                                this.data.endTime = moment(element.endTime).format("h:mmA ")
                                                // this.data.startTime = moment(element.rescheduleData ? element.rescheduleData.startTime : element.startTime).format("MMM. D, YYYY | h:mmA")
                                                // this.data.endTime = moment(element.rescheduleData ? element.rescheduleData.endTime : element.endTime).format("h:mmA ");
                                                break;
                                            }
                                        case 'RESCHEDULE_REQUEST_BY_TUTOR':
                                            {
                                                this.data.statusMsg = 'Reschedule Request By Tutor';
                                                this.data.color = '#5a5a5a';
                                                this.data.past_show = true;
                                                this.data.endTime = moment(element.endTime).format("h:mmA ")
                                                // this.data.startTime = moment(element.rescheduleData ? element.rescheduleData.startTime : element.startTime).format("MMM. D, YYYY | h:mmA")
                                                // this.data.endTime = moment(element.rescheduleData ? element.rescheduleData.endTime : element.endTime).format("h:mmA ");
                                                // this.data.startTime  = element.rescheduleData ? element.rescheduleData.startTime : element.startTime;
                                                // this.data.endTime  = element.rescheduleData ? element.rescheduleData.endTime : element.endTime
                                                break;
                                            }

                                        case 'ON_THE_WAY':
                                            {
                                                this.data.statusMsg = 'On The Way';
                                                this.data.color = '#e88420';
                                                this.data.past_show = true;
                                                // this.data.startTime = element.startTime
                                                // this.data.endTime = element.endTime;
                                                this.data.endTime = moment(element.endTime).format("h:mmA ")
                                                break;
                                            }
                                        case 'FINISHED':
                                            {
                                                this.data.statusMsg = 'Finished';
                                                this.data.color = '#f15d25';
                                                this.data.past_show = true;
                                                this.data.startTime = moment(element.sessionStartTime).format("MMM. D, YYYY | h:mmA");
                                                if (moment(element.sessionStartTime).month() == 4) {
                                                    this.data.startTime = moment(element.sessionStartTime).format("MMM D, YYYY | h:mmA");
                                                }
                                                else {
                                                    this.data.startTime = moment(element.sessionStartTime).format("MMM. D, YYYY | h:mmA");

                                                }
                                                this.data.endTime = moment(element.sessionEndTime).format("h:mmA ");
                                                break;
                                            }
                                        case 'DISPUTE_RAISED':
                                            {
                                                this.data.statusMsg = 'Dispute Raised';
                                                this.data.color = '#f15d25';
                                                this.data.past_show = false;
                                                this.data.endTime = moment(element.endTime).format("h:mmA ");
                                                break;
                                            }
                                        case 'HOLD_FAIL':
                                            {
                                                this.data.statusMsg = 'Hold';
                                                this.data.color = '#f15d25';
                                                this.data.past_show = false;
                                                this.data.endTime = moment(element.endTime).format("h:mmA ");
                                                break;
                                            }
                                        case 'COMPLETED':
                                            {
                                                this.data.statusMsg = 'Completed';
                                                this.data.color = '#227B14';
                                                this.data.startTime = moment(element.sessionStartTime).format("MMM. D, YYYY | h:mmA");
                                                if (moment(element.sessionStartTime).month() == 4) {
                                                    this.data.startTime = moment(element.sessionStartTime).format("MMM D, YYYY | h:mmA");
                                                }
                                                else {
                                                    this.data.startTime = moment(element.sessionStartTime).format("MMM. D, YYYY | h:mmA");

                                                }
                                                this.data.endTime = moment(element.sessionEndTime).format("h:mmA ");
                                                this.data.past_show = true;
                                                break;
                                            }
                                        default:
                                            {
                                                this.data.statusMsg = 'Pending';
                                                this.data.color = '#d9ab28';
                                                this.data.past_show = false;
                                                if (moment(element.startTime).month() == 4) {
                                                    this.data.startTime = moment(element.startTime).format("MMM D, YYYY | h:mmA");
                                                }
                                                else {
                                                    this.data.startTime = moment(element.startTime).format("MMM. D, YYYY | h:mmA");

                                                }
                                                // this.data.startTime = moment(element.startTime).format("MMM. D, YYYY | h:mmA");
                                                this.data.endTime = moment(element.endTime).format("h:mmA ");

                                            }
                                            break;

                                    }
                                    this.upcomingSessions.push(this.data);
                                });
                            }
                        }
                    }
                    if (res && res.past && res.past.bookings && res.past.bookings != undefined) {


                        this.allPastSessions = [];
                        if (res.past.bookings.length > 0) {
                            this.allPastSessions = res.past.bookings;
                            this.pastSessions = [];

                            if (res.pastCount && res.pastCount != undefined) {

                                this.past_count = res.pastCount.count;



                            }
                            if (this.allPastSessions && this.allPastSessions != undefined) {
                                this.allPastSessions.forEach((element) => {
                                    this.past_data = {
                                        statusMsg: '',
                                        color: '',
                                        Bookings: '',
                                        up_show: '',
                                        startTime: '',
                                        endTime: '',

                                    };
                                    this.past_data.Bookings = element;
                                    if (moment(element.sessionStartTime).month() == 4) {
                                        this.past_data.startTime = moment(element.sessionStartTime).format("MMM D, YYYY | h:mmA");
                                    }
                                    else {
                                        this.past_data.startTime = moment(element.sessionStartTime).format("MMM. D, YYYY | h:mmA");

                                    }
                                    switch (element.status) {
                                        case 'NEW': {
                                            this.past_data.statusMsg = 'Pending';
                                            this.past_data.color = '#d9ab28';
                                            this.past_data.up_show = false;
                                            this.past_data.endTime = moment(element.endTime).format("h:mmA ");
                                            break;
                                        }
                                        case 'ACCEPTED_BY_TUTOR': {
                                            this.past_data.statusMsg = 'Accepted';
                                            this.past_data.color = '#227B14';
                                            this.past_data.up_show = true;
                                            this.past_data.endTime = moment(element.endTime).format("h:mmA ");
                                            break;
                                        }
                                        case 'RESCHEDULE_ACCEPTED': {
                                            this.past_data.statusMsg = 'Accepted';
                                            this.past_data.color = '#227B14';
                                            this.past_data.up_show = true;
                                            this.past_data.endTime = moment(element.endTime).format("h:mmA ");
                                            break;
                                        }
                                        case 'REJECTED_BY_TUTOR': {
                                            this.past_data.statusMsg = 'Declined by Tutor';
                                            this.past_data.color = '#e1134f';
                                            this.past_data.up_show = false;
                                            this.past_data.endTime = moment(element.endTime).format("h:mmA ");
                                            break;
                                        }
                                        case 'REJECTED_BY_PARENT': {
                                            this.past_data.statusMsg = 'Declined';
                                            this.past_data.color = '#e1134f';
                                            this.past_data.up_show = false;
                                            this.past_data.endTime = moment(element.endTime).format("h:mmA ");
                                            break;
                                        }
                                        case 'RESCHEDULE_REJECTED': {
                                            this.past_data.statusMsg = 'Accepted';
                                            // this.past_data.color = '#e1134f';
                                            this.past_data.color = '#227B14';

                                            this.past_data.up_show = false;
                                            this.past_data.endTime = moment(element.endTime).format("h:mmA ");
                                            break;
                                        }

                                        case 'CANCELLED_BY_PARENT': {
                                            this.past_data.statusMsg = 'Canceled';
                                            this.past_data.color = '#e1134f';
                                            this.past_data.up_show = false;
                                            if (moment(element.startTime).month() == 4) {
                                                this.past_data.startTime = moment(element.startTime).format("MMM D, YYYY | h:mmA");
                                            }
                                            else {
                                                this.past_data.startTime = moment(element.startTime).format("MMM. D, YYYY | h:mmA");
                                            }
                                            this.past_data.endTime = moment(element.endTime).format("h:mmA ");
                                            break;
                                        }
                                        case 'CANCELLED_BY_TUTOR': {
                                            this.past_data.statusMsg = 'Canceled By Tutor';
                                            this.past_data.color = '#e1134f';
                                            this.past_data.up_show = false;
                                            if (moment(element.startTime).month() == 4) {
                                                this.past_data.startTime = moment(element.startTime).format("MMM D, YYYY | h:mmA");
                                            }
                                            else {
                                                this.past_data.startTime = moment(element.startTime).format("MMM. D, YYYY | h:mmA");
                                            }
                                            this.past_data.endTime = moment(element.endTime).format("h:mmA ");
                                            break;
                                        }
                                        case 'COMPLETED':
                                            {
                                                this.past_data.statusMsg = 'Completed';
                                                this.past_data.color = '#227B14';
                                                this.past_data.up_show = true;
                                                this.past_data.endTime = moment(element.sessionEndTime).format("h:mmA ");
                                                break;
                                            }
                                        case 'CANCELLED_BY_ADMIN': {
                                            this.past_data.statusMsg = 'Canceled';
                                            this.past_data.up_show = false;
                                            this.past_data.color = '#e1134f';
                                            if (moment(element.startTime).month() == 4) {
                                                this.past_data.startTime = moment(element.startTime).format("MMM D, YYYY | h:mmA");
                                            }
                                            else {
                                                this.past_data.startTime = moment(element.startTime).format("MMM. D, YYYY | h:mmA");
                                            }
                                            this.past_data.endTime = moment(element.endTime).format("h:mmA ");
                                            break;
                                        }
                                        case 'SESSION_STARTED':
                                            {
                                                this.past_data.statusMsg = 'Session Started';
                                                this.past_data.color = '#227B14';
                                                this.past_data.up_show = true;
                                                this.past_data.endTime = '';
                                                break;
                                            }
                                        case 'RESCHEDULE_REQUEST_BY_PARENT':
                                            {
                                                this.past_data.statusMsg = 'Reschedule Request';
                                                this.past_data.color = '#5a5a5a';
                                                this.past_data.up_show = true;
                                                if (moment(element.startTime).month() == 4) {
                                                    this.past_data.startTime = moment(element.startTime).format("MMM D, YYYY | h:mmA");
                                                }
                                                else {
                                                    this.past_data.startTime = moment(element.startTime).format("MMM. D, YYYY | h:mmA");
                                                }
                                                this.past_data.endTime = moment(element.endTime).format("h:mmA ");
                                                break;
                                            }
                                        case 'RESCHEDULE_REQUEST_BY_TUTOR':
                                            {
                                                this.past_data.statusMsg = 'Reschedule Request By Tutor';
                                                this.past_data.color = '#5a5a5a';
                                                this.past_data.up_show = true;
                                                if (moment(element.startTime).month() == 4) {
                                                    this.past_data.startTime = moment(element.startTime).format("MMM D, YYYY | h:mmA");
                                                }
                                                else {
                                                    this.past_data.startTime = moment(element.startTime).format("MMM. D, YYYY | h:mmA");
                                                }
                                                this.past_data.endTime = moment(element.endTime).format("h:mmA ");
                                                break;
                                            }

                                        case 'ON_THE_WAY':
                                            {
                                                this.past_data.statusMsg = 'On The Way';
                                                this.past_data.color = '#e88420';
                                                this.past_data.up_show = true;
                                                this.past_data.endTime = moment(element.endTime).format("h:mmA ");
                                                break;
                                            }
                                        case 'HOLD_FAIL':
                                            {
                                                this.past_data.statusMsg = 'Hold';
                                                this.past_data.color = '#f15d25';
                                                this.past_data.up_show = false;
                                                if (moment(element.startTime).month() == 4) {
                                                    this.past_data.startTime = moment(element.startTime).format("MMM D, YYYY | h:mmA");
                                                }
                                                else {
                                                    this.past_data.startTime = moment(element.startTime).format("MMM. D, YYYY | h:mmA");
                                                }
                                                this.past_data.endTime = moment(element.endTime).format("h:mmA ");
                                                break;
                                            }
                                        case 'FINISHED':
                                            {
                                                this.past_data.statusMsg = 'Finished';
                                                this.past_data.color = '#227B14';
                                                this.past_data.up_show = true;
                                                this.past_data.endTime = moment(element.sessionEndTime).format("h:mmA ");
                                                break;
                                            }
                                        case 'DISPUTE_RAISED':
                                            {
                                                this.past_data.statusMsg = 'Dispute Raised';
                                                this.past_data.color = '#f15d25';
                                                this.past_data.up_show = false;
                                                this.past_data.endTime = moment(element.sessionEndTime).format("h:mmA ");
                                                break;
                                            }



                                        default:
                                            {
                                                this.past_data.statusMsg = 'Pending';
                                                this.past_data.color = '#d9ab28';
                                                this.past_data.up_show = false;
                                                if (moment(element.startTime).month() == 4) {
                                                    this.past_data.startTime = moment(element.startTime).format("MMM D, YYYY | h:mmA");
                                                }
                                                else {
                                                    this.past_data.startTime = moment(element.startTime).format("MMM. D, YYYY | h:mmA");

                                                }
                                                this.past_data.endTime = moment(element.endTime).format("h:mmA ");

                                            }
                                            break;

                                    }
                                    this.pastSessions.push(this.past_data);

                                });
                            }
                        }


                    }
                }
            });


    }
    changedTab(tab) {
        this.tabIndex = tab.index
        if (tab.index === 0) {
            this.store.dispatch({
                type: sessionsDetails.actionTypes.GET_ALL_UPCOMING_SESSIONS,
                payload: { type: 'UPCOMING', limit: this.up_limit, skip: this.up_skip }
            });
            ga('send', {
                hitType: 'event',
                eventCategory: 'Upcoming Session',
                eventAction: "OK Session",
                eventLabel: "OK Session"
            });
        }
        else {
            this.store.dispatch({
                type: sessionsDetails.actionTypes.GET_ALL_PAST_SESSIONS,
                payload: { type: 'PAST', limit: this.past_limit, skip: this.past_skip }
            });
            ga('send', {
                hitType: 'event',
                eventCategory: 'Child Sessions',
                eventAction: "Child Sessions History",
                eventLabel: "Child Sessions History"
            });
        }
    }
    getDetails(data) {

        this.sessionService.bookingId = data;
        localStorage.setItem('bookingId', data);
        let id = this.tabIndex;
        let booking;
        if (id === 0) {
            booking = 'upcoming';
        } else {
            booking = 'past';
        }
        localStorage.setItem('bookingType', booking);
        this.router.navigate(['/pages/all-sessions/session-details'])
    }
    ngOnInit() {
        this.store.dispatch({
            type: sessionsDetails.actionTypes.GET_ALL_UPCOMING_SESSIONS,
            payload: { type: 'UPCOMING', limit: this.up_limit, skip: this.up_skip }
        });
    }
    pageChangedUpcoming(page) {
        let el = $('#moveUp');
        $('html,body').animate({ scrollTop: (el.offset().top - 50) }, 'slow', () => {
            el.focus();
        });
        let self = this;
        this.up_page = page;
        this.up_skip = (this.up_page - 1) * this.up_limit;
        this.store.dispatch({
            type: sessionsDetails.actionTypes.GET_ALL_UPCOMING_SESSIONS,
            payload: { type: 'UPCOMING', limit: this.up_limit, skip: this.up_skip }
        });

    }
    pageChangedPast(page) {
        let el = $('#moveUp');
        $('html,body').animate({ scrollTop: (el.offset().top - 50) }, 'slow', () => {
            el.focus();
        });
        this.past_page = page;
        this.past_skip = (this.past_page - 1) * this.past_limit;
        this.store.dispatch({
            type: sessionsDetails.actionTypes.GET_ALL_PAST_SESSIONS,
            payload: { type: 'PAST', limit: this.past_limit, skip: this.past_skip }
        });
    }
    // checkStatus(status) {
    //     let check_status = status;
    //     switch (check_status) {
    //         case 'BOOKING_ACCEPTED':
    //             this.status = 'ACCEPTED'
    //             break;
    //         case 'CANCEL_BOOKING_BY_TUTOR':
    //             this.status = 'CANCELLED'
    //             break;
    //         case 'RESCHEDULE_REQUEST_BY_TUTOR':
    //             this.status = 'RESCHEDULED';
    //             break;
    //         case 'RESCHEDULE_ACCEPTED':
    //             this.status = 'RESCHEDULED';
    //             break;
    //         case 'BOOKING_REJECTED':
    //             this.status = 'REJECTED';
    //             break;
    //         case 'RESCHEDULE_REJECTED':
    //             this.status = 'REJECTED';
    //             break;
    //         default:
    //             break;
    //     }

    // }

    ngOnDestroy() {
        if (this.sessionStore && this.sessionStore != undefined) {
            this.sessionStore.unsubscribe();
        }
        if (localStorage.getItem('goToUpcoming')) {
            localStorage.removeItem('goToUpcoming')
        }
        let bookingData = localStorage.getItem('bookingAvailable');
        if (document.cookie) {
            let domainParts = window.location.host.split('.');
            domainParts.shift();
            let domain = '.' + domainParts.join('.');
            let expireDate = new Date();
            let d = expireDate.toUTCString();
            document.cookie = 'bookingData=' + bookingData + ';domain=' + domain + ';expires=' + d + + "; SameSite=Strict; secure";
        }
        if (localStorage.getItem('bookingAvailable')) {

            localStorage.removeItem('bookingAvailable');
        }
    }

}
