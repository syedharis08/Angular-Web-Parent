import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import * as profile from '../../state/profile.actions';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator, NameValidator } from '../../../../theme/validators';
import { ActivatedRoute } from '@angular/router';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import 'style-loader!./address-dialog.scss';
import { Subscription } from 'rxjs/Rx';
@Component({
    selector: 'address-dialog',
    templateUrl: 'address-dialog.html'
})

export class AddressDialog {
    public addressForm: FormGroup;
    public latitude;
    public longitude;
    public char: any;
    public userData;
    public country;
    public setState;
    public localStoragePresent: boolean = false;
    public setCity;
    public checkvalueError: boolean = false;

    public label;
    public addressesLength;
    public route;
    public editAddressId;
    public zip;
    public stateCode;
    public isEditing;
    public canEdit: boolean = false;
    public setaddress1 = '';
    public profileStore: Subscription;
    public streetAdress1: AbstractControl;
    public city: AbstractControl;
    public zipCode: AbstractControl;
    public locationLabel: AbstractControl;
    public state: AbstractControl;
    public streetAdress2: AbstractControl;
    byPass: any;

    constructor(public dialogRef: MatDialogRef<AddressDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private store: Store<any>,
        private toastrService: ToastrService) {
        // window.scroll(0, 0);
        let el = $('#moveUp');
        $('html,body').animate({ scrollTop: (el.offset().top - 50) }, 'slow', () => {
            el.focus();
        });
        let fd = new FormData();
        fd.append('deviceType', 'WEB')

        this.store.dispatch({
            type: profile.actionTypes.GET_PARENT_PROFILE,
            payload: fd
        });
        if (data) {

            if (data && data.address && data.address.latitude && data.address.longitude) {
                this.longitude = data.address.longitude;
                this.latitude = data.address.latitude
                this.country = data.address.country
            }
            else {
                this.longitude = data.address ? data.address.currentLong : '';
                this.latitude = data.address ? data.address.currentLat : '';
                this.country = data.address ? data.address.country : '';
            }
            this.addressForm = fb.group({
                'streetAdress1': ['', Validators.compose([Validators.required])],
                'locationLabel': ['', Validators.compose([Validators.required])],
                'streetAdress2': [''],
                'city': ['', Validators.compose([Validators.required])],
                'zipCode': ['', Validators.compose([Validators.required])],
                'state': ['', Validators.compose([Validators.required])],
            });
            this.streetAdress1 = this.addressForm.controls['streetAdress1'];
            this.locationLabel = this.addressForm.controls['locationLabel'];
            this.streetAdress2 = this.addressForm.controls['streetAdress2'];
            this.city = this.addressForm.controls['city'];
            this.zipCode = this.addressForm.controls['zipCode'];
            this.state = this.addressForm.controls['state'];

            this.profileStore = this.store
                .select('profile')
                .subscribe((res: any) => {
                    if (res) {
                        if (res.userData && res.userData.data) {
                            this.userData = res.userData.data;

                        }

                        if (this.userData && this.userData.parent && this.userData.parent.addresses) {
                            this.addressesLength = this.userData.parent.addresses.length;

                        }

                    }

                    if (this.addressesLength != undefined && this.addressesLength == 0) {
                        this.addressForm.controls['locationLabel'].setValue('Home');
                        this.canEdit = false;
                        this.addressForm.get('locationLabel')[!this.isEditing ? 'disable' : '']();
                        // this.locationLabel.setValue('HOME');
                    }


                    if (localStorage.getItem('editAddressId') && localStorage.getItem('editAddressId') != undefined && this.addressesLength > 0) {
                        // this.localStoragePresent = true;
                        let labelDetails = JSON.parse(localStorage.getItem('editAddressId'));
                        this.label = labelDetails.label;
                        if (this.label.toLowerCase() === 'home') {
                            this.byPass = true;
                            this.addressForm.controls['locationLabel'].setValue('Home');
                            this.canEdit = false;
                            this.addressForm.get('locationLabel')[!this.isEditing ? 'disable' : '']();

                        } else {
                            this.canEdit = true;
                        }

                        this.editAddressId = labelDetails;
                        this.locationLabel.setValue(this.label);
                    }
                });
        }

        if (data && data.address) {
            let address = data.address
            this.stateCode = data.address.stateCode;
            if (address.street && address.street != undefined) {
                this.setaddress1 = address.street;
                this.addressForm.controls['streetAdress1'].setValue(address.street);
                this.addressForm.get('streetAdress1')[!this.isEditing ? 'disable' : '']();
            }

            this.addressForm.controls['streetAdress1'].setValue(address.street);
            if (address.city && address.city != undefined) {
                this.setCity = address.city ? address.city : '';
                this.addressForm.controls['city'].setValue(address.city);
                this.addressForm.get('city')[!this.isEditing ? 'disable' : '']();
            }
            this.addressForm.controls['city'].setValue(address.city);
            if (address.zipCode && address.zipCode != undefined) {
                this.zip = address.zipCode ? address.zipCode : '';
                this.addressForm.controls['zipCode'].setValue(address.zipCode);
                this.addressForm.get('zipCode')[!this.isEditing ? 'disable' : '']();
            }
            this.addressForm.controls['zipCode'].setValue(address.zipCode);
            if (address.state && address.state != undefined) {
                this.setState = address.state;
                this.addressForm.controls['state'].setValue(address.state);
                this.addressForm.get('state')[!this.isEditing ? 'disable' : '']();
            }
            this.addressForm.controls['state'].setValue(address.state);
        }

    }

