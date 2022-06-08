
import { ApiService } from './../api-service/api.service';
import { forEach } from '@angular/router/src/utils/collection';
import { RequestOptions, Http, Headers, Response } from '@angular/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';
import { environment } from '../../environment/environment';
import * as moment1 from 'moment-timezone';


@Injectable()



export class CalendarEventService {
  options: RequestOptions;
  headerToken: string;
  token: string;
  headers: any;
  utcOffset;
  authRequired: boolean;
  dummyslotArray = [];
  tutorId: any
  constructor(private apiService?: ApiService, private http?: Http) { }

  rescheduleBooking(data) {

    this.authRequired = true;
    this.utcOffset = false;
    let bookingId;
    if (localStorage.getItem('bookingId') && localStorage.getItem('bookingId') != undefined) {
      bookingId = localStorage.getItem('bookingId');
    }
    let url = environment.APP.API_URL + environment.APP.RESCHEDULE_BOOKING + bookingId;
    return this.apiService.putApi(url, data, this.authRequired, this.utcOffset);

  }
  getAvaibility(start, end, duration) {
    this.headers = new Headers({ 'content-language': 'en' });
    this.headers.set('X-Frame-Options', 'SAMEORIGIN');
    this.headers.set('X-Content-Type-Options', 'nosniff');
    this.token = localStorage.getItem('token');
    this.headerToken = 'Bearer ' + this.token;
    this.utcOffset = ((new Date()).getTimezoneOffset()) * (-60000);
    this.headers.set('utcoffsetzone',moment1.tz.guess());

    this.headers.set('Authorization', this.headerToken);
    this.headers.set('utcoffset', this.utcOffset);
    if (localStorage.getItem('tutor_Id') && localStorage.getItem('tutor_Id') != undefined) {
      this.tutorId = localStorage.getItem('tutor_Id');
    }
    else {
      this.tutorId = '';
    }

    this.options = new RequestOptions({ headers: this.headers });
    let url = environment.APP.API_URL + environment.APP.GET_AVAILABILTY + '?startDate=' + start + '&endDate=' + end;
    if (this.tutorId && this.tutorId != undefined && this.tutorId != '') {
      url += '&tutorId=' + this.tutorId;
    }
    if(duration != undefined){
      url += '&duration=' + duration;

    }
    return this.http.get(url, this.options)
      .map((res: Response) => res.json())

      .catch((error: any) => {
        try {
          return (Observable.throw(error.json()));
        } catch (jsonError) {
          let minimumViableError = {
            success: false
          };
          return (Observable.throw(minimumViableError));
        }
      });

  }
  getAvaibilityDays(start, end, duration) {
    let tutorId;
    this.headers = new Headers({ 'content-language': 'en' });
    this.headers.set('X-Frame-Options', 'SAMEORIGIN');
    this.headers.set('X-Content-Type-Options', 'nosniff');
    this.token = localStorage.getItem('token');
    this.headerToken = 'Bearer ' + this.token;
    this.utcOffset = ((new Date()).getTimezoneOffset()) * (-60000);
    this.headers.set('utcoffsetzone',moment1.tz.guess());

    this.headers.set('Authorization', this.headerToken);
    this.headers.set('utcoffset', this.utcOffset);
    if (localStorage.getItem('tutor_Id')) {
      tutorId = localStorage.getItem('tutor_Id');
    }



    this.options = new RequestOptions({ headers: this.headers });

    let url = environment.APP.API_URL + environment.APP.GET_AVAILABILTY_DAYS + '?startDate=' + start + '&tutorId=' + tutorId + '&endDate=' + end;
    if(duration != undefined){
      url += '&duration=' + duration;

    }
    return this.http.get(url, this.options)
      .map((res: Response) => res.json())

      .catch((error: any) => {
        try {
          return (Observable.throw(error.json()));
        } catch (jsonError) {
          let minimumViableError = {
            success: false
          };
          return (Observable.throw(minimumViableError));
        }
      });

  }
  getTimeAMPM(start, end) {
    let startTime = moment(start, 'hh:mmA');
    let endTime = moment(end, 'hh:mmA');

    if (endTime.isBefore(startTime)) {
      endTime.add(1, 'day');
    }

    let timeStops = [];

    while (startTime <= endTime) {
      timeStops.push(moment(startTime).format('hh:mmA'));
      startTime.add(30, 'minutes');
    }
    return timeStops;
  }
  getDaysInMonth(month, year): Promise<any> {
    let hms = new Date();
    let date = new Date(year, month, 1, hms.getHours(), hms.getMinutes(), hms.getSeconds(), 0);
    let days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return Promise.resolve(days);
  }
  //Convert millisecond to hour , min , second
  parseMillisecondsIntoReadableTime(milliseconds) {
    //Get hours from milliseconds
    let hours = milliseconds / (1000 * 60 * 60);
    let absoluteHours = Math.floor(hours);
    let h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

    //Get remainder from hours and convert to minutes
    let minutes = (hours - absoluteHours) * 60;
    let absoluteMinutes = Math.floor(minutes);
    let m = absoluteMinutes > 9 ? absoluteMinutes : '0' + absoluteMinutes;

    //Get remainder from minutes and convert to seconds
    let seconds = (minutes - absoluteMinutes) * 60;
    let absoluteSeconds = Math.floor(seconds);
    let s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;


    return h + ':' + m;
  }


