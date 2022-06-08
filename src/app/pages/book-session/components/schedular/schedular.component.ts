import { Component, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import * as session from './../../state/book-session.actions';
import { TutorService } from '../../../../services/tutor-service/tutor.service';
import 'style-loader!./schedular.scss';
import { CalendarEventService, calendarConst, calendarConstReplica } from '../../../../services/calender-service/calendar-event.service';
import { Subscription } from 'rxjs/Rx';
import { MatStepper } from '@angular/material';
import { BookSessionService } from '../../../../services/session-service/session.service';
import { CheckTutorDialog } from '../../../../auth/model/check-tutor-dialog/check-tutor-dialog';
import { MatDialog } from '@angular/material';
import { CommonService } from '../../../../services/common.service';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
    selector: 'schedule',
    templateUrl: `./schedular.component.html`,
    providers: [CalendarEventService],
    styles: [`
        .marginL {
            margin-left: 233px;
        }

        @media screen and (max-width: 460px) {
            .marginL {
                margin-left: 0;
            }
        }

        @media screen and (min-width: 461px) and (max-width: 1200px) {
            .marginL {
                margin-left: 0;
            }
        }
    `]
})
export class Schedular implements AfterViewInit {
    errorMessage: boolean = false;
    timeToDisplay: any;
    @ViewChild('stepper') stepper: MatStepper;
    currentSelectedDate: any;
    showClender: boolean = false;
    hideTable: boolean = true;
    newDateFromWeek: any;
    public sessionLengthSubscription: Subscription;
    public errorMessageSubScription: Subscription;
    dataFromCalenderEvent: any = [];
    datesToRemove: any = [];
    userData: any = [];
    public stepTwoData: any;
    dateToDisplay: any;
    tutorId: any;
    shortMonth: any;
    steponeData: any;
    childId: string;
    sessionStore: Subscription;
    profileStore: Subscription;
    sessionDatalength: any;
    slots = [];
    editEndTime;
    public isRateChargeSuppressNow: boolean = false;
    public step2data: boolean = false;
    public stopForward: boolean = false;
    errorMessageSubScription1: any;
    web: boolean;

