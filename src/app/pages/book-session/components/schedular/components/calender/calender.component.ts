import { forEach } from '@angular/router/src/utils/collection';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, NgZone } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';

import 'style-loader!./calender.scss';
import { BookSessionService } from '../../../../../../services/session-service/session.service';
import { MatDialog } from '@angular/material';
import { CalendarEventService } from '../../../../../../services/calender-service/calendar-event.service';
import { BaThemeSpinner } from '../../../../../../theme/services';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

export interface CalendarDate {
    mDate: moment.Moment;
    selected?: boolean;
    today?: boolean;
}

@Component({
    selector: 'calender',
    templateUrl: 'calender.html',
})
export class CalenderComponent implements OnInit, OnChanges {
    next: string;
    currentDate = moment();
    dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    weeks: CalendarDate[][] = [];
    sortedDates: CalendarDate[] = [];
    previousMonthArrow: boolean = false;
    nextMonthArrow: boolean = true;
    @Input() selectedDates: CalendarDate[] = [];
    @Input() newDateSelected;
    @Output() onSelectDate = new EventEmitter<CalendarDate>();
    selectedDuration: any;
    consecutiveSlot: number;
    responseFromGetApi: any;

    constructor(private CalendarEventService: CalendarEventService,
                private dialog: MatDialog,
                private sessionService: BookSessionService,
                private baThemeSpinner: BaThemeSpinner,
                private router: Router,
                private ngZone: NgZone,
                private store: Store<any>) {
        let preSelect = JSON.parse(localStorage.getItem('tempData'));

        if (preSelect && preSelect[0][0]) {
            this.currentDate = moment(preSelect[0][0].date);

        }
        // window.scroll(0, 0);
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
        if (this.sessionService.getStepperOneData() != undefined) {

            let stepperdata = this.sessionService.getStepperOneData();
            if (stepperdata != undefined) {
                this.selectedDuration = stepperdata.duration;
                this.consecutiveSlot = this.selectedDuration / 0.5;
            }

        } else {
            localStorage.removeItem('steponeData');
            localStorage.removeItem('slotSelected');
            localStorage.removeItem('goBack');
            this.router.navigate(['/home/browse-tutor']);

        }
        // this.generateCalendar();

    }

