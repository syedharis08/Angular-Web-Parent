import { actionTypes } from './../state/select-payments.actions';
import { BaThemeSpinner } from './../../../../../theme/services/baThemeSpinner/baThemeSpinner.service';
import { Subscription } from 'rxjs/Rx';
import { Component, VERSION, Renderer, ApplicationRef, NgZone, ChangeDetectorRef, AfterContentChecked, AfterViewInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { cloneDeep, random } from 'lodash';
import { NgbActiveModal, NgbDropdown, NgbDropdownConfig, NgbTimepicker, NgbInputDatepicker, NgbDatepickerConfig, NgbDateStruct, NgbModal, NgbTimepickerConfig, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';

const types = ['success', 'error', 'info', 'warning'];
import 'style-loader!./select-payments.scss';
import * as selectPayments from '../state';
import * as tutor from '../../../../../publicPages/tutor/state';
import * as session from '../../../state';
import * as  profile from '../../../../profile/state';
import { ISubscription } from 'rxjs/Subscription';
import * as authAction from '../../../../../../app/auth/state/auth.actions';
import { BookSessionService } from '../../../../../services/session-service/session.service';
import { EmailValidator } from './../../../../../theme/validators';
import { ParentService } from '../../../../../services/parent-service/parent.service';
import { auth } from '../../../../../auth/index';
import { CommonErrorDialog } from '../../../../../auth/model/common-error-dialog/common-error-dialog';
import { CheckTutorDialog } from '../../../../../auth/model/check-tutor-dialog/check-tutor-dialog';
import { SelectPaymentService } from '../../../../../services/select-payment/select-payments.service';
import { IfObservable } from 'rxjs/observable/IfObservable';
import * as _ from 'lodash';
import * as   sessionsDetails from '../../../state/all-sessions.actions';

@Component({
    selector: 'select-payments',
    templateUrl: './select-payments.html',
})

export class SelectPaymentsTutorComponent {
    finalArrayFalse: any;
    promoIndex: any;
    promoStatus: any;
    promoCodeName: any;
    promocodeData: any;
    promocodeCheck: any;
    beforeDiscount: any;
    promoValid: any;
    showEmptyError: boolean = false;
    referDiscount: any;
    referValue: any;
    referType: any;
    referData: any;
    cardEditcheck: boolean;
    userCards: any;
    bookingDetails: any;
    bookingData: any;
    profileStore: Subscription;
    sessionStore: Subscription;
    thisLongitude: any;
    thisLatitude: any;
    paymentStore: Subscription;
    defaultAddress: AbstractControl;
    zipcode: AbstractControl;
    city: AbstractControl;
    state: AbstractControl;
    addressLine2: AbstractControl;
    addressLine1: AbstractControl;
    formaddress: FormGroup;
    defaultCard: AbstractControl;
    yearArray: any[];
    expiryYear: AbstractControl;
    expiryMonth: AbstractControl;
    displayTime: Date;
    date: Date;
    offset: number;
    emptyStore: any;
    emailVerified: any;
    promoError: any;
    bookingError: any;
    selectCardError: boolean = false;
    address: any;
    defaultCardId: any;
    sessionSubscription: Subscription;
    cardIdToBeSent: any;
    promoId: any;
    userLastName: any;
    promoModel: any;
    userFirstname: any;
    userImage: any;
    sessionData: any;
    currentUser: any;
    promoapplied: boolean = false;
    promoValue: any = 0;
    totalPrice: any = 0;
    promoDiscount: number;
    maxDiscount: any;
    promoPercentage: any;
    errorMessageCard: any;
    viewSavedCards: boolean = false;
    alreadyHaveSavedCards: boolean = false;
    promocode: AbstractControl;
    finalData: any;
    serviceIdSelected: any = [];
    dummyArray: any = [];
    categoryArray: any;
    cardListLength: any;
    cardId: any;
    cardsList: any;
    options: ToastrConfig;
    title = '';
    type = types[0];
    message = '';
    allLanguage = [];
    version = VERSION;
    errorMessage: string;
    messageToken: string;
    referalAmount: any;
    _zone: any;
    zero = 0;
    submitted: boolean;
    cvv: AbstractControl;
    expiryDate: AbstractControl;
    cardHolderName: AbstractControl;
    cartList: any;
    promoCodevalue: any;
    promoCodeValue: any;
    promoCodevalue_type: any;
    promocodeAmount: any = 0;
    monthArray: any = [];
    discount: any = 0;
    totalValue: any;
    promoHash = {};
    bookingHash = {};
    addCardCheck: boolean = false;
    index;
    any;
    cardNumber: AbstractControl;
    parent_address: any;
    promocodeValueName;
    public form: FormGroup;
    public items: FormArray;
    public mask = [/[0-9]/, /\d/, /\d/, /\d/, ' ', /[0-9]/, /\d/, /\d/, /\d/, ' ', /[0-9]/, /\d/, /\d/, /\d/, ' ', /[0-9]/, /\d/, /\d/, /\d/];
    public expiryMask = [/[0-9]/, /\d/, '/', /[0-9]/, /\d/];
    private lastInserted: number[] = [];
    startTime: string;
    endTime: string;
    totalProjected: any;
    completeBookingData: { FormData: FormData; bookingId: string; };
    fixedPrice: any;
    hidePromo: boolean;

    constructor(private fb: FormBuilder,
                private store: Store<any>,
                private modalService: NgbModal,
                private router: Router,
                private route: ActivatedRoute,
                private _spinner: BaThemeSpinner,
                private selectPaymentService: SelectPaymentService,
                private renderer: Renderer,
                private appRef: ApplicationRef,
                private config: NgbDatepickerConfig,
                private dialog: MatDialog,
                private changeRef: ChangeDetectorRef,
                private ngZone: NgZone,
                private parentService: ParentService,
                private sessionService: BookSessionService
    ) {
        if (localStorage.getItem('hasPartnerCode') == 'true') {
            this.hidePromo = true;
        } else {
            this.hidePromo = false;
        }
        this.sessionService.getPromoData();
        this.startTime = localStorage.getItem('startTimeBooking');
        this.endTime = localStorage.getItem('endTimeBooking');
        this.fixedPrice = JSON.parse(localStorage.getItem('estimatedPrice'));
        this.totalProjected = JSON.parse(localStorage.getItem('estimatedPrice'));
        this.refferalDiscount();

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
        // else {
        // }
        if (localStorage.getItem('promoHash') && localStorage.getItem('bookingHash')) {
            let promocodesArray = [];
            this.dummyArray = JSON.parse(localStorage.getItem('promoHash'));
            this.bookingHash = JSON.parse(localStorage.getItem('bookingHash'));
            for (let data in this.dummyArray) {
                if (this.dummyArray.hasOwnProperty(data)) {
                    promocodesArray.push(this.dummyArray[data].promocode);
                }
            }
            let formData = new FormData();
            if (promocodesArray.length > 0) {
                formData.append('promocodes', JSON.stringify(promocodesArray));

                this.selectPaymentService.checkMultiplePromocodes(formData).subscribe(res => {
                        if (res.statusCode == 200) {
                            for (let i = 0; i < res.data.length; i++) {
                                for (let name in this.dummyArray) {
                                    if (this.dummyArray[name].promocode == res.data[i].promocode) {
                                        this.dummyArray[name] = {
                                            usedCount: res.data[i].usedCount,
                                            maxCount: res.data[i].maxCount,
                                            perUserCount: res.data[i].perUserCount,
                                            promocode: res.data[i].promocode,
                                            usedByCount: res.data[i].usedByCount,
                                            localCount: this.dummyArray[name].localCount
                                        };
                                    }
                                }
                            }
                            this.promoHash = this.dummyArray;
                        }
                    },
                    (error) => {
                        if (error.statusCode == 401) {
                            this.store.dispatch(new authAction.AuthLogoutAction(error));
                        }
                        this.promoHash = this.dummyArray;
                        this.bookingHash = JSON.parse(localStorage.getItem('bookingHash'));
                    });
            }
            //       this.parentService.getRefferal().subscribe((res) => {
            //           debugger
            //     if (res && res.data != undefined) {
            //         this.referData = res.data;
            //         if (this.referData.type === 'FLAT') {
            //             this.referalAmount = this.referData.discount;
            //         }
            //         else if (this.referData.type === 'PERCENT') {
            //             this.referalAmount = ((this.totalProjected ? ((this.totalProjected * this.referData.discount) / 100) : 0).toFixed(2));
            //         }
            //         else {
            //             this.referalAmount = 0;
            //         }
            //         let totalValue = ((this.totalProjected ? this.totalProjected : 0) - (this.referalAmount ? this.referalAmount : 0));
            //         this.totalProjected = totalValue;

            //     }
            // },
            //     (error) => {
            //         this._spinner.hide();
            //         if (error.message != undefined) {
            //             let dialogRef = this.dialog.open(CommonErrorDialog, {
            //                 data: { message: error.message }
            //             });
            //         }
            //         if (error.statusCode == 401) {
            //             this.store.dispatch(new authAction.AuthLogoutAction(error));
            //         }
            //     });

            // this.selectPaymentService.checkMultiplePromocodes()
        }
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
        // window.scroll(0, 0);
        let fd = new FormData();
        fd.append('deviceType', 'WEB');

        this.store.dispatch({
            type: profile.actionTypes.GET_PARENT_PROFILE,
            payload: fd
        });
        // window.scroll(0, 0);
        this.date = new Date();
        this.offset = -(this.date.getTimezoneOffset());
        this.monthArray = moment.months();
        let currentYear = moment().format('YYYY');
        this.yearArray = this.getNextTenYear(+currentYear);
        this.promoModel = '';
        //subscription to store
        this.sessionStore = this.store.select('session')
            .subscribe((res: any) => {
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
        this.profileStore = this.store
            .select('profile')
            .subscribe((res: any) => {
                if (res) {
                    if (res.userData && res.userData.data && res.userData != undefined && res.userData.data != undefined) {
                        this.userCards = res.userData.data.cards;
                        if (this.userCards && this.userCards != undefined) {
                            for (let i = 0; i < this.userCards.length; i++) {
                                if (this.userCards[i].isDefault == true) {
                                    this.defaultCardId = this.userCards[i]._id;

                                }
                            }

                        }
                        if (res.userData.data.parent && res.userData.data.parent != undefined) {

                            if (res.userData.data.parent.addresses[0] && res.userData.data.parent.addresses[0] != undefined) {
                                this.parent_address = res.userData.data.parent.addresses[0];
                            }

                        }
                    }
                }
            });
        if (this.defaultCardId && this.defaultCardId != undefined) {
            localStorage.setItem('defaultCard', this.defaultCardId);
        }

        this.paymentStore = this.store.select('selectPayments')
            .subscribe((res: any) => {

                if (res.addCardSuccess) {
                    this._spinner.hide();
                    this.addCardCheck = false;
                    // window.scroll(0, 0);
                }

                if (res.deleteCardSuccess && res.deleteCardSuccess != undefined) {
                    this.userCards = res.deleteCardSuccess.cards;
                    this._spinner.hide();
                }
                if (res.defaultCardSuccess) {
                    this._spinner.hide();
                }
                if (res.updateCardSuccess && res.updateCardSuccess != undefined) {
                    this._spinner.hide();
                    this.userCards = res.updateCardSuccess.cards;
                    this.addCardCheck = false;
                }
            });

        this.sessionSubscription = this.sessionService.finalArray.debounceTime(10).subscribe((data) => {
            this.finalData = data;
            localStorage.setItem('finalData', JSON.stringify(this.finalData));
        });

        this.form = fb.group({
            'cardHolderName': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
            'cardNumber': ['', Validators.compose([Validators.required, Validators.maxLength(20), Validators.minLength(14)])],
            'expiryMonth': ['', Validators.compose([Validators.required])],
            'expiryYear': ['', Validators.compose([Validators.required])],
            'cvv': ['', Validators.compose([Validators.required, Validators.maxLength(4), Validators.minLength(3)])],
            'defaultCard': [true],
            'addressLine1': ['', Validators.compose([Validators.required])],
            'addressLine2': [''],
            'state': ['', Validators.compose([Validators.required])],
            'city': ['', Validators.compose([Validators.required])],
            'zipcode': ['', Validators.compose([Validators.required, Validators.maxLength(5), Validators.minLength(3)])],
            'defaultAddress': ['']

        });

        this.cardHolderName = this.form.controls['cardHolderName'];
        this.cardNumber = this.form.controls['cardNumber'];
        this.expiryMonth = this.form.controls['expiryMonth'];
        this.expiryYear = this.form.controls['expiryYear'];
        this.cvv = this.form.controls['cvv'];
        this.defaultCard = this.form.controls['defaultCard'];

        this.addressLine1 = this.form.controls['addressLine1'];
        this.addressLine2 = this.form.controls['addressLine2'];
        this.state = this.form.controls['state'];
        this.city = this.form.controls['city'];
        this.zipcode = this.form.controls['zipcode'];
        this.defaultAddress = this.form.controls['defaultAddress'];
    }

    updatePromoHash(promoHash, promocode, operation) {
        if (operation == 'increment') {
            promoHash[promocode.promocode] = {
                promocode: promocode.promocode,
                usedCount: promocode.usedCount,
                maxCount: promocode.maxCount,
                usedByCount: promocode.usedByCount,
                perUserCount: promocode.perUserCount,
                localCount: promoHash[promocode.promocode].localCount + 1
            };
        } else if (operation == 'decrement') {
            promoHash[promocode.promocode] = {
                promocode: promocode.promocode,
                usedCount: promocode.usedCount,
                maxCount: promocode.maxCount,
                usedByCount: promocode.usedByCount,
                perUserCount: promocode.perUserCount,
                localCount: promoHash[promocode.promocode].localCount - 1
            };
        } else if (operation == 'insert') {
            promoHash[promocode.promocode] = {
                promocode: promocode.promocode,
                usedCount: promocode.usedCount,
                maxCount: promocode.maxCount,
                usedByCount: promocode.usedByCount,
                perUserCount: promocode.perUserCount,
                localCount: 1
            };
        }
        return promoHash;
    }

    getNextTenYear(currentYear: number) {
        let yearArray = [];
        for (let i = 0; i < 10; i++) {
            yearArray.push(currentYear + i);
        }
        return yearArray;

    }

    _keyPressAlpha(event: any) {
        let theEvent = event || window.event;
        let key = theEvent.keyCode || theEvent.which;
        if (key == 24 || key == 25 || key == 26 || key == 27 || key == 8 || key == 9 || key == 46) { // Left / Up / Right / Down Arrow, Backspace, Delete keys
            key = String.fromCharCode(key);
            if (key == '.') {
                return false;
            }

            return;
        }
        key = String.fromCharCode(key);
        let regex = /[a-z ',A-Z-]|\./;
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        } else {
            let rege = /[.]|\./;
            if (rege.test(key)) {
                theEvent.returnValue = false;
                if (theEvent.preventDefault) theEvent.preventDefault();
            }
        }
    }

    _keyPressAlpha1(event: any) {

        let theEvent = event || window.event;
        let key = theEvent.keyCode || theEvent.which;
        if (key == 24 || key == 25 || key == 26 || key == 27 || key == 8 || key == 9 || key == 46) { // Left / Up / Right / Down Arrow, Backspace, Delete keys
            key = String.fromCharCode(key);
            if (key == '.' || key == ',' || key == '>' || key == '<' || key == '?' || key == '""' || key == ':' || key == ';'
                || key == '{' || key == '}' || key == '[' || key == ']' || key == '|' || key == '!' || key == '@' || key == '#'
                || key == '$' || key == '%' || key == '^' || key == '&' || key == '*' || key == '(' || key == ')' || key == '-' || key == '_'
                || key == '+' || key == '=') {
                return false;
            }

            return;
        }

        key = String.fromCharCode(key);
        let regex = /^[a-zA-Z0-9]*$/;
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        } else {
            let rege = /[.]|\./;
            if (rege.test(key)) {
                theEvent.returnValue = false;
                if (theEvent.preventDefault) theEvent.preventDefault();
            }
        }
    }

    onAddNewCardClick() {
        this.addCardCheck = true;
        this.cardHolderName.reset();
        this.cardNumber.reset();
        this.expiryMonth.reset();
        this.expiryYear.reset();
        this.cvv.reset();
    }

    refferalDiscount() {
        this.parentService.getRefferal().subscribe((res) => {
                if (res && res.data != undefined) {
                    this.referData = res.data[0];
                    if (this.referData.type === 'FLAT') {
                        this.referalAmount = this.referData.discount;
                    } else if (this.referData.type === 'PERCENT') {
                        this.referalAmount = ((this.totalProjected ? ((this.totalProjected * this.referData.discount) / 100) : 0).toFixed(2));
                    } else {
                        this.referalAmount = 0;
                    }
                    let totalValue = ((this.totalProjected ? this.totalProjected : 0) - (this.referalAmount ? this.referalAmount : 0));
                    this.totalProjected = totalValue;
                }
            },
            (error) => {
                this._spinner.hide();
                if (error.message != undefined) {
                    let dialogRef = this.dialog.open(CommonErrorDialog, {
                        data: {message: error.message}
                    });
                }
                if (error.statusCode == 401) {
                    this.store.dispatch(new authAction.AuthLogoutAction(error));
                }
            });
    }

    // formatting of card number //
    cc_format(data) {
        let v;
        let value = data.value;
        if (value) {
            v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');

            let matches = v.match(/\d{4,15}/g);
            let match = matches && matches[0] || '';

            let parts = [];
            for (let i = 0, len = match.length; i < len; i += 4) {
                parts.push(match.substring(i, i + 4));
            }
            if (parts.length) {
                this.cardNumber.setValue(parts.join(' '));
                return parts.join(' ');
            } else {
                return value;
            }
        }
    }

    _keyPressAlphaNumber(event: any) {
        const pattern = /^[0-9 ]*$/;
        let inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar) && event.charCode != 0) {
            event.preventDefault();
        }
    }

    // submit for add card
    onSubmit(value, e) {
        this.userCards = [];
        if (!this.cardEditcheck) {
            let key;
            for (key in value) {
                if ((value[key] === '' || value[key] === null) && key !== 'addressLine2') {
                    if (key === 'addressLine1' || key === 'city' || key === 'state' || key === 'zipcode')
                        window.scroll(0, 600);
                    else {
                        let el = $('#moveUp');
                        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
                            el.focus();
                        });
                    }
                    // return
                }
            }
        }
        e.preventDefault();
        this.submitted = true;
        if (this.cardEditcheck) {
            let el = $('#moveUp');
            $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
                el.focus();
            });
            value.cardId = this.cardIdToBeSent;
            value.expiryMonth = this.monthArray.indexOf(value.expiryMonth) + 1;
            this.store.dispatch({
                type: selectPayments.actionTypes.SELECT_UPDATE_CARD,
                payload: value

            });

        } else {
            if (this.form.valid) {
                this._spinner.show();
                let expiryMonth = this.monthArray.indexOf(value.expiryMonth) + 1;
                let expiryYear = value.expiryYear;
                let stripedata = {
                    number: value.cardNumber,
                    exp_month: expiryMonth,
                    exp_year: expiryYear,
                    cvc: value.cvv,
                    name: value.cardHolderName,
                    address_line1: value.addressLine1,
                    address_line2: '',
                    address_city: value.city,
                    address_state: value.state,
                    address_zip: value.zipcode

                };
                if (value.addressLine2) {
                    stripedata.address_line2 = value.addressLine2;
                }

                (<any>window).Stripe.card.createToken(stripedata, (status: number, response: any) => {

                    this.ngZone.runOutsideAngular(() => {
                        if (status === 200) {
                            // window.scroll(0,0);
                            let el = $('#moveUp');
                            $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
                                el.focus();
                            });
                            //this._spinner.hide();
                            let fd = new FormData();
                            fd.append('stripeToken', response.id);
                            fd.append('isDefault', value.defaultCard);
                            this.showEmptyError = false;
                            // this._spinner.show();
                            this.store.dispatch({
                                type: selectPayments.actionTypes.SELECT_ADD_CARD,
                                payload: fd
                            });
                            // this._spinner.hide();
                            // this.cardHolderName.reset();
                            // this.cardNumber.reset();
                            // this.expiryMonth.reset();
                            // this.expiryYear.reset();
                            // this.cvv.reset();
                        } else {
                            this._spinner.hide();
                            this.errorMessageCard = response.error.message;
                            let el = $('#moveUp');
                            $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
                                el.focus();
                            });
                            this.changeRef.detectChanges();
                        }
                    });
                });
            } else {
                this._spinner.hide();

            }
            // this._spinner.hide();

        }

    }

    /* Wallet functions starts from here */
    onDeleteCard(id) {
        this.userCards = [];
        this._spinner.show();
        this.store.dispatch({
            type: selectPayments.actionTypes.SELECT_DELETE_CARD,
            payload: id

        });

    }

    //Set default card
    onRadioClick(data) {
        this.defaultCardId = data;
        // this.store.dispatch({
        //     type: selectPayments.actionTypes.SELECT_DEFAULT_CARD,
        //     payload: this.defaultCardId

        // });
    }

    completeBooking() {

        if (this.userCards.length === 0) {
            this.showEmptyError = true;
            let el = $('.ng-invalid:not(form):first');
            $('html,body').animate({scrollTop: (el.offset().top - 200)}, 'slow', () => {
                el.focus();
            });
            return;
        }

        let fd = new FormData();
        if (this.defaultCardId && this.defaultCardId != undefined) {
            fd.append('cardId', this.defaultCardId);
        }
        fd.append('amount', this.totalProjected);
        if (this.promocodeValueName) {
            fd.append('promocode', this.promocodeValueName);
            fd.append('promoDiscount', this.discount);

        }

        fd.append('action', 'ACCEPT');
        this.completeBookingData = {
            FormData: fd,
            bookingId: localStorage.getItem('bookingId')
        };
        this.store.dispatch({
            type: sessionsDetails.actionTypes.ACCEPT_TUTOR_BOOKING,
            payload: this.completeBookingData
        });

    }

    // saveDefault() {
    //     this._spinner.show();
    //     this.store.dispatch({
    //         type: selectPayments.actionTypes.SELECT_DEFAULT_CARD,
    //         payload: this.defaultCardId

    //     });
    // }
    goBackToDetails() {
        this.router.navigate(['/pages/all-sessions/session-details']);
    }

    onEditCard(data) {
        this.addCardCheck = true;
        this.cardEditcheck = true;
        this.cardHolderName.setValue(data.name ? data.name : '');
        // this.cardHolderName.setValue('test');
        this.cardNumber.setValue('XXXX XXXX XXXX' + data.last4Digits);
        this.expiryMonth.setValue(this.monthArray[data.expMonth - 1]);
        this.expiryYear.setValue(+data.expYear);
        this.cvv.setValue('...');
        this.defaultCard.setValue(data.isDefault);

        this.addressLine1.setValue(data.addressLine1);
        this.addressLine2.setValue(data.addressLine2);
        this.state.setValue(data.state);
        this.city.setValue(data.city);
        this.zipcode.setValue(data.zipCode);
        // this.defaultAddress
        this.cardIdToBeSent = data._id;

    }

    applyPromoCode(promoValue) {
        this.promocodeCheck = promoValue;

        if (this.promocodeCheck != undefined && this.promocodeCheck != '') {
            localStorage.setItem('promoStopScrolling', 'true');

            localStorage.setItem('promoVal', this.promocodeCheck);
            let payload = {
                promoCode: this.promocodeCheck,
                marketId: 'wdswgdg'
            };
            this._spinner.show();
            let totalMoney = this.totalProjected;
            this.discount = 0;

            // this.store.dispatch({
            //     type: selectPayments.actionTypes.APPLY_PROMOCODE,
            //     payload: { promoCode: this.promocodeCheck, marketId: 'wdswgdg' }

            // });
            this.selectPaymentService.applyPromoCode(payload).subscribe(res => {

                if (res != undefined && res.statusCode == 200) {
                    this.totalProjected = this.fixedPrice;

                    let dialogRef = this.dialog.open(CommonErrorDialog, {
                        data: {message: res.message}
                    });
                    this._spinner.hide();
                    this.promoValid = res.data.promocode;
                    localStorage.setItem('PROMOCODE', this.promoValid);
                    this.promoModel = this.promoValid;
                    this.promoCodevalue = res.data ? res.data.credits : 0;
                    this.promocodeValueName = res.data ? res.data.promocode : '';
                    this.promoCodevalue_type = res.data ? res.data.type : 'FLAT';
                    if (this.promoCodevalue && this.promoCodevalue != undefined && this.promoValid != undefined) {
                        localStorage.setItem('PROMOCODE_TYPE', this.promoCodevalue_type);
                        localStorage.setItem('PROMOCODE_VALUE', this.promoCodevalue);
                    }
                    let bookingNumber = this.sessionService.getpromoIndex();
                    this.promocodeData = res.data;
                    this.totalValue = ((this.totalProjected ? this.totalProjected : 0) - (this.referalAmount ? this.referalAmount : 0));
                    this.beforeDiscount = this.totalValue;

                    //tutor booking rate adjustments
                    if (this.promoCodevalue_type === 'FLAT') {
                        if (this.totalValue < this.promoCodevalue) {
                            this.discount = this.beforeDiscount;
                        } else {
                            this.discount = this.promoCodevalue ? this.promoCodevalue : 0;
                        }
                        this.totalValue = ((this.fixedPrice ? (this.fixedPrice - this.promoCodevalue) : 0) - (this.referalAmount ? this.referalAmount : 0));
                        this.totalProjected = this.totalValue;

                    } else if (this.promoCodevalue_type === 'PERCENT') {
                        let disc = (this.totalProjected ? (this.totalProjected * this.promoCodevalue) / 100 : 0);
                        if (this.totalValue < disc) {
                            this.discount = this.beforeDiscount;
                        } else {
                            this.discount = (this.beforeDiscount ? (this.beforeDiscount * this.promoCodevalue) / 100 : 0);
                        }
                        this.totalValue = ((this.totalProjected ? (this.totalProjected - this.discount) : 0) - ((this.referalAmount != undefined) ? this.referalAmount : 0));
                        this.totalProjected = this.totalValue;
                    } else {
                        this.discount = 0;
                        this.totalValue = ((this.totalProjected ? this.totalProjected : 0) - (this.referalAmount ? this.referalAmount : 0));
                        this.totalProjected = this.totalValue;
                    }

                } else {
                    if (localStorage.getItem('PROMOCODE_TYPE') && localStorage.getItem('PROMOCODE_TYPE') != undefined && localStorage.getItem('PROMOCODE') && localStorage.getItem('PROMOCODE') != undefined && localStorage.getItem('PROMOCODE_VALUE') && localStorage.getItem('PROMOCODE_VALUE') != undefined) {
                        this.promoCodevalue = localStorage.getItem('PROMOCODE_VALUE');
                        this.promoCodevalue_type = localStorage.getItem('PROMOCODE_TYPE');
                        this.promoValid = localStorage.getItem('PROMOCODE');
                        this.promoModel = this.promoValid;
                    }
                }

            }, (error) => {
                this.totalProjected = this.fixedPrice - (this.referalAmount ? this.referalAmount : 0);
                this._spinner.hide();

                if (error.statusCode == 401) {
                    this.store.dispatch(new authAction.AuthLogoutAction(error));
                }
                this.promocode = undefined;

                if (error.message != undefined) {
                    let dialogRef = this.dialog.open(CommonErrorDialog, {
                        data: {message: error.message}
                    });
                }

            });
        }

    }

    cancelAdding() {
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
        this._spinner.show();
        this.cardHolderName.reset();
        this.cardNumber.reset();
        this.expiryMonth.reset();
        this.expiryYear.reset();
        this.cvv.reset();
        this.addCardCheck = false;
        let fd = new FormData();
        fd.append('deviceType', 'WEB');
        this.store.dispatch({
            type: profile.actionTypes.GET_PARENT_PROFILE,
            payload: fd
        });
        setTimeout(() => {
            this._spinner.hide();
        }, 1000);
    }

    setBaseAddress(event) {
        if (event.checked) {
            this.showDefaultAddress();
        } else {
            this.addressLine1.reset();
            this.addressLine2.reset();
            this.state.reset();
            this.city.reset();
            this.zipcode.reset();

        }
    }

    showDefaultAddress() {
        if (this.parent_address && this.parent_address != undefined) {
            this.addressLine1.setValue(this.parent_address.addressLine1 ? this.parent_address.addressLine1 : '');
            this.addressLine2.setValue(this.parent_address.addressLine2 ? this.parent_address.addressLine2 : '');
            this.state.setValue(this.parent_address.state ? this.parent_address.state : '');
            this.city.setValue(this.parent_address.city ? this.parent_address.city : '');
            this.zipcode.setValue(this.parent_address.zipCode ? this.parent_address.zipCode : '');
        } else {
            this.addressLine1.reset();
            this.addressLine2.reset();
            this.state.reset();
            this.city.reset();
            this.zipcode.reset();
        }

    }

    ngOnDestroy() {
        if (this.paymentStore && this.paymentStore != undefined) {
            this.paymentStore.unsubscribe();
        }
        if (this.profileStore && this.profileStore != undefined) {
            this.profileStore.unsubscribe();
        }
        this.store.dispatch({
            type: selectPayments.actionTypes.DESTROY_VALUES,
        });

        if (localStorage.getItem('PROMOCODE') && localStorage.getItem('PROMOCODE') != undefined && localStorage.getItem('PROMOCODE_TYPE') && localStorage.getItem('PROMOCODE_TYPE') != undefined && localStorage.getItem('PROMOCODE_VALUE') && localStorage.getItem('PROMOCODE_VALUE') != undefined) {
            // localStorage.removeItem('bookingDetails');
            localStorage.removeItem('PROMOCODE_TYPE');
            localStorage.removeItem('PROMOCODE_VALUE');
            localStorage.removeItem('PROMOCODE');
        }

        if (localStorage.getItem('refferAmount')) {
            localStorage.removeItem('refferAmount');
        }
    }
}