    constructor(private store: Store<any>, private dialog: MatDialog, public zone: NgZone, private router: Router,
                private calendareventservice: CalendarEventService, private tutorService: TutorService,
                private sessionService: BookSessionService, public commonService: CommonService) {
        if (screen.width >= 1023) {
            this.web = true;
        } else {
            this.web = false;
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

        this.sessionStore = this.store.select('session').subscribe((res: any) => {
            if (res) {
                if (res.steponeData && res.steponeData != undefined)
                    this.steponeData = res.steponeData;
                if (this.steponeData && this.steponeData != undefined) {
                    this.step2data = true;
                }
            }
        });

        this.profileStore = this.store.select('profile').subscribe((res: any) => {
            if (res) {
                if (res.userData && res.userData.data) {
                    if (res.userData.data.metaData) {
                        this.userData = res.userData.data;

                        this.isRateChargeSuppressNow = this.commonService.checkIsSuppress(this.userData).isRateChargeSuppressNow;
                    }
                }

            }
        });

        this.sessionLengthSubscription = this.sessionService.newSessionDataArray.debounceTime(10).subscribe((data) => {
            this.sessionDatalength = data;
        });
        this.errorMessageSubScription = this.sessionService.errorMsgSub.debounceTime(10).subscribe((data) => {
            this.errorMessage = data;
        });
        this.errorMessageSubScription1 = this.sessionService.goForward.debounceTime(10).subscribe((data) => {
            this.stopForward = data;
        });
    }

    ngOnInit() {
        if (localStorage.getItem('slotSelected') != undefined) {
            let slots = JSON.parse(localStorage.getItem('slotSelected'));
            this.receiveData(slots);
        }

    }

    ngAfterViewInit() {
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
            } else
                this.timeToDisplay = this.shortMonth + ' | ' + timeStart + '-' + timeEnd;
        }
    }

    setAvailabilty() {
        for (let i = 0; i < this.sessionDatalength.length; i++) {
            if (this.sessionDatalength[i].date == '' || this.sessionDatalength[i].time == '') {
                if (this.sessionDatalength.length > 1) {
                    this.stopForward = true;
                    this.errorMessage = false;
                    this.sessionService.setErrorMessage(this.errorMessage, this.stopForward);
                    return;
                } else {
                    this.errorMessage = true;
                    this.stopForward = false;
                    this.sessionService.setErrorMessage(this.errorMessage.valueOf, this.stopForward);
                    return;
                }
            } else {

            }
        }

        this.sessionService.updateStepperIndex(2);
        this.sessionService.changeStep.next(2);
        let elements = document.getElementsByClassName('mat-horizontal-content-container')[0];
        let childNode = elements.childNodes[2] as HTMLElement;
        childNode.style.overflow = 'hidden';
        ga('send', {
            hitType: 'event',
            eventCategory: 'Book a Session',
            eventAction: 'Book a Session Step 2',
            eventLabel: 'Book a Session Step 2 Next'
        });
        let fd = new FormData();
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
            // let sortedDataByDateTime = this.sessionDatalength.sort(function (a, b) {
            //     return new Date(a.dateTime).getTime() > new Date(b.dateTime).getTime()
            // });
            let sortedDataByDateTime = this.sessionDatalength.sort(function (a, b) {
                let l = new Date((a.dateTime).replace('.', '')).getTime(), r = new Date((b.dateTime).replace('.', '')).getTime();
                if (l < r) {
                    return -1;
                }
                if (l > r) {
                    return 1;
                }
                return 0;
            });
            if (this.slots && this.slots != undefined) {
                this.stepTwoData = {
                    startDate: finalStartTime.toUTCString(),
                    endDate: finalEndtTime.toUTCString(),
                    sessionsData: sortedDataByDateTime,
                    slots: JSON.stringify(this.slots),
                };
                let head = document.getElementsByClassName('mat-horizontal-stepper-header');
                this.sessionService.stepTwoData(this.stepTwoData);
                this.sessionService.changeStep.next(2);
            }
        }
    }

    ngOnDestroy() {
        if (this.sessionStore && this.sessionStore != undefined) {
            this.sessionStore.unsubscribe();
        }
        if (this.profileStore && this.profileStore != undefined) {
            this.profileStore.unsubscribe();
        }
    }

    showPopup(IndexData, data) {
        let index = IndexData;
        setTimeout(() => {
            this.zone.run(() => {
                let dialogRef = this.dialog.open(CheckTutorDialog, {
                    data: {message: 'Are you sure you would like to delete this session?', data: 'true', index: index, temp: data}
                });
            });
        });

    }

    search(_id, myArray) {
        for (let i = 0; i < myArray.length; i++) {
            if (myArray[i][0]._id === _id) {
                return i;
            }
        }
    }

    gotoScheduler(index, data) {

        let sessionData = this.sessionService.getSessionData();
        localStorage.removeItem('tempData');
        if (localStorage.getItem('finalSlot') && localStorage.getItem('finalSlot').length && data.slots[0]) {
            localStorage.setItem('tempSlots', JSON.stringify(sessionData));
            localStorage.setItem('finalSlotTemp', localStorage.getItem('finalSlot'));
            let k = this.search(data.slots[0], JSON.parse(localStorage.getItem('finalSlot')));
            localStorage.setItem('preSelected', JSON.stringify(sessionData[k]));
            if (k != undefined) {
                for (let i = 0; i < sessionData.length; i++) {
                    if (index == i) {
                        sessionData[i]['date'] = '';
                        sessionData[i]['time'] = '';
                        sessionData[i]['slots'] = '';
                    }
                }
                let newArray = JSON.parse(localStorage.getItem('finalSlot'));
                let spliceData = newArray.splice(k, 1);
                localStorage.setItem('tempData', JSON.stringify(spliceData));
                localStorage.setItem('finalSlot', JSON.stringify(newArray));
            }
        }
        this.setEndDate(index, data);
        this.sessionService.setTableIndex(index);
        // this.router.navigate(['/pages/book-session/Schedule']);
    }

    setEndDate(index, data) {
        if (this.isRateChargeSuppressNow) {

            if (this.userData.parent.sessionCreditsFromExternalApi && this.userData.parent.sessionCreditsFromExternalApi.length) {
                this.userData.parent.sessionCreditsFromExternalApi = this.userData.parent.sessionCreditsFromExternalApi.sort((a, b) => a.endDate - b.endDate);
                let sessionCreditsFromExternalApi = JSON.parse(JSON.stringify(this.commonService.sortByEndDate(this.userData.parent.sessionCreditsFromExternalApi)));
                // let sessionCreditsFromExternalApi = JSON.parse(JSON.stringify(this.userData.parent.sessionCreditsFromExternalApi));
                let sessionDatalength: any = JSON.parse(JSON.stringify(this.sessionDatalength));

                if (data && data.dateTime) {
                    sessionDatalength.splice(index);
                }

                let filteredReservation: any = [];
                sessionDatalength.forEach((val1, key) => {
                    if (val1.dateTime) {
                        filteredReservation = sessionCreditsFromExternalApi.filter(ele =>
                            moment(val1.dateTime).isBefore(ele.endDate) && ele.numberOfTutoringHours > 0
                        );
                        if (filteredReservation.length) {
                            filteredReservation[0].numberOfTutoringHours--;
                        }
                    }
                });

                let selectedEndDate = filteredReservation.filter(ele =>
                    ele.numberOfTutoringHours > 0
                );

                console.log('11111111111111111111',selectedEndDate);
                if (selectedEndDate.length) {
                    console.log('2222222222222222222222');
                    if (localStorage.getItem('endDateCode')) {
                        let patnerShipDate = localStorage.getItem('endDateCode');
                        if (this.getEndDate(selectedEndDate) < patnerShipDate) {
                            patnerShipDate = this.getEndDate(selectedEndDate);
                        }
                        localStorage.setItem('endDateCode', patnerShipDate);
                    } else {
                        localStorage.setItem('endDateCode', this.getEndDate(sessionCreditsFromExternalApi));
                    }
                } else {
                    console.log('33333333333');
                    if (localStorage.getItem('endDateCode')) {
                        console.log('4444444444');
                        let patnerShipDate = localStorage.getItem('endDateCode');
                        if (this.getEndDate(selectedEndDate) < patnerShipDate) {
                            console.log('55555555');
                            patnerShipDate = this.getEndDate(selectedEndDate);
                        }
                        localStorage.setItem('endDateCode', patnerShipDate);
                    } else {
                        console.log('666666');
                        localStorage.setItem('endDateCode', this.getEndDate(sessionCreditsFromExternalApi));
                    }
                    // localStorage.setItem('endDateCode', this.getEndDate(sessionCreditsFromExternalApi));
                }

            }
            this.router.navigate(['/pages/book-session/Schedule']);
        } else {
            this.router.navigate(['/pages/book-session/Schedule']);
        }
    }

    getEndDate(arr) {
        if (arr.length) {
            let tempArr = arr.filter(ele =>
                ele.numberOfTutoringHours > 0
            );
            let lastItem: any = _.last(tempArr);
            return lastItem.endDate;
        }
    }

}