    ngOnInit(): void {
        let now = new Date();
        this.baThemeSpinner.show();
        let nowNew = new Date(new Date(now).getTime() + 60 * 60 * 24 * 1000);
        let getAvailabiltyStartDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1).toUTCString();
        // let getAvailabiltyEndDate: any = new Date(new Date().getFullYear(), new Date().getMonth() + 2, new Date().getDate() - 1).toUTCString();
        let momentDate: any = moment().add(121, 'days');
        if (localStorage.getItem('endDateCode')) {
            if (moment(localStorage.getItem('endDateCode')).isBefore(momentDate)) {
                momentDate = moment(localStorage.getItem('endDateCode'));
            }
        }
        let getAvailabiltyEndDate: any = new Date(momentDate.year(), momentDate.month(), momentDate.date(), 23, 59, 59).toUTCString();
        this.CalendarEventService.getAvaibilityDays(nowNew.toUTCString(), getAvailabiltyEndDate, this.selectedDuration).subscribe((result) => {
            this.responseFromGetApi = result.data;
            if (this.responseFromGetApi) {
                this.generateCalendar();
            }
            this.baThemeSpinner.hide();
        });
        // this.generateCalendar();s
    }

    ngAfterViewInit() {
        // setTimeout(() => {
        //   if(localStorage.getItem("slotSelected") != undefined){

        //     let slots = JSON.parse(localStorage.getItem("slotSelected"));
        //     let newDate = {
        //       today: false,
        //       selected: false,
        //       mDate: slots[0].selectDateWeek
        //     }

        //     this.isSelectedMonth(slots[0].selectDateWeek);
        //     this.selectDate(newDate);
        //   }
        // }, 5000);
        setTimeout(d => {
            if (localStorage.getItem('slotSelected') != undefined) {
                let slots = JSON.parse(localStorage.getItem('slotSelected'));
                let newDate: CalendarDate = {
                    today: false,
                    selected: false,
                    mDate: slots[0].selectDateWeek
                };
                this.selectDateNew2(newDate);
            }
        });

    }

    ngOnChanges(changes: SimpleChanges): void {
        this.generateCalendar();
        if (changes.newDateSelected && changes.newDateSelected.currentValue.length > 0 && changes.newDateSelected.currentValue[0].selectDateWeek) {
            let newDate = {
                today: false,
                selected: false,
                mDate: changes.newDateSelected.currentValue[0].selectDateWeek
            };
            if (newDate != undefined) {
                this.selectDateNew(newDate);
            }
        }
        // else if (changes.newDateSelected != undefined && changes.newDateSelected.currentValue.length === 0 && localStorage.getItem("slotSelected") != undefined) {
        //   let slots = JSON.parse(localStorage.getItem("slotSelected"));
        //   let newDate = {
        //     today: false,
        //     selected: false,
        //     mDate: slots[0].selectDateWeek
        //   }

        //   this.selectDateNew(newDate);
        // }
        if (changes.selectedDates &&
            changes.selectedDates.currentValue &&
            changes.selectedDates.currentValue.length > 1) {
            // sort on date changes for better performance when range checking
            this.sortedDates = _.sortBy(changes.selectedDates.currentValue, (m: CalendarDate) => m.mDate.valueOf());
            this.generateCalendar();
        }
    }

    // date checkers
    isToday(date: moment.Moment): boolean {
        return moment().isSame(moment(date), 'day');
    }

    isSelected(date: moment.Moment): boolean {
        let checkDateVar;
        let preSelect = JSON.parse(localStorage.getItem('tempData'));
        if (preSelect && preSelect[0][0]) {
            checkDateVar = preSelect[0][0].date;
        } else {
            checkDateVar = new Date();
            checkDateVar.setDate(new Date().getDate() + 1);
        }
        if (moment(date).isSame(moment(checkDateVar), 'day')) {

            return true;
        } else {
            return _.findIndex(this.selectedDates, (selectedDate) => {
                return moment(date).isSame(selectedDate.mDate, 'day');
            }) > -1;
        }

    }

    isSelectedMonth(date: moment.Moment): boolean {
        if (moment(date).format('YYYY-MM-DD') < this.currentDate.format('YYYY-MM-DD') && this.currentDate.month() == moment().month()) {
            return false;
        }
            //  else if(moment(date).day() == 6 || moment(date).day() == 0) {
            //   return false;
        // }
        else {
            return moment(date).isSame(this.currentDate, 'month');
        }

    }

    haveBooking(date: moment.Moment) {

        let obj = this.responseFromGetApi.find((o, i) => moment(date).utc().format('YYYY-MM-DD') == moment(o).format('YYYY-MM-DD'));
        return obj ? true : false;

        // }
    }

    selectDate(date: CalendarDate): void {
        let tempweekdata: any = _.flattenDeep(this.weeks);
        let indexN = _.findIndex(tempweekdata, date);
        tempweekdata = tempweekdata.map((value) => {
            value.selected = false;
            return value;
        });
        tempweekdata[indexN]['selected'] = true;
        const tempArray: CalendarDate[][] = [];
        while (tempweekdata.length > 0) {
            tempArray.push(tempweekdata.splice(0, 7));
        }
        this.weeks = tempArray;
        this.onSelectDate.emit(date);
    }

    selectDateNew(date: CalendarDate): void {
        let indexN;
        let tempweekdata: any = _.flattenDeep(this.weeks);
        let i;
        for (i = 0; i < tempweekdata.length; i++) {
            // for(var j = 0; j < this.weeks[i].length; j++){
            if (moment(tempweekdata[i].mDate).format('l') === moment(date.mDate).format('l')) {
                indexN = i;
            }
            // }
        }
        // let indexN = _.findIndex(tempweekdata, date);
        tempweekdata = tempweekdata.map((value) => {
            value.selected = false;
            return value;
        });
        // tempweekdata[indexN]['selected'] = true;
        const tempArray: CalendarDate[][] = [];
        while (tempweekdata.length > 0) {
            tempArray.push(tempweekdata.splice(0, 7));
        }
        this.weeks = tempArray;
        // this.onSelectDate.emit(date);
    }

    selectDateNew2(date: CalendarDate): void {
        let indexN;
        let tempweekdata: any = _.flattenDeep(this.weeks);
        let i;
        for (i = 0; i < tempweekdata.length; i++) {
            // for(var j = 0; j < this.weeks[i].length; j++){
            if (moment(tempweekdata[i].mDate).format('l') === moment(date.mDate).format('l')) {
                indexN = i;
            }
            // }
        }
        // let indexN = _.findIndex(tempweekdata, date);
        tempweekdata = tempweekdata.map((value) => {
            value.selected = false;
            return value;
        });
        // tempweekdata[indexN]['selected'] = true;
        const tempArray: CalendarDate[][] = [];
        while (tempweekdata.length > 0) {
            tempArray.push(tempweekdata.splice(0, 7));
        }
        this.weeks = tempArray;
        this.onSelectDate.emit(date);
    }

    prevMonth(): void {
        this.currentDate = moment(this.currentDate).subtract(1, 'months');
        if (moment(this.currentDate).month() == moment().month()) {
            this.previousMonthArrow = false;
        }
        this.nextMonthArrow = true;
        this.next = 'auto';
        this.generateCalendar();
    }

    nextMonth(): void {
        this.currentDate = moment(this.currentDate).add(1, 'months');
        if (moment(this.currentDate).diff(moment(), 'days')) {
            this.previousMonthArrow = true;
        }
        // TODO:  calender 120 days changes to 90

        if (moment(this.currentDate).diff(moment(), 'days') >= 90) {
            this.nextMonthArrow = false;
            this.next = 'none';
        }

        this.generateCalendar();
    }

    // generate the calendar grid
    generateCalendar(): void {
        this.ngZone.runOutsideAngular(() => {
            const dates = this.fillDates(this.currentDate);
            const weeks: CalendarDate[][] = [];
            while (dates.length > 0) {
                weeks.push(dates.splice(0, 7));
            }
            this.ngZone.run(() => {
                this.weeks = weeks;
            });
        });

    }

    fillDates(currentMoment: moment.Moment): any {
        const firstOfMonth = moment(currentMoment).startOf('month').day();
        const firstDayOfGrid = moment(currentMoment).startOf('month').subtract(firstOfMonth, 'days');
        const start = firstDayOfGrid.date();
        return _.range(start, start + 42)
            .map((date: number): any => {
                const d = moment(firstDayOfGrid).date(date);

                return {
                    today: this.isToday(d),
                    selected: this.isSelected(d),
                    mDate: d,
                    disabled: this.matchDate(d)
                };
            });
    }

    matchDate(date) {

        if (this.responseFromGetApi) {
            let obj = this.responseFromGetApi.find((o, i) => moment(date).format('YYYY-MM-DD') == moment(o).utc().format('YYYY-MM-DD'));
            return obj ? true : false;

        } else {
            return false;
        }
    }
}