    ngOnInit() {

    }
    closeDialog() {
        this.dialogRef.close();
    }
    onSubmit2(values) {
        let formdata = new FormData();
        // this.fireAllErrors(this.addressForm);
        if (this.addressForm.valid) {
            this.char = this.addressForm.controls['locationLabel'].value;
            if (this.char.toLowerCase() === 'home' && this.addressesLength > 0 && !this.canEdit && !localStorage.getItem('editAddressId')) {
                this.checkvalueError = true;
                return;
            }
            else {
                this.checkvalueError = false;
                formdata.append('label', this.char);
            }
            if (!this.byPass) {
                if (this.char.toLowerCase() === 'home' && localStorage.getItem('editAddressId')) {
                    this.checkvalueError = true;
                    return;
                }
                else {
                    this.checkvalueError = false;
                    // formdata.append('label', this.char);
                }

            }

            let addressToSet = this.addressForm.controls['streetAdress1'].value;
            formdata.append('addressLine1', addressToSet);
            let street2 = this.addressForm.controls['streetAdress2'].value;
            if (street2) {
                formdata.append('addressLine2', street2)
            }

            let cityToSend = this.addressForm.controls['city'].value;
            formdata.append('city', cityToSend);
            let stateToSet = this.addressForm.controls['state'].value;
            formdata.append('state', stateToSet);
            formdata.append('country', this.country);
            let zipCodetoSet = this.addressForm.controls['zipCode'].value;
            formdata.append('zipCode', zipCodetoSet);
            formdata.append('longitude', this.longitude);
            formdata.append('latitude', this.latitude);
            // formdata.append('shortState', this.stateCode);

            if (localStorage.getItem('addSessionAddress') && localStorage.getItem('addSessionAddress') != undefined && (!localStorage.getItem('editAddressId'))) {
                if (localStorage.getItem('tutor_Id') && localStorage.getItem('tutor_Id') != undefined) {
                    let tutorId = localStorage.getItem('tutor_Id');
                    formdata.append('tutorId', tutorId)
                }

            }
            if (localStorage.getItem('editAddressId') && localStorage.getItem('editAddressId') != undefined) {
                let id = JSON.parse(localStorage.getItem('editAddressId'));
                this.store.dispatch({
                    type: profile.actionTypes.EDIT_ADDRESS,
                    payload: { address: formdata, addressId: id._id }
                });
            } else {
                this.store.dispatch({
                    type: profile.actionTypes.ADD_ADDRESS,
                    payload: formdata
                });
            }
        }
        else {

            let control;
            Object.keys(this.addressForm.controls).reverse().forEach((field) => {
                if (this.addressForm.get(field).invalid) {
                    control = this.addressForm.get(field);
                    control.markAsDirty();
                }
            });
            // window.scroll(0,0)

            if (control) {
                let el = $('.ng-invalid:not(form):first');
                $('html,body,div #addr-dialog').animate({ scrollTop: (el.offset().top - 200) }, 'slow', () => {
                    el.focus();
                });
            }

        }




    }
    fireAllErrors(formGroup: FormGroup) {
        let keys = Object.keys(formGroup.controls);
        keys.forEach((field: any) => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {

                control.markAsTouched({ onlySelf: true });
                control.markAsDirty({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.fireAllErrors(control);
            }
            else if (control instanceof FormArray) {
                (<FormArray>control).controls.forEach((element: FormGroup) => {
                    this.fireAllErrors(element);
                });
            }
        });
    }
    ngOnDestroy() {
        // if (localStorage.getItem('editAddressId')) {
        //     localStorage.removeItem('editAddressId');
        // }
        // if (this.storeData) {
        //     // this.storeData.unsubscribe();
        // }
    }



}
