import { Component, AfterContentChecked, ViewChild, AfterViewInit, NgZone, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as session from '../../state/book-session.actions';
import * as profile from './../../../profile/state/profile.actions';
import * as tutor from './../../../../publicPages/tutor/state/tutor.actions';
import { TutorService } from '../../../../services/tutor-service/tutor.service';
import { BookSessionService } from '../../../../services/session-service/session.service';
import { Subscription } from 'rxjs/Rx';
import { MatStepper, MatDialog } from '@angular/material';
import { AllSessionService } from '../../../../services/all-sessions-service/all-sessions.service';
import { BaThemeSpinner } from '../../../../theme/services';
import * as moment from 'moment';
import * as auth from '../../../../auth/state/auth.actions';
import 'style-loader!./session.scss';
import { ParentService } from '../../../../services/parent-service/parent.service';
import { CommonErrorDialog } from '../../../../auth/model/common-error-dialog/common-error-dialog';
import { CheckTutorDialog } from '../../../../auth/model/check-tutor-dialog/check-tutor-dialog';
import * as selectPayments from '../select-payment/state';
import { CommonService } from '../../../../services/common.service';

@Component({
    selector: 'session',
    templateUrl: `./session.component.html`
})
export class Session implements AfterContentChecked, AfterViewInit {
    @ViewChild('stepper') stepper: MatStepper;
    @ViewChild('panel') panel: ElementRef;
    public showSchedular: boolean = false;
    public form: FormGroup;
    public form2: FormGroup;
    public changeStepSubscription: Subscription;
    public sessionLengthSubscription: Subscription;
    public child: AbstractControl;
    public address: AbstractControl;
    bookingData: any;
    emptyBookingData = false;
    finalData: any;
    public subjectControl: AbstractControl;
    public childInfo: AbstractControl;
    public duration: AbstractControl;
    public sessionLength: AbstractControl;
    public checkFlexibility: AbstractControl;
    public profileStore: Subscription;
    public tutorStore: Subscription;
    public schedularStore: Subscription;
    public tutor_image = '/assets/img/user.png';
    public certi_bgCheck = '/assets/img/background-checked.svg';
    public certi_degCheck = '/assets/img/degree-icon-1.svg';
    public certi_sylCheck = '/assets/img/certified-in-sylvan-method.svg';
    public certi_stateCheck = '/assets/img/state-certified.svg';
    public onlineSessions = '/assets/img/online.svg';
    public sessionStore: Subscription;
    public edit1: boolean = true;
    public edit2: boolean = false;
    public complete1: boolean = false;
    public complete2: boolean = false;
    public tutor_amount;
    public referDiscount;
    public setChildInformation;
    public checkAddressId;
    public bookAgainData;
    public clickedAddress: boolean = false;
    public hideArrowAddress: boolean = false;
    public hideArrow: boolean = false;
    public bookAgainData_address;
    public tutor;
    public addressId: any;
    public amount: any;
    public params: number = 0;
    public stepperIndex: boolean = false;
    public stepperIndexStep2: boolean = false;
    public parentData;
    public checkedaddress: any;
    public sessionHeading: string;
    public totalSessions;
    public tableArray = [];
    public children = [];
    public bookingDetails: {
        steponeData: any,
        step2Data: any,
        startDateFormated: any,
        startTimeFormated: any,
        endTimeFormated: any
        amount: any,
        referalAmount: any,
        flexibility: any
    };
    public addresses = [];
    public subbsubjects;
    public tutor_id;
    public subjects = [];
    public subjectsAdded = [];
    public removable: boolean = true;
    public isLinear: boolean;
    public sessionStepone: any;
    public mobHeight: any;
    public mobWidth: any;
    address1: any;
    addresses1: any;
    addressCheck: any;
    sessionsWithTutor: boolean;
    web: boolean;
    storeData1: Subscription;
    parentEmail: any;
    parentContact: any;
    timeZone: any;
    onlineBooking: boolean;
    onlineBookingTab: boolean;
    isByPassMarket: string;
    hourlyRate: any;
    hasPartnerCode: boolean;
    showNationWide: boolean;
    userData: any;
    isRateChargeSuppress = false;
    sessionDropDownData: any = [];

    constructor(private store: Store<any>, private dialog: MatDialog, public zone: NgZone,
                private spinner: BaThemeSpinner, private parentService: ParentService,
                private AllSessionService: AllSessionService, private route: ActivatedRoute,
                private router: Router, private fb: FormBuilder, private tutorService: TutorService,
                private sessionService: BookSessionService, public commonService: CommonService) {
        this.store.dispatch({
            type: profile.actionTypes.FAQ
        });
        localStorage.removeItem('page');
        if (localStorage.getItem('isNationWide') == 'true') {
            this.showNationWide = true;
            this.hasPartnerCode = false;
            if (localStorage.getItem('hasPartnerCode') == 'true') {
                this.hasPartnerCode = true;
            }
        } else if (localStorage.getItem('hasPartnerCode') == 'true') {
            this.hasPartnerCode = true;
        } else {
            this.showNationWide = false;
            this.hasPartnerCode = false;
        }

        this.isByPassMarket = localStorage.getItem('isByPassMarket');
        this.storeData1 = this.store.select('profile').subscribe((res: any) => {
            if (res) {
                if (res.faq) {
                    if (res.faq.parentContact) {
                        this.parentEmail = res.faq.parentContact.email;
                        this.parentContact = res.faq.parentContact.phoneNumber;
                    }
                    if (res.userData && res.userData.data) {
                        if (res.userData.data.metaData && res.userData.data.metaData.timezoneOffsetZone) {
                            this.userData = res.userData;
                            this.checkIsSuppress();
                            this.setSessionLengthDropDown();
                            if (this.userData.data.marketData && this.userData.data.marketData.marketName == 'Nationwide') {
                                this.selectAddress(this.addresses, this.addresses[0], true);
                            }
                            // this.timeZone = res.userData.data.metaData.timezoneOffsetZone;
                        }
                    }

                }

            }
        });
        if (screen.width >= 1023) {
            this.web = true;
        } else {
            this.web = false;

        }
        // this.checkRoute = this.router.events.pairwise().subscribe((event) => {
        // });
        // if (localStorage.getItem('tutor_Id') && localStorage.getItem('totalSessions')) {
        //     this.store.dispatch({
        //         type: profile.actionTypes.GET_REFERRAL_AMOUNT,
        //     });
        // }
        let keep = this.sessionService.getTrackPageRefresh();
        if (keep == undefined) {
            if (localStorage.getItem('goBack')) {
                localStorage.removeItem('goBack');
            }
        }

        this.mobHeight = (window.screen.height) + 'px';
        this.mobWidth = (window.screen.width) + 'px';
        window.scroll(0, 0);
        this.isLinear = true;
        this.sessionHeading = 'Book a Session';
        this.subjects = [];
        this.subjectsAdded = [];
        if (localStorage.getItem('tutor_Id') && localStorage.getItem('totalSessions')) {
            this.store.dispatch({
                type: profile.actionTypes.GET_REFERRAL_AMOUNT
            });
        }
        if (!localStorage.getItem('tutor_Id')) {
            this.onlineBookingTab = true;
        }
        if (localStorage.getItem('tutor_Id')) {
            if (localStorage.getItem('isTutorOfferOnlineClasses')) {
                this.onlineBookingTab = true;
            } else {
                if (localStorage.getItem('onlyNationWide')) {
                    this.onlineBookingTab = true;
                } else {
                    this.onlineBookingTab = false;
                }
            }
        }

        this.form = fb.group({
            'child': ['', Validators.compose([Validators.required])],
            'address': ['', Validators.compose([Validators.required])],
            'subjectControl': ['', Validators.compose([Validators.required])],
            'childInfo': [''],
            // 'childInfo': [Validators.compose([Validators.maxLength(400)])],
            'sessionLength': ['1', Validators.compose([Validators.required])],
            'duration': ['', Validators.compose([Validators.required])],
            'checkFlexibility': ['']

        });
        if (this.sessionService.addedSubjects && this.sessionService.addedSubjects != undefined) {
            this.subjectsAdded = this.sessionService.addedSubjects;
        } else {
            if (this.AllSessionService.getBookingAgainData() && this.AllSessionService.getBookingAgainData() != undefined) {
                let subjects = JSON.parse(this.AllSessionService.getBookingAgainData());
                this.subbsubjects = subjects.subjects;
                this.subbsubjects.forEach((element) => {
                    if (element.subcategories && element.subcategories.length > 0) {
                        for (let i = 0; i < element.subcategories.length; i++) {
                            this.subjectsAdded.push({
                                subCategoryName: element.subcategories[i].name,
                                subCategoryId: element.subcategories[i]._id,
                                categoryId: element._id
                            });
                        }
                    }
                });
            } else {
                this.subjectsAdded = [];
            }
        }
        if (localStorage.getItem('tutor_Id') && localStorage.getItem('tutor_Id') != undefined) {
            this.tutor_id = localStorage.getItem('tutor_Id');
            this.store.dispatch({
                type: tutor.actionTypes.GET_ADDRESS_STUDENTS,
                payload: this.tutor_id
            });
        }
        if (localStorage.getItem('tutor_Id') && localStorage.getItem('tutor_Id') != undefined) {
            this.tutor_id = localStorage.getItem('tutor_Id');
            if (this.tutor_id && this.tutor_id != undefined) {
                this.store.dispatch({
                    type: tutor.actionTypes.GET_TUTOR_DETAILS,
                    payload: this.tutor_id
                });
            }
        }

        this.tutorStore = this.store.select('tutor').subscribe((res: any) => {
            this.sessionsWithTutor = false;
            if (res) {
                if (res && res.tutorDetails && res.tutorDetails != undefined) {
                    this.tutor = res.tutorDetails.data;
                }
                if (res.parentDetails && res.parentDetails != undefined && res.parentDetails.data != undefined) {
                    this.parentData = res.parentDetails.data;
                    if (this.parentData && this.parentData.sessionsWithTutor) {
                        this.sessionsWithTutor = true;
                    }
                    this.children = [];
                    this.parentData.students.map((value, key) => {
                        this.children.push({data: value, selected: false});
                    });
                    if (this.children != undefined && this.children.length === 1) {

                        if (this.child != undefined) {
                            if (this.children[0].dob) {
                                this.child.setValue(this.children[0].data);
                            }
                        }
                        if (this.children[0].dob) {
                            this.children[0].selected = true;
                            this.sessionService.selectedChild = this.children[0].data;
                        } else {
                            // this.child.setValue('');
                        }

                    } else if (localStorage.getItem('book_again') && localStorage.getItem('book_again') != undefined) {
                        this.bookAgainData = JSON.parse(localStorage.getItem('book_again'));
                        if (this.bookAgainData.studentId != undefined && this.children != undefined && this.children.length > 0) {
                            this.children.forEach((element) => {
                                if (element.data != undefined && element.data._id === this.bookAgainData.studentId._id) {
                                    element.selected = true;
                                }
                            });

                        }
                    }
                    this.addresses = [];
                    if (this.parentData.addresses && this.parentData.addresses != undefined) {
                        this.parentData.addresses.map((value, key) => {
                            this.addresses.push({data: value, selected: false});
                        });
                    }
                    if (this.sessionService.onlineBooking) {
                        this.onlineBooking = true;
                    }
                    if (this.AllSessionService.getBookAgainAddress() && this.AllSessionService.getBookAgainAddress() != undefined && this.AllSessionService.getBookAgainAddress() != '' && localStorage.getItem('book_again_address') && localStorage.getItem('book_again_address') != undefined) {
                        let id = JSON.parse(this.AllSessionService.getBookAgainAddress());
                        if (id != undefined) {
                            this.addressId = id._id;
                            for (let element of this.addresses) {
                                // this.addresses.forEach((element) => {
                                if (element.data != undefined && element.data._id === this.addressId) {
                                    if (this.checkEqualityOfAddress(element.data, id)) {
                                        element.selected = true;
                                        break;
                                    }

                                } else {
                                    if (this.checkEqualityOfAddress(element.data, id)) {
                                        element.selected = true;
                                        break;
                                    }
                                }
                            }
                            // });
                            // if (this.sessionService.selectedAddress && this.sessionService.selectedAddress != undefined) {
                            //     this.address.setValue(JSON.parse(this.sessionService.selectedAddress));
                            // }
                        }
                        // if (localStorage.getItem('book_again_address') && localStorage.getItem('book_again_address') != undefined) {
                        //     this.address.setValue(JSON.parse(localStorage.getItem('book_again_address')));
                        // }

                    }
                    //  else if (localStorage.getItem('book_again_address') && localStorage.getItem('book_again_address') != undefined) {
                    //     this.bookAgainData = JSON.parse(localStorage.getItem('book_again_address'));
                    //     if (this.bookAgainData.studentId != undefined && this.children != undefined && this.children.length > 0) {
                    //         this.children.forEach((element) => {
                    //             if (element.data != undefined && element.data._id === this.bookAgainData.studentId._id) {
                    //                 element.selected = true;
                    //             }
                    //         });

                    //     }
                    // }
                }
            }
            if (this.tutor && this.tutor != undefined && this.tutor.tutor && this.tutor.tutor != undefined) {
                if (this.hasPartnerCode && this.tutor.partnershipCode && this.tutor.partnershipCode[0].hourlyRate) {
                    this.tutor_amount = this.tutor.partnershipCode[0].hourlyRate;
                    this.hourlyRate = this.tutor.partnershipCode[0].hourlyRate;
                    if (localStorage.getItem('hourlyRate')) {
                        this.tutor_amount = JSON.parse(localStorage.getItem('hourlyRate'));
                        this.hourlyRate = JSON.parse(localStorage.getItem('hourlyRate'));
                    }
                } else {
                    this.tutor_amount = this.tutor.tutor.hourlyRate;
                    this.hourlyRate = this.tutor.tutor.hourlyRate;
                }
            }

            if (res.continueBooking && res.continueBooking.continueBooking && this.addresses1) {
                // setTimeout(() => {
                for (let element of this.addresses1) {
                    // this.addresses.forEach((element) => {
                    element.selected = false;
                }
                // }, 1);

                this.dialog.closeAll();
                this.checkedaddress = this.address1;
                this.clickedAddress = true;
                this.addresses1.map((value) => {
                    value.selected = false;
                });

                if (this.address1) {
                    this.address1.selected = !this.address1.selected;

                    let setAddess = {
                        latitude: (this.address1.data && this.address1.data.location) ? this.address1.data.location.coordinates[1] : '',
                        longitude: (this.address1.data && this.address1.data.location) ? this.address1.data.location.coordinates[0] : '',
                        zipCode: this.address1.data ? this.address1.data.zipCode : '',
                        addressLine1: this.address1.data ? this.address1.data.addressLine1 : '',
                        addressLine2: this.address1.data ? this.address1.data.addressLine2 : '',
                        city: this.address1.data ? this.address1.data.city : '',
                        state: this.address1.data ? this.address1.data.state : '',
                        country: this.address1.data ? this.address1.data.country : '',
                        label: this.address1.data ? this.address1.data.label : '',
                        _id: this.address1.data ? this.address1.data._id : ''
                        // parentTimezoneOffsetZone: this.address1.data && this.address1.data.timezoneOffsetZone ? this.address1.data.timezoneOffsetZone : 'America/New_york'
                    };
                    this.sessionService.selectedAddress = JSON.stringify(setAddess);
                    this.sessionService.selectedAddress_id = this.address1.data ? this.address1.data._id : '';
                    this.address.setValue(setAddess);
                }
            }
            if (res.continueBooking && res.continueBooking.closeAddress) {
                this.addressCheck = '';
            }

        });

        this.changeStepSubscription = this.sessionService.changeStep.debounceTime(10).subscribe((index) => {
            if (this.stepper != undefined) {
                this.showSchedular = true;
                let stepperIndex = this.sessionService.getIndex();

                if (stepperIndex != undefined) {
                    this.stepper.selectedIndex = stepperIndex;
                    if (this.stepper.selectedIndex == 0) {
                        this.stepper.selectedIndex = 0;
                        this.sessionHeading = 'Book a Session';
                    }

                    if (this.stepper.selectedIndex === 1) {
                        this.stepper.selectedIndex = 1;
                        // window.scroll(0, 0);
                        let el = $('#moveUp');
                        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
                            el.focus();
                        });
                        let lines = document.getElementsByClassName('mat-stepper-horizontal-line');
                        setTimeout(() => {
                            lines[0].className = 'blue-line mat-stepper-horizontal-line';
                        }, 500);
                        this.complete1 = true;
                        this.sessionHeading = 'Choose your Date and Time';
                        this.edit1 = false;
                    }
                    if (this.stepper.selectedIndex === 2) {
                        // window.scroll(0, 0);
                        let el = $('#moveUp');
                        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
                            el.focus();
                        });
                        let lines = document.getElementsByClassName('mat-stepper-horizontal-line');
                        setTimeout(() => {
                            lines[1].className = 'blue-line mat-stepper-horizontal-line';
                        }, 500);
                        this.edit1 = false;
                        this.edit2 = false;
                        this.sessionHeading = 'Review Session Details';
                        this.complete1 = true;
                        this.complete2 = true;
                    }
                }
            }

            if (this.sessionService.getStepperFullData() != undefined) {

                let data = this.sessionService.getStepperFullData();
                let sessionData = this.sessionService.getSessionData();
                if (data != undefined && data.stepOne != undefined && data.stepTwo != undefined) {
                    this.bookingDetails = {
                        steponeData: data.stepOne,
                        step2Data: data.stepTwo,
                        startDateFormated: data.stepTwo.startDate ? moment(data.stepTwo.startDate).format('MMM. D, YYYY') : '',
                        startTimeFormated: data.stepTwo.startDate ? moment(data.stepTwo.startDate).format('h:mmA') : '',
                        endTimeFormated: data.stepTwo.endDate ? moment(data.stepTwo.endDate).format('h:mmA') : '',
                        amount: ((this.tutor_amount * (data.stepOne ? data.stepOne.duration : 0)) - (this.referDiscount ? this.referDiscount : 0)),
                        referalAmount: this.referDiscount,
                        flexibility: false
                    };
                    if (this.bookingDetails != undefined) {
                        localStorage.setItem('bookingDetails', JSON.stringify(this.bookingDetails));
                        for (let i = 0; i < sessionData.length; i++) {
                            sessionData[i]['total_amount'] = this.bookingDetails.amount;
                        }

                        this.sessionService.setSessionData(sessionData);
                    }
                }

            }

        });

        // this.form2 = fb.group({
        //     'checkFlexibility': [''],
        // });
        // this.checkFlexibility = this.form2.controls['checkFlexibility'];
        this.child = this.form.controls['child'];
        this.address = this.form.controls['address'];
        this.subjectControl = this.form.controls['subjectControl'];
        this.childInfo = this.form.controls['childInfo'];
        this.duration = this.form.controls['duration'];
        this.sessionLength = this.form.controls['sessionLength'];
        this.checkFlexibility = this.form.controls['checkFlexibility'];
        this.subjectControl.setValue(this.subjectsAdded);

        // if(localStorage.getItem('totalSessions') != undefined)
        //     {
        //         let totalSessions = localStorage.getItem('totalSessions');
        //         this.sessionLength.setValue(totalSessions);
        //     }
        if (this.sessionService.childInformation && this.sessionService.childInformation != undefined) {
            this.childInfo.setValue(this.sessionService.childInformation);
        }
        let fd = new FormData();
        fd.append('deviceType', 'WEB');
        this.spinner.show();
        this.parentService.getProfile(fd).subscribe((result) => {
            this.spinner.hide();
            if (result && result.data != undefined && !localStorage.getItem('tutor_Id')) {

                this.parentData = result.data;

                this.children = [];
                this.parentData.students.map((value, key) => {
                    this.children.push({data: value, selected: false});
                });

                if (this.children != undefined && this.children.length === 1) {
                    if (this.child.value != undefined) {
                        if (this.children[0].data.dob) {
                            this.child.setValue(this.children[0].data);
                            this.children[0].selected = true;
                            this.sessionService.selectedChild = this.children[0].data;
                        }
                    }
                } else {
                }
                this.addresses = [];
                if (this.parentData.parent && this.parentData.parent != undefined) {
                    this.parentData.parent.addresses.map((value, key) => {
                        this.addresses.push({data: value, selected: false});
                    });
                }

            }
        }, (error) => {
            this.spinner.hide();

            if (error.statusCode == 401 || error.statusCode == 429) {
                this.store.dispatch(new auth.AuthLogoutAction(error));
            } else if (error.message != undefined) {
                let dialogRef = this.dialog.open(CommonErrorDialog, {
                    data: {message: error.message}
                });
            }

        });
        this.spinner.hide();

        if (this.sessionService.selectedChild && this.sessionService.selectedChild != undefined) {
            this.child.setValue(this.sessionService.selectedChild);
        }
        if (this.sessionService.flexibility) {
            this.checkFlexibility.setValue(this.sessionService.flexibility);
        }
        if (this.AllSessionService.getBookingAgainData() && this.AllSessionService.getBookingAgainData() != undefined) {
            this.bookAgainData = JSON.parse(this.AllSessionService.getBookingAgainData());
        } else {
            if (localStorage.getItem('book_again') && localStorage.getItem('book_again') != undefined) {
                this.bookAgainData = JSON.parse(localStorage.getItem('book_again'));
            }
        }
        if (this.sessionService.checkedaddress && this.sessionService.checkedaddress != undefined) {
            this.checkedaddress = JSON.parse(this.sessionService.checkedaddress);
            this.clickedAddress = true;

        }
        if (this.sessionService.onlineBooking) {
            this.onlineBooking = true;
        } else {
            this.onlineBooking = false;
        }
        if (this.bookAgainData && this.bookAgainData != undefined) {
            if (!this.bookAgainData.studentId.isDeleted) {
                this.child.setValue(this.bookAgainData.studentId);
            } else {
                this.child.setValue('');

            }

        }
        if (localStorage.getItem('bookingDetails') != undefined) {
            let bookingDetail = JSON.parse(localStorage.getItem('bookingDetails'));

        }
        if (this.sessionService.getDuration() != undefined) {
            let duration = this.sessionService.getDuration();
            this.duration.setValue(duration);
        }
        this.setNewSessionLength();
        this.getBookingData();

        // let keep = this.sessionService.getTrackPageRefresh();
        // if (keep == undefined) {
        //     if (localStorage.getItem('finalData')) {
        //         localStorage.removeItem('finalData');
        //     }
        //     if (localStorage.getItem('totalSessions')) {
        //         localStorage.removeItem('totalSessions')
        //     }
        //     if (localStorage.getItem('finalSlot')) {
        //         localStorage.removeItem('finalSlot');
        //     }
        //     if (localStorage.getItem('index')) {
        //         localStorage.removeItem('index');
        //     }
        //     if (localStorage.getItem('goBack')) {
        //         localStorage.removeItem('goBack');
        //     }
        //     if (localStorage.getItem('promoHash')) {
        //         localStorage.removeItem('promoHash');
        //     }
        //     if (localStorage.getItem('bookingHash')) {
        //         localStorage.removeItem('bookingHash');
        //     }
        //     if (localStorage.getItem('steponeData')) {
        //         localStorage.removeItem('steponeData');
        //     }
        //     if (localStorage.getItem('slotSelected')) {
        //         localStorage.removeItem('slotSelected');
        //     }
        //     // this.router.navigate(['/home/browse-tutor']);
        // }

    }

    getBookingData() {
        this.sessionStore = this.store.select('session').subscribe((res: any) => {
            if (res.bookingData && res.bookingData != undefined) {
                this.bookingDetails = res.bookingData;
            }
        });
        if (this.bookingDetails && this.bookingDetails != undefined) {
            this.bookingData = this.bookingDetails;
            this.finalData = this.bookingData.step2Data.sessionsData;
            localStorage.setItem('finalData', JSON.stringify(this.finalData));
        } else {
            if (localStorage.getItem('bookingDetails') && localStorage.getItem('bookingDetails') != undefined) {
                this.bookingData = JSON.parse(localStorage.getItem('bookingDetails'));
                this.finalData = this.bookingData.step2Data.sessionsData;
                localStorage.setItem('finalData', JSON.stringify(this.finalData));
            } else {
                this.bookingData = '';
            }
        }
    }

    checkEqualityOfAddress(address1, Address2) {

        if (address1.addressLine1 != Address2.addressLine1) {
            return false;
        }

        if (((address1.addressLine2 ? address1.addressLine2 : '') != (Address2.addressLine2 ? Address2.addressLine2 : ''))) {
            return false;
        }

        if (address1.zipCode != Address2.zipCode) {
            return false;
        }

        if (address1.city != Address2.city) {
            return false;
        }

        if (address1.state != Address2.state) {
            return false;
        }

        // if ((address1.country ? address1.country : "") != (Address2.country ? Address2.country : "")) {
        //     return false
        // }
        return true;
    }

    addNewAddress() {
        localStorage.setItem('addSessionAddress', 'true');
        this.router.navigate(['/pages/profile/address']);
    }

    setNewSessionLength() {
        if (this.sessionService.getSessionLength() != undefined) {
            let length = this.sessionService.getSessionLength();
            this.sessionLength.setValue(length);
            localStorage.setItem('goBack', 'true');
        }

    }

    ngAfterViewInit() {
        setTimeout(() => {

        });

    }

    fireAllErrors(formGroup: FormGroup) {
        let keys = Object.keys(formGroup.controls);
        keys.forEach((field: any) => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {

                control.markAsTouched({onlySelf: true});
                control.markAsDirty({onlySelf: true});
            } else if (control instanceof FormGroup) {
                this.fireAllErrors(control);
            } else if (control instanceof FormArray) {
                (<FormArray>control).controls.forEach((element: FormGroup) => {
                    this.fireAllErrors(element);
                });
            }
        });
    }

    checkIsSuppress() {

        if (this.userData.data && this.userData.data.partnershipCode && this.userData.data.partnershipCode.length && this.userData.data.partnershipCode[0].isRateChargeSuppress) {
            if (this.userData.data.parent.isParentOutOfTutoringHours) {
                this.isRateChargeSuppress = false;
            } else {
                this.isRateChargeSuppress = true;
            }

        }

    }

    setSessionLengthDropDown() {
        this.sessionDropDownData = [];
        let length = 10;
        if (this.isRateChargeSuppress) {
            if (this.userData.data.parent.numberOfTutoringHours <= 10) {
                let sessionCreditsFromExternalApi = JSON.parse(JSON.stringify(this.userData.data.parent.sessionCreditsFromExternalApi));
                length = this.commonService.noOfNonExpiredHours(sessionCreditsFromExternalApi);
            }
        }
        for (let i = 0; i < length; i++) {
            this.sessionDropDownData.push(`${i + 1}`);
        }
        if (!length) {
            // this.sessionLength.setValue('');
            // this.sessionLength.setValue(0);
            // this.form.controls.sessionLength.setValue(undefined);
        }

    }

    scroollTop() {
        localStorage.setItem('currentDuration', this.sessionService.getDuration());
        this.complete1 = false;
        this.edit1 = true;
        this.sessionHeading = 'Book a Session';
        ga('send', {
            hitType: 'event',
            eventCategory: 'Book a Session',
            eventAction: 'Book a Session Step 2',
            eventLabel: 'Book a Session Step 1 Back'
        });
        // window.scroll(0, 0);
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
        setTimeout(() => {
            this.stepper.selectedIndex = 0;
            let elements = document.getElementsByClassName('mat-horizontal-content-container')[0];
            let childNode = elements.childNodes[2] as HTMLElement;
            childNode.style.overflow = 'hidden';
            // document.getElementsByClassName('mat-horizontal-content-container')[0].childNodes[2].style.overflow = 'hidden'
        }, 1);
        let lines = document.getElementsByClassName('mat-stepper-horizontal-line');
        setTimeout(() => {
            lines[0].className = 'mat-stepper-horizontal-line';
        }, 500);

        this.setNewSessionLength();

    }

    scroollTop2() {
        this.complete2 = false;
        this.edit2 = true;
        this.sessionHeading = 'Choose your Date and Time';
        // window.scroll(0, 0);
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
        ga('send', {
            hitType: 'event',
            eventCategory: 'Book a Session',
            eventAction: 'Book a Session Step 3',
            eventLabel: 'Book a Session Step 3 Back'
        });

        setTimeout(() => {
            let elements = document.getElementsByClassName('mat-horizontal-content-container')[0];
            let childNode = elements.childNodes[2] as HTMLElement;
            childNode.style.overflow = 'visible';
            // document.getElementsByClassName('mat-horizontal-content-container')[0].childNodes[2].style.overflow = 'visible'
            this.stepper.selectedIndex = 1;
        }, 1);
        let lines = document.getElementsByClassName('mat-stepper-horizontal-line');
        setTimeout(() => {
            lines[1].className = 'mat-stepper-horizontal-line';
        }, 500);

    }

    goToConfirmPayment(gotoPayment) {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Book a Session',
            eventAction: 'Book a Session Step 3',
            eventLabel: 'Book a Session Step 3 Next'
        });
        let sessionData = this.sessionService.getSessionData();
        for (let i = 0; i < sessionData.length; i++) {
            if (sessionData[i].isPromoValid == 0) {
                sessionData[i].promocode = '';
            }
        }

        this.sessionService.setSessionData(sessionData);
        this.sessionService.setTrackPageRefresh(true);
        // this.bookingDetails['flexibility'] = this.checkFlexibility.value;
        localStorage.setItem('bookingDetails', JSON.stringify(this.bookingDetails));

        if (gotoPayment) {
            this.store.dispatch({
                type: session.actionTypes.GO_TO_PAYMENTS,
                payload: this.bookingDetails
            });
        } else {
            this.completeBooking(this.bookingDetails);
        }

    }

    addChild() {
        localStorage.setItem('goFromSession', 'true');
        this.router.navigate(['/pages/profile/add-child']);

    }

    shiftRight() {
        this.hideArrow = true;
        let elements = document.getElementsByClassName('mat-chip-list-wrapper');
        let chipListDiv = elements[0] as HTMLElement;
        let initial = chipListDiv.scrollLeft;
        jQuery('#childd .mat-chip-list-wrapper').scrollLeft(initial + 200);

    }

    shiftLeft() {

        let elements = document.getElementsByClassName('mat-chip-list-wrapper');
        let chipListDiv = elements[0] as HTMLElement;
        let initial = chipListDiv.scrollLeft;
        jQuery('#childd .mat-chip-list-wrapper').scrollLeft(initial - 200);
        if (initial === 0) {
            this.hideArrow = !this.hideArrow;
        }
    }

    shiftRightAddress() {
        this.hideArrowAddress = true;
        let elements = document.getElementById('addressMat').getElementsByClassName('mat-chip-list-wrapper');
        let chipListDiv = elements[0] as HTMLElement;
        let initial = chipListDiv.scrollLeft;
        jQuery('#addressMat .mat-chip-list-wrapper').scrollLeft(initial + 200);
        // let initial = chipListDiv.scrollLeft;
        // chipListDiv.scrollTo({
        //     left: initial + 200,
        //     top: 0
        // });
    }

    shiftLeftAddress() {
        let elements = document.getElementById('addressMat').getElementsByClassName('mat-chip-list-wrapper');
        let chipListDiv = elements[0] as HTMLElement;
        let initial = chipListDiv.scrollLeft;
        jQuery('#addressMat .mat-chip-list-wrapper').scrollLeft(initial - 200);
        // let initial = chipListDiv.scrollLeft
        // chipListDiv.scrollTo({
        //     left: initial - 200,
        //     top: 0
        // });
        if (initial === 0) {
            this.hideArrowAddress = !this.hideArrowAddress;
        }
    }

    ngAfterContentChecked() {

        if (this.sessionService.selectedAddress && this.sessionService.selectedAddress != undefined) {
            this.address.setValue(JSON.parse(this.sessionService.selectedAddress));
        } else {
            if (this.AllSessionService.setBookAgain_address && this.AllSessionService.setBookAgain_address != undefined) {
                let id = JSON.parse(this.AllSessionService.setBookAgain_address);
                this.addressId = id._id;
                this.address.setValue(JSON.parse(this.AllSessionService.setBookAgain_address));
            }
        }

    }

    ngOnInit() {
        if (this.AllSessionService.singleSessionUrl) {
            this.sessionService.selectedChild = '';
        }
        window['x'] = this;

        if (localStorage.getItem('comeFromDialog') != undefined && localStorage.getItem('comeFromDialog') === 'true') {
            localStorage.removeItem('comeFromDialog');
        }
        if (localStorage.getItem('addSessionAddress') != undefined && localStorage.getItem('addSessionAddress') === 'true') {
            localStorage.removeItem('addSessionAddress');
        }

        if (!localStorage.getItem('tutorSubjects')) {

        }
    }

    submit() {

        if (!this.sessionDropDownData.length) {
            return;
        }

        this.sessionService.setErrorMessage(false, false);
        this.totalSessions = this.sessionLength.value;
        if (this.totalSessions > this.sessionService.getSessionData().length) {
            this.tableArray = this.sessionService.getSessionData();
            for (let i = this.sessionService.getSessionData().length; i < this.totalSessions; i++) {
                this.tableArray.push({
                    slots: '',
                    date: '',
                    time: '',
                    discount: '',
                    refferal: '',
                    total_amount: '',
                    promocode: '',
                    finalPrice: '',
                    endTime: '',
                    isPromoValid: 0,
                    dateTime: ''
                });
            }
            this.sessionService.setSessionData(this.tableArray);
        } else {
            this.tableArray = this.sessionService.getSessionData();
            this.tableArray.splice(this.totalSessions);
            this.sessionService.setSessionData(this.tableArray);
        }
        localStorage.setItem('totalSessions', this.totalSessions);
        // let back = JSON.parse(localStorage.getItem('goBack'));
        // if (!back) {
        //     this.tableArray = [];
        //     for (let i = 0; i < this.totalSessions; i++) {
        //         this.tableArray.push({ slots: '', date: '', time: '', discount: '', refferal: '', total_amount: '', promocode: '', finalPrice: '', endTime: '', isPromoValid: 0, dateTime: '' });
        //     }
        //     this.sessionService.setSessionData(this.tableArray)
        // }
        if (this.tableArray.length)


            // this.fireAllErrors(this.form);
            if (this.form.valid) {
                if (document.getElementsByClassName('mat-horizontal-content-container') != undefined) {
                    let elements = document.getElementsByClassName('mat-horizontal-content-container')[0];
                    let childNode = elements.childNodes[2] as HTMLElement;
                    childNode.style.overflow = 'visible';
                }

                let el = $('#moveUp');
                $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
                    el.focus();
                });
                //checkng if duration is changed than clearing values
                let oldDuration = localStorage.getItem('currentDuration');
                let newDuration = JSON.stringify(this.sessionService.getDuration());
                if (oldDuration != newDuration) {
                    if (localStorage.getItem('slotSelected')) {
                        localStorage.removeItem('slotSelected');
                    }
                    if (localStorage.getItem('goBack')) {
                        localStorage.removeItem('goBack');
                    }
                    if (localStorage.getItem('finalSlot')) {
                        localStorage.removeItem('finalSlot');
                    }
                    if (localStorage.getItem('promoHash')) {
                        localStorage.removeItem('promoHash');
                    }
                    if (localStorage.getItem('bookingHash')) {
                        localStorage.removeItem('bookingHash');
                    }
                    this.tableArray = [];
                    for (let i = 0; i < this.totalSessions; i++) {
                        this.tableArray.push({
                            slots: '',
                            date: '',
                            time: '',
                            discount: '',
                            refferal: '',
                            total_amount: '',
                            promocode: '',
                            finalPrice: '',
                            endTime: '',
                            isPromoValid: 0,
                            dateTime: ''
                        });
                    }
                    this.sessionService.setSessionData(this.tableArray);
                }

                ga('send', {
                    hitType: 'event',
                    eventCategory: 'Book a Session',
                    eventAction: 'Book a Session Step 1',
                    eventLabel: 'Book a Session Step 1 Next'
                });
                let value = this.form.value;
                if (this.onlineBooking && this.onlineBookingTab) {
                    value.isSessionOnline = 'true';
                }
                this.showSchedular = true;
                localStorage.setItem('steponeData', JSON.stringify(value));
                this.sessionService.childInformation = (this.childInfo ? this.childInfo.value : '');
                this.sessionService.stepOneData(value);
                this.sessionService.step.next(value);
                if (localStorage.getItem('tutor_Id') && localStorage.getItem('tutor_Id') != undefined && this.sessionService.tutorSelected) {
                    this.spinner.show();
                    let tutorId = localStorage.getItem('tutor_Id');
                    let payload = {
                        tutorId: tutorId,
                        duration: this.duration.value,
                        totalSessions: this.totalSessions
                    };
                    this.sessionService.checkTutorAvailability(payload).subscribe((res) => {
                            if (res && res.data != undefined) {
                                this.spinner.hide();
                                this.sessionService.stepOneData(value);

                                this.sessionService.updateStepperIndex(1);
                                // this.sessionService.changeStep.next(1);
                                this.sessionService.step.next(value);
                                this.stepper.next();
                                let lines = document.getElementsByClassName('mat-stepper-horizontal-line');
                                setTimeout(() => {
                                    lines[0].className = 'blue-line mat-stepper-horizontal-line';
                                }, 500);
                            }
                        },
                        (error) => {
                            this.spinner.hide();

                            if (error.statusCode == 401 || error.statusCode == 429) {
                                this.store.dispatch(new auth.AuthLogoutAction(error));
                            } else if (error.message) {
                                this.dialog.closeAll();
                                let dialogRef = this.dialog.open(CheckTutorDialog, {
                                    data: {message: error.message}
                                });
                            }
                        });
                } else {
                    this.sessionService.stepOneData(value);
                    this.sessionService.step.next(value);
                    this.router.navigate(['/pages/book-session/select-tutor']);
                }

            } else {

                let control;
                Object.keys(this.form.controls).reverse().forEach((field) => {
                    if (this.form.get(field).invalid) {
                        control = this.form.get(field);
                        control.markAsDirty();
                    }
                });

                if (control) {
                    let el = $('.ng-invalid:not(form):first');
                    $('html,body').animate({scrollTop: (el.offset().top - 200)}, 'slow', () => {
                        el.focus();
                    });
                }

            }
    }

    select(children, child) {

        if (!child.data.dob) {
            let dialogRef = this.dialog.open(CommonErrorDialog, {
                data: {message: 'Additional information is required in order to complete a session request for the child you have selected. In order to continue, please click on My Profile and provide all requested information for this child or any others that may receive tutoring support.'}
                // data: {message: 'Your selected child does not have all required information need to continue with session booking. Please go to My Profile to provide additional details about your child or select a new child for this session before continuing.'}
            });
            dialogRef.afterClosed().subscribe(() => {
            });
        } else {
            children.map((value) => {
                value.selected = false;
            });

            child.selected = !child.selected;
            let setChild = child.data;
            this.sessionService.selectedChild = setChild;
            this.child.setValue(setChild);
        }

    }

    durationHours(event) {
        this.duration.setValue(event.value);
        this.sessionService.setDuration(event.value);
        if (localStorage.getItem('slotSelected')) {
            localStorage.removeItem('slotSelected');
        }
        if (localStorage.getItem('goBack')) {
            localStorage.removeItem('goBack');
        }
        if (localStorage.getItem('finalSlot')) {
            localStorage.removeItem('finalSlot');
        }
        if (localStorage.getItem('promoHash')) {
            localStorage.removeItem('promoHash');
        }
        if (localStorage.getItem('bookingHash')) {
            localStorage.removeItem('bookingHash');
        }

    }

    sessionLengthValue(event) {
        this.sessionLength.setValue(event.value);
        let count = event.value;
        this.sessionService.setSessionLength(event.value);
        // if (localStorage.getItem('slotSelected')) {
        //     localStorage.removeItem('slotSelected')
        // }
        // if (localStorage.getItem('goBack')) {
        //     localStorage.removeItem('goBack')
        // }
        // if (localStorage.getItem('finalSlot')) {
        //     localStorage.removeItem('finalSlot')
        // }
        if (localStorage.getItem('promoHash')) {
            localStorage.removeItem('promoHash');
        }
        if (localStorage.getItem('bookingHash')) {
            localStorage.removeItem('bookingHash');
        }
    }

    roundOff(rating) {
        let rate = Math.round(rating);
        let multiplier = Math.pow(10, 1 || 0);
        return Math.round(rating * multiplier) / multiplier;
    }

    addSubject() {
        if (this.subjectsAdded.length > 0) {
            // this.sessionService.alreadyAddSubjects(this.subjectsAdded);
            localStorage.setItem('selected_subjects', JSON.stringify(this.subjectsAdded));
        }
        this.sessionService.childInformation = (this.childInfo ? this.childInfo.value : '');
        this.setChildInformation = this.childInfo.value;
        // this.subjectsAdded = [];
        if (this.checkFlexibility.value) {
            this.sessionService.flexibility = this.checkFlexibility.value;

        }
        this.sessionService.flexibility = this.checkFlexibility.value;

        this.sessionService.checkedaddress = JSON.stringify(this.checkedaddress);
        this.router.navigate(['/pages/book-session/add-subjects']);
    }

    selectAddress(addresses, address, online) {
        if (online) {
            this.onlineBooking = true;
            this.sessionService.onlineBooking = true;
        } else {
            this.sessionService.onlineBooking = false;
            this.onlineBooking = false;
            this.addressCheck = '';
        }
        this.address1 = address;
        this.addresses1 = addresses;

        if (address && address.data && this.addressCheck != address.data.label) {
            localStorage.removeItem('book_again_address');
            if (address.data.withinTutorPreferredDistance === false && !this.sessionsWithTutor && online == false) {
                this.addressCheck = address.data.label;
                this.zone.run(() => {
                    let dialogRef = this.dialog.open(CommonErrorDialog, {
                        data: {
                            message: 'Oops! If you are attempting to schedule an in-person session, based on this tutor’s Travel Policy, they may not be willing to offer tutoring at your chosen location. If you wish to continue with an in-person session request, we recommend choosing a location closer to the tutor to reduce travel distance. If you are scheduling an online session, please continue with your request.',
                            data: 'true'
                        }
                    });
                });
            } else {
                for (let element of this.addresses1) {
                    // this.addresses.forEach((element) => {
                    element.selected = false;
                }
                this.addressCheck = address.data.label;
                this.checkedaddress = address;
                this.clickedAddress = true;
                addresses.map((value) => {
                    value.selected = false;
                });
                address.selected = !address.selected;

                let setAddess = {
                    latitude: (address.data && address.data.location) ? address.data.location.coordinates[1] : '',
                    longitude: (address.data && address.data.location) ? address.data.location.coordinates[0] : '',
                    zipCode: address.data ? address.data.zipCode : '',
                    addressLine1: address.data ? address.data.addressLine1 : '',
                    addressLine2: address.data ? address.data.addressLine2 : '',
                    city: address.data ? address.data.city : '',
                    state: address.data ? address.data.state : '',
                    country: address.data ? address.data.country : '',
                    label: address.data ? address.data.label : '',
                    _id: address.data ? address.data._id : ''
                    // parentTimezoneOffsetZone: address.data && address.data.timezoneOffsetZone ? address.data.timezoneOffsetZone : 'America/New_york'
                };
                this.sessionService.selectedAddress = JSON.stringify(setAddess);
                this.sessionService.selectedAddress_id = address.data ? address.data._id : '';

                if (setAddess && setAddess != undefined) {
                    this.address.setValue(setAddess);
                }

            }
        }

    }

    onlineBookingSession(addresses, address) {

    }

    chipSelectionChanges(event, child) {
    }

    chipSelectionChangesAddress(event, child) {
    }

    remove(child: any): void {
        let index = this.children.indexOf(child);
        if (index >= 0) {
            this.children.splice(index, 1);
        }
    }

    selectSubject(data, i) {
        data.selected = !data.selected;
    }

    removeAddress(child: any): void {
        let index = this.children.indexOf(child);
        if (index >= 0) {
            this.children.splice(index, 1);
        }
    }

    removeSubject(subject: any): void {
        let index = this.subjectsAdded.indexOf(subject);

        if (index >= 0) {
            this.subjectsAdded.splice(index, 1);
        }
        this.subjectControl.setValue(this.subjectsAdded);
    }

    ngOnDestroy() {
        this.store.dispatch({
            type: tutor.actionTypes.ADDRESS_LOCATION,
            payload: {continueBooking: false}
        });
        this.sessionsWithTutor = false;
        this.AllSessionService.singleSessionUrl = '';
        this.child.setValue('');
        this.store.dispatch({
            type: session.actionTypes.GOTO_BOOK_SESSION_STEP2_FALSE
        });

        // if (this.emptyBookingData) {
        //
        //     if (this.sessionStore) {
        //         this.sessionStore.unsubscribe();
        //     }
        //     if (localStorage.getItem('finalData')) {
        //         localStorage.removeItem('finalData');
        //     }
        //     if (localStorage.getItem('totalSessions')) {
        //         localStorage.removeItem('totalSessions');
        //     }
        //     if (localStorage.getItem('finalSlot')) {
        //         localStorage.removeItem('finalSlot');
        //     }
        //     if (localStorage.getItem('index')) {
        //         localStorage.removeItem('index');
        //     }
        //     if (localStorage.getItem('goBack')) {
        //         localStorage.removeItem('goBack');
        //     }
        //     if (localStorage.getItem('promoHash')) {
        //         localStorage.removeItem('promoHash');
        //     }
        //     if (localStorage.getItem('bookingHash')) {
        //         localStorage.removeItem('bookingHash');
        //     }
        //     if (localStorage.getItem('steponeData')) {
        //         localStorage.removeItem('steponeData');
        //     }
        //     if (localStorage.getItem('slotSelected')) {
        //         localStorage.removeItem('slotSelected');
        //     }
        //
        // }

        // this.checkRoute.unsubscribe();
        if (this.profileStore && this.profileStore != undefined) {
            this.profileStore.unsubscribe();
        }
        if (localStorage.getItem('book_again') != undefined) {
            localStorage.removeItem('book_again');
        }
        if (localStorage.getItem('book_again_address') != undefined) {
            localStorage.removeItem('book_again_address');
        }
        if (this.schedularStore && this.schedularStore != undefined) {
            this.schedularStore.unsubscribe();
        }
        if (this.tutorStore && this.tutorStore != undefined) {
            this.tutorStore.unsubscribe();
        }
        if (this.changeStepSubscription) {
            this.changeStepSubscription.unsubscribe();
        }
        this.store.dispatch({
            type: selectPayments.actionTypes.DESTROY_VALUES
        });
    }

    // completeBooking(data) {
    //
    //
    //     this.emptyBookingData = true;
    //
    //     let fd = new FormData();
    //     if (localStorage.getItem('tutor_Id') && localStorage.getItem('tutor_Id') != undefined) {
    //         let tutor_id = localStorage.getItem('tutor_Id');
    //         fd.append('tutorId', tutor_id);
    //     }
    //
    //     // if (!this.bookingData) {
    //     //     if (this.isRateChargeSuppress) {
    //     // this.getBookingData();
    //     this.bookingData = this.bookingDetails;
    //     // }
    //     //
    //     // }
    //
    //     if (this.bookingData && this.bookingData != undefined) {
    //         if (this.bookingData.steponeData && this.bookingData.steponeData != undefined) {
    //             fd.append('studentId', this.bookingData.steponeData.child ? this.bookingData.steponeData.child._id : '');
    //             if (this.bookingData.steponeData.subjectControl && this.bookingData.steponeData.subjectControl != undefined && this.bookingData.steponeData.subjectControl.length > 0) {
    //                 let subjects = [];
    //                 for (let i = 0; i < this.bookingData.steponeData.subjectControl.length; i++) {
    //                     subjects.push(this.bookingData.steponeData.subjectControl[i].categoryId);
    //                 }
    //                 fd.append('subjects', JSON.stringify(subjects));
    //             }
    //             if (this.bookingData.steponeData.subjectControl && this.bookingData.steponeData.subjectControl != undefined && this.bookingData.steponeData.subjectControl.length > 0) {
    //                 let sub_subjects = [];
    //                 for (let i = 0; i < this.bookingData.steponeData.subjectControl.length; i++) {
    //                     sub_subjects.push(this.bookingData.steponeData.subjectControl[i].subCategoryId);
    //                 }
    //                 fd.append('subSubjects', JSON.stringify(sub_subjects));
    //             }
    //             if (this.bookingData.steponeData.address && this.bookingData.steponeData.address != undefined) {
    //
    //                 fd.append('locationDetails', JSON.stringify(this.bookingData.steponeData.address));
    //             }
    //             if (this.bookingData.steponeData.duration && this.bookingData.steponeData.duration != undefined) {
    //
    //                 fd.append('duration', this.bookingData.steponeData.duration);
    //             }
    //             if (this.bookingData.steponeData.childInfo && this.bookingData.steponeData.childInfo != undefined) {
    //
    //                 fd.append('additionalNotes', this.bookingData.steponeData.childInfo);
    //             }
    //             fd.append('isSessionOnline', this.bookingData.steponeData.isSessionOnline == 'true' ? 'true' : 'false');
    //             fd.append('isFlexibleOnSessionLocation', (this.bookingData.steponeData.checkFlexibility || false));
    //         }
    //
    //         if (localStorage.getItem('totalSessions') && localStorage.getItem('totalSessions') != undefined) {
    //             let totalSessions = JSON.parse(localStorage.getItem('totalSessions'));
    //             fd.append('totalSessions', totalSessions);
    //         }
    //
    //         if (this.finalData && this.finalData != undefined) {
    //             let sessionsData = [];
    //             let data: any;
    //             for (let i = 0; i < this.finalData.length; i++) {
    //                 let time = this.finalData[i].time.split('-');
    //                 let date = moment(this.finalData[i].date, 'MMM D YYYY').format('MMMM D, YYYY');
    //                 let start_time = moment(time[0], 'hh:mmA').format('HH:mm:ss');
    //                 let end_time = moment(time[1], 'hh:mmA').format('HH:mm:ss');
    //                 let startDateTime = new Date(date + ' ' + start_time);
    //                 let endDateTime = new Date(date + ' ' + end_time);
    //                 data = {
    //                     startTime: (startDateTime).toUTCString(),
    //                     endTime: (endDateTime).toUTCString(),
    //                     slots: this.finalData[i].slots
    //                 };
    //                 if (this.finalData[i].isPromoValid == 1) {
    //                     if (this.finalData[i].finalPrice > 0) {
    //                         data.amount = this.finalData[i].finalPrice;
    //                     } else {
    //                         data.amount = 0;
    //                     }
    //                 } else {
    //                     if (this.finalData[i].total_amount > 0) {
    //                         data.amount = this.finalData[i].total_amount;
    //                     } else {
    //                         data.amount = 0;
    //                     }
    //                 }
    //
    //                 if (this.finalData[i].isPromoValid == 1) {
    //                     if (this.finalData[i].promocode && this.finalData[i].promocode != undefined) {
    //                         data.promocode = this.finalData[i].promocode;
    //                     }
    //                 }
    //
    //                 if (this.finalData[i].promoDiscount && this.finalData[i].promoDiscount != undefined) {
    //                     data.promoDiscount = this.finalData[i].discount;
    //                 }
    //
    //                 sessionsData.push(data);
    //             }
    //             fd.append('sessions', JSON.stringify(sessionsData));
    //         } else {
    //             if (localStorage.getItem('finalData')) {
    //
    //                 let data = JSON.parse(localStorage.getItem('finalData'));
    //                 let sessionsData = [];
    //                 let temp: any;
    //                 for (let i = 0; i < data.length; i++) {
    //                     let time = data[i].time.split('-');
    //                     let start_time = moment((time[0]), 'hh:mmA').format('hh:mm A').toString();
    //                     let end_time = moment((time[1]), 'hh:mmA').format('hh:mm A').toString();
    //                     let startDateTime = new Date((data[i].date + '' + start_time));
    //                     let endDateTime = new Date((data[i].date + '' + end_time));
    //                     temp = {
    //                         startTime: (startDateTime).toUTCString(),
    //                         endTime: (endDateTime).toUTCString(),
    //                         slots: data[i].slots
    //                     };
    //                     if (data[i].isPromoValid == 1) {
    //                         temp.amount = data[i].finalPrice;
    //                     } else {
    //                         temp.amount = data[i].total_amount;
    //                     }
    //                     if (data[i].isPromoValid == 1) {
    //                         if (data[i].promocode && data[i].promocode != undefined) {
    //                             temp.promocode = data[i].promocode;
    //                         }
    //                     }
    //
    //                     if (data[i].promoDiscount && data[i].promoDiscount != undefined) {
    //                         temp.promoDiscount = data[i].discount;
    //                     }
    //                     sessionsData.push(temp);
    //                 }
    //                 fd.append('sessions', JSON.stringify(sessionsData));
    //             }
    //         }
    //
    //         if (localStorage.getItem('userData'))
    //             fd.append('userSource', localStorage.getItem('userData'));
    //     }
    //
    //     // local test
    //     // return;
    //
    //     this.store.dispatch({
    //         type: session.actionTypes.COMPLETE_BOOKING,
    //         payload: fd
    //     });
    // }

    completeBooking(data) {

        this.emptyBookingData = true;

        let fd = new FormData();
        if (localStorage.getItem('tutor_Id') && localStorage.getItem('tutor_Id') != undefined) {
            let tutor_id = localStorage.getItem('tutor_Id');
            fd.append('tutorId', tutor_id);
        }

        // if (!this.bookingData) {
        //     if (this.isRateChargeSuppress) {
        // this.getBookingData();
        // this.bookingData = this.bookingDetails;
        // }
        //
        // }
        if (data.steponeData) {
            fd.append('studentId', data.steponeData.child ? data.steponeData.child._id : '');

            if (data.steponeData.subjectControl && data.steponeData.subjectControl.length > 0) {
                let subjects = [];
                for (let i = 0; i < data.steponeData.subjectControl.length; i++) {
                    subjects.push(data.steponeData.subjectControl[i].categoryId);
                }
                fd.append('subjects', JSON.stringify(subjects));
            }
            if (data.steponeData.subjectControl && data.steponeData.subjectControl.length > 0) {
                let sub_subjects = [];
                for (let i = 0; i < data.steponeData.subjectControl.length; i++) {
                    sub_subjects.push(data.steponeData.subjectControl[i].subCategoryId);
                }
                fd.append('subSubjects', JSON.stringify(sub_subjects));
            }
            if (data.steponeData.address) {

                fd.append('locationDetails', JSON.stringify(data.steponeData.address));
            }
            if (data.steponeData.duration) {

                fd.append('duration', data.steponeData.duration);
            }
            if (data.steponeData.childInfo) {

                fd.append('additionalNotes', data.steponeData.childInfo);
            }
            fd.append('isSessionOnline', data.steponeData.isSessionOnline == 'true' ? 'true' : 'false');
            fd.append('isFlexibleOnSessionLocation', (data.steponeData.checkFlexibility || false));
        }

        if (localStorage.getItem('totalSessions') && localStorage.getItem('totalSessions') != undefined) {
            let totalSessions = JSON.parse(localStorage.getItem('totalSessions'));
            fd.append('totalSessions', totalSessions);
        }
        this.finalData = data.step2Data.sessionsData;

        if (this.finalData) {
            let sessionsData = [];
            let tempData: any;
            for (let i = 0; i < this.finalData.length; i++) {
                let time = this.finalData[i].time.split('-');
                let date = moment(this.finalData[i].date, 'MMM D YYYY').format('MMMM D, YYYY');
                let start_time = moment(time[0], 'hh:mmA').format('HH:mm:ss');
                let end_time = moment(time[1], 'hh:mmA').format('HH:mm:ss');
                let startDateTime = new Date(date + ' ' + start_time);
                let endDateTime = new Date(date + ' ' + end_time);

                tempData = {
                    startTime: (startDateTime).toUTCString(),
                    endTime: (endDateTime).toUTCString(),
                    slots: this.finalData[i].slots
                };
                if (this.finalData[i].isPromoValid == 1) {
                    if (this.finalData[i].finalPrice > 0) {
                        tempData.amount = this.finalData[i].finalPrice;
                    } else {
                        tempData.amount = 0;
                    }
                } else {
                    if (this.finalData[i].total_amount > 0) {
                        tempData.amount = this.finalData[i].total_amount;
                    } else {
                        tempData.amount = 0;
                    }
                }

                if (this.finalData[i].isPromoValid == 1) {
                    if (this.finalData[i].promocode && this.finalData[i].promocode != undefined) {
                        tempData.promocode = this.finalData[i].promocode;
                    }
                }

                if (this.finalData[i].promoDiscount && this.finalData[i].promoDiscount != undefined) {
                    tempData.promoDiscount = this.finalData[i].discount;
                }
                sessionsData.push(tempData);
            }
            fd.append('sessions', JSON.stringify(sessionsData));
        } else {
            if (localStorage.getItem('finalData')) {
                let finalData = JSON.parse(localStorage.getItem('finalData'));
                let sessionsData = [];
                let temp: any;
                for (let i = 0; i < data.length; i++) {
                    let time = data[i].time.split('-');
                    let start_time = moment((time[0]), 'hh:mmA').format('hh:mm A').toString();
                    let end_time = moment((time[1]), 'hh:mmA').format('hh:mm A').toString();
                    let startDateTime = new Date((data[i].date + '' + start_time));
                    let endDateTime = new Date((data[i].date + '' + end_time));
                    temp = {
                        startTime: (startDateTime).toUTCString(),
                        endTime: (endDateTime).toUTCString(),
                        slots: finalData[i].slots
                    };
                    if (finalData[i].isPromoValid == 1) {
                        temp.amount = finalData[i].finalPrice;
                    } else {
                        temp.amount = finalData[i].total_amount;
                    }
                    if (finalData[i].isPromoValid == 1) {
                        if (finalData[i].promocode && finalData[i].promocode != undefined) {
                            temp.promocode = finalData[i].promocode;
                        }
                    }

                    if (finalData[i].promoDiscount && finalData[i].promoDiscount != undefined) {
                        temp.promoDiscount = finalData[i].discount;
                    }
                    sessionsData.push(temp);
                }
                fd.append('sessions', JSON.stringify(sessionsData));
            }
        }

        if (localStorage.getItem('userData'))
            fd.append('userSource', localStorage.getItem('userData'));

        this.store.dispatch({
            type: session.actionTypes.COMPLETE_BOOKING,
            payload: fd
        });
    }

    gotoScheduler() {
        // this.router.navigate(['/steptwo']);
        this.stepper.selectedIndex = 1;
        // window.scroll(0, 0);
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
        let lines = document.getElementsByClassName('mat-stepper-horizontal-line');
        setTimeout(() => {
            lines[0].className = 'blue-line mat-stepper-horizontal-line';
        }, 500);
        this.complete1 = true;
        this.sessionHeading = 'Choose your Date and Time';
        this.edit1 = false;
    }

}
