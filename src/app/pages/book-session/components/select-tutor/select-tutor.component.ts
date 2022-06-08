import {
    Component, ViewChild, ElementRef, Renderer, NgZone
} from '@angular/core';
import { Store } from '@ngrx/store';
import * as session from '../../state/book-session.actions';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs/Subject';
import { TutorService } from '../../../../services/tutor-service/tutor.service';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { BookSessionService } from '../../../../services/session-service/session.service';
import * as moment from 'moment';
import { CommonErrorDialog } from '../../../../auth/model/common-error-dialog/common-error-dialog';
import { MatDialog } from '@angular/material';
import { NgbTimepickerConfig, NgbTimeStruct, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../../auth/service/auth-service/auth.service';
import { AllSessionService } from '../../../../services/all-sessions-service/all-sessions.service';
import { BaThemeSpinner } from '../../../../theme/services';
import { LoginDialog } from '../../../../auth/model/session-login-dialog/session-login-dialog.component';
import { ModalOptions } from 'ngx-bootstrap/modal';
import { NoHourAvailable } from '../../../../auth/model/no-hour-available/no-hour-available';
import { CONSTANT } from '../../../../shared/constant/constant';

@Component({
    selector: 'select-tutor',
    templateUrl: './select-tutor.html',
    styleUrls: ['./select-tutor.scss']
})
export class SelectTutor {

    selected: any;
    public slider: any;
    public stepOneData: any;
    public count: number;
    public areaLocation: any;
    public postCode;
    public sessionStore: Subscription;
    public limit: number = 10;
    public duration;
    public page: number = 1;
    public skip: number = 0;
    public tutor_image = '/assets/img/user.png';
    public onlineSessions = '/assets/img/online.svg';
    public certi_bgCheck = '/assets/img/background-checked.svg';
    public certi_degCheck = '/assets/img/degree-icon-1.svg';
    public certi_sylCheck = '/assets/img/certified-in-sylvan-method.svg';
    public certi_stateCheck = '/assets/img/state-certified.svg';
    public form: FormGroup;
    public submitted: boolean = false;
    public search: AbstractControl;
    public openedgrade = 0;
    public openedRate = 0;
    public ratingRadio: AbstractControl;
    public lowerRange: AbstractControl;
    public upperRange: AbstractControl;
    public lowerDistance: AbstractControl;
    public upperDistance: AbstractControl;
    public rangeValues: number[];
    public distanceValues: number;
    public tutors = [];
    public invokeEvent: Subject<any> = new Subject();
    public filters;
    public subjectArray = [];
    public totalSessions;
    sylvanCertifiedValue: AbstractControl;
    sortFilter: any = 'RELEVANCE';
    filtersError: any = false;
    filtersErrorDate: boolean = false;
    startTime: NgbTimeStruct;
    endTime: NgbTimeStruct;
    startTimeMinutes: any = 'MM';
    startTimeHours: any = 'HH';
    startTimeAp: any = 'AM';
    endTimeMinutes: any = 'MM';
    endTimeHours: any = 'HH';
    endTimeAp: any = 'AM';
    disabledH: any = true;
    disabledM: any = true;
    disabledH1: any = true;
    disabledM1: any = true;
    errorClass: boolean;
    errorClass1: boolean;
    errorTime: string;
    startTimeHoursToSend: any;
    endTimeToSend: number;
    endTimeMinToSend: any;
    startTimeMinToSend: any;
    public onlineSessionValue: AbstractControl;
    stateCertifiedValue: AbstractControl;
    date: any;
    dateS: Date;
    wordPressLink: string;
    minutes: any[];
    hours: any[];
    expandedTutorQual: boolean;
    closeResult: string;
    timeToShowStart: string;
    timeToShowEnd: string;
    web: boolean = true;
    options: FormGroup;
    @ViewChild('sidenav1') public sidenav1: ElementRef;
    @ViewChild('sortClick') public sortClick: ElementRef;
    grade1: any;
    grade2: any;
    grade3: any;
    grade4: any;
    filterCount: any = 2;
    filterCountShow: any = 2;
    showAddressPopError: boolean;
    sessionsWithTutor: boolean = false;
    step1Data: any;
    addressDataStore: Subscription;
    profileStore: Subscription;
    closeFilters: boolean;
    closeMobileFilters: boolean;
    panelOpenState: boolean;
    max: Date;
    minDate: Date;
    showSearching: boolean;
    searchValue: any;
    userData: any;
    cancellationPolicy: any;
    showAlternatePrice: boolean;
    showNationWide: boolean;
    hasPartnerCode: boolean;
    public isRateChargeSuppressNow = false;
    isSessionOnline = false;

    constructor(private fb: FormBuilder, private store: Store<any>, public zone: NgZone,
                private tutorService: TutorService, config: NgbTimepickerConfig, private router: Router,
                private dialog: MatDialog, private _spinner: BaThemeSpinner, private sessionService: BookSessionService,
                private toastrService: ToastrService, private checkLogin: AuthService, private renderer: Renderer,
                public allSessionService: AllSessionService, private modalService: NgbModal, private spinner: BaThemeSpinner
    ) {
        if (localStorage.getItem('isNationWide') == 'true') {
            this.showNationWide = true;
            this.hasPartnerCode = false;
            if (localStorage.getItem('hasPartnerCode') == 'true') {
                // this.showNationWide = false;
                this.hasPartnerCode = true;
            }
        } else if (localStorage.getItem('hasPartnerCode') == 'true') {
            // this.showNationWide = false;
            this.hasPartnerCode = true;
        } else {
            this.showNationWide = false;
            this.hasPartnerCode = false;
        }

        this.minDate = new Date();
        let momentDate: any = moment().add(121, 'days');
        this.max = new Date(momentDate.year(), momentDate.month(), momentDate.date(), 0, 0, 0);
        $(window).scroll(function (e) {
            let $el = $('.fixedElement');
            let $mobileSite = $('.upfromFixed');
            let isPositionFixed = ($el.css('position') == 'fixed');
            if ($(this).scrollTop() > 187 && !isPositionFixed) {
                $mobileSite.css({'margin-top': '50px'});
                $el.css({'position': 'fixed', 'top': '0px'});
            }
            if ($(this).scrollTop() < 187 && isPositionFixed) {
                $el.css({'position': 'static', 'top': '0px'});
                $mobileSite.css({'margin-top': '0px'});
            }
        });
        this.options = fb.group({
            bottom: 0,
            fixed: true,
            top: 0
        });
        if (screen.width <= 1023) {
            this.web = false;
            document.getElementById('alMain').style.marginTop = '0px';
            document.getElementById('alMain').style.paddingBottom = '0px';
            document.getElementById('alMain').style.minHeight = '0px';
        } else {

        }

        this.minutes = ['00', 30];
        // for (let j = 0; j <= 59; j++) {
        //     let k;
        //     if (j < 10) {
        //         k = '0' + j;
        //     }
        //     else {
        //         k = j;
        //     }
        //     this.minutes.push(k);
        // }
        this.hours = [];
        for (let j = 1; j <= 12; j++) {
            let k;
            if (j < 10) {
                k = '0' + j;
            } else {
                k = j;
            }
            this.hours.push(k);
        }
        config.seconds = false;
        config.spinners = false;
        localStorage.removeItem('finalSlot');

        this.filters = {};
        // if (event && event != undefined) {
        //     event.preventDefault();
        // }
        if (localStorage.getItem('page1')) {
            this.page = JSON.parse(localStorage.getItem('page1'));
            this.skip = (this.page - 1) * this.limit;
            localStorage.removeItem('page1');
        }

        this.totalSessions = localStorage.getItem('totalSessions');
        this.rangeValues = [10, 200];
        this.distanceValues = 100;

        this.filters.minHourlyRate = 10;
        this.filters.maxHourlyRate = 200;
        this.filters.distance = 100;
        this.form = fb.group({
            'search': ['', Validators.compose([])],
            'ratingRadio': ['', Validators.compose([])],
            'lowerRange': ['', Validators.compose([])],
            'upperRange': ['', Validators.compose([])],
            'lowerDistance': ['', Validators.compose([])],
            'upperDistance': ['', Validators.compose([])],
            'sylvanCertified': [false, Validators.compose([])],
            'stateCertified': [false, Validators.compose([])],
            'onlineSession': [false, Validators.compose([])]
        });
        this.onlineSessionValue = this.form.controls['onlineSession'];
        this.search = this.form.controls['search'];
        this.ratingRadio = this.form.controls['ratingRadio'];
        this.sylvanCertifiedValue = this.form.controls['sylvanCertified'];
        this.stateCertifiedValue = this.form.controls['stateCertified'];
        this.lowerRange = this.form.controls['lowerRange'];
        this.upperRange = this.form.controls['upperRange'];
        this.lowerDistance = this.form.controls['lowerDistance'];
        this.upperDistance = this.form.controls['upperDistance'];
        this.lowerRange.setValue(('$' + this.rangeValues[0]));
        this.upperRange.setValue(('$' + this.rangeValues[1]));
        this.lowerDistance.setValue((0 + ' Miles'));
        this.upperDistance.setValue(('100+ Miles'));
        this.upperRange.setValue('$200+');

        if (this.sessionService.onlineBooking) {
            this.onlineSessionValue.setValue('true');
            this.filters.onlineSession = 'true';
        } else {
            this.onlineSessionValue.setValue('false');
            this.filters.onlineSession = 'false';
        }
        //store subscribed
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });

        this.profileStore = this.store.select('profile').subscribe((res: any) => {
            if (res) {
                if (res.userData && res.userData.data) {
                    this.userData = res.userData.data;
                    this.checkIsSuppress();
                }
            }
        });

        this.addressDataStore = this.store.select('tutor').subscribe((res: any) => {
            this.showSearching = false;
            if (res.continueBooking && res.continueBooking.continueBooking) {
                this.dialog.closeAll();
                // this.spinner.show();
                this.sessionService.tutorSelected = true;
                if (localStorage.getItem('PROMOCODE') != undefined) {
                    localStorage.removeItem('PROMOCODE');
                }
                if (localStorage.getItem('promoVal') != undefined) {
                    localStorage.removeItem('promoVal');
                }
                this.sessionService.updateStepperIndex(1);
                this.router.navigate(['/pages/book-session/session']).then(() => {
                    this.sessionService.changeStep.next(1);
                });
            }
        });

        this.sessionStore = this.store.select('session').subscribe((res: any) => {
            this.showSearching = false;
            if (res) {
                this.zone.run(() => {
                    this.showSearching = false;
                    this._spinner.hide();
                    this.tutors = [];
                    if (res.tutors && res.tutors.data && res.tutors.data != undefined) {
                        this.tutors = res.tutors.data;

                    }
                    if (res.tutorsCount != undefined && res.tutorsCount.data != undefined) {
                        this.showSearching = false;
                        this._spinner.hide();
                        this.count = res.tutorsCount.data.count;
                    } else {
                        this.count = undefined;
                    }

                });
            }

        });
        if (navigator != undefined && navigator.userAgent != undefined && navigator.userAgent.indexOf('Edge') >= 0) {
            event.preventDefault();
        } else {
        }

        $('#eventId').click(function (event) {
            // Stop the Search input reloading the page by preventing its default action
            if (event && event != undefined) {

            }
        });
        // Filters values
        this.zone.run(() => {
            if (this.sessionService.getUserName() != undefined) {
                let name = this.sessionService.getUserName();
                this.filters.tutorName = name;
                this.search.setValue(name);
                this.searchValue = name;
            }
            if (this.sessionService.getHourlyRate() != undefined) {
                let hourlRate = this.sessionService.getHourlyRate();
                if (hourlRate.min != undefined && hourlRate.max != undefined) {
                    this.rangeValues = [hourlRate.min, hourlRate.max];
                    this.lowerRange.setValue(hourlRate ? ('$' + hourlRate.min) : 10);
                    if (hourlRate.max === 200) {
                        this.upperRange.setValue('$200+');
                    } else {
                        this.upperRange.setValue(hourlRate ? ('$' + hourlRate.max) : 200);
                    }
                    this.filters.minHourlyRate = hourlRate.min;
                    this.filters.maxHourlyRate = hourlRate.max;
                }
            }
            if (this.sessionService.getRatings() != undefined) {
                this.selected = this.sessionService.getRatings();
                if (this.selected != 'zero') {
                    this.filters.ratings = this.selected;

                }
            }
            if (this.sessionService.getDistance() != undefined) {
                this.distanceValues = this.sessionService.getDistance();
                if (this.distanceValues === 100) {
                    this.upperDistance.setValue('100+ Miles');
                } else {
                    this.upperDistance.setValue(this.distanceValues + ' Miles');
                }
                this.filters.distance = this.distanceValues;
            }
            if (this.sessionService.filterCount) {
                this.filterCountShow = this.sessionService.filterCount;
            }
            if (this.sessionService.getSylvanCertifiedValue()) {

                this.expandedTutorQual = true;

                let sylvanCertifiedValue = this.sessionService.getSylvanCertifiedValue();
                this.filters.sylvanCertifiedValue = sylvanCertifiedValue;
                this.sylvanCertifiedValue.setValue(sylvanCertifiedValue);
                // this.search.setValue(sylvanCertifiedValue);
            }
            if (this.sessionService.getStateCertifiedValue()) {
                this.expandedTutorQual = true;
                let sylvanCertifiedValue = this.sessionService.getStateCertifiedValue();
                this.filters.stateCertifiedValue = sylvanCertifiedValue;
                this.stateCertifiedValue.setValue(sylvanCertifiedValue);
                // this.search.setValue(sylvanCertifiedValue);
            }
            if (this.sessionService.getOnlineSessionValue()) {
                this.expandedTutorQual = true;

                let onlineSession = this.tutorService.getOnlineSessionValue();
                this.filters.onlineSessionValue = onlineSession;
                this.onlineSessionValue.setValue(onlineSession);
                // this.search.setValue(sylvanCertifiedValue);
            }
            if (this.sessionService.startTimeHours) {
                this.startTimeHours = this.sessionService.startTimeHours;
                this.disabledH = false;
                this.disabledM = false;
                this.date = this.sessionService.date;
            }
            if (this.sessionService.endTimeHours) {
                this.endTimeHours = this.sessionService.endTimeHours;
                this.disabledH1 = false;
                this.disabledM1 = false;

            }
            if (this.sessionService.getSort()) {
                this.sortFilter = this.sessionService.getSort();
                this.filters.sortType = this.sessionService.getSort();
            }
            if (this.sessionService.startTimeMinutes) {
                this.startTimeMinutes = this.sessionService.startTimeMinutes;
            }
            if (this.sessionService.endTimeMinutes) {
                this.endTimeMinutes = this.sessionService.endTimeMinutes;
            }
            if (this.sessionService.startTimeAp) {
                this.startTimeAp = this.sessionService.startTimeAp;
            }
            if (this.sessionService.endTimeAp) {
                this.endTimeAp = this.sessionService.endTimeAp;
            }
            if (this.sessionService.startTimeHours && this.sessionService.endTimeHours) {
                this.filters.startTime = this.sessionService.startDate;
                this.filters.endTime = this.sessionService.endDate;
            }

            let stepperData = this.sessionService.getStepperOneData();
            if (stepperData && stepperData != undefined) {
                let stepone = stepperData;
                this.stepOneData = stepone;
            }
            if (this.stepOneData && this.stepOneData.address && this.stepOneData.address != undefined) {
                let address = this.stepOneData.address;
                this.areaLocation = {
                    latitude: address.latitude,
                    longitude: address.longitude,
                    zipCode: address.zipCode
                };

                if (this.stepOneData && this.stepOneData.duration && this.stepOneData.duration != undefined) {
                    this.duration = this.stepOneData.duration;
                    this.filters.duration = this.duration;

                }
                if (this.stepOneData && this.stepOneData.subjectControl && this.stepOneData.subjectControl.length > 0) {
                    this.subjectArray = [];
                    for (let i = 0; i < this.stepOneData.subjectControl.length; i++) {
                        this.subjectArray.push(this.stepOneData.subjectControl[i].subCategoryId);
                    }
                }
                if (this.subjectArray && this.subjectArray.length > 0) {
                    this.filters.subjects = this.subjectArray;
                }
            }
            if (this.filters && this.filters != undefined && this.areaLocation && this.areaLocation != undefined) {
                this.browseTutor(this.areaLocation, this.limit, this.skip, this.filters);
            } else {
                // this.router.navigate(['/pages/book-session/session']);
            }
        });
    }

    checkIsSuppress() {
        if (this.userData.partnershipCode && this.userData.partnershipCode.length && this.userData.partnershipCode[0].isRateChargeSuppress) {
            this.isRateChargeSuppressNow = true;
            if (this.userData.parent.isParentOutOfTutoringHours) {
                this.isRateChargeSuppressNow = false;
            } else {
                this.isRateChargeSuppressNow = true;
            }
        } else {
            this.isRateChargeSuppressNow = false;
        }
        this.areaLocation = CONSTANT.STATIC_ZIP_CODE;

        // this.areaLocation = {
        //     latitude: '47.0984',
        //     longitude: '101.1810',
        //     zipCode: '58530'
        // };
    }

    handleChange(event) {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Browse Filters',
            eventAction: 'Browse by Hourly Rate',
            eventLabel: 'Browse by Hourly Rate'
        });
        this.lowerRange.setValue(event.values ? ('$' + event.values[0]) : 10);
        this.upperRange.setValue(event.values ? ('$' + event.values[1]) : 200);
        this.filters.minHourlyRate = event.values[0];
        this.filters.maxHourlyRate = event.values[1];
        this.sessionService.setHourlyRate(event.values[0], event.values[1]);
        this.page = 1;
        this.skip = 0;
        this.limit = 10;
        if (this.web)
            this.invokeEvent.next(event);
    }

    stateCertified(event) {
        this.filters.stateCertifiedValue = !this.stateCertifiedValue.value;
        this.sessionService.setStateCertifiedValue(!this.stateCertifiedValue.value);
        this.page = 1;
        this.skip = 0;
        this.limit = 10;
        if (this.web)
            this.invokeEvent.next(event);
    }

    sylvanCertified() {
        this.filters.sylvanCertifiedValue = !this.sylvanCertifiedValue.value;
        this.sessionService.setSylvanCertifiedValue(!this.sylvanCertifiedValue.value);
        this.page = 1;
        this.skip = 0;
        this.limit = 10;
        if (this.web)
            this.invokeEvent.next(event);
    }

    onlineSession(e) {
        this.filters.onlineSession = !this.onlineSessionValue.value;
        this.sessionService.setOnlineSessionValue(!this.onlineSessionValue.value);
        this.page = 1;
        this.skip = 0;
        this.limit = 10;
        if (this.web)
            this.invokeEvent.next(e);
    }

    distanceChange(event) {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Browse Filters',
            eventAction: 'Browse by Distance',
            eventLabel: 'Browse by Distance'
        });
        this.lowerDistance.setValue(0 + ' Miles');

        if (this.distanceValues === 100) {
            this.upperDistance.setValue('100+ Miles');
        } else {
            this.upperDistance.setValue(this.distanceValues + ' Miles');
        }
        this.sessionService.setDistance(this.distanceValues);
        let distance = this.distanceValues;
        this.filters.distance = distance;
        this.page = 1;
        this.skip = 0;
        this.limit = 10;
        if (this.web)
            this.invokeEvent.next(event);
    }

    searchByNameMobile() {
        let data = (<HTMLInputElement>document.getElementById('searchByName')).value;
        (document.activeElement as HTMLElement).blur();
        ga('send', {
            hitType: 'event',
            eventCategory: 'Browse Filters',
            eventAction: 'Browse by Name',
            eventLabel: 'Browse by Name'
        });
        this.showSearching = true;
        this._spinner.show();
        this.filters.tutorName = data;
        this.sessionService.setUserName(data);
        this.page = 1;
        this.skip = 0;
        this.limit = 10;
        this.invokeEvent.next(<HTMLInputElement>document.getElementById('searchByName'));
    }

    ngOnInit() {
        if (process.env.ENV == 'development') {
            // this.wordPressLink = 'https://sylvandev-wordpress.clicklabs.in/';
            this.wordPressLink = CONSTANT.wordPressDevLink;
        }
        if (process.env.ENV == 'production') {
            this.wordPressLink = CONSTANT.wordPressQualLink;
        }
        if (process.env.ENV == 'demo') {
            this.wordPressLink = CONSTANT.wordPressDemoLink;
        }
        if (process.env.ENV == 'test') {
            this.wordPressLink = CONSTANT.wordPressTestLink;
        }
        if (process.env.ENV == 'live') {
            this.wordPressLink = CONSTANT.wordPressLiveLink;
        }

        this.invokeEvent.debounceTime(300).subscribe((name: String) => {
            // this._spinner.show();
            this.showSearching = false;
            if (name) {
                this.tutors = [];
                if (this.areaLocation && this.areaLocation != undefined) {
                    this.showSearching = false;
                    // this._spinner.hide();
                    this.browseTutor(this.areaLocation, this.limit, this.skip, this.filters);
                }
            } else if (name.length == 0) {
                this.showSearching = false;
                // this._spinner.hide();
            }
        });
        if (document.getElementById('eventId') != undefined) {
            document.getElementById('eventId').click();
        }

    }

    searchByName(data) {
        if (data.keyCode == 13) {
            ga('send', {
                hitType: 'event',
                eventCategory: 'Browse Filters',
                eventAction: 'Browse by Name',
                eventLabel: 'Browse by Name'
            });
            (document.activeElement as HTMLElement).blur();
            this.showSearching = true;
            this._spinner.show();
            this.filters.tutorName = data.target.value;
            this.sessionService.setUserName(data.target.value);
            this.page = 1;
            this.skip = 0;
            this.limit = 10;
            this.invokeEvent.next(data);
        }

    }

    // tutorRatings(event) {
    //     this.filters.ratings = event.value;
    //     this.subject.next(event);

    // }
    // applyTutorAvailFilters() {

    //     if (this.date && this.startTime && this.endTime && this.duration) {
    //         this.dateS = this.date;
    //         let check = new Date(this.dateS.getFullYear(), this.dateS.getMonth(), this.dateS.getDate(), this.startTime.hour, this.startTime.minute, 0).toUTCString();
    //         this.filters.startTime = check;
    //         let check1 = new Date(this.dateS.getFullYear(), this.dateS.getMonth(), this.dateS.getDate(), this.endTime.hour, this.endTime.minute, 0).toUTCString();
    //         this.filters.endTime = check1;
    //         this.filters.duration = this.duration;
    //         this.page = 1;
    //         this.skip = 0;
    //         this.limit = 10;
    //         this.invokeEvent.next(event);
    //     }
    //     else {
    //         if (!this.startTime) {
    //             let error = document.getElementsByClassName('ngb-tp-hour');
    //             let error1 = document.getElementsByClassName('ngb-tp-minute');
    //             error[0].className = 'ngb-tp-hour filtersError';
    //             error1[0].className = 'ngb-tp-minute filtersError'
    //         }
    //         if (!this.endTime) {
    //             let error = document.getElementsByClassName('ngb-tp-hour');
    //             let error1 = document.getElementsByClassName('ngb-tp-minute');
    //             error[1].className = 'ngb-tp-hour filtersError';
    //             error1[1].className = 'ngb-tp-minute filtersError'
    //         }
    //         if (!this.duration) {
    //             this.filtersError = true;
    //         }
    //         if (!this.date) {
    //             this.filtersErrorDate = true
    //         }

    //     }

    // }
    applyTutorAvailFilters() {
        this.panelOpenState = true;
        this.startTimeMinToSend = this.startTimeMinutes;
        this.endTimeMinToSend = this.endTimeMinutes;
        if (this.date && (this.startTimeHours != 'HH') && (this.endTimeHours != 'HH') && this.duration) {
            if (this.startTimeAp == 'PM') {
                if (parseInt(this.startTimeHours, 10) < 12)
                    this.startTimeHoursToSend = parseInt(this.startTimeHours, 10) + 12;
                else {
                    this.startTimeHoursToSend = parseInt(this.startTimeHours, 10);

                }
            } else {
                this.startTimeHoursToSend = parseInt(this.startTimeHours, 10);
                if (this.startTimeHoursToSend == 12) {
                    this.startTimeHoursToSend = 0;
                    // this.startTimeMinToSend = 59;
                }
            }
            if (this.endTimeAp == 'PM') {
                if (parseInt(this.endTimeHours, 10) < 12)
                    this.endTimeToSend = parseInt(this.endTimeHours, 10) + 12;
                else
                    this.endTimeToSend = parseInt(this.endTimeHours, 10);

            } else {
                this.endTimeToSend = parseInt(this.endTimeHours, 10);
                if (this.endTimeToSend == 12) {
                    this.endTimeToSend = 23;
                    this.endTimeMinToSend = 30;
                }
            }
            this.dateS = this.date;
            this.sessionService.date = this.date;
            let check = new Date(this.dateS.getFullYear(), this.dateS.getMonth(), this.dateS.getDate(), parseInt(this.startTimeHoursToSend, 10), parseInt(this.startTimeMinToSend, 10), 0).toUTCString();
            this.sessionService.startDate = check;
            this.sessionService.duration = this.duration;
            this.filters.startTime = check;
            this.sessionService.startTimeHours = this.startTimeHours;
            this.sessionService.endTimeHours = this.endTimeHours;
            this.sessionService.startTimeMinutes = this.startTimeMinutes;
            this.sessionService.endTimeMinutes = this.endTimeMinutes;
            this.sessionService.startTimeAp = this.startTimeAp;
            this.sessionService.endTimeAp = this.endTimeAp;
            this.sessionService.timeToShowEnd = this.timeToShowEnd;
            this.sessionService.timeToShowStart = this.timeToShowStart;
            let check1 = new Date(this.dateS.getFullYear(), this.dateS.getMonth(), this.dateS.getDate(),
                this.endTimeToSend, this.endTimeMinToSend, 0).toUTCString();
            this.filters.endTime = check1;
            this.sessionService.endDate = check1;
            this.filters.duration = this.duration;
            this.page = 1;
            this.skip = 0;
            this.limit = 10;
            if (moment(check1).isAfter(check)) {

                setTimeout(() => {
                    this.panelOpenState = false;

                }, 1);
                this.invokeEvent.next(event);

            } else {
                let dialogRef = this.dialog.open(CommonErrorDialog, {
                    data: {message: 'Start Time must be before the End Time.'}
                });
            }

        } else {
            if (this.startTimeHours == 'HH') {
                this.errorClass = true;
            }
            if (this.endTimeHours == 'HH') {
                this.errorClass1 = true;
            }
            if (!this.duration) {
                this.filtersError = true;
            }
            if (!this.date) {
                this.filtersErrorDate = true;
            }

        }

    }

    tutorDetails(id, tutor) {
        if (this.hasPartnerCode) {
            localStorage.setItem('hourlyRate', tutor.partnershipCode[0].hourlyRate);
        } else {
            localStorage.removeItem('hourlyRate');
        }
        localStorage.setItem('tutor_Id', id);
        localStorage.setItem('page1', JSON.stringify(this.page));
        let info = tutor;
        if (info && info.tutor && info.tutor.cancellationPolicy && info.tutor.cancellationPolicy != undefined) {
            this.cancellationPolicy = info.tutor.cancellationPolicy;
            if (this.cancellationPolicy && this.cancellationPolicy != undefined) {
                localStorage.setItem('cancelPolicy', JSON.stringify(this.cancellationPolicy));
            }
        }
        ga('send', {
            hitType: 'event',
            eventCategory: 'Tutor Short Card',
            eventAction: 'View Profile',
            eventLabel: 'View Profile'
        });
        this.tutorService.sendId(id);
        this.router.navigate(['/pages/book-session/tutor-details']);
    }

    roundOff(rating) {
        let rate = Math.round(rating);
        let multiplier = Math.pow(10, 1 || 0);
        return Math.round(rating * multiplier) / multiplier;
    }

    open(content) {
        let timeHistoryStart = this.timeToShowStart;
        let startTimeHours = this.startTimeHours;
        let startTimeMinutes = this.startTimeMinutes;
        let startTimeAp = this.startTimeAp;
        const config: ModalOptions = {
            backdrop: 'static',
            keyboard: false,
            animated: true
            // ignoreBackdropClick: true,

        };
        // this.modalService.open(content, config);
        const modalRef = this.modalService.open(content, config);

        modalRef.result.then((data) => {
            // on close
        }, (reason) => {
            this.startTimeAp = 'AM';
            this.timeToShowStart = undefined;
            this.startTime = undefined;
            this.startTimeHours = 'HH';
            this.startTimeMinutes = 'MM';
            this.sessionService.timeToShowStart = undefined;
            this.sessionService.startTimeHours = undefined;
            this.sessionService.startTimeMinutes = undefined;
            this.sessionService.startTimeAp = undefined;
            this.filters.startTime = undefined;
            if (timeHistoryStart) {
                this.timeToShowStart = timeHistoryStart;
                this.startTimeAp = startTimeAp;
                // this.startTime = this.startTime;
                this.startTimeHours = startTimeHours;
                this.startTimeMinutes = startTimeMinutes;
                this.sessionService.timeToShowStart = timeHistoryStart;
                this.sessionService.startTimeHours = startTimeHours;
                this.sessionService.startTimeMinutes = startTimeMinutes;
                this.sessionService.startTimeAp = startTimeAp;
            }
            // this.sessionService.=undefined;
            // on dismiss
        });
    }

    open2(content2) {
        let timeHistoryEnd = this.timeToShowEnd;
        let endTimeHours = this.endTimeHours;
        let endTimeMinutes = this.endTimeMinutes;
        let endTimeAp = this.endTimeAp;
        const config: ModalOptions = {
            backdrop: 'static',
            keyboard: false,
            animated: true
            // ignoreBackdropClick: true,

        };
        const modalRef = this.modalService.open(content2, config);

        modalRef.result.then((data) => {
            // on close
        }, (reason) => {
            this.endTimeAp = 'AM';
            this.timeToShowEnd = undefined;
            this.endTime = undefined;
            this.endTimeHours = 'HH';
            this.endTimeMinutes = 'MM';
            this.sessionService.timeToShowStart = undefined;
            this.sessionService.endTimeHours = undefined;
            this.sessionService.endTimeMinutes = undefined;
            this.sessionService.endTimeAp = undefined;
            this.filters.endTime = undefined;
            if (timeHistoryEnd) {
                this.timeToShowEnd = timeHistoryEnd;
                this.endTimeAp = endTimeAp;
                this.endTimeHours = endTimeHours;
                this.endTimeMinutes = endTimeMinutes;
                this.sessionService.timeToShowEnd = timeHistoryEnd;
                this.sessionService.endTimeHours = endTimeHours;
                this.sessionService.endTimeMinutes = endTimeMinutes;
                this.sessionService.endTimeAp = endTimeAp;
            }
            // on dismiss
        });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    clearSearchName() {
        if (this.filters.tutorName) {
            this._spinner.show();
            this.filters.tutorName = undefined;
            this.tutorService.setUserName(undefined);
            this.search.setValue(undefined);
            this.searchValue = undefined;
            this.page = 1;
            this.skip = 0;
            this.limit = 10;
            this.invokeEvent.next(<HTMLInputElement>document.getElementById('searchByName'));
        } else {
            this.searchValue = undefined;
            this.search.setValue(undefined);
        }
    }

    onChange(value: { hour: string, minute: string }) {
        if (!value) {
            setTimeout(() => {
                let hour = $('.ngb-tp-hour input').eq(0).val();
                let letterNumber = /^[0-9]+$/;
                let hh = new RegExp('^[0-9]+$');
                if ((hour.match(letterNumber))) {
                    setTimeout(() => {
                        this.startTime = {hour: hour, minute: 0, second: 0};
                    }, 2);
                } else {
                    setTimeout(() => {
                        this.startTime = {hour: 0, minute: 0, second: 0};
                    }, 2);
                }
                let error = document.getElementsByClassName('ngb-tp-hour');
                let error1 = document.getElementsByClassName('ngb-tp-minute');
                error[0].className = 'ngb-tp-hour';
                error1[0].className = 'ngb-tp-minute';
            }, 1);
        }
    }

    onChange1(value: { hour: string, minute: string }) {
        setTimeout(() => {
            if (!value) {
                let letterNumber = /^[0-9]+$/;
                let hour = $('.ngb-tp-hour input').eq(1).val();
                if ((hour.match(letterNumber))) {
                    setTimeout(() => {
                        this.endTime = {hour: hour, minute: 0, second: 0};
                    }, 2);
                } else {
                    setTimeout(() => {
                        this.endTime = {hour: 0, minute: 0, second: 0};
                    }, 2);
                }
            }
            let error = document.getElementsByClassName('ngb-tp-hour');
            let error1 = document.getElementsByClassName('ngb-tp-minute');
            error[1].className = 'ngb-tp-hour';
            error1[1].className = 'ngb-tp-minute';
        }, 1);
    }

    onChangeDate(e) {
        this.filtersErrorDate = false;
    }

    onChangeDuration(e) {
        this.filtersError = false;
    }

    sort(event) {
        this.filters.sortType = this.sortFilter;
        this.sessionService.setSort(this.sortFilter);
        this.page = 1;
        this.skip = 0;
        this.limit = 10;
        this.invokeEvent.next(event);

    }

    checkstartTimeAp() {
        if (this.startTimeAp == 'PM') {
            this.endTimeAp = 'PM';
            if (this.timeToShowEnd)
                this.timeToShowEnd = this.endTimeHours.replace(/^0+/, '') + ':' + this.endTimeMinutes + ' ' + this.endTimeAp;

        }
    }

    clearFilters() {
        this.closeFilters = false;
        this.startTimeAp = 'AM';
        this.endTimeAp = 'AM';
        this.endTimeHours = 'HH';
        this.startTimeHours = 'HH';
        this.startTimeMinutes = 'MM';
        this.endTimeMinutes = 'MM';
        this.disabledH = true;
        this.disabledM = true;
        this.disabledH1 = true;
        this.disabledM1 = true;
        this.date = undefined;
        this.startTime = undefined;
        this.endTime = undefined;
        this.timeToShowStart = undefined;
        this.timeToShowEnd = undefined;
        // this.duration = undefined;
        this.filters.startTime = undefined;
        this.filters.endTime = undefined;
        this.sessionService.startTimeHours = undefined;
        this.sessionService.endTimeHours = undefined;
        this.sessionService.startTimeMinutes = undefined;
        this.sessionService.endTimeMinutes = undefined;
        this.sessionService.startTimeAp = undefined;
        this.sessionService.endTimeAp = undefined;
        this.sessionService.timeToShowEnd = undefined;
        this.sessionService.timeToShowStart = undefined;
        this.filters.startTime = undefined;
        this.filters.endTime = undefined;
        this.filters.duration = undefined;
        this.sessionService.startDate = undefined;
        this.sessionService.date = undefined;
        this.sessionService.endDate = undefined;
        this.errorClass = false;
        this.errorClass1 = false;
        this.filtersError = false;
        this.filtersErrorDate = false;
        this.page = 1;
        this.skip = 0;
        this.limit = 10;
        this.invokeEvent.next(event);
        // this.subject.next(event)
    }

    // tutorRatings(event, selected) {
    //     let el = $('#moveUp');
    //     $('html,body').animate({ scrollTop: (el.offset().top - 50) }, 'slow', () => {
    //         el.focus();
    //     });
    //     if (event.source.value != undefined && event.checked) {
    //         this.filters.ratings = selected;
    //         this.sessionService.setRating(selected);

    //     } else {
    //         this.filters.ratings = '';

    //     }
    //     this.page = 1;
    //     this.skip = 0;
    //     this.limit = 10;
    //     this.subject.next(event);
    // }
    tutorRatings(event, selected) {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Browse Filters',
            eventAction: 'Browse by Ratings',
            eventLabel: 'Browse by Ratings'
        });
        if (event.source.value != undefined && event.checked) {
            this.filters.ratings = selected;
            this.sessionService.setRating(selected);
        } else {
            this.filters.ratings = '';
            this.selected = '';
            if (event.checked === false) {
                this.sessionService.setRating('');

            }
        }
        this.page = 1;
        this.skip = 0;
        this.limit = 10;
        if (this.web)
            this.invokeEvent.next(event);
    }

    pageChanged(page) {
        // window.scroll(0, 0)
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
        this.page = page;
        this.skip = (this.page - 1) * this.limit;
        this.browseTutor(this.areaLocation, this.limit, this.skip, this.filters);
    }

    browseTutor(data, limit, skip, filters) {
        this.showSearching = true;
        this._spinner.show();
        this.zone.runOutsideAngular(() => {

            this.store.dispatch({
                type: session.actionTypes.SELECT_TUTOR,
                payload: {
                    area: JSON.stringify(data),
                    limit: this.limit,
                    skip: this.skip,
                    filters: this.filters,
                    searchType: 'BOOK_A_SESSION',
                    totalSessions: parseInt(this.totalSessions, 10)
                }
            });
        });
    }

    learnMore() {

        let url = this.wordPressLink + 'how-it-works/the-sylvan-method/';
        window.open(url, '_blank');

    }

    startTimeHoursChange() {
        if (this.startTimeHours != 'HH') {
            if (this.startTimeMinutes == 'MM') {
                this.startTimeMinutes = '00';
                this.disabledM = false;
            }
            this.errorClass = false;
            this.disabledH = false;
        }
        if (this.startTimeMinutes != 'MM') {
            this.disabledM = false;
        }
        this.timeToShowStart = this.startTimeHours.replace(/^0+/, '') + ':' + this.startTimeMinutes + ' ' + this.startTimeAp;
    }

    endTimeHoursChange() {
        if (this.endTimeHours != 'HH') {
            this.disabledH1 = false;
            if (this.endTimeMinutes == 'MM') {
                this.endTimeMinutes = '00';
                this.disabledM1 = false;
            }
            this.errorClass1 = false;
        }
        if (this.endTimeMinutes != 'MM') {
            this.disabledM1 = false;
        }
        this.timeToShowEnd = this.endTimeHours.replace(/^0+/, '') + ':' + this.endTimeMinutes + ' ' + this.endTimeAp;
    }

    clearMobileFilters() {
        this.rangeValues = [10, 200];
        this.upperDistance.setValue('100+ Miles');
        this.distanceValues = 100;
        this.filters.minHourlyRate = 10;
        this.filters.maxHourlyRate = 200;
        this.lowerRange.setValue(('$' + '10'));
        this.upperRange.setValue(('$' + '200+'));
        this.filters.distance = 100;
        this.filters.sylvanCertifiedValue = false;
        this.filters.onlineSessionValue = false;
        this.sylvanCertifiedValue.setValue(false);
        this.onlineSessionValue.setValue(false);
        this.sessionService.setSylvanCertifiedValue(false);
        this.sessionService.setOnlineSessionValue(false);
        this.filters.stateCertifiedValue = false;
        this.stateCertifiedValue.setValue(false);
        this.sessionService.setStateCertifiedValue(false);
        this.filters.ratings = '';
        this.sessionService.setRating('');
        this.selected = undefined;
        this.filters.subjects = undefined;
        this.subjectArray = [];

        // this.subject.next(event);

    }

    onScrollDown() {
        if (this.count >= this.limit) {

            this.limit = this.limit + 2;
            this._spinner.hide();

            this.zone.runOutsideAngular(() => {

                this.store.dispatch({
                    type: session.actionTypes.SELECT_TUTOR,
                    payload: {
                        area: JSON.stringify(this.areaLocation),
                        limit: this.limit,
                        skip: this.skip,
                        filters: this.filters,
                        searchType: 'BOOK_A_SESSION',
                        totalSessions: parseInt(this.totalSessions, 10)
                    }
                });
            });
        }

    }

    applyMobileFilters() {
        // this._spinner.show();
        this.closeFilters = false;
        let filterCount = this.filterCount;
        if (this.sessionService.stateCertifiedValue || this.sessionService.sylvanCertifiedValue || this.sessionService.onlineSessionValue) {
            filterCount = filterCount + 1;
        }

        if (this.sessionService.rating && this.sessionService.rating) {
            filterCount = filterCount + 1;
        }

        this.invokeEvent.next(event);
        this.filterCountShow = filterCount;
        this.sessionService.filterCount = filterCount;
        setTimeout(() => {
            $('div').scrollTop(0);
            this.renderer.invokeElementMethod(this.sidenav1.nativeElement, 'click');
        }, 1);

        document.body.style.position = 'relative';
        document.body.style.height = '100%';
        // this.sidenav.opened = !this.sidenav.opened;
    }

    disableBody() {
        if (this.closeMobileFilters == true) {
            this.closeMobileFilters = false;
        } else {
            this.closeMobileFilters = true;
            setTimeout(() => {
                this.closeMobileFilters = false;

            }, 1);
        }
        this.closeFilters = false;
        document.body.style.position = 'fixed';
        document.body.style.height = '100vh';
        document.getElementById('matSideNav').style.zIndex = '100';
        let backupData: any = {};
        backupData.rating = this.sessionService.rating;
        backupData.hourlyRate = this.sessionService.hourlyRate;
        backupData.distance = this.sessionService.getDistance();
        backupData.stateCertified = this.sessionService.getStateCertifiedValue();
        backupData.sylvanCertified = this.sessionService.getSylvanCertifiedValue();
        backupData.onlineSession = this.sessionService.getOnlineSessionValue();
        localStorage.setItem('backUpData', JSON.stringify(backupData));
        setTimeout(() => {
            document.body.style.position = 'fixed';
            document.body.style.height = '100vh';
            this.renderer.invokeElementMethod(this.sidenav1.nativeElement, 'click');

        }, 25);
    }

    defaultFilters() {
        let defaultData = JSON.parse(localStorage.getItem('backUpData'));

        // debugger
        if (defaultData.distance) {
            this.distanceValues = defaultData.distance;
            this.filters.distance = defaultData.distance;
            // this.upperDistance = defaultData.distance;
            this.upperDistance.setValue(defaultData.distance + ' ' + 'Miles');
        } else {
            this.upperDistance.setValue('100+ Miles');
            this.filters.distance = 100;
            this.distanceValues = 100;
            this.sessionService.setDistance(100);

        }
        if (defaultData.rating) {
            this.selected = defaultData.rating;
            this.filters.ratings = defaultData.rating;
        } else {
            this.filters.ratings = '';
            this.sessionService.setRating('');
            this.selected = undefined;
        }
        if (defaultData.sylvanCertified) {
            this.filters.sylvanCertifiedValue = true;
            this.sylvanCertifiedValue.setValue(true);
            this.sessionService.setSylvanCertifiedValue(true);

        } else {
            this.filters.sylvanCertifiedValue = false;
            this.sylvanCertifiedValue.setValue(false);
            this.sessionService.setSylvanCertifiedValue(false);
        }
        if (defaultData.onlineSession) {
            this.filters.onlineSessionValue = true;
            this.onlineSessionValue.setValue(true);
            this.sessionService.setOnlineSessionValue(true);

        } else {
            this.filters.onlineSessionValue = false;
            this.onlineSessionValue.setValue(false);
            this.sessionService.setOnlineSessionValue(false);
        }
        if (defaultData.stateCertified) {
            this.filters.stateCertifiedValue = true;
            this.stateCertifiedValue.setValue(true);
            this.sessionService.setStateCertifiedValue(true);
        } else {
            this.filters.stateCertifiedValue = false;
            this.stateCertifiedValue.setValue(false);
            this.sessionService.setStateCertifiedValue(false);
        }

    }

    enableBody() {
        document.body.style.position = 'relative';
        document.body.style.height = '100%';
        document.getElementById('matSideNav').style.zIndex = '40';
    }

    checkSuppressCases() {

        if (this.userData.partnershipCode && this.userData.partnershipCode.length && this.userData.partnershipCode[0].isRateChargeSuppress) {
            if (this.userData.parent.numberOfTutoringHours == 0 && !this.userData.parent.isParentOutOfTutoringHours) {
                this.dialog.open(NoHourAvailable, {
                    data: {userData: this.userData, bookAgainText: true},
                    panelClass: 'contentHieght'
                });
                return true;
            }
        }
    }

    selectTutor(tutor, id) {
        if (this.checkSuppressCases()) {
            return;
        }
        let info = tutor;
        if (this.hasPartnerCode) {
            localStorage.setItem('hourlyRate', tutor.partnershipCode[0].hourlyRate);
        } else {
            localStorage.removeItem('hourlyRate');
        }
        if (info && info.tutor && info.tutor.cancellationPolicy && info.tutor.cancellationPolicy != undefined) {
            this.cancellationPolicy = info.tutor.cancellationPolicy;
            if (this.cancellationPolicy && this.cancellationPolicy != undefined) {
                localStorage.setItem('cancelPolicy', JSON.stringify(this.cancellationPolicy));
            }
        }
        localStorage.setItem('tutor_Id', id);
        if (tutor.sessionsWithTutor) {
            this.sessionsWithTutor = true;
        } else {
            this.sessionsWithTutor = false;
        }
        if (localStorage.getItem('steponeData')) {
            let addressToCompare = tutor.parentData;
            let step1Data = JSON.parse(localStorage.getItem('steponeData'));

            this.isSessionOnline = step1Data.isSessionOnline == 'true' || step1Data.isSessionOnline == true;

            if (step1Data.address) {
                this.step1Data = step1Data.address._id;
                //   debugger;
                let obj = addressToCompare.find((o, i) => {
                    if (o._id === this.step1Data) {
                        if (o.withinTutorPreferredDistance === false) {
                            this.showAddressPopError = true;
                        } else {
                            this.showAddressPopError = false;
                        }
                        return true; // stop searching
                    }
                });
            }
        }
        if (this.checkLogin.login()) {

            if (this.showAddressPopError && !this.sessionsWithTutor && !this.isSessionOnline) {
                //
                // if (this.showAddressPopError && !this.sessionsWithTutor) {
                this.zone.run(() => {
                    let dialogRef = this.dialog.open(CommonErrorDialog, {
                        data: {
                            message: 'Oops! If you are attempting to schedule an in-person session, based on this tutor’s Travel Policy, they may not be willing to offer tutoring at your chosen location. If you wish to continue with an in-person session request, we recommend choosing a location closer to the tutor to reduce travel distance. If you are scheduling an online session, please continue with your request.',
                            data: 'selectTutor',
                            inside: 'true'
                        }
                    });
                });
            } else {
                // this.spinner.show();
                this.sessionService.tutorSelected = true;
                if (localStorage.getItem('PROMOCODE') != undefined) {
                    localStorage.removeItem('PROMOCODE');
                }
                if (localStorage.getItem('promoVal') != undefined) {
                    localStorage.removeItem('promoVal');
                }
                this.sessionService.updateStepperIndex(1);
                this.router.navigate(['/pages/book-session/session']).then(() => {
                    this.sessionService.changeStep.next(1);
                });
            }
        } else {
            this.spinner.hide();
            let dialogRef = this.dialog.open(LoginDialog);
        }
    }

    ngOnDestroy() {
        if (this.sessionStore && this.sessionStore != undefined) {
            this.sessionStore.unsubscribe();
        }
        this.addressDataStore.unsubscribe();
        this.profileStore.unsubscribe();
        if (document.getElementById('breadCrumb')) {
            let elements = document.getElementById('breadCrumb');
            elements.style.display = 'block';
            let k = document.getElementById('alMain');
            k.style.marginTop = '45px !important';
        }

    }
}
