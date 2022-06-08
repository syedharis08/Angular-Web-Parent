import { forEach } from '@angular/router/src/utils/collection';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import { CalendarEventRescheduleService, calendarConst } from '../../../../../../services/calender-reschedule-service/calender-reschedule.service';

import * as _ from 'lodash';
import { Store } from '@ngrx/store';

import 'style-loader!./calender.scss';

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
  responseFromGetApi: any;

  constructor(private CalendarEventRescheduleService: CalendarEventRescheduleService, private store: Store<any>) {
    // window.scroll(0,0);
    let el = $('#moveUp');
    $('html,body').animate({ scrollTop: (el.offset().top - 50) }, 'slow', () => {
      el.focus();
    });
    this.store.select('reschedular').subscribe((res: any) => {
    });
  }

  ngOnInit(): void {
    let now = new Date();
    let nowNew = new Date(new Date(now).getTime() + 60 * 60 * 24 * 1000);
    let momentDate: any = moment().add(121, 'days');
    if(localStorage.getItem('endDateCode'))
    {
      if(moment(localStorage.getItem('endDateCode')).isBefore(momentDate)){
        momentDate =  moment(localStorage.getItem('endDateCode'));
      }
    }
    let getAvailabiltyEndDate: any = new Date(momentDate.year(), momentDate.month(), momentDate.date(), 23, 59, 59).toUTCString();
    // let getAvailabiltyEndDate: any = new Date(new Date().getFullYear(), new Date().getMonth() + 2, new Date().getDate() - 1).toUTCString();

    this.CalendarEventRescheduleService.getAvaibilityDays(nowNew.toUTCString(), getAvailabiltyEndDate).subscribe((result) => {
      this.responseFromGetApi = result.data;
      if (this.responseFromGetApi) {
        this.generateCalendar();
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
      }
      this.selectDateNew(newDate)
    }
    if (changes.selectedDates &&
      changes.selectedDates.currentValue &&
      changes.selectedDates.currentValue.length > 1) {
      // sort on date changes for better performance when range checking
      this.sortedDates = _.sortBy(changes.selectedDates.currentValue, (m: CalendarDate) => m.mDate.valueOf());
    }
  }

  // date checkers
  isToday(date: moment.Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }

  isSelected(date: moment.Moment): boolean {
    return _.findIndex(this.selectedDates, (selectedDate) => {
      return moment(date).isSame(selectedDate.mDate, 'day');
    }) > -1;
  }

  isSelectedMonth(date: moment.Moment): boolean {
    if (moment(date).format('YYYY-MM-DD') < this.currentDate.format('YYYY-MM-DD') && this.currentDate.month() == moment().month()) {
      return false;
    }
    // else if(moment(date).day() == 6 || moment(date).day() == 0) {
    //   return false;
    // }
    else {
      return moment(date).isSame(this.currentDate, 'month');
    }

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
        indexN = i
      }
      // }
    }
    // let indexN = _.findIndex(tempweekdata, date);
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
    // this.onSelectDate.emit(date);
  }

  // actions from calendar
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
    if (moment(this.currentDate).diff(moment(), 'days') >= 120) {
      this.nextMonthArrow = false;
      this.next = 'none';
    }

    this.generateCalendar();
  }
  // nextMonth(): void {
  //   this.currentDate = moment(this.currentDate).add(1, 'months');
  //   if(moment(this.currentDate).month() != moment().month()) {
  //     this.previousMonthArrow = true;
  //   }

  //   this.generateCalendar();
  // }


  // generate the calendar grid
  generateCalendar(): void {
    const dates = this.fillDates(this.currentDate);
    const weeks: CalendarDate[][] = [];
    while (dates.length > 0) {
      weeks.push(dates.splice(0, 7));
    }
    this.weeks = weeks;

  }

  // fillDates(currentMoment: moment.Moment): CalendarDate[] {
  //   const firstOfMonth = moment(currentMoment).startOf('month').day();
  //   const firstDayOfGrid = moment(currentMoment).startOf('month').subtract(firstOfMonth, 'days');
  //   const start = firstDayOfGrid.date();
  //   return _.range(start, start + 42)
  //           .map((date: number): CalendarDate => {
  //             const d = moment(firstDayOfGrid).date(date);
  //             return {
  //               today: this.isToday(d),
  //               selected: this.isSelected(d),
  //               mDate: d,
  //             };
  //           });
  // }
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

    }
    else {
      return false;
    }
  }
}
