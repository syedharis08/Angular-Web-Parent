import { BaThemeSpinner } from './../../../theme/services/baThemeSpinner/baThemeSpinner.service';
import { Subscription } from 'rxjs/Rx';
import {
    Component, VERSION, Renderer, ApplicationRef, NgZone,
    ChangeDetectorRef, AfterViewInit
} from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrConfig } from 'ngx-toastr';
import { NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';

const types = ['success', 'error', 'info', 'warning'];
import * as Payments from '../state';
import * as  profile from '../../profile/state';
import { AllSessionService } from '../../../services/all-sessions-service/all-sessions.service';
import * as sessionsDetails from '../../all-sessions/state/all-sessions.actions';

@Component({
    selector: 'payments',
    templateUrl: './payments.html',
    styleUrls: ['./payments.scss']
})

export class PaymentsComponent implements AfterViewInit {
    setCard: any;
    cardEditcheck: boolean;
    userCards: any;
    profileStore: Subscription;
    thisLongitude: any;
    thisLatitude: any;
    paymentStore: Subscription;
    sessionStore: Subscription;
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
    bookingError: any;
    selectCardError: boolean = false;
    address: any;
    defaultCardId: any;
    cardIdToBeSent: any;
    promoId: any;
    userLastName: any;
    userFirstname: any;
    userImage: any;
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
    selectedCard: any;
    promocode: AbstractControl;
    serviceIdSelected: any = [];
    categoryArray: any;
    cardListLength: any;
    cardId: any;
    cardsList: any;
    options: ToastrConfig;
    title = '';
    type = types[0];
    message = '';
    allLanguage = [];
    ouside48hrs: any;
    version = VERSION;
    errorMessage: string;
    messageToken: string;
    _zone: any;
    submitted: boolean;
    cvv: AbstractControl;
    expiryDate: AbstractControl;
    cardHolderName: AbstractControl;
    cartList: any;
    promocodeAmount: any = 0;
    monthArray: any = [];
    addCardCheck: boolean = false;
    cardNumber: AbstractControl;
    token: string;
    showChangePaymentMethod: boolean = false;
    parent_address: any;
    public form: FormGroup;
    public cardToken: any;
    public mask = [/[0-9]/, /\d/, /\d/, /\d/, ' ', /[0-9]/, /\d/, /\d/, /\d/, ' ', /[0-9]/, /\d/, /\d/, /\d/, ' ', /[0-9]/, /\d/, /\d/, /\d/];
    public expiryMask = [/[0-9]/, /\d/, '/', /[0-9]/, /\d/];
    private lastInserted: number[] = [];
    myBooking: any;

    constructor(fb: FormBuilder,
                private store: Store<any>,
                private modalService: NgbModal,
                private router: Router,
                private route: ActivatedRoute,
                private _spinner: BaThemeSpinner,
                private renderer: Renderer,
                private appRef: ApplicationRef,
                private config: NgbDatepickerConfig,
                private dialog: MatDialog,
                private ngZone: NgZone,
                private ref: ChangeDetectorRef,
                private allSessionService: AllSessionService
    ) {
        localStorage.removeItem('page');
        localStorage.removeItem('savedCardData');

        // setInterval(() => {
        //     this.ref.reattach();
        //     this.ref.markForCheck();
        // }, 1000);
        this.token = localStorage.getItem('tokenSession');
        // window.scroll(0, 0);
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
        this.date = new Date();
        this.offset = -(this.date.getTimezoneOffset());
        this.monthArray = moment.months();
        let currentYear = moment().format('YYYY');
        this.yearArray = this.getNextTenYear(+currentYear);
        if (localStorage.getItem('changePayment') != undefined) {
            this.showChangePaymentMethod = true;
            if (localStorage.getItem('cardPaymentId') != undefined) {
                let cardToken = localStorage.getItem('cardPaymentId');
                if (cardToken != undefined) {
                    this.cardToken = cardToken;
                }

            }
        }

        if (localStorage.getItem('bookingId')) {
            this.store.dispatch({
                type: sessionsDetails.actionTypes.GET_BOOKING_BY_ID,
                payload: localStorage.getItem('bookingId')
            });
        }

        //subscription to store
        // this.profileStore = this.store
        //     .select('profile')
        //     .subscribe((res: any) => {
        //         if (res) {
        //             if (res.userData && res.userData.data && res.userData != undefined && res.userData.data != undefined) {
        //                 this.userCards = res.userData.data.cards;
        //                 if (res.userData.data.parent && res.userData.data.parent != undefined) {

        //                     if (res.userData.data.parent.addresses[0] && res.userData.data.parent.addresses[0] != undefined) {
        //                         this.parent_address = res.userData.data.parent.addresses[0];
        //                     }

        //                 }
        //             }
        //         }
        //     });
        //  localStorage.setItem("changePayment", "true");

        this.sessionStore = this.store.select('sessionsDetails').subscribe((res: any) => {
            if (res) {

                if (res.bookingById && res.bookingById != undefined) {

                    this.myBooking = res.bookingById;

                    let current = moment();
                    let momentTime = moment(this.myBooking.startTime);
                    let setTimes = momentTime.diff(current, 'hours');

                    if (setTimes > 48) {
                        this.ouside48hrs = true;
                    } else {
                        this.ouside48hrs = false;
                    }
                    //
                    // this.myBooking.payments.paymentStatus == 'hold failed' && setTimes > 24 &&
                    // if (this.myBooking.startTime >= (moment(new Date()).add(48, 'hours').toDate().toISOString())) {
                    //     this.ouside48hrs = true;
                    // } else {
                    //     this.ouside48hrs = false;
                    // }

                }
            }
        });
        this.paymentStore = this.store.select('Payments').subscribe((res: any) => {
            if (res && res != undefined) {
                if (res.addCardSuccess && res.addCardSuccess != undefined) {
                    //     this.userCards = [];
                    //     this.userCards = res.addCardSuccess.cards;
                    // this._spinner.hide();
                    // location.reload();
                    this.addCardCheck = false;
                    // window.scroll(0, 0);
                }
                if (res.deleteCardSuccess) {
                    if (res.deleteCardSuccess && res.deleteCardSuccess != undefined) {
                        this.userCards = [];
                        this.userCards = res.deleteCardSuccess.cards;
                        this._spinner.hide();
                    }
                }
                if (res.defaultCardSuccess) {
                    this._spinner.hide();
                }
                if (res.updateCardSuccess) {
                    this.userCards = [];
                    this._spinner.hide();
                    if (res.updateCardSuccess && res.updateCardSuccess != undefined) {
                        this.userCards = res.updateCardSuccess.cards;
                        this.addCardCheck = false;
                    }
                }
                // this.ref.detectChanges();
            }

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
            if (key == '.') return false;
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

    onAddNewCardClick() {
        this.addCardCheck = true;
        this.defaultAddress.setValue('');
        this.addressLine1.reset();
        this.addressLine2.reset();
        this.state.reset();
        this.city.reset();
        this.zipcode.reset();
        this.cardHolderName.reset();
        this.cardNumber.reset();
        this.expiryMonth.reset();
        this.expiryYear.reset();
        this.cvv.reset();
        // window.scroll(0, 0);
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
    }

    ngAfterViewInit() {
        this.profileStore = this.store.select('profile').subscribe((res: any) => {
            if (res) {
                if (res.userData && res.userData.data && res.userData != undefined && res.userData.data != undefined) {
                    this.userCards = [];
                    this.userCards = res.userData.data.cards;
                    //
                    // this.userCards.forEach((element) => {
                    //     // if(element.isDefault){
                    //     //     this.default=element
                    //     // }
                    //  });
                    // this.ref.detectChanges;
                    if (res.userData.data.parent && res.userData.data.parent != undefined) {
                        if (res.userData.data.parent.addresses[0] && res.userData.data.parent.addresses[0] != undefined) {
                            this.parent_address = res.userData.data.parent.addresses[0];
                        }

                    }
                }
            }
        });

    }

    // formatting of card number //
    cc_format(data) {
        let value = data.value;
        if (value) {
            let v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
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
    onSubmit(value, e, form) {
        this.userCards = [];
        if (!this.cardEditcheck) {
            let key;
            for (key in value) {
                if ((value[key] === '' || value[key] === null) && key !== 'addressLine2') {
                    if (key === 'addressLine1' || key === 'city' || key === 'state' || key === 'zipcode') {
                    } else {
                        let el = $('#moveUp');
                        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
                            el.focus();
                        });
                    }
                }
            }
        }

        e.preventDefault();
        // this.submitted = true;
        // this._spinner.show();
        if (this.cardEditcheck) {
            let el = $('#moveUp');
            $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
                el.focus();
            });
            value.cardId = this.cardIdToBeSent;
            value.expiryMonth = this.monthArray.indexOf(value.expiryMonth) + 1;
            this.store.dispatch({
                type: Payments.actionTypes.UPDATE_CARD,
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
                            // window.scroll(0, 0);
                            let el = $('#moveUp');
                            $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
                                el.focus();
                            });
                            let fd = new FormData();
                            fd.append('stripeToken', response.id);
                            fd.append('isDefault', value.defaultCard);
                            if (value.defaultCard) {
                                ga('send', {
                                    hitType: 'event',
                                    eventCategory: 'My Wallet',
                                    eventAction: 'Add Default',
                                    eventLabel: 'Add Default'
                                });
                            }
                            this.errorMessageCard = '';
                            this.store.dispatch({
                                type: Payments.actionTypes.ADD_CARD,
                                payload: fd
                            });
                            // this.cardHolderName.reset();
                            // this.cardNumber.reset();
                            // this.expiryMonth.reset();
                            // this.expiryYear.reset();
                            // this.cvv.reset();

                        } else {
                            this._spinner.hide();
                            let el = $('#moveUp');
                            $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
                                el.focus();
                            });
                            this.errorMessageCard = response.error.message;
                            // this.changeRef.detectChanges();
                        }
                    });
                });
            } else {
                this._spinner.hide();
            }
        }
        // let fd = new FormData();
        // fd.append('deviceType', 'WEB')

        // this.store.dispatch({
        //     type: profile.actionTypes.GET_PARENT_PROFILE,
        //     payload: fd
        // });
    }

    /* Wallet functions starts from here */
    onDeleteCard(id) {
        this.userCards = [];
        this._spinner.show();
        this.store.dispatch({
            type: Payments.actionTypes.DELETE_CARD,
            payload: id

        });

    }

    showBtn = 'retry';

    //Set default card
    onRadioClick(data) {
        this.defaultCardId = data;
        this.selectedCard = data;
        for (let i = 0; i < this.userCards.length; i++) {
            if (this.userCards[i]._id === data) {
                if (this.userCards[i].last4Digits) {
                    localStorage.setItem('savedCardData', JSON.stringify(this.userCards[i]));
                }

                this.userCards[i].isDefault = true;
            } else {
                this.userCards[i].isDefault = false;
            }
        }
        // }

        // saveDefault() {
        // this._spinner.show();
        if (localStorage.getItem('changePayment') != undefined && localStorage.getItem('changePayment') === 'true' && localStorage.getItem('bookingId') != undefined) {
            this.setCard = this.selectedCard;

        } else {
            this.store.dispatch({
                type: Payments.actionTypes.DEFAULT_CARD,
                payload: this.defaultCardId
            });
        }
    }

    retrySameCard() {

        this._spinner.show();
        let bookingId = localStorage.getItem('bookingId');
        let fd = new FormData();
        fd.append('cardId', this.cardToken);
        this.store.dispatch({
            type: Payments.actionTypes.CHANGE_PAYMENT_METHOD,
            payload: {selectedCard: fd, booking_Id: bookingId}
        });

    }

    // let dialogRef = this.dialog.open(CommonErrorDialog, {
    //     data: { message: result.message }
    // });

    setChangePaymentMethod(isNewCard?) {
        // this.openMultiSessionCardModal();
        //
        // return;

        let bookingId = localStorage.getItem('bookingId');
        let fd = new FormData();
        if (this.setCard != undefined) {
            fd.append('cardId', this.setCard);
            this.store.dispatch({
                type: Payments.actionTypes.CHANGE_PAYMENT_METHOD,
                payload: {selectedCard: fd, booking_Id: bookingId, isNewCard: isNewCard}
            });

        } else {
            if (localStorage.getItem('changePayment')) {
                localStorage.removeItem('changePayment');
            }
            this.router.navigate(['/pages/all-sessions/sessions']);

        }

    }

    onEditCard(data) {
        this.addCardCheck = true;
        this.cardEditcheck = true;
        this.cardHolderName.setValue(data.name ? data.name : '');
        this.cardNumber.setValue('XXXX XXXX XXXX ' + data.last4Digits);
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

    ngOnInit() {
        let fd = new FormData();
        fd.append('deviceType', 'WEB');
        this.store.dispatch({
            type: profile.actionTypes.GET_PARENT_PROFILE,
            payload: fd
        });
    }

    cancelAdding() {
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
        this.addCardCheck = false;
        this._spinner.show();
        this.cardHolderName.reset();
        this.cardNumber.reset();
        this.expiryMonth.reset();
        this.expiryYear.reset();
        this.cvv.reset();
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

    ngOnDestroy() {
        // this.defaultAddress.setValue('');
        this.addressLine1.reset();
        this.addressLine2.reset();
        this.state.reset();
        this.city.reset();
        this.zipcode.reset();
        this.cardHolderName.reset();
        this.cardNumber.reset();
        this.expiryMonth.reset();
        this.expiryYear.reset();
        this.cvv.reset();
        this.paymentStore.unsubscribe();
        this.profileStore.unsubscribe();
        this.sessionStore.unsubscribe();
        if (localStorage.getItem('changePayment')) {
            localStorage.removeItem('changePayment');
        }
        // this.ref.detach()
    }
}
