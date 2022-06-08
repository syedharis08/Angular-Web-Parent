import { Component, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BookSessionService } from '../../../../../../services/session-service/session.service';
import { CalendarEventRescheduleService, calendarConst } from '../../../../../../services/calender-reschedule-service/calender-reschedule.service';
import * as moment from 'moment';
import { OnChanges, SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import * as _ from 'lodash';
import { Store } from '@ngrx/store';

@Component({
    selector: 'calendar-event',
    templateUrl: './calendar-event.html',
    styleUrls: ['./calendar-event.scss'],
})
export class CalendarEventComponent implements OnInit, OnChanges {
    visbiltyUpdate: boolean = false;
    newdummyslot: any;
    responseFromGetApi: any;
    dateData: any;
    getAvailabiltyStartDate: any = moment.utc().startOf('day').format();
    getAvailabiltyEndDate: any = moment.utc().add(4, 'month').format();
    public selectedTypeOfCal: string = 'day';

    finalSlotArray: any = [];
    public selectedSlotsDay: any = [];
    slotArray: any = [];
    calendar: any = {};
    calendarConst = calendarConst;
    selectedDuration: number;
    consecutiveSlot: any = this.selectedDuration / 0.5;
    @Input() reselectedDateUpdate;
    @Output() dataToSend = new EventEmitter<any>();

    constructor(private CalendarEventRescheduleService: CalendarEventRescheduleService, private sessionService: BookSessionService, private modalService: NgbModal, private store: Store<any>) {
        // window.scroll(0, 0);
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
        this.store.select('reschedular').subscribe((res: any) => {
            if (res.rescheduleData && res.rescheduleData != undefined) {
                this.selectedDuration = res.rescheduleData.duration;
                this.consecutiveSlot = this.selectedDuration / 0.5;
            } else {
                if (localStorage.getItem('tuorId_Reschedule') != undefined) {
                    let reschedule = JSON.parse(localStorage.getItem('tuorId_Reschedule'));
                    this.selectedDuration = reschedule.duration;
                    this.consecutiveSlot = this.selectedDuration / 0.5;
                }

            }
            if (res.setAvailabilySuccess) {
                this.responseFromGetApi = res.setAvailabilySuccess;
                this.formatedResponse();
            }
        });
        this.store.select('session').subscribe((res: any) => {

            // if (res && res.steponeData && res.steponeData != undefined && res.steponeData.duration) {
            //   this.selectedDuration = res.steponeData.duration;
            //   this.consecutiveSlot = this.selectedDuration / 0.5;
            // }
            // else {
            //   this.selectedDuration = 2;
            //   this.consecutiveSlot = this.selectedDuration / 0.5;
            // }
        });

    };

    formatedResponse = function () {
        this.slotArray = [];
        this.responseFromGetApi.forEach((value) => {
            value.slots.forEach((obj) => {
                let tempdate = moment.utc(value.date).startOf('day').add(obj.startTime).format();
                let slot = {
                    _id: obj._id,
                    availableSlot: tempdate.split('T').reverse()[0].substring(0, 5),
                    date: tempdate.split('T')[0]
                };
                this.slotArray.push(slot);
            });

        });
    };

    ngOnChanges(changes: SimpleChanges) {
        if (changes.reselectedDateUpdate.currentValue) {
            this.visbiltyUpdate = true;
            let dateReceived = moment(changes.reselectedDateUpdate.currentValue.mDate).format();
            this.dateData = dateReceived;
            if (this.selectedTypeOfCal == 'day') {
                this.setDayData('updated');
            } else {
                this.setWeekData('updated');
            }
            if (document.getElementById('scrollUpReschedule') != undefined) {
                let elmnt = document.getElementById('scrollUpReschedule');
                elmnt.scrollTop = 570;
            }
            // this.setDayData('updated');
        }
    }

    updateStatus(date) {
        this.newdummyslot = _.cloneDeep(calendarConst.dummyslot);
        this.slotArray.forEach((obj) => {
            if (obj.date == moment(date).format('YYYY-MM-DD')) {
                let index = _.findIndex(this.newdummyslot, {startTime: obj.availableSlot});
                if (index != -1) {
                    this.newdummyslot[index].status = true;
                    this.newdummyslot[index]._id = obj._id;
                }
                if (this.selectedSlotsDay.length) {
                    if (moment(this.selectedSlotsDay[0].date).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')) {
                        this.selectedSlotsDay.forEach((day) => {
                            let indexInner = _.findIndex(this.newdummyslot, {startTime: day.startTime});
                            if (indexInner != -1) {
                                this.newdummyslot[indexInner].status = false;
                                // this.newdummyslot[indexInner]._id = obj._id;
                            }
                        });
                    }
                }
            }
        });

        return this.newdummyslot;
    }

    setDayData(dayFlag: String): void {

        this.calendar.changeView = 'day';
        let date;
        switch (dayFlag) {
            case 'prev':
                date = new Date(this.calendar.currentTimeDay);
                date = new Date(date.setDate(date.getDate() - 1));
                break;
            case 'next':
                date = new Date(this.calendar.currentTimeDay);
                date = new Date(date.setDate(date.getDate() + 1));
                break;
            case 'updated':
                date = new Date(this.dateData);
                break;
            default:
                date = this.dateData ? new Date(this.dateData) : new Date();
        }

        this.calendar.currentYear = date.getFullYear();
        this.calendar.currentMonth = calendarConst.fullMonth[date.getMonth()];
        this.calendar.currentTimeDay = date;
        this.calendar.dayDataCal = {day: calendarConst.fullDay[date.getDay()], date: (date.getDate()), fulldate: date, slot: this.updateStatus(date)};
        //hit api to get details
    }

    setWeekData(weekFlag: String): void {
        this.calendar.changeView = 'week';
        let date;
        switch (weekFlag) {
            case 'prev':
                date = new Date(this.calendar.weekDataCal[0].fulldate);
                date = new Date(date.setDate(date.getDate() - 1));
                break;
            case 'next':
                date = new Date(this.calendar.weekDataCal[6].fulldate);
                date = new Date(date.setDate(date.getDate() + 1));
                break;
            default:
                date = this.dateData ? new Date(this.dateData) : new Date();
                weekFlag = this.dateData ? 'updated' : '';
        }
        this.calendar.currentMonthIndex = date.getMonth();
        this.calendar.currentYear = date.getFullYear();
        this.calendar.currentMonth = calendarConst.fullMonth[date.getMonth()];
        this.calendar.currentMonthNext = calendarConst.fullMonth[date.getMonth()];

        this.CalendarEventRescheduleService.getDaysInWeek(weekFlag == '' ? 1 : date).then(currentWeekList => {
            this.calendar.weekDataCal = [];
            for (let i = 0; i < currentWeekList.length; i++) {
                this.calendar.weekDataCal.push({day: calendarConst.sortDay[i], date: currentWeekList[i].getDate(), fulldate: currentWeekList[i], slot: this.updateStatus(currentWeekList[i])});
            }
            this.calendar.currentMonth = calendarConst.fullMonth[currentWeekList[0].getMonth()];
            this.calendar.currentMonthNext = calendarConst.fullMonth[currentWeekList[6].getMonth()];
        });
        //hit api to get details
    }

    ngOnInit() {
        let now = new Date();
        let nowNew = new Date(new Date(now).getTime() + 60 * 60 * 24 * 1000);
        // let getAvailabiltyEndDate: any = new Date(new Date().getFullYear(), new Date().getMonth() + 2, new Date().getDate()-1).toUTCString();
        let momentDate: any = moment().add(121, 'days');
        if (localStorage.getItem('endDateCode')) {
            if (moment(localStorage.getItem('endDateCode')).isBefore(momentDate)) {
                momentDate = moment(localStorage.getItem('endDateCode'));
            }
        }
        let getAvailabiltyEndDate: any = new Date(momentDate.year(), momentDate.month(), momentDate.date(), 23, 59, 59).toUTCString();

        this.CalendarEventRescheduleService.getAvaibility(nowNew.toUTCString(), getAvailabiltyEndDate).subscribe((result) => {
            this.responseFromGetApi = result.data;
            this.formatedResponse();
            this.setDayData('');
        });
    }

    changeViewCal(view: any): void {
        if (view == 'day') {
            this.selectedTypeOfCal = 'day';

            this.setDayData('');
        } else if (view == 'week') {
            this.selectedTypeOfCal = 'week';
            this.setWeekData('');
        }
    }

    prvData(): void {
        if (this.calendar.changeView == 'day') {

            this.setDayData('prev');
        } else if (this.calendar.changeView == 'week') {
            this.setWeekData('prev');
        }
    }

    nextData(): void {
        if (this.calendar.changeView == 'day') {
            this.setDayData('next');
        } else if (this.calendar.changeView == 'week') {
            this.setWeekData('next');
        }
    }

    // checkWeekDay(day) {
    //   if (day == 'Sun' || day == 'Sat') {
    //     return false;
    //   } else {
    //     return true;
    //   }
    // }

    getClass(status, id) {
        if (id) {
            if (status) {
                return 'cal-bg-fill';
            } else {
                return 'cal-bg-selected';
            }
        } else {
            return 'dummyslots';
        }
    }

    showEvent(item, index, allslot, from, cal) {
        // debugger;
        this.selectedSlotsDay = [];
        if (item._id) {
            this.finalSlotArray = [];
            if (item.status) {
                // allslot.forEach((value) => {
                //   if (value._id) {
                //     value.status = 'true';
                //   }
                // });

                if (from == 0) {
                    allslot.forEach((value) => {
                        if (value._id) {
                            value.status = 'true';
                        }
                    });

                } else {
                    this.calendar.weekDataCal.forEach((DayData) => {
                        DayData.slot.forEach((day) => {
                            if (day._id) {
                                day.status = 'true';
                            }

                        });
                    });

                }
                let consecutiveArray = [];
                for (let i = 0; i <= (this.consecutiveSlot - 1); i++) {
                    if ((index + i) > allslot.length) {
                        return;
                    } else {
                        consecutiveArray.push(allslot[index + i]);
                    }

                }
                if (_.findIndex(consecutiveArray, {status: false}) == -1) {
                    // consecutiveArray.forEach((val) => {
                    //   let itemIndex = _.findIndex(allslot, { _id: val._id });
                    //   allslot[itemIndex].status = false;
                    //   this.finalSlotArray.push(val);
                    // });
                    consecutiveArray.forEach((val) => {
                        let itemIndex = _.findIndex(allslot, {_id: val._id});
                        allslot[itemIndex].status = false;
                        val.selectDateWeek = cal.fulldate ? cal.fulldate : cal.currentTimeDay;
                        let newVal = val;
                        newVal.date = moment(val.selectDateWeek).format('YYYY-MM-DD');
                        this.dateData = moment(val.selectDateWeek).format();
                        this.selectedSlotsDay.push(newVal);
                        this.finalSlotArray.push(val);
                    });
                    this.dataToSend.emit(this.finalSlotArray);
                } else {
                }
                return;
            } else {
                allslot.forEach((value) => {
                    if (value._id) {
                        value.status = 'true';
                    }
                    this.finalSlotArray = [];
                    this.dataToSend.emit(this.finalSlotArray);
                });
                return;
            }
        } else {
            //show error message 'Tutor not avaiable at this time'
            return false;
        }

    }
}
