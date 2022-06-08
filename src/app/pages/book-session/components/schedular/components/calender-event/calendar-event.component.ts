import { layoutPaths } from './../../../../../../theme/theme.constants';
import { CalendarDate } from './../calender/calender.component';
import { CancelDialog } from './../cancellation/cancel.component';
import { Response } from '@angular/http';
import { forEach } from '@angular/router/src/utils/collection';
import { Component, OnInit, ElementRef, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { CalendarEventService, calendarConst } from './calendar-event.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BookSessionService } from '../../../../../../services/session-service/session.service';
import {
    CalendarEventService,
    calendarConst
} from '../../../../../../services/calender-service/calendar-event.service';
import * as moment from 'moment';
import { OnChanges, SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import * as _ from 'lodash';
import { Store } from '@ngrx/store';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { scrollTo } from 'ng2-utils';
import { BaThemeSpinner } from '../../../../../../theme/services';

@Component({
    selector: 'calendar-event',
    templateUrl: './calendar-event.html',
    styleUrls: ['./calendar-event.scss']
    // providers: [CalendarEventService]
})
export class CalendarEventComponent implements OnInit, OnChanges, AfterViewInit {
    convertedDate: any;
    visbiltyUpdate: boolean = true;
    newdummyslot: any;
    responseFromGetApi: any;
    public timeDifference;
    public selectedTypeOfCal: string = 'day';
    dateData: any;
    getAvailabiltyStartDate: any = moment.utc().startOf('day').format();
    getAvailabiltyEndDate: any = moment.utc().add(4, 'month').format();
    cancelPolicy;
    finalSlotArray: any = [];
    finalSlotData: any = [];
    tableRowIndex: any;
    // public mainArray: any =[];
    public selectedSlotsDay: any = [];
    slotArray: any = [];
    calendar: any = {};
    calendarConst = calendarConst;
    selectedDuration: number = 2;
    consecutiveSlot: any = this.selectedDuration / 0.5;
    public changeValueSubscription: Subscription;
    @Input() selectedDateUpdate;

    @Output() dataToSend = new EventEmitter<any>();
    tempVariable: boolean;

    constructor(private CalendarEventService: CalendarEventService,
                private dialog: MatDialog,
                private sessionService: BookSessionService,
                private modalService: NgbModal,
                private baThemeSpinner: BaThemeSpinner,
                private store: Store<any>) {
        setTimeout(() => {
            if (localStorage.getItem('finalSlot')) {
                this.visbiltyUpdate = true;
                this.tempVariable = true;
            }
        }, 1);

        this.store.select('schedular').subscribe((res: any) => {
            if (res.setAvailabilySuccess && res.setAvailabilySuccess != undefined) {
                this.visbiltyUpdate = true;
                this.responseFromGetApi = res.setAvailabilySuccess;
                this.formatedResponse();
            }
        });
        if (this.sessionService.getStepperOneData() != undefined) {

            let stepperdata = this.sessionService.getStepperOneData();
            if (stepperdata != undefined) {
                this.selectedDuration = stepperdata.duration;
                this.consecutiveSlot = this.selectedDuration / 0.5;
            }

        }

        this.changeValueSubscription = this.sessionService.step.debounceTime(10).subscribe((values) => {
            if (this.sessionService.getStepperOneData() != undefined) {
                let stepperdata = this.sessionService.getStepperOneData();
                if (stepperdata != undefined) {

                    if (this.selectedDuration != stepperdata.duration) {
                        this.selectedSlotsDay = [];
                        this.setDayData('');
                        this.dataToSend.emit([]);
                        // this.setDayData('updated');

                    }

                    this.selectedDuration = stepperdata.duration;
                    this.consecutiveSlot = this.selectedDuration / 0.5;
                    this.ngOnInit();
                    // this.getAvailibility();
                }
            }

        });

        if (localStorage.getItem('cancelPolicy') && localStorage.getItem('cancelPolicy') != undefined) {
            this.cancelPolicy = JSON.parse(localStorage.getItem('cancelPolicy'));
        }
        if (localStorage.getItem('slotSelected') != undefined) {
            let slots = JSON.parse(localStorage.getItem('slotSelected'));
        }

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
        if (localStorage.getItem('slotSelected') != undefined) {
            let slots = JSON.parse(localStorage.getItem('slotSelected'));
            this.selectedSlotsDay = slots;
            this.getClass(true, this.selectedSlotsDay);
        }
    };

    ngAfterViewInit() {

    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.selectedDateUpdate.currentValue && !this.tempVariable) {
            this.visbiltyUpdate = true;
            let dateReceived = moment(changes.selectedDateUpdate.currentValue.mDate).format();
            this.dateData = dateReceived;
            if (this.selectedTypeOfCal == 'day') {
                this.setDayData('updated');
            } else {
                this.setWeekData('updated');
            }
            if (document.getElementById('scrollUp') != undefined) {
                let elmnt = document.getElementById('scrollUp');
                elmnt.scrollTop = 570;
            }

        } else {
            this.tempVariable = false;
        }
    }

    updateStatus(date) {
        //     let selectedSession;
        // let finalIndex;
        // let tableIndex = this.sessionService.getTableIndex();
        // let allSessionData = this.sessionService.getSessionData();
        // if(localStorage.getItem('finalSlot'))
        // {
        //   let finalSlots = JSON.parse(localStorage.getItem('finalSlot'));
        //   for(let i= 0; i< allSessionData.length;i++)
        //   {
        //       if(tableIndex == i)
        //       {
        //         selectedSession = allSessionData[i];
        //       }
        //   }
        //   if(selectedSession)
        //   {
        //     let date =moment(selectedSession.date).format('YYYY-MM-DD');
        //     let dateTime =  selectedSession.time.split('-');
        //     let start_time = moment((dateTime[0]), 'hh:mmA').format('HH:mm');
        //     let end_time = moment((dateTime[1]), 'hh:mmA').format('HH:mm');
        //     for(let i=0;i<finalSlots.length;i++){
        //       if(finalSlots[i][0]['startTime'] == start_time && finalSlots[i][0]['date'] == date){
        //          finalIndex = i;
        //           break;
        //       }
        //     }
        //     finalSlots.splice(finalIndex, 1);
        //     localStorage.setItem('finalSlot', JSON.stringify(finalSlots));

        //   }

        // }
        this.finalSlotData = [];
        this.selectedSlotsDay = [];

        if (localStorage.getItem('finalSlot')) {
            let slots = JSON.parse(localStorage.getItem('finalSlot'));
            for (let i = 0; i < slots.length; i++) {
                for (let j = 0; j < slots[i].length; j++) {
                    this.finalSlotData.push(slots[i][j]);
                }
            }
        }
        this.newdummyslot = _.cloneDeep(calendarConst.dummyslot);

        this.slotArray.forEach((obj) => {

            if (obj.date == moment(date).format('YYYY-MM-DD')) {
                let index = _.findIndex(this.newdummyslot, {startTime: obj.availableSlot});
                if (index != -1) {
                    this.newdummyslot[index].status = true;
                    this.newdummyslot[index]._id = obj._id;
                }
                if (this.finalSlotData.length) {
                    // if (moment(this.finalSlotData[0].date).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')) {
                    this.finalSlotData.forEach((day) => {
                        if (obj.date == moment(day.date).format('YYYY-MM-DD')) {
                            let indexInner = _.findIndex(this.newdummyslot, {startTime: day.startTime});
                            if (indexInner != -1) {
                                this.newdummyslot[indexInner].status = false;
                                this.newdummyslot[indexInner]._id = '';
                                this.newdummyslot[indexInner].date = '';
                                this.newdummyslot[indexInner].selectDateWeek = '';
                            }
                        }
                    });
                    // }
                }
                let preSelect = JSON.parse(localStorage.getItem('tempData'));
                if (preSelect && preSelect.length) {
                    preSelect[0].forEach((day) => {
                        if (obj.date == moment(day.date).format('YYYY-MM-DD')) {
                            let indexInner = _.findIndex(this.newdummyslot, {startTime: day.startTime});
                            if (indexInner != -1) {
                                this.newdummyslot[indexInner].status = false;
                                this.newdummyslot[indexInner]._id = day._id;

                            }
                        }
                    });
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
                let preSelect = JSON.parse(localStorage.getItem('tempData'));
                if (preSelect && preSelect.length) {
                    date = new Date(moment(preSelect[0][0].date).utc().toString());

                } else {
                    date = new Date();
                    // Add a day
                    date.setDate(date.getDate() + 1);

                }
                if (document.getElementById('scrollUp') != undefined) {
                    let elmnt = document.getElementById('scrollUp');
                    elmnt.scrollTop = 570;
                }

        }
        this.calendar.currentYear = date.getFullYear();
        this.calendar.currentMonth = calendarConst.fullMonth[date.getMonth()];
        this.calendar.currentTimeDay = date;
        this.calendar.dayDataCal = {
            day: calendarConst.fullDay[date.getDay()],
            date: (date.getDate()),
            fulldate: date,
            slot: this.updateStatus(date)
        };
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
                // date = this.dateData ? new Date(this.dateData) : new Date();
                weekFlag = this.dateData ? 'updated' : '';
                let preSelect = JSON.parse(localStorage.getItem('tempData'));
                if (preSelect && preSelect.length) {
                    date = new Date(moment(preSelect[0][0].date).utc().toString());
                } else {
                    date = new Date();
                    // Add a day
                    date.setDate(date.getDate() + 1);

                }
                if (document.getElementById('scrollUp') != undefined) {
                    let elmnt = document.getElementById('scrollUp');
                    elmnt.scrollTop = 570;
                }
        }
        this.calendar.currentMonthIndex = date.getMonth();
        this.calendar.currentYear = date.getFullYear();
        this.calendar.currentMonth = calendarConst.fullMonth[date.getMonth()];
        this.calendar.currentMonthNext = calendarConst.fullMonth[date.getMonth()];
        // if (this.dateData) {
        //   date = this.dateData;
        // }
        this.CalendarEventService.getDaysInWeek(date).then(currentWeekList => {
            this.calendar.weekDataCal = [];

            for (let i = 0; i < currentWeekList.length; i++) {
                this.calendar.weekDataCal.push({
                    day: calendarConst.sortDay[i],
                    date: currentWeekList[i].getDate(),
                    fulldate: currentWeekList[i],
                    slot: this.updateStatus(currentWeekList[i])
                });
            }
            this.calendar.currentMonth = calendarConst.fullMonth[currentWeekList[0].getMonth()];
            this.calendar.currentMonthNext = calendarConst.fullMonth[currentWeekList[6].getMonth()];
        });
        //hit api to get details
    }

    ngOnInit() {


        let now = new Date();
        this.baThemeSpinner.show();
        let nowNew = new Date(new Date(now).getTime() + 60 * 60 * 24 * 1000);
        let getAvailabiltyStartDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1).toUTCString();
        let momentDate: any = moment().add(121, 'days');
        if (localStorage.getItem('endDateCode')) {
            if (moment(localStorage.getItem('endDateCode')).isBefore(momentDate)) {
                momentDate = moment(localStorage.getItem('endDateCode'));
            }
        }
        let getAvailabiltyEndDate: any = new Date(momentDate.year(), momentDate.month(), momentDate.date(), 23, 59, 59).toUTCString();
        // let getAvailabiltyEndDate: any = new Date(new Date().getFullYear(), new Date().getMonth() + 2, new Date().getDate() - 1).toUTCString();

        this.CalendarEventService.getAvaibility(nowNew.toUTCString(), getAvailabiltyEndDate, this.selectedDuration).subscribe((result) => {

            this.responseFromGetApi = result.data;
            this.formatedResponse();
            this.setDayData('');
            // if (localStorage.getItem("slotSelected") != undefined) {
            //   let slots = JSON.parse(localStorage.getItem("slotSelected"));
            //   // this.selectedSlotsDay = slots;
            //   // this.getClass(true, this.selectedSlotsDay);

            // }
            this.finalSlotData = [];
            this.baThemeSpinner.hide();

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
        let newd = new Date(cal.fulldate);
        this.selectedSlotsDay = [];
        let convertedDate;
        if (cal.currentTimeDay && cal.currentTimeDay != undefined) {
            convertedDate = new Date(cal.currentTimeDay);
        } else if (cal.fulldate && cal.fulldate != undefined) {
            convertedDate = new Date(cal.fulldate);
        }
        this.convertedDate = convertedDate;
        if (this.convertedDate != undefined) {
            let itemStatus = item.status;
            let startTime = item.startTime;
            let stringStartTime = startTime.toString();
            let time = stringStartTime.split(':');
            this.convertedDate.setHours(time[0]);
            this.convertedDate.setMinutes(time[1]);
            let finalStartTime = this.convertedDate;

            let curTime = new Date();

            let diff = (curTime.getTime() - finalStartTime.getTime()) / 1000;

            diff /= (60 * 60);
            this.timeDifference = Math.abs(Math.round(diff));

            if (this.cancelPolicy && this.cancelPolicy.cancelsLessThan != undefined && itemStatus != undefined) {
                if ((this.timeDifference < this.cancelPolicy.cancelsLessThan) && itemStatus) {

                    let dialogRef = this.dialog.open(CancelDialog);
                } else {

                }
            }

        }
        if (item._id) {
            this.finalSlotArray = [];
            if (item.status) {
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
                    if ((index + i) > allslot.length - 1) {
                        return;
                    } else {
                        consecutiveArray.push(allslot[index + i]);
                    }

                }
                if (_.findIndex(consecutiveArray, {status: false}) == -1) {
                    consecutiveArray.forEach((val) => {
                        let itemIndex = _.findIndex(allslot, {_id: val._id});
                        allslot[itemIndex].status = false;
                        val.selectDateWeek = cal.fulldate ? cal.fulldate : cal.currentTimeDay;
                        let newVal = val;
                        newVal.date = moment(val.selectDateWeek).format('YYYY-MM-DD');
                        this.dateData = moment(val.selectDateWeek).format();
                        this.selectedSlotsDay.push(newVal);
                        localStorage.setItem('slotSelected', JSON.stringify(this.selectedSlotsDay));
                        this.finalSlotArray.push(val);
                    });
                    this.sessionService.setSlotsArray(this.selectedSlotsDay);

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

            return false;
        }

    }
}
