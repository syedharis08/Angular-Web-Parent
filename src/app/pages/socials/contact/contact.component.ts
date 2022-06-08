import { CommonService } from '../../../services/common.service';
import { FormBuilder, Validators, FormGroup, AbstractControl, FormControl, FormArray } from '@angular/forms';
import { Component, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import 'style-loader!./contact.scss';
import { Subscription } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import * as profile from '../../profile/state/profile.actions';
import { MatDialog } from '@angular/material';
import { CommonErrorDialog } from '../../../auth/model/common-error-dialog/common-error-dialog';

@Component({
    selector: 'contact',
    templateUrl: './contact.html'
})

export class ContactComponent implements OnDestroy {
    phoneNumber: any;
    message: AbstractControl;
    user: AbstractControl;
    email: AbstractControl;
    lastName: AbstractControl;
    public userData;
    public alladdress = [];
    public noEdit: boolean = false;
    firstName: AbstractControl;
    zipcode: AbstractControl;
    public profileStore: Subscription;
    form: FormGroup;
    storeData;
    parentEmail;
    parentContact;
    tutorEmail;
    tutorContact;
    mobile: AbstractControl;
    marketId: any;

    constructor(private fb: FormBuilder, private dialog: MatDialog,
                private commonservice: CommonService, private toastservice: ToastrService, private store: Store<any>) {

        this.store.dispatch({
            type: profile.actionTypes.FAQ
        });
        localStorage.removeItem('page');

        this.storeData = this.store
            .select('profile')
            .subscribe((res: any) => {
                if (res) {
                    if (res.faq) {
                        if (res.faq.parentContact) {
                            this.parentEmail = res.faq.parentContact.email;
                            this.parentContact = res.faq.parentContact.phoneNumber;
                        }
                        if (res.faq.tutorContact) {
                            this.tutorEmail = res.faq.tutorContact.email;
                            this.tutorContact = res.faq.tutorContact.phoneNumber;
                        }
                    }
                }
            });
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
        this.form = fb.group({
            'firstName': ['', Validators.compose([Validators.required])],
            'lastName': [''],
            'email': ['', Validators.compose([Validators.required, Validators.email])],
            'message': ['', Validators.compose([Validators.required])],
            'mobile': ['', Validators.compose([Validators.required, Validators.pattern(/^[1-9][0-9]*$/), Validators.maxLength(10), Validators.minLength(10)])],
            'zipcode': ['', Validators.compose([Validators.required])],
        });
        this.firstName = this.form.controls['firstName'];
        this.lastName = this.form.controls['lastName'];
        this.email = this.form.controls['email'];
        this.message = this.form.controls['message'];
        this.zipcode = this.form.controls['zipcode'];
        this.mobile = this.form.controls['mobile'];

        this.profileStore = this.store
            .select('profile')
            .subscribe((res: any) => {
                if (res) {
                    if (res.userData && res.userData != undefined && res.userData.data && res.userData.data != undefined) {
                        this.userData = res.userData.data;
                        this.phoneNumber = this.userData.phoneNumber;
                        this.mobile.setValue(this.userData.phoneNumber);
                        this.firstName.setValue(this.userData.firstName ? this.userData.firstName : '');
                        this.lastName.setValue(this.userData.lastName ? this.userData.lastName : '');
                        this.email.setValue(this.userData.email ? this.userData.email : '');

                        this.alladdress = [];
                        if (this.userData && this.userData.parent && this.userData.parent.addresses && this.userData.parent.addresses.length > 0) {
                            this.alladdress = this.userData.parent.addresses;
                            this.alladdress.forEach((element) => {
                                if (element.isDefault == true) {
                                    this.zipcode.setValue(element.zipCode ? element.zipCode : '');
                                    if (element.zipCode != '') {
                                        this.noEdit = true;
                                    }
                                }
                            });

                        }
                        if (this.userData.marketId) {
                            this.marketId = this.userData.marketId;
                        }
                    }

                }
            });
    }

    parentSendEmail() {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Email Submission',
            eventAction: 'Email',
            eventLabel: 'Email Address'
        });
    }

    parentSendContact() {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Call Submission',
            eventAction: 'Call aTel',
            eventLabel: 'Phone Number'
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

    onSubmit(value, e) {
        this.fireAllErrors(this.form);
        if (this.form.valid) {
            let fd = new FormData();
            fd.append('firstName', value.firstName);
            fd.append('email', value.email);
            fd.append('user', 'PARENT');
            fd.append('from', 'PARENT');
            fd.append('phoneNumber', value.mobile);
            if (value.lastName) {
                fd.append('lastName', value.lastName);
            }
            if (value.message) {
                fd.append('message', value.message);
            }
            if (value.zipcode) {
                fd.append('location', value.zipcode);
            }
            if (this.marketId) {
                fd.append('market', this.marketId);
            }

            this.commonservice.contactForm(fd).subscribe((result) => {
                if (result.statusCode == 200) {
                    ga('send', {
                        hitType: 'event',
                        eventCategory: 'Form Submission',
                        eventAction: 'Send Message',
                        eventLabel: 'Send Message'
                    });
                    // this.toastservice.success(result.message);
                    if (result.message != undefined) {

                        let dialogRef = this.dialog.open(CommonErrorDialog, {
                            data: {message: result.message}
                        });
                        dialogRef.afterClosed().subscribe(() => {
                            let el = $('#moveUp');
                            $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
                                el.focus();
                            });
                            this.store.dispatch({
                                type: profile.actionTypes.GO_TO_BROWSE_TUTOR
                            });
                        });
                    }
                }
            }, (error) => {
                this.toastservice.error(error.message);
            });
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

    ngOnDestroy() {
        this.storeData.unsubscribe();
    }

}
