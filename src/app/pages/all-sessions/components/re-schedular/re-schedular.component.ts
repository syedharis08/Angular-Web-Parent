import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import * as reschedular from './state/re-schedular.actions';
import * as moment from 'moment';
import { TutorService } from '../../../../services/tutor-service/tutor.service';
import 'style-loader!./re-schedular.scss';
import { calendarConst, CalendarEventRescheduleService } from '../../../../services/calender-reschedule-service/calender-reschedule.service';
import { Subscription } from 'rxjs/Rx';
import * as sessionsDetails from '../../state/all-sessions.actions';

@Component({
    selector: 'reschedule',
    template: `
        <div>
            <div class="all-schedule">

                <div class="second row">
                    <div class="calendersection">
                        <div class="calenerheading">
                            <h2 class="font-28 proximanova-light">Choose a date</h2>
                        </div>
                        <div class="calenderComponent">
                            <calender (onSelectDate)='dayValue($event)'
                                      [newDateSelected]="dataFromCalenderEvent"></calender>
                        </div>
                    </div>
                    <div class="schedularsection">
                        <div class="schedularheading">
                            <h2 class="font-28 proximanova-light">Choose a time</h2>
                        </div>
                        <div class="schedularComponent">
                            <calendar-event [reselectedDateUpdate]="currentSelectedDate"
                                            (dataToSend)='receiveData($event)'></calendar-event>
                        </div>
                    </div>

                </div>

                <div class="date-content row  proximanova-semibold" *ngIf='this.dataFromCalenderEvent.length != 0'>
                    {{timeToDisplay}}
                </div>
                <div class="third row">
                    <button type="submit" (click)='setAvailabilty()'
                            [disabled]='buttonDisabledReschudule || buttonDisabledOriginal || this.dataFromCalenderEvent.length == 0 '>
                        Proceed to Session
                        Review<span
                        class="btn-arrow"> <i aria-hidden="true" class="fa fa-md fa-arrow-right"></i></span>
                    </button>
                </div>

            </div>


        </div>
    `,
    providers: [CalendarEventRescheduleService]
})
export class ReSchedular {
    timeToDisplay: any;
    currentSelectedDate: any;
    dataFromCalenderEvent: any = [];
    datesToRemove: any = [];
    dateToDisplay: any;
    tutorId: any;
    shortMonth: any;
    steponeData: any;
    slots: any;
    childId: string;
    sessionStore: Subscription;
    subjects = [];
    bookingId: any;
    editEndTime: any;
    bookingData: any = [];
    buttonDisabledOriginal = false;
    buttonDisabledReschudule = false;

    constructor(private store: Store<any>, private router: Router, private calendareventservice: CalendarEventRescheduleService, private tutorService: TutorService) {
        this.slots = [];
        if (this.tutorService.getId && this.tutorService.getId != undefined) {
            this.tutorId = this.tutorService.getId;
        } else {
            if (localStorage.getItem('tutor_Id') && localStorage.getItem('tutor_Id') != undefined) {
                this.tutorId = localStorage.getItem('tutor_Id');
            } else {
                this.tutorId = '';
            }

        }
        this.sessionStore = this.store.select('session').subscribe((res: any) => {
            if (res) {
                if (res.steponeData && res.steponeData != undefined)

                    this.steponeData = res.steponeData;
                if (this.steponeData && this.steponeData != undefined) {
                    this.childId = this.steponeData.child;
                    this.subjects = [];
                    this.steponeData.subjectControl.map((value, key) => {
                        this.subjects.push(value._id);
                    });
                }
            }

        });

        this.sessionStore = this.store.select('sessionsDetails').subscribe((res: any) => {
            if (res) {
                if (res.bookingById) {
                    this.bookingData = res.bookingById;
                }
            }

        });

    }

    ngOnInit() {
        this.getBookingData();
    }

    checkDisbledDate() {
        let originalBookingSlots = this.bookingData.slots.map(ele => {
            return ele.startTime;
        });

        let dataFromCalenderEvent = this.dataFromCalenderEvent.map(ele => {
            return moment(ele.date + 'T' + ele.startTime, 'YYYY-MM-DD[T]HH:mm').toISOString();
        });
        const isMatch = dataFromCalenderEvent.every(elem => originalBookingSlots.includes(elem));
        this.buttonDisabledOriginal = !!isMatch;

        if (this.bookingData.rescheduleData && this.bookingData.rescheduleData.slots
            && Array.isArray(this.bookingData.rescheduleData.slots)
            && this.bookingData.rescheduleData.slots.length
            && this.bookingData.status != 'RESCHEDULE_REJECTED') {
            let originalRescheduleSlots = this.bookingData.rescheduleData.slots.map(ele => {
                return ele.startTime;
            });
            const isMatchNew = dataFromCalenderEvent.every(elem => originalRescheduleSlots.includes(elem));
            this.buttonDisabledReschudule = !!isMatchNew;
        }
    }

    getBookingData() {
        if (localStorage.getItem('bookingId')) {
            this.bookingId = localStorage.getItem('bookingId');
            if (this.bookingId != undefined) {
                this.store.dispatch({
                    type: sessionsDetails.actionTypes.GET_BOOKING_BY_ID,
                    payload: this.bookingId
                });
            }
        }
    }

    dayValue(date) {
        this.currentSelectedDate = date;
        let d = date.mDate._d.toString();
        let curDate = new Date(d);
        let fullMonths = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];

        let shortMonth = fullMonths[curDate.getMonth()];
        this.shortMonth = shortMonth + ' ' + curDate.getDate() + ', ' + curDate.getFullYear();
        this.dateToDisplay = moment(this.currentSelectedDate.mDate).format('LL');
    }

    receiveData(data) {
        if (data.length == 0) {
            this.timeToDisplay = undefined;
        }
        this.dataFromCalenderEvent = data;
        let last;
        if (this.dataFromCalenderEvent.length > 0) {
            let first = this.dataFromCalenderEvent[0];
            if (this.dataFromCalenderEvent[0].endTime) {
                last = this.dataFromCalenderEvent[this.dataFromCalenderEvent.length - 1];
            } else {
                last = this.dataFromCalenderEvent[this.dataFromCalenderEvent.length - 1];
            }
            let indexOfLast = calendarConst.timeData.indexOf(last.startTime);
            let lastvalue = calendarConst.timeData[indexOfLast + 1];
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
            } else
                this.timeToDisplay = this.shortMonth + ' | ' + timeStart + '-' + timeEnd;

            this.checkDisbledDate();

        }

    }

    setAvailabilty() {
        let fd = new FormData();
        let stringDate = this.dataFromCalenderEvent[0].selectDateWeek.toString();
        let convertedDate = new Date(stringDate);
        if (this.dataFromCalenderEvent && this.dataFromCalenderEvent != undefined) {
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

            let rescheduleData = {
                startTime: finalStartTime.toUTCString(),
                endTime: finalEndtTime.toUTCString(),
                slots: JSON.stringify(this.slots)
            };

            localStorage.setItem('Rescheduled_Data', JSON.stringify(rescheduleData));
            this.store.dispatch({
                type: reschedular.actionTypes.GOTO_RESCHEDULE,
                payload: rescheduleData
            });
        }

    }

    ngOnDestroy() {
        if (this.sessionStore && this.sessionStore != undefined) {
            this.sessionStore.unsubscribe();
        }
    }

}
