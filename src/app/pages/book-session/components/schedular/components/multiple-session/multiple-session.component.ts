// import { CalendarEventService, calendarConst } from './components/calender-event/calendar-event.service';
import { Component, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { CanActivate, Router, ActivatedRoute } from '@angular/router';
import { Effect, Actions } from '@ngrx/effects';
import * as schedular from './state/schedular.actions';
import * as session from './../../state/book-session.actions';
import * as moment from 'moment';
import * as _ from 'lodash';
import 'style-loader!./multiple-session.scss';
import { Subscription } from 'rxjs/Rx';
import { MatStepper } from '@angular/material';
import { CheckTutorDialog } from '../../../../auth/model/check-tutor-dialog/check-tutor-dialog';
import { MatDialog } from '@angular/material';
import {
    CalendarEventService,
    calendarConst,
    calendarConstReplica
} from '../../../../../../services/calender-service/calendar-event.service';
import { TutorService } from '../../../../../../services/tutor-service/tutor.service';
import { BookSessionService } from '../../../../../../services/session-service/session.service';
import moment1 from 'moment-timezone';

@Component({
    selector: 'multiple-session',
    templateUrl: './multiple-session.html',
    providers: [CalendarEventService],
    styles: [`
        .marginL {
            margin-left: 300px;
        }

        @media screen and (max-width: 460px) {
            .marginL {
                margin-left: 0px;
            }
        }

        @media screen and (min-width: 461px) and (max-width: 1200px) {
            .marginL {
                margin-left: 0px;
            }
        }
    `]
})
export class MultipleSessionComponent implements AfterViewInit {
    timeToDisplay: any;
    @ViewChild('stepper') stepper: MatStepper;
    currentSelectedDate: any;
    showClender: boolean = false;
    hideTable: boolean = true;
    newDateFromWeek: any;
    public mainArray: any = [];
    index: any;
    public sessionLengthSubscription: Subscription;
    dataFromCalenderEvent: any = [];
    datesToRemove: any = [];
    public stepTwoData: any;
    dateToDisplay: any;
    tutorId: any;
    shortMonth: any;
    steponeData: any;
    childId: string;
    sessionStore: Subscription;
    sessionDatalength: any;
    slots = [];
    editEndTime;
    showEmptyError: boolean = false;
    public step2data: boolean = false;
    web: boolean;
    browserTz: any = moment1.tz.guess();
    bookingTz: any;
    showTzMsg: boolean;
    showTimer = true;

    constructor(private store: Store<any>, private dialog: MatDialog, public zone: NgZone, private router: Router, private calendareventservice: CalendarEventService, private tutorService: TutorService, private sessionService: BookSessionService, private snapshot: ActivatedRoute) {
        if (screen.width >= 1023) {
            this.web = true;
        } else {
            this.web = false;

        }

        if (localStorage.getItem('timezoneOffsetZone')) {
            this.checkTimeZone();
        }

        if (localStorage.getItem('finalSlot')) {
            this.mainArray = JSON.parse(localStorage.getItem('finalSlot'));
            if (typeof this.mainArray == 'string') {
                this.mainArray = JSON.parse(localStorage.getItem('finalSlot'));
            }
        }
        if (this.mainArray == null) {
            this.mainArray = [];
        }
        this.sessionDatalength = this.sessionService.getSessionData();
        if (this.tutorService.getId && this.tutorService.getId != undefined) {
            this.tutorId = this.tutorService.getId;
        } else {
            if (localStorage.getItem('tutor_Id') && localStorage.getItem('tutor_Id') != undefined) {
                this.tutorId = localStorage.getItem('tutor_Id');
            } else {
                this.tutorId = '';
            }

        }

        this.index = this.sessionService.getTableIndex();
        this.sessionStore = this.store.select('session').subscribe((res: any) => {
            if (res) {
                if (res.steponeData && res.steponeData != undefined)

                    this.steponeData = res.steponeData;
                if (this.steponeData && this.steponeData != undefined) {

                    this.step2data = true;

                }

            }

        });

    }

    ngOnInit() {
        if (localStorage.getItem('slotSelected') != undefined) {
            let slots = JSON.parse(localStorage.getItem('slotSelected'));
            // this.receiveData(slots);

        }

    }

    ngAfterViewInit() {

    }

    checkTimeZone() {
        this.browserTz = moment1.tz(this.browserTz).format('z');
        if (localStorage.getItem('timezoneOffsetZone')) {
            this.bookingTz = moment1.tz(localStorage.getItem('timezoneOffsetZone')).format('z');

            if (this.bookingTz != this.browserTz) {

                if (this.bookingTz != this.tutorService.checkDayLightTimeZone(this.browserTz)) {
                    this.showTzMsg = true;
                } else {
                    this.showTzMsg = false;
                }

            } else {
                this.showTzMsg = false;
            }
        }

    }

    dayValue(date) {

        this.showTimer = false;
        let d;
        // this.currentSelectedDate = date;
        if (date.mDate._d) {
            d = date.mDate._d.toString();
            // d = date.mDate._d;
        } else {
            d = date.mDate;
        }

        // local test
        // if (date.mDate._d != undefined) {
        //     d = date.mDate._d.toString();
        //
        // } else {
        //     d = date.mDate;
        // }

        let curDate = new Date(d);
        let fullMonths = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];

        let shortMonth = fullMonths[curDate.getMonth()];
        this.shortMonth = shortMonth + ' ' + curDate.getDate() + ',' + ' ';
        this.dateToDisplay = moment(date.mDate).format('LL');

        // this.timeToDisplay = undefined;

        this.showTimer = true;
        setTimeout(() => {
            this.currentSelectedDate = date;
        }, 50);
    }

    receiveData(data) {
        if (data.length == 0) {
            this.timeToDisplay = undefined;
        }

        this.dataFromCalenderEvent = data;
        this.sessionService.setCalenderData(data);
        let last;
        if (this.dataFromCalenderEvent.length > 0) {
            let first = this.dataFromCalenderEvent[0];
            if (this.dataFromCalenderEvent[0].endTime) {
                last = this.dataFromCalenderEvent[this.dataFromCalenderEvent.length - 1];
            } else {
                last = this.dataFromCalenderEvent[this.dataFromCalenderEvent.length - 1];
            }
            let indexOfLast = calendarConstReplica.timeData.indexOf(last.startTime);
            let lastvalue = calendarConstReplica.timeData[indexOfLast + 1];
            let timeStart = this.calendareventservice.convertTime(first.startTime);
            let timeEnd = this.calendareventservice.convertTime(lastvalue);
            if (lastvalue) {
                this.editEndTime = lastvalue.toString();
            } else {
                this.editEndTime = (moment(timeEnd, 'hh:mmA').format('HH:mm')).toString();
            }

            if (data[0].selectDateWeek) {
                if (moment(data[0].selectDateWeek).month() == 4) {
                    this.timeToDisplay = moment(data[0].selectDateWeek).format('MMM D, YYYY') + ' | ' + timeStart + '-' + timeEnd;
                } else {
                    this.timeToDisplay = moment(data[0].selectDateWeek).format('MMM. D, YYYY') + ' | ' + timeStart + '-' + timeEnd;
                }
            } else {
                this.timeToDisplay = this.shortMonth + ' | ' + timeStart + '-' + timeEnd;
            }
        }
    }

    setAvailabilty() {
        this.sessionService.updateStepperIndex(2);
        this.sessionService.changeStep.next(2);
        let elements = document.getElementsByClassName('mat-horizontal-content-container')[0];
        let childNode = elements.childNodes[2] as HTMLElement;
        childNode.style.overflow = 'hidden';
        // document.getElementsByClassName('mat-horizontal-content-container')[0].childNodes[2].style.overflow = 'hidden'
        ga('send', {
            hitType: 'event',
            eventCategory: 'Book a Session',
            eventAction: 'Book a Session Step 2',
            eventLabel: 'Book a Session Step 2 Next'
        });
        let fd = new FormData();
        // let stringDate = this.dateToDisplay.toString();
        let stringDate = this.dataFromCalenderEvent[0].selectDateWeek.toString();

        let convertedDate = new Date(stringDate);
        if (this.dataFromCalenderEvent && this.dataFromCalenderEvent != undefined) {
            this.slots = [];
            for (let j = 0; j < this.dataFromCalenderEvent.length; j++) {
                this.slots.push(this.dataFromCalenderEvent[j]._id);
            }
            let startTime = this.dataFromCalenderEvent[0].startTime;
            let stringStartTime = startTime.toString();
            let time = stringStartTime.split(':');
            convertedDate.setHours(time[0]);
            convertedDate.setMinutes(time[1]);
            let finalStartTime = convertedDate;
            let convertedEndDate = new Date(stringDate);
            let end_time = this.editEndTime.split(':');
            convertedEndDate.setHours(end_time[0]);
            convertedEndDate.setMinutes(end_time[1]);
            let finalEndtTime = convertedEndDate;
            // }
            if (this.slots && this.slots != undefined) {
                this.stepTwoData = {
                    startDate: finalStartTime.toUTCString(),
                    endDate: finalEndtTime.toUTCString(),
                    slots: JSON.stringify(this.slots)
                };
                let head = document.getElementsByClassName('mat-horizontal-stepper-header');
                this.sessionService.stepTwoData(this.stepTwoData);
                this.sessionService.changeStep.next(2);
                // this.store.dispatch({
                //     type: session.actionTypes.GOTO_BOOK_SESSION_STEP3,
                //     payload: this.stepTwoData
                // });
            }

            // fd.append('startDate', moment.utc(this.currentSelectedDate).format());
            // fd.append('endDate', moment.utc().add(1, 'month').format());
            // fd.append('slots', JSON.stringify(this.dataFromCalenderEvent));
            // fd.append('slotsIdToRemove', JSON.stringify(this.datesToRemove));
            // fd.append('tutorId', this.tutorId);
            // fd.append('studentId', this.childId);
            // fd.append('locationDetails',JSON.stringify(this.addressdetails));

            // this.store.dispatch({
            //     type: schedular.actionTypes.SET_AVAILABILTY,
            //     payload: {availibility: fd,stepTwoData:this.stepTwoData}
            // });
        }
    }

    ngOnDestroy() {
        if (this.sessionStore && this.sessionStore != undefined) {
            this.sessionStore.unsubscribe();
        }

    }

    cancel() {
        if (localStorage.getItem('tempData')) {
            localStorage.setItem('finalSlot', localStorage.getItem('finalSlotTemp'));
            this.sessionService.setSessionData(JSON.parse(localStorage.getItem('tempSlots')));
        }
        if (localStorage.getItem('tempData'))
            localStorage.removeItem('tempData');
        if (localStorage.getItem('finalSlotTemp'))
            localStorage.removeItem('finalSlotTemp');
        if (localStorage.getItem('tempData')) {
            localStorage.removeItem('tempData');
        }
        localStorage.setItem('goBack', 'true');
        this.router.navigate(['/pages/book-session/session']).then(() => {
            this.sessionService.updateStepperIndex(1);
            this.sessionService.changeStep.next(1);
            let el = $('#moveUp');
            $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
                el.focus();
            });
            let lines = document.getElementsByClassName('mat-stepper-horizontal-line');
            setTimeout(() => {
                lines[0].className = 'blue-line mat-stepper-horizontal-line';
            }, 500);
        });
    }

    selectedDate() {
        // debugger;
        if (localStorage.getItem('tempData'))
            localStorage.removeItem('tempData');
        if (localStorage.getItem('finalSlotTemp'))
            localStorage.removeItem('finalSlotTemp');
        if (localStorage.getItem('tempData')) {
            localStorage.removeItem('tempData');
        }
        localStorage.setItem('goBack', 'true');
        let slotsData = this.sessionService.getSlotsArray();
        if (slotsData == null || slotsData == undefined || !slotsData) {
            this.showEmptyError = true;
        } else {
            let newSlots = [];
            if (slotsData) {
                for (let j = 0; j < slotsData.length; j++) {
                    newSlots.push(slotsData[j]._id);
                }
            }
            if (this.timeToDisplay) {
                this.showEmptyError = false;
                this.mainArray.push(slotsData);

                localStorage.setItem('finalSlot', JSON.stringify(this.mainArray));
                let dateTime = this.timeToDisplay.split('|');
                let data = this.sessionService.getSessionData();

                for (let i = 0; i < data.length; i++) {
                    if (i == this.index) {
                        data[i]['date'] = dateTime[0];
                        data[i]['time'] = dateTime[1];
                        data[i]['slots'] = newSlots;
                        let time = dateTime[1].split('-');
                        let time1 = moment(time[0], 'h:mmA').format('HH:mm');
                        let endTime1 = moment(time[1], 'h:mmA').format('HH:mm');
                        data[i]['dateTime'] = dateTime[0] + time1;
                    }
                }
                this.sessionService.setErrorMessage(false, false);
                // this.sessionService.setMessage(false);
                this.sessionService.setSessionData(data);
                this.router.navigate(['/pages/book-session/session']).then(() => {
                    this.sessionService.updateStepperIndex(1);
                    this.sessionService.changeStep.next(1);
                    let el = $('#moveUp');
                    $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
                        el.focus();
                    });
                    let lines = document.getElementsByClassName('mat-stepper-horizontal-line');
                    setTimeout(() => {
                        lines[0].className = 'blue-line mat-stepper-horizontal-line';
                    }, 500);
                });
            } else {
                this.showEmptyError = true;
            }

        }

    }
}
