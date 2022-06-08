import { actionTypes } from './../state/select-payments.actions';
import { BaThemeSpinner } from './../../../../../theme/services/baThemeSpinner/baThemeSpinner.service';
import { Subscription } from 'rxjs/Rx';
import { Component, VERSION, Renderer, ApplicationRef, NgZone, ChangeDetectorRef, AfterContentChecked, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
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
import { ModalOptions } from 'ngx-bootstrap/modal';

@Component({
    selector: 'select-payments',
    templateUrl: './select-payments.html',
})

export class SelectPaymentsComponent {
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
    @ViewChild('closePop') public _fileUpload: ElementRef;
    public mask = [/[0-9]/, /\d/, /\d/, /\d/, ' ', /[0-9]/, /\d/, /\d/, /\d/, ' ', /[0-9]/, /\d/, /\d/, /\d/, ' ', /[0-9]/, /\d/, /\d/, /\d/];
    public expiryMask = [/[0-9]/, /\d/, '/', /[0-9]/, /\d/];
    private lastInserted: number[] = [];
    web: boolean;
    addcard: boolean;
    storeModal: any;
    hidePromo: boolean;

    constructor(private fb: FormBuilder,
                private store: Store<any>,
                private activeModal: NgbActiveModal,
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
                private sessionService: BookSessionService,
    ) {
        if (localStorage.getItem('hasPartnerCode') == 'true') {
            this.hidePromo = true;
        } else {
            this.hidePromo = false;
        }
        if (screen.width >= 1023) {
            this.web = true;
        } else {
            this.web = false;

        }
        this.sessionService.getPromoData();

        let keep = this.sessionService.getTrackPageRefresh();
        if (keep == undefined) {
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
            if (localStorage.getItem('promoHash')) {
                localStorage.removeItem('promoHash');
            }
            if (localStorage.getItem('bookingHash')) {
                localStorage.removeItem('bookingHash');
            }
            if (localStorage.getItem('steponeData')) {
                localStorage.removeItem('steponeData');
            }
            if (localStorage.getItem('slotSelected')) {
                localStorage.removeItem('slotSelected');
            }
            this.router.navigate(['/home/browse-tutor']);
        } else {
            this.refferalDiscount();
        }
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
        // if (this.userCards && this.userCards != undefined) {
        //     for (let i = 0; i < this.userCards.length; i++) {
        //         if (this.userCards[i].isDefault == true) {
        //             this.defaultCardId = this.userCards[i]._id;
        //             if(this.defaultCardId && this.defaultCardId !=undefined){
        //                 localStorage.setItem("defaultCard",this.defaultCardId);
        //             }
        //         }
        //     }

        // }

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

    updatePromoHashCheck(promoHash, promocode) {
        return (((promoHash[promocode.promocode]['usedCount'] + promoHash[promocode.promocode]['localCount']) < promoHash[promocode.promocode]['maxCount']) &&
            (promoHash[promocode.promocode]['usedByCount'] + promoHash[promocode.promocode]['localCount']) < promoHash[promocode.promocode]['perUserCount']) ? true : false;
    }

    updateCache(promoHash, promoToBeApplied, bookingNumber, bookingHash) {
        if (promoHash[promoToBeApplied.promocode]) {
            if (bookingHash[bookingNumber] && bookingHash[bookingNumber] == promoToBeApplied.promocode) {
                // Applied successfully with no change in local cache
                let dialogRef = this.dialog.open(CommonErrorDialog, {
                    data: {message: 'Promocode applied successfully'}
                });
            } else if (bookingHash[bookingNumber] && bookingHash[bookingNumber] !== promoToBeApplied.promocode) {
                // if promocode key exists in promoHash
                if (!this.updatePromoHashCheck(promoHash, promoToBeApplied)) {
                    // Error in applying promocode
                    this.promoCodeName = this.promocodeData.promocode;
                    this.promoIndex = bookingNumber;
                    for (let i = 0; i < this.finalData.length; i++) {
                        if (i == bookingNumber) {
                            this.finalData[i]['finalPrice'] = '';
                            this.finalData[i]['discount'] = '';
                            this.finalData[i]['promocode'] = '';
                            this.finalData[i]['isPromoValid'] = 0;
                        }
                    }
                    // let dialogRef = this.dialog.open(CheckTutorDialog, {
                    //     data: { message: "This promo code has expired" }
                    // });
                    let dialogRef = this.dialog.open(CommonErrorDialog, {
                        data: {message: 'Oops! The Promo Code you entered has expired or has been used the maximum amount of times.'}
                    });
                    this.sessionService.setPromoData(this.finalData);
                } else {
                    this.updatePromoHash(promoHash, promoHash[bookingHash[bookingNumber]], 'decrement');
                    this.updatePromoHash(promoHash, promoToBeApplied, 'increment');
                    this.bookingHash[bookingNumber] = promoToBeApplied.promocode;
                    localStorage.setItem('bookingHash', JSON.stringify(this.bookingHash));
                    let dialogRef = this.dialog.open(CommonErrorDialog, {
                        data: {message: 'Promocode applied successfully'}
                    });
                }
            } else {
                // if promocode key exists in promoHash
                if (!this.updatePromoHashCheck(promoHash, promoToBeApplied)) {
                    // Error in applying promocode
                    this.promoCodeName = this.promocodeData.promocode;
                    this.promoIndex = bookingNumber;
                    for (let i = 0; i < this.finalData.length; i++) {
                        if (i == bookingNumber) {
                            this.finalData[i]['finalPrice'] = '';
                            this.finalData[i]['discount'] = '';
                            this.finalData[i]['promocode'] = '';
                            this.finalData[i]['isPromoValid'] = 0;
                        }
                    }
                    // let dialogRef = this.dialog.open(CheckTutorDialog, {
                    //     data: { message: "This promo code has expired" }
                    // });
                    let dialogRef = this.dialog.open(CommonErrorDialog, {
                        data: {message: 'Oops! The Promo Code you entered has expired or has been used the maximum amount of times.'}
                    });
                    this.sessionService.setPromoData(this.finalData);
                } else {
                    this.updatePromoHash(promoHash, promoToBeApplied, 'increment');
                    this.bookingHash[bookingNumber] = promoToBeApplied.promocode;
                    localStorage.setItem('bookingHash', JSON.stringify(this.bookingHash));
                    let dialogRef = this.dialog.open(CommonErrorDialog, {
                        data: {message: 'Promocode applied successfully'}
                    });
                }
            }
        } else {
            // new promocode key for promoHash
            if (bookingHash[bookingNumber]) {
                this.updatePromoHash(promoHash, promoHash[bookingHash[bookingNumber]], 'decrement');
            }

            this.updatePromoHash(promoHash, promoToBeApplied, 'insert');
            this.bookingHash[bookingNumber] = promoToBeApplied.promocode;
            localStorage.setItem('bookingHash', JSON.stringify(this.bookingHash));
            let dialogRef = this.dialog.open(CommonErrorDialog, {
                data: {message: 'Promocode applied successfully'}
            });

        }
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
        this.addcard = true;
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
                    this.referData = res.data;
                    if (this.finalData) {
                        for (let i = 0; i < this.finalData.length; i++) {
                            for (let j = 0; j < this.referData.length; j++) {
                                if (i == j) {
                                    if (this.referData[j].type === 'FLAT') {
                                        this.referalAmount = this.referData[j].discount;
                                    } else if (this.referData[j].type === 'PERCENT') {
                                        this.referalAmount = ((this.finalData ? ((this.finalData[i]['total_amount'] * this.referData[j].discount) / 100) : 0).toFixed(2));
                                    } else {
                                        this.referalAmount = 0;
                                    }
                                    let totalValue = ((this.finalData ? this.finalData[i]['total_amount'] : 0) - (this.referalAmount ? this.referalAmount : 0));
                                    this.finalData[i]['total_amount'] = totalValue;
                                    this.finalData[i]['refferal'] = this.referalAmount;
                                }
                            }
                        }
                    }

                    this.sessionService.setPromoData(this.finalData);
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

    setPromoCode(index) {
        this.promocodeCheck = '';
        // let index = this.sessionService.getpromoIndex();
        // debugger;
        if (this.finalData && this.finalData != undefined) {
            if (this.promoCodevalue != undefined && this.promoCodevalue_type != undefined) {

                if (this.promoCodevalue_type === 'FLAT') {

                    for (let i = 0; i < this.finalData.length; i++) {
                        if (i == index) {
                            if (this.finalData[i].total_amount < this.promoCodevalue) {
                                this.discount = this.finalData[i]['total_amount'];
                            } else {
                                this.discount = this.promoCodevalue ? this.promoCodevalue : 0;
                            }
                            let totalValue = (this.finalData[i]['total_amount'] - this.promoCodevalue);

                            this.finalData[i]['finalPrice'] = totalValue;
                            this.finalData[i]['discount'] = this.discount;
                            this.finalData[i]['promocode'] = this.promocodeValueName;
                            this.finalData[i]['isPromoValid'] = 1;
                        }
                    }
                    this.sessionService.setPromoData(this.finalData);
                } else if (this.promoCodevalue_type === 'PERCENT') {
                    for (let i = 0; i < this.finalData.length; i++) {
                        if (i == index) {
                            let disc = (this.finalData ? (this.finalData[i]['total_amount'] * this.promoCodevalue) / 100 : 0);
                            this.discount = disc;
                            disc = Math.round(disc * 100) / 100;

                            let totalValue = (this.finalData[i]['total_amount'] - this.discount);

                            this.finalData[i]['finalPrice'] = totalValue;
                            this.finalData[i]['discount'] = this.discount;
                            this.finalData[i]['promocode'] = this.promocodeValueName;
                            this.finalData[i]['isPromoValid'] = 1;
                        }

                    }

                    this.sessionService.setPromoData(this.finalData);
                } else {
                    this.discount = 0;

                    for (let i = 0; i < this.finalData.length; i++) {
                        if (i == index) {
                            let totalValue = (this.finalData[i]['total_amount']);
                            this.finalData[i]['finalPrice'] = totalValue;
                            this.finalData[i]['discount'] = this.discount;
                            this.finalData[i]['promocode'] = this.promocodeValueName;
                            this.finalData[i]['isPromoValid'] = 1;
                        }
                    }

                    this.sessionService.setPromoData(this.finalData);
                }

            }

        } else if (localStorage.getItem('finalData') && localStorage.getItem('finalData') != undefined) {
            let promoData = JSON.parse(localStorage.getItem('finalData'));
            let index1 = this.sessionService.getpromoIndex();
            if (this.promoCodevalue != undefined && this.promoCodevalue_type != undefined) {

                if (this.promoCodevalue_type === 'FLAT') {
                    for (let i = 0; i < promoData.length; i++) {
                        if (i == index1) {
                            let totalValue = (promoData[i]['total_amount'] - this.promoCodevalue);
                            if (totalValue < this.promoCodevalue) {
                                this.discount = promoData[i]['total_amount'];
                            } else {
                                this.discount = this.promoCodevalue ? this.promoCodevalue : 0;
                            }
                            promoData[i]['finalPrice'] = totalValue;
                            promoData[i]['discount'] = this.discount;
                            promoData[i]['promocode'] = this.promocodeValueName;
                            promoData[i]['isPromoValid'] = 1;
                        }

                    }

                    this.sessionService.setPromoData(promoData);
                } else if (this.promoCodevalue_type === 'PERCENT') {

                    for (let i = 0; i < promoData.length; i++) {

                        if (i == index1) {
                            let disc = (promoData ? (promoData[i]['total_amount'] * this.promoCodevalue) / 100 : 0);
                            let totalValue = (promoData[i]['total_amount'] - this.discount);
                            if (totalValue < disc) {
                                this.discount = promoData[i]['total_amount'];
                            } else {
                                this.discount = (promoData[i] ? (promoData[i]['total_amount'] * this.promoCodevalue) / 100 : 0);
                            }
                            promoData[i]['finalPrice'] = totalValue;
                            promoData[i]['discount'] = this.discount;
                            promoData[i]['promocode'] = this.promocodeValueName;
                            promoData[i]['isPromoValid'] = 1;
                        }

                    }

                    this.sessionService.setPromoData(promoData);

                } else {
                    this.discount = 0;

                    for (let i = 0; i < promoData.length; i++) {
                        if (i == index1) {
                            let totalValue = (promoData[i]['total_amount']);
                            promoData[i]['finalPrice'] = totalValue;
                            promoData[i]['discount'] = this.discount;
                            promoData[i]['promocode'] = this.promocodeValueName;
                            promoData[i]['isPromoValid'] = 1;
                        }

                    }

                    this.sessionService.setPromoData(promoData);
                }

            }
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
        } else {
            if (localStorage.getItem('defaultCard') && localStorage.getItem('defaultCard') != undefined) {
                this.defaultCardId = localStorage.getItem('defaultCard');
                fd.append('cardId', this.defaultCardId);
            }
        }
        if (localStorage.getItem('tutor_Id') && localStorage.getItem('tutor_Id') != undefined) {
            let tutor_id = localStorage.getItem('tutor_Id');
            fd.append('tutorId', tutor_id);
        }

        if (this.bookingData && this.bookingData != undefined) {
            if (this.bookingData.steponeData && this.bookingData.steponeData != undefined) {
                fd.append('studentId', this.bookingData.steponeData.child ? this.bookingData.steponeData.child._id : '');

                if (this.bookingData.steponeData.subjectControl && this.bookingData.steponeData.subjectControl != undefined && this.bookingData.steponeData.subjectControl.length > 0) {
                    let subjects = [];
                    for (let i = 0; i < this.bookingData.steponeData.subjectControl.length; i++) {
                        subjects.push(this.bookingData.steponeData.subjectControl[i].categoryId);
                    }
                    fd.append('subjects', JSON.stringify(subjects));
                }
                if (this.bookingData.steponeData.subjectControl && this.bookingData.steponeData.subjectControl != undefined && this.bookingData.steponeData.subjectControl.length > 0) {
                    let sub_subjects = [];
                    for (let i = 0; i < this.bookingData.steponeData.subjectControl.length; i++) {
                        sub_subjects.push(this.bookingData.steponeData.subjectControl[i].subCategoryId);
                    }
                    fd.append('subSubjects', JSON.stringify(sub_subjects));
                }
                if (this.bookingData.steponeData.address && this.bookingData.steponeData.address != undefined) {

                    fd.append('locationDetails', JSON.stringify(this.bookingData.steponeData.address));
                }
                if (this.bookingData.steponeData.duration && this.bookingData.steponeData.duration != undefined) {

                    fd.append('duration', this.bookingData.steponeData.duration);
                }
                if (this.bookingData.steponeData.childInfo && this.bookingData.steponeData.childInfo != undefined) {

                    fd.append('additionalNotes', this.bookingData.steponeData.childInfo);
                }
                fd.append('isSessionOnline', this.bookingData.steponeData.isSessionOnline == 'true' ? 'true' : 'false');
                fd.append('isFlexibleOnSessionLocation', (this.bookingData.steponeData.checkFlexibility || false));
            }

            if (localStorage.getItem('totalSessions') && localStorage.getItem('totalSessions') != undefined) {
                let totalSessions = JSON.parse(localStorage.getItem('totalSessions'));
                fd.append('totalSessions', totalSessions);
            }

            if (this.finalData && this.finalData != undefined) {
                let sessionsData = [];
                let data: any;
                for (let i = 0; i < this.finalData.length; i++) {
                    let time = this.finalData[i].time.split('-');
                    let date = moment(this.finalData[i].date, 'MMM D YYYY').format('MMMM D, YYYY');
                    let start_time = moment(time[0], 'hh:mmA').format('HH:mm:ss');
                    let end_time = moment(time[1], 'hh:mmA').format('HH:mm:ss');
                    let startDateTime = new Date(date + ' ' + start_time);
                    let endDateTime = new Date(date + ' ' + end_time);
                    data = {
                        startTime: (startDateTime).toUTCString(),
                        endTime: (endDateTime).toUTCString(),
                        slots: this.finalData[i].slots
                    };
                    if (this.finalData[i].isPromoValid == 1) {
                        if (this.finalData[i].finalPrice > 0) {
                            data.amount = this.finalData[i].finalPrice;
                        } else {
                            data.amount = 0;
                        }
                    } else {
                        if (this.finalData[i].total_amount > 0) {
                            data.amount = this.finalData[i].total_amount;
                        } else {
                            data.amount = 0;
                        }
                    }

                    if (this.finalData[i].isPromoValid == 1) {
                        if (this.finalData[i].promocode && this.finalData[i].promocode != undefined) {
                            data.promocode = this.finalData[i].promocode;
                        }
                    }

                    if (this.finalData[i].promoDiscount && this.finalData[i].promoDiscount != undefined) {
                        data.promoDiscount = this.finalData[i].discount;
                    }
                    sessionsData.push(data);
                }
                fd.append('sessions', JSON.stringify(sessionsData));
            } else {
                if (localStorage.getItem('finalData')) {
                    let data = JSON.parse(localStorage.getItem('finalData'));
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
                            slots: data[i].slots
                        };
                        if (data[i].isPromoValid == 1) {
                            temp.amount = data[i].finalPrice;
                        } else {
                            temp.amount = data[i].total_amount;
                        }
                        if (data[i].isPromoValid == 1) {
                            if (data[i].promocode && data[i].promocode != undefined) {
                                temp.promocode = data[i].promocode;
                            }
                        }

                        if (data[i].promoDiscount && data[i].promoDiscount != undefined) {
                            temp.promoDiscount = data[i].discount;
                        }
                        sessionsData.push(temp);
                    }
                    fd.append('sessions', JSON.stringify(sessionsData));
                }
            }

            if (localStorage.getItem('userData'))
                fd.append('userSource', localStorage.getItem('userData'));
        }

        this.store.dispatch({
            type: session.actionTypes.COMPLETE_BOOKING,
            payload: fd
        });
    }

    // saveDefault() {
    //     this._spinner.show();
    //     this.store.dispatch({
    //         type: selectPayments.actionTypes.SELECT_DEFAULT_CARD,
    //         payload: this.defaultCardId

    //     });
    // }
    goBackToStepper() {
        this.sessionService.updateStepperIndex(2);
        this.router.navigate(['/pages/book-session/session']).then(() => {
            let lines = document.getElementsByClassName('mat-stepper-horizontal-line');
            setTimeout(() => {
                lines[0].className = 'blue-line mat-stepper-horizontal-line';
                lines[1].className = 'blue-line mat-stepper-horizontal-line';

            }, 500);
            this.sessionService.changeStep.next(2);
            ga('send', {
                hitType: 'event',
                eventCategory: 'Book a Session',
                eventAction: 'Book a Session Step 4 Payment',
                eventLabel: 'Book a Session Step 4 Back'
            });
        });
        // this.complete1 = false;
        // this.edit1 = true;
        // window.scroll(0, 0);
        // setTimeout(() => {
        //     this.stepper.selectedIndex = 0;

        // }, 1);

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

    applyPromoCode(promoValue, i) {
        this.sessionService.setPromoIndex(i);
        this.promocodeCheck = promoValue;
        if (this.promocodeCheck != undefined && this.promocodeCheck != '') {
            if (document.getElementById('closePop')) {
                document.getElementById('closePop').click();
            }
            localStorage.setItem('promoStopScrolling', 'true');

            localStorage.setItem('promoVal', this.promocodeCheck);
            let payload = {
                promoCode: this.promocodeCheck,
                marketId: 'wdswgdg'
            };
            this._spinner.show();
            // this.store.dispatch({
            //     type: selectPayments.actionTypes.APPLY_PROMOCODE,
            //     payload: { promoCode: this.promocodeCheck, marketId: 'wdswgdg' }

            // });
            this.selectPaymentService.applyPromoCode(payload).subscribe(res => {
                if (res != undefined && res.statusCode == 200) {
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
                    this.setPromoCode(i);
                    let bookingNumber = this.sessionService.getpromoIndex();
                    this.promocodeData = res.data;
                    this.updateCache(this.promoHash, this.promocodeData, bookingNumber, this.bookingHash);
                    localStorage.setItem('promoHash', JSON.stringify(this.promoHash));
                } else {
                    if (localStorage.getItem('PROMOCODE_TYPE') && localStorage.getItem('PROMOCODE_TYPE') != undefined && localStorage.getItem('PROMOCODE') && localStorage.getItem('PROMOCODE') != undefined && localStorage.getItem('PROMOCODE_VALUE') && localStorage.getItem('PROMOCODE_VALUE') != undefined) {
                        this.promoCodevalue = localStorage.getItem('PROMOCODE_VALUE');
                        this.promoCodevalue_type = localStorage.getItem('PROMOCODE_TYPE');
                        this.promoValid = localStorage.getItem('PROMOCODE');
                        this.promoModel = this.promoValid;
                    }
                }

            }, (error) => {
                this._spinner.hide();
                if (this.bookingHash) {
                    for (let name in this.bookingHash) {
                        if (i == name) {
                            for (let key in this.promoHash) {
                                if (this.bookingHash[name] == this.promoHash[key].promocode) {
                                    this.promoHash[key] = {
                                        usedCount: this.promoHash[key].usedCount,
                                        maxCount: this.promoHash[key].maxCount,
                                        perUserCount: this.promoHash[key].perUserCount,
                                        promocode: this.promoHash[key].promocode,
                                        usedByCount: this.promoHash[key].usedByCount,
                                        localCount: this.promoHash[key].localCount - 1
                                    };
                                }
                            }
                            delete this.bookingHash[name];
                        }
                    }
                    localStorage.setItem('bookingHash', JSON.stringify(this.bookingHash));
                    localStorage.setItem('promoHash', JSON.stringify(this.promoHash));
                }

                if (error.statusCode == 401) {
                    this.store.dispatch(new authAction.AuthLogoutAction(error));
                }
                let index = this.sessionService.getpromoIndex();
                if (localStorage.getItem('PROMOCODE') != undefined) {
                    localStorage.removeItem('PROMOCODE');
                }
                if (error.message != undefined) {
                    let dialogRef = this.dialog.open(CommonErrorDialog, {
                        data: {message: error.message}
                    });
                }
                for (let j = 0; j < this.finalData.length; j++) {
                    if (j == index) {
                        this.finalData[j]['finalPrice'] = '';
                        this.finalData[j]['discount'] = '';
                        this.finalData[j]['promocode'] = '';
                        this.finalData[j]['isPromoValid'] = 0;
                    }
                }

            });
        }

    }

    deletePromo(i) {
        this.finalData[i]['finalPrice'] = '';
        this.finalData[i]['discount'] = '';
        this.finalData[i]['promocode'] = '';
        this.finalData[i]['isPromoValid'] = 0;
        // setTimeout(() => {
        //     if (this.bookingHash) {
        //         for (let name in this.bookingHash) {
        //             if (i == name) {
        //                 for (let key in this.promoHash) {
        //                     if (this.bookingHash[name] == this.promoHash[key].promocode) {
        //                         this.promoHash[key] = {
        //                             usedCount: this.promoHash[key].usedCount,
        //                             maxCount: this.promoHash[key].maxCount,
        //                             perUserCount: this.promoHash[key].perUserCount,
        //                             promocode: this.promoHash[key].promocode,
        //                             usedByCount: this.promoHash[key].usedByCount,
        //                             localCount: this.promoHash[key].localCount - 1
        //                         }
        //                     }
        //                 }
        //                 delete this.bookingHash[name];
        //             }
        //         }
        //         localStorage.setItem("bookingHash", JSON.stringify(this.bookingHash));
        //         localStorage.setItem("promoHash", JSON.stringify(this.promoHash));
        //     }
        //     let index = this.sessionService.getpromoIndex();
        //     if (localStorage.getItem('PROMOCODE') != undefined) {
        //         localStorage.removeItem('PROMOCODE')
        //     }

        //     for (let j = 0; j < this.finalData.length; j++) {
        //         if (j == index) {
        //             this.finalData[j]['finalPrice'] = '';
        //             this.finalData[j]['discount'] = '';
        //             this.finalData[j]['promocode'] = '';
        //             this.finalData[j]['isPromoValid'] = 0;
        //         }
        //     }
        // }, 500);

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

    open2(content2) {
        this.storeModal = content2;
        const config: ModalOptions = {
            backdrop: 'static',
            keyboard: false,
            animated: true,
            // ignoreBackdropClick: true,

        };
        const modalRef = this.modalService.open(content2, config);
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
