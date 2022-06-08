import { Component, ViewChild, ElementRef, Renderer, NgZone, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as auth from '../../../../auth/state/auth.actions';
import * as tutor from '../../state/tutor.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs/Subject';
import * as moment from 'moment';
import { TutorService } from '../../../../services/tutor-service/tutor.service';
import { FindTutor } from '../find-tutor-dialog';
import { Subscription } from 'rxjs/Rx';
import { MatDialog } from '@angular/material';
import * as profile from '../../../../pages/profile/state/profile.actions';
import { AuthService } from '../../../../auth/service/auth-service/auth.service';
import { NgbTimepickerConfig, NgbTimeStruct, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonErrorDialog } from '../../../../auth/model/common-error-dialog/common-error-dialog';
import { BookSessionService } from '../../../../services/session-service/session.service';
import { AllSessionService } from '../../../../services/all-sessions-service/all-sessions.service';
import { CompleteProfileDialog } from '../../../../auth/model/complete-profile-dialog/complete-profile-dialog.component';
import { LoginDialog } from '../../../../auth/model/session-login-dialog/session-login-dialog.component';
import { BaThemeSpinner } from '../../../../theme/services/baThemeSpinner';
import { ModalOptions } from 'ngx-bootstrap/modal';
import { NoHourAvailable } from '../../../../auth/model/no-hour-available/no-hour-available';
import { CommonService } from '../../../../services/common.service';
import { CONSTANT } from '../../../../shared/constant/constant';
import { NoTodayHourAvailable } from '../../../../auth/model/no-today-hour-available';

declare let ga: Function;

@Component({
    selector: 'browse-tutor',
    templateUrl: './browse-tutor.html',
    styleUrls: ['./browse-tutor.scss']
})
export class BrowseTutor implements AfterViewInit {
    public canBookSession: boolean = false;
    compareZip: any;
    authStore: Subscription;
    tutort: boolean;
    marketValues: any;
    marketId: boolean;
    selected: any;
    public nineGrade: boolean = false;
    public sixGrade: boolean = false;
    public threeGrade: boolean = false;
    public kgrade: boolean = false;
    getGrades: any;
    public slider: any;
    public storeData;
    public count: number;
    zipLatLong;
    public thisLatitude;
    public thisLongitude;
    public postCode;
    public userInfo;
    public isRateChargeSuppressNow = false;
    public tutorStore: Subscription;
    public profileStore: Subscription;
    public limit: number = 10;
    public minutes: any = 0;
    public page: number = 1;
    public skip: number = 0;
    public tutor_image = '/assets/img/user.png';
    public certi_bgCheck = '/assets/img/background-checked.svg';
    public certi_degCheck = '/assets/img/degree-icon-1.svg';
    public certi_sylCheck = '/assets/img/certified-in-sylvan-method.svg';
    public certi_stateCheck = '/assets/img/state-certified.svg';
    public onlineSessions = '/assets/img/online.svg';
    public form: FormGroup;
    public submitted: boolean = false;
    public zipCodeModel;
    public sylvanCertifiedValue: AbstractControl;
    public onlineSessionValue: AbstractControl;
    public stateCertifiedValue: AbstractControl;
    public search: AbstractControl;
    public zipcode: AbstractControl;
    public gradeRadio: AbstractControl;
    public ratingRadio: AbstractControl;
    public lowerRange: AbstractControl;
    public upperRange: AbstractControl;
    public lowerDistance: AbstractControl;
    public upperDistance: AbstractControl;
    public subjectsControl: AbstractControl;
    public rangeValues: number[];
    public distanceValues: number;
    public response: any;
    public current: any;
    public tutors = [];
    public locationDetails: any = {};
    public subject = new Subject();
    public browse = new Subject();
    public filters;
    public enteredZipcode;
    public locationDetailsQuery;
    public zipDialog: boolean = false;
    public subjects = [];
    public showSubjects = [];
    public no_categorySubjects = [];
    public subjectArray = [];
    public obj = {};
    public gradeArray = [];
    public grades = [];
    public gradek2 = ['K', '1', '2'];
    public grade35 = ['3', '4', '5'];
    public grade68 = ['6', '7', '8'];
    public grade912 = ['9', '10', '11', '12'];
    public gArray: any;
    public openedHour = 0;
    public openedRate = 0;
    parentSubject = [];
    startTimeMinutes: any = 'MM';
    startTimeHours: any = 'HH';
    startTimeAp: any = 'AM';
    endTimeMinutes: any = 'MM';
    endTimeHours: any = 'HH';
    endTimeAp: any = 'AM';
    expandSubject: boolean = false;
    expandedTutorQual: boolean;
    duration: any;
    sortFilter: any = 'RELEVANCE';
    startTime: NgbTimeStruct;
    endTime: NgbTimeStruct;
    hourStep: number;
    minuteStep: number;
    secondStep: number;
    date: any;
    disabledH: any = true;
    disabledM: any = true;
    disabledH1: any = true;
    disabledM1: any = true;
    dateS: Date;
    filtersError: any = false;
    filtersErrorDate: boolean = false;
    marketAvail: boolean;
    hours: any[];
    wordPressLink: string;
    errorClass: boolean;
    errorClass1: boolean;
    errorTime: string;
    startTimeHoursToSend: any;
    endTimeToSend: number;
    endTimeMinToSend: any;
    startTimeMinToSend: any;
    durationArray: number[] = [0.5, 1, 1.5, 2, 2.5, 3];
    durationCheck: any;
    durationCheckArray: number[];
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
    filterCountShow: any;
    closeMobileFilters: any;
    panelOpenState: boolean;
    max: any;
    minDate: Date;
    showSearching: boolean;
    searchValue: any;
    cancellationPolicy: any;
    showAlternatePrice: boolean;
    showNationWide: boolean;
    hasPartnerCode: boolean;
    availHide: boolean;
    isCanada = false;
    staticZip = false;

    constructor(private fb: FormBuilder, private checkLogin: AuthService, private renderer: Renderer, private sessionService: BookSessionService,
                public allSessionService: AllSessionService, private store: Store<any>, public zone: NgZone,
                config: NgbTimepickerConfig, private _spinner: BaThemeSpinner, private tutorService: TutorService,
                private dialog: MatDialog, private toastrService: ToastrService, private activatedRoute: ActivatedRoute,
                private authService: AuthService, private router: Router, private modalService: NgbModal,
                public commonService: CommonService
    ) {

        if (localStorage.getItem('login') == 'yes') {
            this.availHide = true;
        } else {
            this.availHide = false;
        }

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

        if (localStorage.getItem('isByPassMarket') == 'true') {
            this.showAlternatePrice = false;
        } else {
            this.showAlternatePrice = true;
        }
        this.sessionService.sessionLengthArray = [];
        this.minDate = new Date();
        let momentDate: any = moment().add(121, 'days');
        this.max = new Date(momentDate.year(), momentDate.month(), momentDate.date(), 0, 0, 0);
        // this.sessionService= undefined;
        // this.sessionService.stepData = undefined;
        // this.sessionService.step2Data = undefined;
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

        if (localStorage.getItem('page')) {
            this.page = JSON.parse(localStorage.getItem('page'));
            this.skip = (this.page - 1) * this.limit;
            localStorage.removeItem('page');

        }
        localStorage.removeItem('tutorUId');
        this.tutort = false;
        // window.scroll(0, 0);
        this.filters = {};
        this.store.dispatch({
            type: tutor.actionTypes.GET_SUBJECTS
        });
        ga('send', {
            hitType: 'event',
            eventCategory: 'Navigation',
            eventAction: 'Browse Tutors',
            eventLabel: 'Find a Tutor'
        });

        this.rangeValues = [10, 200];
        this.distanceValues = 100;
        this.filters.minHourlyRate = 10;
        this.filters.maxHourlyRate = 200;
        this.filters.distance = 100;
        this.options = fb.group({
            bottom: 0,
            fixed: true,
            top: 0
        });
        this.form = fb.group({
            'search': ['', Validators.compose([])],
            // Validators.maxLength(5)
            'zipcode': ['', Validators.compose([])],
            'sylvanCertified': [false, Validators.compose([])],
            'onlineSession': [false, Validators.compose([])],
            'stateCertified': [false, Validators.compose([])],
            'gradeRadio': ['', Validators.compose([])],
            'ratingRadio': ['', Validators.compose([])],
            'lowerRange': ['', Validators.compose([])],
            'upperRange': ['', Validators.compose([])],
            'lowerDistance': ['', Validators.compose([])],
            'upperDistance': ['', Validators.compose([])],
            'subjectsControl': ['', Validators.compose([])]

        });

        // if (localStorage.getItem('isNationWide') == 'true') {
        //     this.form.controls.onlineSession.patchValue(true);
        // }

        this.search = this.form.controls['search'];
        this.sylvanCertifiedValue = this.form.controls['sylvanCertified'];
        this.onlineSessionValue = this.form.controls['onlineSession'];
        if (localStorage.getItem('onlyNationWide') == 'true') {
            this.onlineSessionValue.setValue(true);
            this.onlineSessionValue.disable();
        }
        this.stateCertifiedValue = this.form.controls['stateCertified'];
        this.zipcode = this.form.controls['zipcode'];

        this.gradeRadio = this.form.controls['gradeRadio'];
        this.ratingRadio = this.form.controls['ratingRadio'];
        this.lowerRange = this.form.controls['lowerRange'];
        this.upperRange = this.form.controls['upperRange'];
        this.lowerDistance = this.form.controls['lowerDistance'];
        this.upperDistance = this.form.controls['upperDistance'];
        this.subjectsControl = this.form.controls['subjectsControl'];
        this.lowerRange.setValue(('$' + this.rangeValues[0]));
        this.upperRange.setValue(('$' + this.rangeValues[1]));
        this.lowerDistance.setValue((0 + ' Miles'));
        this.upperDistance.setValue(('100+ Miles'));
        this.subjectArray = [];
        this.upperRange.setValue('$200+');

        this.zone.run(() => {

        });
        if (screen.width <= 1023) {
            this.web = false;
            document.body.style.position = 'relative';
            document.body.style.height = '100%';
        } else {

        }

        if (this.tutorService.getDistance() != undefined) {
            this.distanceValues = this.tutorService.getDistance();
            if (this.distanceValues === 100) {
                this.upperDistance.setValue('100+ Miles');
            } else {
                this.upperDistance.setValue(this.distanceValues + ' Miles');
            }
            this.filters.distance = this.distanceValues;

        }
        if (this.tutorService.getHourlyRate() != undefined) {
            let hourlRate = this.tutorService.getHourlyRate();
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
        if (this.tutorService.timeToShowEnd) {
            this.timeToShowEnd = this.tutorService.timeToShowEnd;
        }
        if (this.tutorService.timeToShowStart) {
            this.timeToShowStart = this.tutorService.timeToShowStart;

        }
        if (this.tutorService.getName() != undefined) {
            let name = this.tutorService.getName();
            this.filters.tutorName = name;
            this.search.setValue(name);
            this.searchValue = name;
        }
        if (this.tutorService.filterCount) {
            this.filterCountShow = this.tutorService.filterCount;
        } else {
            this.filterCountShow = 2;

        }
        if (this.tutorService.startTime) {
            this.startTime = {
                hour: this.tutorService.startTime.hour,
                minute: this.tutorService.startTime.minute,
                second: 0
            };
            this.filters.startTime = this.tutorService.startDate;

        }
        if (this.tutorService.startTimeHours) {
            this.startTimeHours = this.tutorService.startTimeHours;
            this.disabledH = false;
            this.disabledM = false;
            this.date = this.tutorService.date;
        }
        if (this.tutorService.endTimeHours) {
            this.endTimeHours = this.tutorService.endTimeHours;
            this.disabledH1 = false;
            this.disabledM1 = false;

        }
        if (this.tutorService.startTimeMinutes) {
            this.startTimeMinutes = this.tutorService.startTimeMinutes;
        }
        if (this.tutorService.endTimeMinutes) {
            this.endTimeMinutes = this.tutorService.endTimeMinutes;
        }
        if (this.tutorService.startTimeHours && this.endTimeHours) {
            this.filters.startTime = this.tutorService.startDate;
            this.filters.endTime = this.tutorService.endDate;
        }
        if (this.tutorService.startTimeAp) {
            this.startTimeAp = this.tutorService.startTimeAp;
        }
        if (this.tutorService.endTimeAp) {
            this.endTimeAp = this.tutorService.endTimeAp;
        }
        if (this.tutorService.duration) {
            this.duration = this.tutorService.duration;
            this.filters.duration = this.duration;
        }
        if (this.tutorService.endTime) {
            this.endTime = {hour: this.tutorService.endTime.hour, minute: this.tutorService.endTime.minute, second: 0};
            this.filters.endTime = this.tutorService.endDate;
        }
        if (this.tutorService.getRatings() != undefined) {
            this.selected = this.tutorService.getRatings();
            this.filters.ratings = this.selected;
        }
        if (this.tutorService.getSelectedSubjects() != undefined) {
            this.subjectArray = JSON.parse(this.tutorService.getSelectedSubjects());
            this.filters.subjects = this.subjectArray;

        }
        if (this.tutorService.getSylvanCertifiedValue()) {
            this.expandedTutorQual = true;

            let sylvanCertifiedValue = this.tutorService.getSylvanCertifiedValue();
            this.filters.sylvanCertifiedValue = sylvanCertifiedValue;
            this.sylvanCertifiedValue.setValue(sylvanCertifiedValue);
            // this.search.setValue(sylvanCertifiedValue);
        }
        if (this.tutorService.getOnlineSessionValue()) {
            this.expandedTutorQual = true;

            let onlineSession = this.tutorService.getOnlineSessionValue();
            this.filters.onlineSession = onlineSession;
            this.onlineSessionValue.setValue(onlineSession);
            // this.search.setValue(sylvanCertifiedValue);
        }
        if (this.tutorService.getSort()) {
            this.sortFilter = this.tutorService.getSort();
            this.filters.sortType = this.tutorService.getSort();
        }
        if (this.tutorService.getStateCertifiedValue()) {
            this.expandedTutorQual = true;
            let sylvanCertifiedValue = this.tutorService.getStateCertifiedValue();
            this.filters.stateCertifiedValue = sylvanCertifiedValue;
            this.stateCertifiedValue.setValue(sylvanCertifiedValue);
            // this.search.setValue(sylvanCertifiedValue);
        }
        if (this.tutorService.getGrades() != undefined) {
            this.getGrades = this.tutorService.getGrades();
            this.getGrades.forEach((element) => {

                switch (element) {
                    case 'K-2':
                        this.kgrade = true;
                        this.grades.push(this.gradek2);
                        break;
                    case '3-5':
                        this.threeGrade = true;
                        this.grades.push(this.grade35);
                        break;

                    case '6-8':
                        this.sixGrade = true;
                        this.grades.push(this.grade68);

                        break;

                    case '9-12':
                        this.nineGrade = true;
                        this.grades.push(this.grade912);

                        break;

                    default:
                        this.kgrade = false;
                        this.threeGrade = false;
                        this.sixGrade = false;
                        this.nineGrade = false;

                        break;

                }
                this.gradeArray.push(element);

            });
            if (this.grades.length > 0) {
                this.gArray = this.grades.reduce(
                    (previousValue, currentValue) => previousValue.concat(currentValue)
                );
            } else {
                this.gArray = [];
            }
            this.filters.grade = this.gArray;
        }

        this.activatedRoute.queryParams.subscribe((params: any) => {
            if (params.location != undefined) {
                let market = params.location;
                this.marketId = false;
                let marketValue = {
                    market: market,
                    visibility: false
                };
                this.marketAvail = true;
                // this.filters.distance = '';

                this.tutorService.setLocationMarket(marketValue);
            } else {
                this.marketAvail = false;

            }
        });
        if (this.tutorService.getLocationMarket() && (this.marketId === false)) {
            this.marketValues = this.tutorService.getLocationMarket();
            if (this.marketValues != undefined) {
                this.marketId = this.marketValues.visibility;
            }
            // this.filters.distance = '';
            this.filters.marketId = this.marketValues.market;
            this.browseTutorMarket(this.limit, this.skip, this.filters);

        } else {
            this.marketId = true;
        }

        if (!localStorage.getItem('token') && this.tutorService.getLocationMarket() === undefined && !localStorage.getItem('zip_code')) {

            this.showPopup();
        }
        if (!localStorage.getItem('token') && this.tutorService.getLocationMarket() === undefined && this.marketId && localStorage.getItem('zip_code') && localStorage.getItem('zip_code') != undefined) {
            let locations = JSON.parse(localStorage.getItem('zip_code'));
            this.locationDetails = {
                latitude: locations.latitude,
                longitude: locations.longitude,
                zipCode: locations.zipCode
            };

            this.checkTutors();

        }
        // this.upperRange.setValue('$200+');

        this.profileStore = this.store.select('profile').subscribe((res: any) => {
            if (res) {
                if (res.userData && res.userData.data) {
                    this.userInfo = res.userData.data;

                    this.checkIsSuppress();

                    if (this.userInfo.parent && this.userInfo.parent != undefined && this.userInfo.parent.addresses && this.userInfo.parent.addresses.length > 0 && this.tutorService.getLocationMarket() === undefined) {
                        this.zipDialog = true;
                        this.userInfo.parent.addresses.forEach(element => {
                            if (element.isDefault == true) {
                                this.locationDetails = {
                                    latitude: element.location.coordinates[1],
                                    longitude: element.location.coordinates[0],
                                    zipCode: element.zipCode ? element.zipCode : ''
                                };
                            }
                        });
                        if (this.locationDetails && this.locationDetails != undefined && (this.tutorService.getFilterZipCodeDetails() === undefined)) {
                            // this.zipCodeModel = this.locationDetails.zipCode;
                        }
                    }

                    if (this.tutorService.getFilterZipCodeDetails() != undefined) {
                        let location = JSON.parse(this.tutorService.getFilterZipCodeDetails());
                        this.locationDetails = {
                            latitude: location.latitude,
                            longitude: location.longitude,
                            zipCode: location.zipCode
                        };

                        // this.zipCodeModel = this.locationDetails.zipCode;
                    }

                    this.isCanada = this.commonService.checkIsCanada(this.userInfo);
                    if (this.isCanada || !this.userInfo.parent.addresses.length) {
                        if (this.userInfo.partnershipCode && this.userInfo.partnershipCode.length
                            && this.userInfo.partnershipCode[0].isRateChargeSuppress) {
                            this.staticZip = true;
                        }

                    }

                    if (this.staticZip) {
                        this.locationDetails = CONSTANT.STATIC_ZIP_CODE;
                        // this.locationDetails = {
                        //     latitude: '47.0984',
                        //     longitude: '101.1810',
                        //     zipCode: '58530'
                        // };
                    }

                    if (this.userInfo && this.userInfo != undefined) {
                        this.checkTutors();
                    }

                }
                if (res.userData && res.userData.data && res.userData.data != undefined) {
                    let user = res.userData.data;

                    if (user.students && user.students.length > 0 && user.parent && user.parent.addresses && user.parent.addresses.length > 0) {
                        this.canBookSession = this.commonService.checkChildDOB(user);
                    }
                }

            }

        });
        this.authStore = this.store.select('auth').subscribe((res: any) => {
            if (res) {
                if (res && res.checkTutor) {
                    this.checkTutors();

                }
            }
        });

        //store subscribed
        // if (this.tutorService.getFilterZipCodeDetails() != undefined) {
        //     let location = JSON.parse(this.tutorService.getFilterZipCodeDetails());
        //     this.locationDetails = {
        //         latitude: location.latitude,
        //         longitude: location.longitude,
        //         zipCode: location.zipCode
        //     }

        //     this.zipCodeModel = this.locationDetails.zipCode;

        // }
        this.tutorStore = this.store.select('tutor').subscribe((res: any) => {
            if (res) {
                this.tutors = [];
                this.zone.run(() => {
                    if (res.zipcode && res.zipcode != undefined) {
                        this.zipCodeModel = res.zipcode;
                    }
                    if (res.tutors && res.tutors != undefined) {
                        this.showSearching = false;
                        this._spinner.hide();
                        this.tutors = res.tutors.data;
                        this.tutort = true;

                        this.gotoTutor(this.tutors);

                    }
                    if (res.tutorsCount === 0) {
                        this._spinner.hide();
                        this.count = 0;
                        this.showSearching = false;
                    }
                    if (res.tutorsCount && res.tutorsCount != undefined && res.tutorsCount.data && res.tutorsCount.data != undefined) {
                        this.count = res.tutorsCount.data.count;
                        // window.screen
                        // screen.width
                        if (window.innerWidth != undefined && window.innerWidth <= 1023) {
                            if (this.count > 0) {
                                let element = document.getElementById('tutors') as HTMLElement;
                                let el = $('.tutors1');
                                if (el != undefined && el.offset() != undefined) {
                                    $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
                                        el.focus();
                                    });
                                }
                            }
                        }
                    }
                    if (res.subjects && res.subjects != undefined) {
                        if (res.subjects.data && res.subjects.data != undefined) {
                            this.subjects = res.subjects.data;
                            this.showSubjects = [];
                            this.no_categorySubjects = [];
                            for (let i = 0; i < this.subjects.length; i++) {
                                if (this.subjects[i].subcategories && this.subjects[i].subcategories.length > 0) {
                                    this.showSubjects.push(this.subjects[i]);
                                }
                                if (!this.subjects[i].subcategories) {
                                    this.no_categorySubjects.push(this.subjects[i]);
                                }
                            }
                        }
                    }
                    if (res && res.latLongResult && res.latLongResult != undefined) {
                        this.zipLatLong = res.latLongResult;
                    }
                });
            }
        });

    }

    checkSuppressCases() {
        if (this.userInfo && this.userInfo.partnershipCode && this.userInfo.partnershipCode.length && this.userInfo.partnershipCode[0].isRateChargeSuppress) {
            let length = this.commonService.noOfNonExpiredHours(this.userInfo.parent.sessionCreditsFromExternalApi);
            if (length === 0 && this.userInfo.parent.numberOfTutoringHours > 0) {
                this.dialog.open(NoTodayHourAvailable, {
                    data: {userData: this.userInfo},
                    panelClass: 'contentHieght'
                });
                return true;
            } else {
                if (this.userInfo.parent.numberOfTutoringHours == 0 && !this.userInfo.parent.isParentOutOfTutoringHours) {
                    this.dialog.open(NoHourAvailable, {
                        data: {userData: this.userInfo, bookAgainText: true},
                        panelClass: 'contentHieght'
                    });
                    return true;
                }
            }
        }
    }

    checkIsSuppress() {
        if (this.userInfo.partnershipCode && this.userInfo.partnershipCode.length
            && this.userInfo.partnershipCode[0].isRateChargeSuppress) {
            this.isRateChargeSuppressNow = true;
            if (this.userInfo.parent.isParentOutOfTutoringHours) {
                this.isRateChargeSuppressNow = false;
            } else {
                this.isRateChargeSuppressNow = true;
            }
        } else {
            this.isRateChargeSuppressNow = false;
        }
    }

    gotoTutor(data) {

        if (localStorage.getItem('tutor_detail')) {
            if (localStorage.getItem('tutor_Id')) {
                data.forEach((tutor, key) => {
                    if (localStorage.getItem('tutor_Id') == tutor._id) {
                        localStorage.removeItem('tutor_detail');
                        this.tutorDetails(tutor._id, tutor.tutor.tutorId, tutor);
                    }
                });
            }
        }

    }

    roundOff(rating) {
        let rate = Math.round(rating);
        let multiplier = Math.pow(10, 1 || 0);
        return Math.round(rating * multiplier) / multiplier;
    }

    checkTutors() {

        if (this.tutorService.getFilterZipCodeDetails() != undefined) {
            let location = JSON.parse(this.tutorService.getFilterZipCodeDetails());
            this.locationDetails = {
                latitude: location.latitude,
                longitude: location.longitude,
                zipCode: location.zipCode
            };
        }
        if (this.locationDetails && this.locationDetails.latitude && this.tutorService.getLocationMarket() === undefined) {
            // this.zipCodeModel = this.locationDetails.zipCode;
            if (this.staticZip) {
            } else {
            }
            this.browseTutor(this.locationDetails, this.limit, this.skip, this.filters);
        }
            // else if (this.locationDetailsQuery && this.locationDetailsQuery != undefined) {
            //     this.locationDetails = this.locationDetailsQuery;
            //     this.browseTutor(this.locationDetails, this.limit, this.skip, this.filters);
        // }
        else {
            if (localStorage.getItem('token') && localStorage.getItem('token') != undefined && this.tutorService.getLocationMarket() === undefined) {
                this.getPosition();
            }
        }
    }

    isChecked(id) {
        if (this.subjectArray && this.subjectArray != undefined && this.subjectArray.length > 0) {
            for (let subcat of this.subjectArray) {
                if (subcat == id) return true;
            }
            return false;
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
            this.tutorService.timeToShowStart = undefined;
            this.tutorService.startTimeHours = undefined;
            this.tutorService.startTimeMinutes = undefined;
            this.tutorService.startTimeAp = undefined;
            this.filters.startTime = undefined;
            this.tutorService.startTime = undefined;
            if (timeHistoryStart) {
                this.timeToShowStart = timeHistoryStart;
                this.startTimeAp = startTimeAp;
                // this.startTime = this.startTime;
                this.startTimeHours = startTimeHours;
                this.startTimeMinutes = startTimeMinutes;
                this.tutorService.timeToShowStart = timeHistoryStart;
                this.tutorService.startTimeHours = startTimeHours;
                this.tutorService.startTimeMinutes = startTimeMinutes;
                this.tutorService.startTimeAp = startTimeAp;
                // this.filters.startTime = undefined;
                // this.tutorService.startTime = undefined;

            }
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
            this.tutorService.timeToShowStart = undefined;
            this.tutorService.endTimeHours = undefined;
            this.tutorService.endTimeMinutes = undefined;
            this.tutorService.endTimeAp = undefined;
            this.filters.endTime = undefined;
            if (timeHistoryEnd) {
                this.timeToShowEnd = timeHistoryEnd;
                this.endTimeAp = endTimeAp;
                this.endTimeHours = endTimeHours;
                this.endTimeMinutes = endTimeMinutes;
                this.tutorService.timeToShowEnd = timeHistoryEnd;
                this.tutorService.endTimeHours = endTimeHours;
                this.tutorService.endTimeMinutes = endTimeMinutes;
                this.tutorService.endTimeAp = endTimeAp;
            }
            // on dismiss
        });
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

    isExpanded(id) {
        if (this.tutorService.parentSubject.length > 0) {
            for (let j = 0; j < this.tutorService.parentSubject.length; j++) {
                if (this.tutorService.parentSubject[j] === id) {
                    return true;
                }
            }
            return false;
        }
    }

    handleChange(event) {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Browse Filters',
            eventAction: 'Browse by Hourly Rate',
            eventLabel: 'Browse by Hourly Rate'
        });
        this.lowerRange.setValue(event.values ? ('$' + event.values[0]) : 10);
        if (event.values[1] === 200) {
            this.upperRange.setValue('$200+');
        } else {
            this.upperRange.setValue(event.values ? ('$' + event.values[1]) : 200);
        }
        this.tutorService.setHourlyRate(event.values[0], event.values[1]);
        this.filters.minHourlyRate = event.values[0];
        this.filters.maxHourlyRate = event.values[1];
        this.page = 1;
        this.skip = 0;
        this.limit = 10;
        if (this.web)
            this.subject.next(event);
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
        this.tutorService.setDistance(this.distanceValues);
        let distance = this.distanceValues;
        this.filters.distance = distance;
        this.page = 1;
        this.skip = 0;
        this.limit = 10;
        if (this.web)
            this.subject.next(event);
    }

    selectSubject(data, event, i, sub) {
        this.parentSubject.push(sub._id);
        this.tutorService.parentSubject.push(sub._id);
        ga('send', {
            hitType: 'event',
            eventCategory: 'Browse Filters',
            eventAction: 'Browse by Subjects',
            eventLabel: 'Browse by Subjects'
        });
        let index = this.subjectArray.findIndex((element) => {
            return element == data._id;
        });
        if (index != -1) {
            this.subjectArray.splice(index, 1);
        } else {
            this.subjectArray.push(data._id);
        }
        this.filters.subjects = this.subjectArray;
        this.tutorService.setSubjects(JSON.stringify(this.subjectArray));
        this.page = 1;
        this.skip = 0;
        this.limit = 10;
        if (this.web)
            this.subject.next(event);
    }

    getPosition() {

        if ('geolocation' in navigator) {

            let self = this;
            let lat, long;
            navigator.geolocation.getCurrentPosition((position) => {
                lat = position.coords.latitude;
                long = position.coords.longitude;
                this.current = {lat: position.coords.latitude, lng: position.coords.longitude};
                if (self) {
                    this.thisLatitude = self.current.lat;
                    this.thisLongitude = self.current.lng;
                }
                self.showPosition(position, self);
            }, (error) => {
            });
        }
    }

    ngOnInit() {

        if (process.env.ENV == 'development') {
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
        this.subject.debounceTime(300).subscribe((name: String) => {
            if (name) {
                this.tutors = [];
                let el = $('#moveUp');
                $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
                    el.focus();
                });
                if (this.tutorService.getFilterZipCodeDetails() != undefined) {

                    let location = JSON.parse(this.tutorService.getFilterZipCodeDetails());
                    this.locationDetails = {
                        latitude: location.latitude,
                        longitude: location.longitude,
                        zipCode: location.zipCode
                    };

                }
                if (this.locationDetails != undefined) {
                    this.browseTutor(this.locationDetails, this.limit, this.skip, this.filters);
                } else if (this.tutorService.getLocationMarket() != undefined && this.tutorService.getFilterZipCodeDetails() === undefined) {
                    this.marketValues = this.tutorService.getLocationMarket();
                    // this.filters.distance = '';
                    this.filters.marketId = this.marketValues.market;

                    this.browseTutorMarket(this.limit, this.skip, this.filters);
                } else {
                    if (localStorage.getItem('zip_code') && localStorage.getItem('zip_code') != undefined && this.tutorService.getLocationMarket() === undefined) {
                        this.locationDetails = JSON.parse(localStorage.getItem('zip_code'));

                        // this.zipCodeModel = this.locationDetails.zipCode;
                        this.browseTutor(this.locationDetails, this.limit, this.skip, this.filters);
                    } else if (localStorage.getItem('zip_code') && localStorage.getItem('zip_code') != undefined && this.tutorService.getLocationMarket() != undefined && this.tutorService.getFilterZipCodeDetails() != undefined) {

                        this.locationDetails = JSON.parse(localStorage.getItem('zip_code'));

                        // this.zipCodeModel = this.locationDetails.zipCode;
                        this.browseTutor(this.locationDetails, this.limit, this.skip, this.filters);
                    }
                }
            } else if (name.length == 0) {
            }
        });
        if (this.subjectArray.length === 0) {
            this.tutorService.parentSubject = [];
        }
        for (let i = 0; i < this.showSubjects.length; i++) {
            for (let j = 0; j < this.tutorService.parentSubject.length; j++) {
                if (this.showSubjects[i]._id === this.tutorService.parentSubject[j]) {
                    this.expandSubject = true;
                } else if (this.showSubjects[i]._id != this.tutorService.parentSubject[j]) {
                    this.expandSubject = false;
                }
            }
        }
    }

    // searchZip(data) {

    //     let marketValue;
    //     this.filters.zipcode = data;
    //     let value = data;
    //     this.enteredZipcode = value;
    //     this.limit = 10;
    //     this.page = 1;
    //     this.skip = 0;
    //     if (data && data.length == 5) {
    //         this.zone.runOutsideAngular(() => {
    //             this.store.dispatch({
    //                 type: tutor.actionTypes.AUTH_GET_LAT_LONG,
    //                 payload: { zip: data, filters: this.filters }
    //             });
    //         });
    //         this.marketId = true;
    //         if (this.tutorService.getLocationMarket() != undefined) {
    //             this.marketValues = this.tutorService.getLocationMarket();
    //             // if (this.marketValues != undefined) {
    //             //     this.marketId = this.marketValues.visibility;
    //             // }
    //             this.filters.distance = '';
    //             // this.filters.marketId = this.marketValues.market;
    //             // this.browseTutorMarket(this.limit, this.skip, this.filters);
    //             marketValue = {
    //                 market: this.marketValues.market,
    //                 visibility: true,
    //             }
    //             // this.tutorService.setLocationMarket(marketValue);

    //         }
    //         if (marketValue != undefined) {
    //             this.tutorService.setLocationMarket(marketValue.visibility = true);

    //         }
    //         // return;

    //     }
    //     if (data && (data.length > 5 || data.length < 5)) {
    //         return;
    //     }
    // }
    searchZip(data) {

        let marketValue;
        let value;
        if (data.staticVal) {
            this.filters.zipcode = data.staticVal;
            value = data.staticVal;
        } else {
            this.filters.zipcode = data.target.value;
            value = data.target.value;
        }

        this.enteredZipcode = value;
        this.limit = 10;
        this.page = 1;
        this.skip = 0;
        if (this.compareZip != this.enteredZipcode) {
            if (value.length == 5) {
                this.compareZip = this.enteredZipcode;
                (document.activeElement as HTMLElement).blur();
                ga('send', {
                    hitType: 'event',
                    eventCategory: 'Browse Filters',
                    eventAction: 'Browse by Zip',
                    eventLabel: 'Browse by Zip'
                });
                this.zone.runOutsideAngular(() => {
                    this.store.dispatch({
                        type: tutor.actionTypes.AUTH_GET_LAT_LONG,
                        payload: {zip: data.target.value, filters: this.filters}
                    });
                });
                this.marketId = true;
                if (this.tutorService.getLocationMarket() != undefined) {
                    this.marketValues = this.tutorService.getLocationMarket();
                    // if (this.marketValues != undefined) {
                    //     this.marketId = this.marketValues.visibility;
                    // }
                    // this.filters.distance = '';
                    // this.filters.marketId = this.marketValues.market;
                    // this.browseTutorMarket(this.limit, this.skip, this.filters);
                    marketValue = {
                        market: this.marketValues.market,
                        visibility: true
                    };
                    // this.tutorService.setLocationMarket(marketValue);

                }
                if (marketValue != undefined) {
                    this.tutorService.setLocationMarket(marketValue.visibility = true);

                }

            }
        }
        if (value.length > 5 || value.length < 5) {
            return;
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
            this.filters.tutorName = data.target.value;
            this.tutorService.setUserName(data.target.value);
            this.showSearching = true;
            this._spinner.show();

            this.page = 1;
            this.skip = 0;
            this.limit = 10;
            this.subject.next(data);
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
            this.subject.next(<HTMLInputElement>document.getElementById('searchByName'));
        } else {
            this.searchValue = undefined;
            this.search.setValue(undefined);
        }
    }

    searchByNameMobile() {
        let data = (<HTMLInputElement>document.getElementById('searchByName')).value;
        (document.activeElement as HTMLElement).blur();
        this._spinner.show();
        ga('send', {
            hitType: 'event',
            eventCategory: 'Browse Filters',
            eventAction: 'Browse by Name',
            eventLabel: 'Browse by Name'
        });
        // if(!data)
        // {
        //     data = '';
        // }
        this.filters.tutorName = data;
        this.tutorService.setUserName(data);
        this.page = 1;
        this.skip = 0;
        this.limit = 10;
        this.subject.next(<HTMLInputElement>document.getElementById('searchByName'));
    }

    sylvanCertified() {
        this.filters.sylvanCertifiedValue = !this.sylvanCertifiedValue.value;
        this.tutorService.setSylvanCertifiedValue(!this.sylvanCertifiedValue.value);
        this.page = 1;
        this.skip = 0;
        this.limit = 10;
        if (this.web)
            this.subject.next(event);
    }

    onlineSession(e) {

        this.filters.onlineSession = !this.onlineSessionValue.value;
        this.tutorService.setOnlineSessionValue(!this.onlineSessionValue.value);
        this.page = 1;
        this.skip = 0;
        this.limit = 10;
        if (this.web)
            this.subject.next(e);
    }

    sort(event) {
        this.filters.sortType = this.sortFilter;
        this.tutorService.setSort(this.sortFilter);
        this.page = 1;
        this.skip = 0;
        this.limit = 10;
        this.subject.next(event);

    }

    stateCertified(event) {
        this.filters.stateCertifiedValue = !this.stateCertifiedValue.value;
        this.tutorService.setStateCertifiedValue(!this.stateCertifiedValue.value);
        this.page = 1;
        this.skip = 0;
        this.limit = 10;
        if (this.web)
            this.subject.next(event);
    }

    tutorGrade(event, value, i) {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Browse Filters',
            eventAction: 'Browse by Grades',
            eventLabel: 'Browse by Grades'
        });
        let j = this.gradeArray.findIndex((data) => {
            return data == value;
        });
        if (j != -1) {
            this.gradeArray.splice(j, 1);
            this.grades.splice(j, 1);
            this.tutorService.setGrade(this.gradeArray);
        } else {
            this.gradeArray.push(value);
            if (value == 'K-2') {
                this.grades.push(this.gradek2);
            }
            if (value == '3-5') {
                this.grades.push(this.grade35);
            }
            if (value == '6-8') {
                this.grades.push(this.grade68);
            }
            if (value == '9-12') {
                this.grades.push(this.grade912);
            }

            this.tutorService.setGrade(this.gradeArray);

        }
        if (this.grades.length > 0) {
            this.gArray = this.grades.reduce(
                (previousValue, currentValue) => previousValue.concat(currentValue)
            );
        } else {
            this.gArray = [];
            this.tutorService.setGrade([]);
        }
        this.page = 1;
        this.skip = 0;
        this.limit = 10;
        this.filters.grade = this.gArray;
        if (this.web)
            this.subject.next(event);
    }

    tutorRatings(event, selected) {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Browse Filters',
            eventAction: 'Browse by Ratings',
            eventLabel: 'Browse by Ratings'
        });
        if (event.source.value != undefined && event.checked) {
            this.filters.ratings = selected;
            this.tutorService.setRating(selected);
        } else {
            this.filters.ratings = '';
            this.tutorService.setRating('');
            this.selected = '';
        }
        this.page = 1;
        this.skip = 0;
        this.limit = 10;
        if (this.web)
            this.subject.next(event);
    }

    changeinDetection() {
        this.durationCheckArray = this.durationArray;
        this.durationCheck = this.duration;
        this.startTimeMinToSend = this.startTimeMinutes;
        this.endTimeMinToSend = this.endTimeMinutes;
        if (this.startTimeHours != 'HH' && this.endTimeHours != 'HH') {
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
            this.dateS = new Date();
            let check = new Date(this.dateS.getFullYear(), this.dateS.getMonth(), this.dateS.getDate(), parseInt(this.startTimeHoursToSend, 10), parseInt(this.startTimeMinToSend, 10), 0);
            let check1 = new Date(this.dateS.getFullYear(), this.dateS.getMonth(), this.dateS.getDate(),
                this.endTimeToSend, this.endTimeMinToSend, 0);
            this.timeToShowStart = moment(check).format('LT');
            this.timeToShowEnd = moment(check1).format('LT');

            let timeCome = moment(check1).diff(moment(check), 'minutes');
            if (timeCome >= 0) {
                this.durationArray = [];
                let max;
                let multiple = timeCome / 30;
                if (multiple >= 6) {
                    max = 6;
                    this.duration = 3;
                } else {
                    max = multiple;
                }
                for (let j = 1; j <= max; j++) {
                    let k;
                    let p = j * 0.5;
                    k = p;
                    this.durationArray.push(k);
                    this.duration = 1;
                }
                // if (multiple >= 6) {
                //     this.duration=undefined;
                // }
                // else
                // {
                //     this.duration = undefined;
                // }

            }

        }
        // this.duration=undefined
        // setTimeout(() => {
        if (this.durationArray.length >= this.durationCheckArray.length) {
            this.duration = this.durationCheck;
        } else {
            if (this.durationArray.indexOf(this.durationCheck) >= 0) {
                this.duration = this.durationCheck;
            } else {
                this.duration = undefined;

            }

        }

        // }, 5);

    }

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
            this.tutorService.date = this.date;
            this.dateS = this.date;
            let check = new Date(this.dateS.getFullYear(), this.dateS.getMonth(), this.dateS.getDate(), parseInt(this.startTimeHoursToSend, 10), parseInt(this.startTimeMinToSend, 10), 0).toUTCString();
            this.tutorService.startDate = check;
            this.tutorService.duration = this.duration;
            this.filters.startTime = check;
            this.tutorService.startTimeHours = this.startTimeHours;
            this.tutorService.endTimeHours = this.endTimeHours;
            this.tutorService.startTimeMinutes = this.startTimeMinutes;
            this.tutorService.endTimeMinutes = this.endTimeMinutes;
            this.tutorService.startTimeAp = this.startTimeAp;
            this.tutorService.endTimeAp = this.endTimeAp;
            this.tutorService.timeToShowEnd = this.timeToShowEnd;
            this.tutorService.timeToShowStart = this.timeToShowStart;
            let check1 = new Date(this.dateS.getFullYear(), this.dateS.getMonth(), this.dateS.getDate(),
                this.endTimeToSend, this.endTimeMinToSend, 0).toUTCString();
            this.filters.endTime = check1;
            this.tutorService.endDate = check1;
            this.filters.duration = this.duration;
            this.page = 1;
            this.skip = 0;
            this.limit = 10;
            if (moment(check1).isAfter(check)) {
                setTimeout(() => {
                    this.panelOpenState = false;

                }, 1);

                this.subject.next(event);
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

    clearFilters() {
        this.durationArray = [0.5, 1, 1.5, 2, 2.5, 3];
        this.startTimeAp = 'AM';
        this.endTimeAp = 'AM';
        this.timeToShowStart = undefined;
        this.timeToShowEnd = undefined;
        this.date = undefined;
        this.startTime = undefined;
        this.endTime = undefined;
        this.duration = undefined;
        this.endTimeHours = 'HH';
        this.startTimeHours = 'HH';
        this.startTimeMinutes = 'MM';
        this.endTimeMinutes = 'MM';
        this.disabledH = true;
        this.disabledM = true;
        this.disabledH1 = true;
        this.disabledM1 = true;
        this.tutorService.timeToShowEnd = undefined;
        this.tutorService.timeToShowStart = undefined;
        this.tutorService.startTimeHours = undefined;
        this.tutorService.endTimeHours = undefined;
        this.tutorService.startTimeMinutes = undefined;
        this.tutorService.endTimeMinutes = undefined;
        this.tutorService.startTimeAp = undefined;
        this.tutorService.endTimeAp = undefined;
        this.filters.startTime = undefined;
        this.filters.endTime = undefined;
        this.filters.duration = undefined;
        this.tutorService.startDate = undefined;
        this.tutorService.date = undefined;
        this.tutorService.endDate = undefined;
        this.errorClass = false;
        this.errorClass1 = false;
        this.filtersError = false;
        this.filtersErrorDate = false;

        this.tutorService.duration = this.duration;
        this.page = 1;
        this.skip = 0;
        this.limit = 10;
        this.subject.next(event);
    }

    clearMobileFilters() {
        if (this.closeMobileFilters == true) {
            this.closeMobileFilters = false;
        } else {
            this.closeMobileFilters = true;
            setTimeout(() => {
                this.closeMobileFilters = false;

            }, 1);
        }
        this.rangeValues = [10, 200];
        this.upperDistance.setValue('100+ Miles');
        this.distanceValues = 100;
        this.filters.minHourlyRate = 10;
        this.filters.maxHourlyRate = 200;
        this.lowerRange.setValue(('$' + '10'));
        this.upperRange.setValue(('$' + '200+'));
        this.filters.distance = 100;
        this.filters.sylvanCertifiedValue = false;
        this.filters.onlineSession = false;
        this.sylvanCertifiedValue.setValue(false);
        this.onlineSessionValue.setValue(false);
        this.tutorService.setSylvanCertifiedValue(false);
        this.tutorService.setOnlineSessionValue(false);
        this.filters.stateCertifiedValue = false;
        this.stateCertifiedValue.setValue(false);
        this.tutorService.setStateCertifiedValue(false);
        this.gArray = [];
        this.tutorService.setGrade([]);
        this.filters.grade = this.gArray;
        this.gradeArray = [];
        this.grade1 = undefined;
        this.grade2 = undefined;
        this.grade3 = undefined;
        this.grade4 = undefined;
        this.kgrade = false;
        this.threeGrade = false;
        this.sixGrade = false;
        this.nineGrade = false;
        this.filters.ratings = '';
        this.tutorService.setRating('');
        this.selected = undefined;
        this.filters.subjects = undefined;
        this.subjectArray = [];
        this.tutorService.parentSubject = [];
        this.tutorService.setSubjects(undefined);
        // this.subject.next(event);

    }

    tutorQualifications() {
    }

    tutorDetails(id, id2, info) {
        if (this.hasPartnerCode) {
            localStorage.setItem('hourlyRate', info.partnershipCode[0].hourlyRate);
        } else {
            localStorage.removeItem('hourlyRate');
        }
        localStorage.setItem('tutor_Id', id);
        localStorage.setItem('tutorUId1', id2);
        localStorage.setItem('page', JSON.stringify(this.page));
        this.tutorService.sendId(id);
        ga('send', {
            hitType: 'event',
            eventCategory: 'Tutor Short Card',
            eventAction: 'View Profile',
            eventLabel: 'View Profile'
        });

        if (!this.checkLogin.login()) {
            localStorage.setItem('tutor_detail', 'true');
        }

        this.router.navigate(['/home/tutor-details']);
    }

    showPosition(position, self) {
        if (position && position.coords) {
            let latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            let geocoder = new google.maps.Geocoder();

            const that = this;
            geocoder.geocode({'location': latlng}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0]) {

                        self.searchLocation = results[0].formatted_address;
                        let addressComponents = results[0].address_components;
                        let latitude = results[0].geometry.location.lat();
                        let longitude = results[0].geometry.location.lng();
                        let formattedAddress = results[0].formatted_address;
                        let route = '';
                        let locality = '';
                        let city = '';
                        let state = '';
                        let country = '';
                        let postal = '';
                        for (let i = 0; i < addressComponents.length; i++) {
                            let types = addressComponents[i].types;
                            for (let j = 0; j < types.length; j++) {
                                if (types[j] == 'administrative_area_level_1') {
                                    state = addressComponents[i].long_name;
                                } else if (types[j] == 'administrative_area_level_2') {
                                    city = addressComponents[i].long_name;
                                } else if (types[j] == 'locality') {
                                    locality = addressComponents[i].long_name;
                                } else if (types[j] == 'country') {
                                    country = addressComponents[i].long_name;
                                } else if (types[j] == 'postal_code') {
                                    postal = addressComponents[i].long_name;
                                } else if (types[j] == 'route') {
                                    route = addressComponents[i].long_name;
                                }
                            }
                        }
                        self.latitude = latitude;
                        self.longitude = longitude;
                        self.city = city;
                        self.state = state;
                        self.country = country;
                        self.zipCode = postal;
                        if (postal) {
                            self.addressType = 'ZIPCODE';
                            self.zoom = 13;
                        } else if (city) {
                            self.addressType = 'CITY';
                            self.zoom = 12;
                        } else if (state) {
                            self.addressType = 'STATE';
                            self.zoom = 11;
                        } else if (country) {
                            self.addressType = 'COUNTRY';
                            self.zoom = 6;
                        }

                        let address = {
                            city: city,
                            cityShort: city,
                            state: state,
                            stateShort: state,
                            country: country,
                            zipCode: postal,
                            latitude: latitude,
                            longitude: longitude
                        };

                        that.locationDetails = {
                            latitude: latitude.toString(),
                            longitude: longitude.toString(),
                            zipCode: postal
                        };

                        self.currentLocation = that.locationDetails;
                        self.getCurrentArea(self);
                    }
                }
            });
        }
    }

    getCurrentArea(self) {

        if (self) {
            this.locationDetails = {
                latitude: self.currentLocation.latitude,
                longitude: self.currentLocation.longitude,
                zipCode: self.currentLocation.zipCode
            };
        }
        if (this.locationDetails && this.locationDetails != undefined) {
            this.zipCodeModel = this.locationDetails.zipCode;
            this.browseTutor(this.locationDetails, this.limit, this.skip, this.filters);
        } else {
            if (localStorage.getItem('token') && localStorage.getItem('token') != undefined && !localStorage.getItem('zip_code')) {
                this.showPopup();

            }

        }
    }

    showPopup() {
        let dialogRef = this.dialog.open(FindTutor, {disableClose: true});
    }

    onScrollDown() {
        if (this.count >= this.limit) {
            this.limit = this.limit + 2;
            this.zone.runOutsideAngular(() => {
                this.store.dispatch({
                    type: tutor.actionTypes.BROWSE_TUTORS,
                    payload: {
                        area: JSON.stringify(this.locationDetails),
                        limit: this.limit,
                        skip: this.skip,
                        filters: this.filters,
                        searchType: 'BROWSE_TUTORS'
                    }
                });
            });
        }

    }

    pageChanged(page) {
        // window.scroll(0, 0)
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
        this.zone.run(() => {
            let self = this;
            this.page = page;
            this.skip = (this.page - 1) * this.limit;
            if (this.tutorService.getFilterZipCodeDetails() != undefined) {
                let location = JSON.parse(this.tutorService.getFilterZipCodeDetails());
                this.locationDetails = {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    zipCode: location.zipCode
                };
            }
            if (this.locationDetails != undefined && this.tutorService.getLocationMarket() === undefined) {
                this.browseTutor(this.locationDetails, this.limit, this.skip, this.filters);
            } else if (this.locationDetails != undefined && this.tutorService.getLocationMarket() != undefined) {
                this.browseTutor(this.locationDetails, this.limit, this.skip, this.filters);
            } else if (this.tutorService.getLocationMarket() != undefined) {
                this.marketValues = this.tutorService.getLocationMarket();
                // this.filters.distance = '';
                this.filters.marketId = this.marketValues.market;
                this.browseTutorMarket(this.limit, this.skip, this.filters);
            } else {
                if (localStorage.getItem('zip_code') != undefined) {
                    let locations = JSON.parse(localStorage.getItem('zip_code'));
                    this.locationDetails = {
                        latitude: locations.latitude,
                        longitude: locations.longitude,
                        zipCode: locations.zipCode
                    };
                }
            }

        });
    }

    browseTutor(data, limit, skip, filters) {
        this.showSearching = true;
        this._spinner.show();

        // if (this.staticZip) {
        //     if (data.zipCode) {
        //         data.zipCode = '58530';
        //     }
        // }
        //

        this.zone.runOutsideAngular(() => {
            this.store.dispatch({
                type: tutor.actionTypes.BROWSE_TUTORS,
                payload: {
                    area: JSON.stringify(data),
                    limit: this.limit,
                    skip: this.skip,
                    filters: this.filters,
                    searchType: 'BROWSE_TUTORS'
                }
            });
        });
    }

    browseTutorMarket(limit, skip, filters) {

        this.zone.runOutsideAngular(() => {
            this.store.dispatch({
                type: tutor.actionTypes.BROWSE_TUTORS_MARKET,
                payload: {limit: this.limit, skip: this.skip, filters: this.filters, searchType: 'BROWSE_TUTORS'}
            });
        });
    }

    learnMore() {

        let url = this.wordPressLink + 'how-it-works/the-sylvan-method/';
        window.open(url, '_blank');
    }

    checkstartTimeAp() {
        this.changeinDetection();
        if (this.startTimeAp == 'PM') {
            this.endTimeAp = 'PM';
            if (this.timeToShowEnd)
                this.timeToShowEnd = this.endTimeHours.replace(/^0+/, '') + ':' + this.endTimeMinutes + ' ' + this.endTimeAp;

        }
    }

    ngAfterViewInit() {
        // if (screen.width != undefined && screen.width <= 768) {
        //     if (this.count > 0) {
        //         if (document.getElementById('tutors') != undefined) {
        //             setTimeout(() => {
        //                 let element = document.getElementById('tutors') as HTMLElement;
        //                 if (element != undefined) {
        //                     element.scrollIntoView();
        //                 }

        //             }, 3)
        //         }
        //     }
        // }
        // if (this.count > 0) {
        //     if (document.getElementById('tutors') != undefined) {
        //         setTimeout(() => {
        //             let element = document.getElementById('tutors') as HTMLElement;
        //             element.scrollIntoView();
        //         }, 3)
        //     }
        // }

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
        this.changeinDetection();

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
        this.changeinDetection();

    }

    bookSession(id, id2, info) {

        if (this.checkSuppressCases()) {
            return;
        }

        if (this.hasPartnerCode) {
            localStorage.setItem('hourlyRate', info.partnershipCode[0].hourlyRate);
        } else {
            localStorage.removeItem('hourlyRate');
        }
        if (info && info.tutor && info.tutor.cancellationPolicy && info.tutor.cancellationPolicy != undefined) {
            this.cancellationPolicy = info.tutor.cancellationPolicy;
            if (this.cancellationPolicy && this.cancellationPolicy != undefined) {
                localStorage.setItem('cancelPolicy', JSON.stringify(this.cancellationPolicy));
            }
        }
        if (info && info.tutor && info.tutor.isTutorOfferOnlineClasses) {
            localStorage.setItem('isTutorOfferOnlineClasses', 'true');
        } else {
            localStorage.removeItem('isTutorOfferOnlineClasses');
        }
        localStorage.setItem('tutor_Id', id);
        localStorage.setItem('tutorUId1', id2);

        ga('send', {
            hitType: 'event',
            eventCategory: 'Tutor Long Profile',
            eventAction: 'Book a Session',
            eventLabel: 'Book a Session'
        });
        if (this.checkLogin.login()) {
            if (localStorage.getItem('slotSelected') != undefined) {
                localStorage.removeItem('slotSelected');
            }
            if (localStorage.getItem('finalData')) {
                localStorage.removeItem('finalData');
            }
            if (localStorage.getItem('totalSessions')) {
                localStorage.removeItem('totalSessions');
            }
            if (localStorage.getItem('finalSlot')) {
                localStorage.removeItem('finalSlot');
            }
            if (localStorage.getItem('index')) {
                localStorage.removeItem('index');
            }
            if (localStorage.getItem('goBack')) {
                localStorage.removeItem('goBack');
            }
            if (localStorage.getItem('steponeData')) {
                localStorage.removeItem('steponeData');
            }
            if (localStorage.getItem('promoHash')) {
                localStorage.removeItem('promoHash');
            }
            if (this.canBookSession) {
                if (localStorage.getItem('PROMOCODE') != undefined) {
                    localStorage.removeItem('PROMOCODE');
                }
                if (localStorage.getItem('promoVal') != undefined) {
                    localStorage.removeItem('promoVal');
                }
                this.sessionService.sessionLengthArray = [];
                this.sessionService.updateStepperIndex(0);
                this.sessionService.setIndexStepper = 0;
                this.sessionService.changeStep.next(0);
                this.sessionService.stepData = undefined;
                this.sessionService.flexibility = '';
                this.sessionService.addedSubjects = '';
                this.sessionService.selectedChild = '';
                this.sessionService.selectedAddress = null;
                this.allSessionService.setBookAgain('');
                // this.sessionService.setSessionData('');
                this.allSessionService.setBookAgain_address = '';
                this.sessionService.childInformation = '';
                this.sessionService.setTrackPageRefresh(true);
                this.sessionService.checkedaddress = '';
                this.sessionService.tutorSelected = true;
                localStorage.removeItem('goFromSession');
                this.sessionService.selectedAddress_id = '';
                this.sessionService.onlineBooking = false;
                this.router.navigate(['/pages/book-session']);

            } else {
                this.sessionService.tutorSelected = true;
                let ref = this.dialog.open(CompleteProfileDialog);
            }

        } else {
            localStorage.setItem('tutor_detail', 'true');
            let dialogRef = this.dialog.open(LoginDialog);
        }

    }

    applyMobileFilters() {
        window.scroll(0, 0);

        this.closeMobileFilters = true;
        let filterCount = this.filterCount;
        if (this.tutorService.stateCertifiedValue || this.tutorService.sylvanCertifiedValue || this.tutorService.onlineSessionValue) {
            filterCount = filterCount + 1;
        }
        if (this.tutorService.parentSubject && this.tutorService.parentSubject.length) {
            filterCount = filterCount + 1;
        }
        if (this.tutorService.setgrades && this.tutorService.setgrades.length) {
            filterCount = filterCount + 1;
        }
        if (this.tutorService.rating && this.tutorService.rating) {
            filterCount = filterCount + 1;
        }

        this.subject.next(event);
        this.filterCountShow = filterCount;
        this.tutorService.filterCount = filterCount;
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

        document.getElementById('matSideNav').style.zIndex = '100';
        let backupData: any = {};
        backupData.subSubjects = this.tutorService.getSelectedSubjects();
        backupData.rating = this.tutorService.rating;
        backupData.hourlyRate = this.tutorService.hourlyRate;
        backupData.grades = this.tutorService.getGrades();
        backupData.distance = this.tutorService.getDistance();
        backupData.stateCertified = this.tutorService.getStateCertifiedValue();
        backupData.sylvanCertified = this.tutorService.getSylvanCertifiedValue();
        backupData.onlineSession = this.tutorService.getOnlineSessionValue();
        backupData.parentSubject = this.tutorService.parentSubject;
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
        if (defaultData.hourlyRate) {
            this.rangeValues = [defaultData.hourlyRate.min, defaultData.hourlyRate.max];
            this.lowerRange.setValue(('$' + defaultData.hourlyRate.min));
            this.upperRange.setValue(('$' + defaultData.hourlyRate.max + '+'));
            this.filters.maxHourlyRate = defaultData.hourlyRate.max;
            this.filters.minHourlyRate = defaultData.hourlyRate.min;
            this.tutorService.setHourlyRate(defaultData.hourlyRate.min, defaultData.hourlyRate.max);

        } else {
            this.rangeValues = [10, 200];
            this.filters.minHourlyRate = 10;
            this.filters.maxHourlyRate = 200;
            this.lowerRange.setValue(('$' + '10'));
            this.upperRange.setValue(('$' + '200+'));
            this.tutorService.setHourlyRate(10, 200);
        }
        if (defaultData.distance) {
            this.distanceValues = defaultData.distance;
            this.filters.distance = defaultData.distance;
            // this.upperDistance = defaultData.distance;
            this.upperDistance.setValue(defaultData.distance + ' ' + 'Miles');
        } else {
            this.upperDistance.setValue('100+ Miles');
            this.filters.distance = 100;
            this.distanceValues = 100;
            this.tutorService.setDistance(100);

        }
        if (defaultData.rating) {
            this.selected = defaultData.rating;
            this.filters.ratings = defaultData.rating;
            this.tutorService.rating = defaultData.rating;
        } else {

            this.filters.ratings = '';
            this.tutorService.rating = '';
            this.selected = undefined;
        }
        if (defaultData.sylvanCertified) {
            this.filters.sylvanCertifiedValue = true;
            this.sylvanCertifiedValue.setValue(true);
            this.tutorService.setSylvanCertifiedValue(true);

        } else {
            this.filters.sylvanCertifiedValue = false;
            this.sylvanCertifiedValue.setValue(false);
            this.tutorService.setSylvanCertifiedValue(false);
        }
        if (defaultData.onlineSession) {
            this.filters.onlineSession = true;
            this.onlineSessionValue.setValue(true);
            this.tutorService.setOnlineSessionValue(true);

        } else {
            this.filters.onlineSession = false;
            this.onlineSessionValue.setValue(false);
            this.tutorService.setOnlineSessionValue(false);
        }
        if (defaultData.stateCertified) {
            this.filters.stateCertifiedValue = true;
            this.stateCertifiedValue.setValue(true);
            this.tutorService.setStateCertifiedValue(true);
        } else {
            this.filters.stateCertifiedValue = false;
            this.stateCertifiedValue.setValue(false);
            this.tutorService.setStateCertifiedValue(false);
        }
        if (defaultData.subSubjects) {
            this.subjectArray = [];
            this.subjectArray = JSON.parse(defaultData.subSubjects);
            this.filters.subjects = this.subjectArray;
            this.tutorService.setSubjects(JSON.stringify(this.subjectArray));
            this.tutorService.parentSubject = defaultData.parentSubject;
        } else {
            this.filters.subjects = undefined;
            this.subjectArray = [];
            this.tutorService.parentSubject = [];
            this.tutorService.setSubjects(undefined);
        }

        if (defaultData.grades && defaultData.grades.length) {
            this.gradeArray = [];
            this.getGrades = [];
            this.grades = [];
            this.gArray = [];
            this.kgrade = false;
            this.threeGrade = false;
            this.sixGrade = false;
            this.nineGrade = false;

            this.getGrades = defaultData.grades;
            this.getGrades.forEach((element) => {

                switch (element) {
                    case 'K-2':
                        this.kgrade = true;
                        this.grades.push(this.gradek2);
                        break;
                    case '3-5':
                        this.threeGrade = true;
                        this.grades.push(this.grade35);
                        break;

                    case '6-8':
                        this.sixGrade = true;
                        this.grades.push(this.grade68);

                        break;

                    case '9-12':
                        this.nineGrade = true;
                        this.grades.push(this.grade912);

                        break;

                    default:
                        this.kgrade = false;
                        this.threeGrade = false;
                        this.sixGrade = false;
                        this.nineGrade = false;

                        break;

                }
                this.gradeArray.push(element);

            });
            if (this.grades.length > 0) {
                this.gArray = this.grades.reduce(
                    (previousValue, currentValue) => previousValue.concat(currentValue)
                );
            } else {
                this.gArray = [];
            }
            this.filters.grade = this.gArray;
            this.tutorService.setGrade(defaultData.grades);
        }
        // this.rangeValues = [10, 200];

    }

    enableBody() {
        document.body.style.position = 'relative';
        document.body.style.height = '100%';
        document.getElementById('matSideNav').style.zIndex = '40';
    }

    ngOnDestroy() {
        localStorage.removeItem('finalSlot');
        if (this.tutorStore && this.tutorStore != undefined) {
            this.tutorStore.unsubscribe();
        }
        if (this.profileStore && this.profileStore != undefined) {
            this.profileStore.unsubscribe();
        }
        if (localStorage.getItem('filter_zip_code') && localStorage.getItem('filter_zip_code') != undefined) {
            localStorage.removeItem('filter_zip_code');
        }
        // if (document.getElementById('bread') != undefined) {
        //     let elements = document.getElementById('bread');
        //     elements.style.display = 'none';
        //     // elements.classList.remove("breadcrumbResult");

        // }
        // if (document.getElementById('breadCrumb')) {
        //     let elements = document.getElementById('breadCrumb');
        //     elements.style.display = 'block';
        // }
    }
}