  getDaysInWeek(date): Promise<any> {
    let days = [], curr;
    if (date == 1) {
      curr = new Date();
    } else {
      curr = new Date(date);
    }
    let first = curr.getDate() - curr.getDay();
    let firstday = new Date(curr.setDate(first));
    days.push(firstday);
    for (let i = 1; i < 7; i++) {
      let next = new Date(curr.getTime());
      next.setDate(next.getDate() + i);
      days.push(next);
    }
    return Promise.resolve(days);
  }

  getTimeStopsReplica(start, end) {
    let startTime = moment(start, 'HH:mm');
    let endTime = moment(end, 'HH:mm');

    if (endTime.isBefore(startTime)) {
      endTime.add(1, 'day');
    }

    let timeStops = [];

    while (startTime <= endTime) {
      timeStops.push(moment(startTime).format('HH:mm'));
      startTime.add(30, 'minutes');
      if(timeStops.length == 48){
        startTime.subtract(1,'minutes');
        timeStops.push(moment(startTime).format('HH:mm'));
        return timeStops;
      }
    }
    return timeStops;
  }


  getTimeStops(start, end) {
    let startTime = moment(start, 'HH:mm');
    let endTime = moment(end, 'HH:mm');

    if (endTime.isBefore(startTime)) {
      endTime.add(1, 'day');
    }

    let timeStops = [];

    while (startTime <= endTime) {
      timeStops.push(moment(startTime).format('HH:mm'));
      startTime.add(30, 'minutes');
    }
    return timeStops;
  }

  createDummySlots() {
    let timeDataArray = this.getTimeStops('00:00', '23:59');

    // let timeDataArray = this.getTimeStops('08:00', '07:30');
    timeDataArray.forEach((value) => {
      let obj = {
        startTime: value,
        endTime: '',
        _id: '',
        status: false
      };
      this.dummyslotArray.push(obj);
    });
    return this.dummyslotArray;
  }

  convertTime(time) {
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) {
      time = time.slice(1);
      time[5] = +time[0] < 12 ? 'AM' : 'PM';
      time[0] = +time[0] % 12 || 12;
    }
    return time.join('');
  }


}

export const calendarConst: any = {
  fullMonth: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  sortMonth: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  fullDay: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  sortDay: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  timeData: new CalendarEventService().getTimeStops('00:00', '23:59'),
  timeAMPM: new CalendarEventService().getTimeAMPM('00:00', '23:59'),
  dummyslot: new CalendarEventService().createDummySlots()

};

export const calendarConstReplica: any = {
  fullMonth: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  sortMonth: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  fullDay: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  sortDay: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  // timeData: new CalendarEventService().getTimeStops('08:00', '07:30'),
  // timeAMPM: new CalendarEventService().getTimeAMPM('08:00', '07:30'),
  timeData: new CalendarEventService().getTimeStopsReplica('00:00', '23:59'),
  timeAMPM: new CalendarEventService().getTimeAMPM('00:00', '23:59'),
  dummyslot: new CalendarEventService().createDummySlots()

};


