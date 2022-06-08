import { Component, ViewChild, ElementRef, TemplateRef, Renderer } from '@angular/core';
import { Store } from '@ngrx/store';
import * as profile from '../../state/profile.actions';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { EmailValidator } from '../../../../theme/validators';
import { BaThemeSpinner } from '../../../../theme/services';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { EditChildDialog } from '../edit-child-dialog/edit-child-dialog.component';
import { CompleteProfileDialog } from '../../../../auth/model/complete-profile-dialog/complete-profile-dialog.component';
import { Subscription } from 'rxjs/Rx';
import { ConfrimDeleteAddress } from '../confirm-delete-address-dialog/confirm-delete-address-component';
import { ConfrimDeleteChild } from '../confirm-delete-child-dialog/confirm-delete-child-component';
import { ParentService } from '../../../../services/parent-service/parent.service';
import ImageCompressor from 'image-compressor.js';
import { UserService } from '../../../../auth/service/user-service/user.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as auth from '../../../../auth/state/auth.actions';
import { CommonService } from '../../../../services/common.service';
import { OutOfHourConfirmComponent } from '../out-of-hour-confirm/out-of-hour-confirm.component';

declare var Croppie: any;

@Component({
    selector: 'parent-profile',
    templateUrl: './parent-profile.html',
    styleUrls: ['./parent-profile.scss']
})
export class ParentProfile {
    modalRef: BsModalRef;
    config = {
        animated: false,
        keyboard: false,
        backdrop: true,
        ignoreBackdropClick: true
    };
    showImageError: boolean;
    imageSize_sp: any;
    oldEmail: any;
    oldPhoneNumber: any;
    public loggedIn: boolean;
    public profileData: any = {};
    public currentUser: any;
    public profileStore: Subscription;
    userData;
    isRateChargeSuppress = false;
    public form: FormGroup;
    @ViewChild('fileUpload') public _fileUpload: ElementRef;
    public originalUserName: AbstractControl;
    public firstName: AbstractControl;
    public lastName: AbstractControl;
    public email: AbstractControl;
    public mobile: AbstractControl;
    public document: AbstractControl;
    public address: AbstractControl;
    public description: AbstractControl;
    public image: AbstractControl;
    public otherSbject: AbstractControl;
    public sp_image_file: any;
    public sp_image: any;
    public base64Image: any;
    public formData: any;
    public cards: any[];
    public otherSubject: boolean = false;
    public canEditFirstName: boolean = false;
    public canEditLastName: boolean = false;
    public canEditEmail: boolean = false;
    public canEditPhone: boolean = false;
    public showRequiredError: boolean = false;
    public errorMessage: string;
    public checkEmail: any;
    public checkPhoneNumber: any;
    public parent_lastName;
    public parent_firstName;
    public parent_email;
    public parent_mobile;
    public addresses: any;
    public parent_address;
    public children = [];
    public addressLength;
    public students;
    public tutorGrades = {};
    public tutorSubjects = {};
    availableHrs = new FormControl('');
    showNumberOfTutoringHours = new FormControl('');
    public imageSize: any = [];

    public profile_image = '/assets/img/user.png';
    kkkkk: { new(parts: (string | Blob | ArrayBuffer | ArrayBufferView)[], filename: string, properties?: FilePropertyBag): File; prototype: File; };
    sp_service_image: any;
    blob: Blob;
    popupImage: any;
    dataURL: string;
    input: any;
    dialogRef: any;
    close: boolean;
    imgBck: any;
    checkImageAvail: boolean = true;
    customImg: any;
    sp_image1: any;
    sp_image_file1: any;
    checkImage: any;
    subjectList = [];
    localSubjectData: any;
    isCanada = false;
    localGradeData: any;

    constructor(private renderer: Renderer, private store: Store<any>, private fb: FormBuilder,
                private router: Router, private dialog: MatDialog, private toaster: ToastrService,
                private ParentService: ParentService, private modalService: BsModalService, private _spinner: BaThemeSpinner,
                private userService: UserService, public commonService: CommonService
    ) {

        localStorage.removeItem('editAddressId');
        this.addresses = [];
        let fd = new FormData();
        fd.append('deviceType', 'WEB');

        this.store.dispatch({
            type: profile.actionTypes.GET_PARENT_PROFILE,
            payload: fd
        });
        // window.scroll(0, 0);
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
        this.form = fb.group({
            'originalUserName': ['', Validators.compose([Validators.required])],
            'firstName': [{value: ''}, Validators.compose([Validators.required, Validators.pattern(commonService.CONSTANT.namePattern), Validators.maxLength(64)])],
                'lastName': [{value: ''}, Validators.compose([Validators.required, Validators.pattern(commonService.CONSTANT.namePattern), Validators.maxLength(64)])],
                'email': [{value: ''}, Validators.compose([Validators.required, EmailValidator.email])],
            'otherSbject': [''],
            'mobile': [{value: ''}, Validators.compose([Validators.required, Validators.pattern(/^[1-9][0-9]*$/), Validators.minLength(10), Validators.maxLength(10)])]
        });

        this.firstName = this.form.controls['firstName'];
        this.lastName = this.form.controls['lastName'];
        this.originalUserName = this.form.controls['originalUserName'];
        this.mobile = this.form.controls['mobile'];
        this.email = this.form.controls['email'];
        this.otherSbject = this.form.controls['otherSbject'];
        this.errorMessage = null;
        let setLocalData = this.ParentService.getProfileData();
        // STORE SUBSCRIBED HERE
        this.profileStore = this.store.select('profile').subscribe((res: any) => {
            if (res) {
                if (res.userData && res.userData.data) {
                    this.userData = res.userData.data;

                    this.isCanada = this.commonService.checkIsCanada(this.userData);
                    this.checkIsSuppress();

                    if (this.userData && this.userData != undefined && this.userData.students && this.userData.students != undefined) {
                        this.students = this.userData.students;
                        this.oldPhoneNumber = this.userData.phoneNumber;
                        this.oldEmail = this.userData.email;
                        if (this.userData.parent && this.userData.parent != undefined && this.userData.parent.addresses && this.userData.parent.addresses != undefined) {
                            this.addressLength = this.userData.parent.addresses;
                        }

                    }

                    if (this.userData && this.userData.parent && !setLocalData) {

                        if (this.userData.parent.interestOtherFactor && this.userData.parent.interestOtherFactor != '-') {
                            this.form.controls['otherSbject'].setValidators([Validators.required]);
                            this.form.controls['otherSbject'].updateValueAndValidity();
                            this.otherSbject.setValue(this.userData.parent.interestOtherFactor);
                            this.otherSubject = true;

                        } else {
                            this.otherSubject = false;
                            this.form.controls['otherSbject'].setValidators([]);
                            this.form.controls['otherSbject'].updateValueAndValidity();
                        }

                        if (this.userData.parent.gradeLevel) {
                            for (let i = 0; i < this.userData.parent.gradeLevel.length; i++) {
                                this.tutorGrades[this.userData.parent.gradeLevel[i]] = true;

                            }
                        }
                        if (this.userData.parent.subjects) {
                            for (let i = 0; i < this.userData.parent.subjects.length; i++) {
                                this.tutorSubjects[this.userData.parent.subjects[i]._id] = true;
                            }
                        }
                    } else {
                        if (this.userData && this.userData.parent) {
                            if (setLocalData.grades) {
                                this.userData.parent.gradeLevel = [];
                                this.userData.parent.gradeLevel = Object.keys(setLocalData.grades);
                            }
                            if (setLocalData.subjects) {
                                this.userData.parent.subjects = [];
                                for (let prop in setLocalData.subjects) {
                                    if (prop) {
                                        this.userData.parent.subjects.push({_id: prop, name: ''});
                                    }
                                }
                            }
                            if (setLocalData.grades) {
                                this.tutorGrades = setLocalData.grades;
                                this.localGradeData = setLocalData.grades;
                            }
                            if (setLocalData.subjects) {
                                this.tutorSubjects = setLocalData.subjects;
                                this.localSubjectData = setLocalData.subjects;
                                if (setLocalData.subjects.other) {
                                    this.otherSbject.setValue(setLocalData.otherSubject);
                                    this.otherSubject = true;
                                    // this.otherSbject
                                } else {
                                    this.otherSubject = false;
                                }
                            }
                            this.ParentService.setProfileData('');
                        }
                        if (!setLocalData.grades) {
                            if (this.userData.parent.gradeLevel) {
                                for (let i = 0; i < this.userData.parent.gradeLevel.length; i++) {
                                    this.tutorGrades[this.userData.parent.gradeLevel[i]] = true;
                                }
                            }
                        }
                        if (!setLocalData.subjects) {
                            if (this.userData.parent.interestOtherFactor && this.userData.parent.interestOtherFactor != '-') {
                                this.otherSbject.setValue(this.userData.parent.interestOtherFactor);
                                this.otherSubject = true;
                            } else {
                                this.otherSubject = false;
                            }
                            if (this.userData.parent.subjects) {
                                for (let i = 0; i < this.userData.parent.subjects.length; i++) {
                                    this.tutorSubjects[this.userData.parent.subjects[i]._id] = true;
                                }
                            }
                        }
                    }
                }
                if (this.userData) {
                    this.originalUserName.setValue(this.userData.originalUserName);
                    this.firstName.setValue(this.userData.firstName);
                    this.lastName.setValue(this.userData.lastName);
                    this.email.setValue(this.userData.email);
                    this.checkEmail = this.userData.email;
                    this.mobile.setValue(this.userData.phoneNumber);
                    this.checkPhoneNumber = this.userData.phoneNumber;
                    if (typeof this.ParentService.profile.sp_image == 'string') {
                        this.sp_image = this.ParentService.profile.sp_image;
                        this.imgBck = this.ParentService.profile.sp_image;
                    } else {
                        this.sp_image = (this.userData.profilePicture && this.userData.profilePicture.original != null) ? this.userData.profilePicture.original : this.profile_image;
                        this.imgBck = (this.userData.profilePicture && this.userData.profilePicture.original != null) ? this.userData.profilePicture.original : this.profile_image;

                    }
                    if (this.userData.profilePicture.original) {
                        this.checkImage = this.userData.profilePicture.original;
                    }
                    this.parent_lastName = this.lastName;
                    this.parent_firstName = this.firstName;
                    this.parent_mobile = this.mobile;
                    this.parent_email = this.email;
                    this.parent_address = this.address;
                }
                if (this.userData && this.userData.parent && this.userData.parent.addresses) {
                    this.addresses = this.userData.parent.addresses;
                }
                if (this.userData && this.userData.students && this.userData.students.length > 0) {
                    this.children = [];
                    for (let i = 0; i < this.userData.students.length; i++) {
                        this.children.push(this.userData.students[i]);
                    }
                } else {
                    this.children = [];
                }
            }
        });
    }

    ngOnInit() {
        this.getSubjects();
        setTimeout(() => {

            let len = document.getElementsByTagName('input').length;
            for (let i = 0; i < len; i++) {
                if (document.getElementsByTagName('input')[i].type == 'file') {
                    this.input = document.getElementsByTagName('input')[i];
                }
            }
        });

    }

    openOutoftutorModal() {
        let matDialogRef = this.dialog.open(OutOfHourConfirmComponent, {
            data: {
                modalData: this.userData
            }
        });
        matDialogRef.disableClose = true;
    }

    checkIsSuppress() {
        if (this.userData.partnershipCode && this.userData.partnershipCode.length && this.userData.partnershipCode[0].isRateChargeSuppress) {
            this.isRateChargeSuppress = true;
            if (this.userData.parent.isParentOutOfTutoringHours) {
                this.availableHrs.patchValue('Out of use for tutoring hours');
                this.showNumberOfTutoringHours.patchValue('Out of use for tutoring hours');
            } else {
                let showNumberOfTutoringHours = 0;
                if (this.isRateChargeSuppress && this.userData.parent.numberOfTutoringHours > 0 && !this.userData.parent.isParentOutOfTutoringHours) {
                    if (this.userData.parent.sessionCreditsFromExternalApi && this.userData.parent.sessionCreditsFromExternalApi.length) {
                        let sessionCreditsFromExternalApi = JSON.parse(JSON.stringify(this.commonService.sortByEndDate(this.userData.parent.sessionCreditsFromExternalApi)));
                        showNumberOfTutoringHours = this.commonService.noOfNonExpiredHours(sessionCreditsFromExternalApi);
                    }
                }
                // this.showNumberOfTutoringHours.patchValue(showNumberOfTutoringHours);
                this.showNumberOfTutoringHours.patchValue(this.userData.parent.numberOfTutoringHours);
                this.availableHrs.patchValue(this.userData.parent.numberOfTutoringHours);
            }
        } else {
            this.isRateChargeSuppress = false;
        }
    }

    ngAfterViewInit() {
    }

    openModal(template: TemplateRef<any>) {
        this.ParentService.profile = {
            sp_image: File,
            sp_image_file: File
        };
        this.input.value = null;
        this.modalRef = this.modalService.show(template, this.config);
        let ua = navigator.userAgent;
        let is_ie = ((ua.indexOf('MSIE') > -1 || ua.indexOf('Trident/') > -1) || (navigator.appVersion.indexOf('Edge') > -1));
        if (is_ie) {
            setTimeout(() => {
                this.input.click();
            }, 5);
        } else {
            this.input.click();
        }
    }

    //upload separate
    uploader() {
        this.bringFileSelector();
        if (this.input) {
            this.input.value = null;
        }
    }

    closeCropper() {
        if (typeof this.ParentService.profile.sp_image == 'string') {
            this.ParentService.profile = {
                sp_image: this.ParentService.profile.sp_image,
                sp_image_file: this.ParentService.profile.sp_image_file
            };
        } else {
            this.ParentService.profile = {
                sp_image: this.sp_image,
                sp_image_file: this.sp_image_file
            };
        }
        this.checkImageAvail = true;
        // this.sp_image = this.imgBck;
        // this.sp_image_file = undefined;
    }

    hideImagePop() {
        this.customImg.result('base64').then((base64) => {
            // do something with cropped blob
            this.sp_image = base64;
            this.base64Image = base64;
            this.sp_image_file = base64;
        });
        this.checkImageAvail = true;
    }

    onSubmit(values) {
        let gradeIds = [];
        let subjectIds = [];
        for (const property in this.tutorGrades) {
            if (this.tutorGrades[property]) {
                gradeIds.push(property);
            }
        }

        let formData = new FormData();
        formData.append('gradeLevel', JSON.stringify(gradeIds));
        for (const property in this.tutorSubjects) {
            if (this.tutorSubjects.hasOwnProperty(property)) {
                if (this.tutorSubjects[property] && property != 'other') {
                    subjectIds.push(property);
                }
            }
        }
        if (values.otherSbject && values.otherSbject != '-') {
            formData.append('interestOtherFactor', values.otherSbject);
        } else {
            formData.append('interestOtherFactor', '-');
        }

        formData.append('subjects', JSON.stringify(subjectIds));
        if (this.checkImage != this.ParentService.profile.sp_image && this.ParentService.profile.sp_image && typeof this.ParentService.profile.sp_image == 'string') {
            if (this.ParentService.profile.sp_image != '/assets/img/user.png')
                this.dataURLtoBlob(this.ParentService.profile.sp_image);
        } else if (this.base64Image) {
            this.dataURLtoBlob(this.base64Image);
        }
        if (this.imageSize_sp != undefined && this.imageSize_sp > 10000000) {
            this.showImageError = true;
            return;
        }
        this.showImageError = false;
        this.canEditLastName = false;
        this.canEditFirstName = false;
        this.canEditPhone = false;
        this.canEditEmail = false;
        // if (this.form.get('firstName')) {
        //   this.form.get('firstName')[this.canEditFirstName ? 'enable' : 'disable']();
        // }
        // if (this.form.get('lastName')) {
        //   this.form.get('lastName')[this.canEditLastName ? 'enable' : 'disable']();
        // }
        // if (this.form.get('email')) {
        //   this.form.get('email')[this.canEditEmail ? 'enable' : 'disable']();
        // }

        // if (this.form.get('phoneNumber')) {
        //   this.form.get('phoneNumber')[this.canEditPhone ? 'enable' : 'disable']();
        // }

        if (values) {
            if (values.firstName != undefined) {
                formData.append('firstName', values.firstName);
            }
            if (values.lastName != undefined) {
                formData.append('lastName', values.lastName);
            }
            if (values.email != undefined) {
                if (values.email.toLowerCase() != this.checkEmail) {
                    formData.append('email', values.email);
                }
            }
            if (values.mobile != undefined) {
                if (values.mobile != this.checkPhoneNumber && values.mobile != undefined) {
                    formData.append('phoneNumber', values.mobile);
                }
            }
            if (this.blob != undefined) {
                formData.append('profilePicture', this.blob);
            }
        }
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
        if (localStorage.getItem('comeFromDialog') === 'true' && localStorage.getItem('comeFromDialog') != undefined) {
            if (this.students && this.students != undefined && this.students.length > 0 && this.addressLength && this.addressLength != undefined && this.addressLength.length > 0) {
                this.router.navigate(['/pages/book-session/session']);
                // this.router.navigate(['/home/tutor-details']);
                // localStorage.removeItem('goFromSession');

            } else {
                let dialogRef = this.dialog.open(CompleteProfileDialog);
                return;
            }

        }
        this.store.dispatch({
            type: profile.actionTypes.UPDATE_PARENT_PROFILE,
            payload: {
                updates: formData,
                changedPhoneNumber: (values.mobile != undefined && (values.mobile != this.oldPhoneNumber)) ? true : false,
                changedEmail: (values.email != undefined && (values.email.toLowerCase() != this.oldEmail.toLowerCase())) ? true : false
            }
        });

        if (localStorage.getItem('addSessionAddress') === 'true' && localStorage.getItem('addSessionAddress') != undefined) {
            if (this.students && this.students != undefined && this.students.length > 0 && this.addressLength && this.addressLength != undefined && this.addressLength.length > 0) {
                this.router.navigate(['/home/tutor-details']);

            }
        } else {

        }

    }

    checkTime(dob) {

        if (dob) {
            let date = new Date(dob);
            let finalDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()).toUTCString();
            let newd = new Date(finalDate);
            let monthNames = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.',
                'Nov.', 'Dec.'
            ];

            let day = newd.getDate();
            let monthIndex = newd.getMonth();
            let year = newd.getFullYear();
            return monthNames[monthIndex] + ' ' + day + ',  ' + year;
        } else {
            // return '-';
        }

    }

    route() {
        this.router.navigate(['pages/profile/address-profile']);
    }

    fileChange(event) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let file_doc = fileList[0];
            this.document.setValue(file_doc.name);
        }
    }

    changePassword() {
        this.router.navigate(['/pages/profile/change-password']);
    }

    bringFileSelector(): boolean {
        this.ParentService.profile = {
            sp_image: File,
            sp_image_file: File
        };
        // this.checkImageSize()
        this.renderer.invokeElementMethod(this._fileUpload.nativeElement, 'click');
        return false;
    }

    editFirstName() {
        this.canEditFirstName = true;
        this.form.get('firstName')[this.canEditFirstName ? 'enable' : 'disable']();
    }

    dataURLtoBlob(dataurl) {
        let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        this.blob = new Blob([u8arr], {type: mime});
    }

    addNewAddress() {
        let obj = {
            grades: this.localGradeData,
            subjects: this.localSubjectData
        };
        if (this.otherSubject == true && this.otherSbject.value) {
            obj['otherSubject'] = this.otherSbject.value;
        }
        this.ParentService.setProfileData(obj);
        if (typeof this.ParentService.profile.sp_image == 'string') {
            this.ParentService.profile = {
                sp_image: this.ParentService.profile.sp_image,
                sp_image_file: this.ParentService.profile.sp_image_file
            };
        } else {
            this.ParentService.profile = {
                sp_image: this.sp_image,
                sp_image_file: this.sp_image_file
            };
        }
        this.router.navigate(['/pages/profile/address']);
    }

    editLastName() {
        this.canEditLastName = true;
        this.form.get('lastName')[this.canEditLastName ? 'enable' : 'disable']();
    }

    editEmail() {
        this.canEditEmail = true;
        this.form.get('email')[this.canEditEmail ? 'enable' : 'disable']();
    }

    editPhone() {
        this.canEditPhone = true;
        this.form.get('mobile')[this.canEditPhone ? 'enable' : 'disable']();
    }

    get_sp_image(event) {
        let files = event.target.files;
        if (files.length) {
            this.popupImage = files;
            const file = files[0];
            let img;
            img = new Image();
            this.sp_image_file1 = files[0];
            this.imageSize_sp = this.sp_image_file1.size;
            if (this.imageSize_sp != undefined && this.imageSize_sp > 10000000) {
                this._spinner.hide();
                this.modalRef.hide();
                this.showImageError = true;
                return;
            } else {
                this.showImageError = false;
                this._spinner.show();

                this.read_sp_image(file);

            }
        }
    }

    read_sp_image(file: File): void {
        // const reader = new FileReader();

        // reader.addEventListener('load', (event: Event) => {
        //   this.sp_image1 = (<any>event.target).result;
        //   this.sp_service_image = (<any>event.target).result;
        //   this.loadCroppie();
        //   this.checkImageAvail = false;
        // }, false);
        // reader.readAsDataURL(file);
        new ImageCompressor(file, {
            quality: .4,
            checkOrientation: true,
            success: (result) => {
                this.sp_image1 = URL.createObjectURL(result);

                // this.sp_image = URL.createObjectURL(result);
                this.sp_service_image = URL.createObjectURL(result);

                this.loadCroppie();
                this.checkImageAvail = false;
            },
            error: (e) => {
            }
        });

    }

    loadCroppie() {
        this.customImg = new Croppie(document.getElementById('jqueryCropper'), {
            enableExif: true,
            viewport: {
                width: 200,
                height: 200,
                type: 'circle'
            },
            boundary: {
                width: 300,
                height: 300
            }
        });

        this.customImg.bind({
            url: this.sp_image1
        });
        this._spinner.hide(4000);
    }

    addChild() {
        let obj = {
            grades: this.localGradeData,
            subjects: this.localSubjectData
        };
        if (this.otherSubject == true && this.otherSbject.value) {
            obj['otherSubject'] = this.otherSbject.value;
        }
        this.ParentService.setProfileData(obj);
        if (typeof this.ParentService.profile.sp_image == 'string') {
            this.ParentService.profile = {
                sp_image: this.ParentService.profile.sp_image,
                sp_image_file: this.ParentService.profile.sp_image_file
            };
        } else {
            this.ParentService.profile = {
                sp_image: this.sp_image,
                sp_image_file: this.sp_image_file
            };
        }
        localStorage.removeItem('goFromSession');
        this.router.navigate(['/pages/profile/add-child']);
    }

    deleteChild(id) {
        if (typeof this.ParentService.profile.sp_image == 'string') {
            this.ParentService.profile = {
                sp_image: this.ParentService.profile.sp_image,
                sp_image_file: this.ParentService.profile.sp_image_file
            };
        } else {
            this.ParentService.profile = {
                sp_image: this.sp_image,
                sp_image_file: this.sp_image_file
            };
        }
        if (id != undefined) {
            let dialogRef = this.dialog.open(ConfrimDeleteChild, {
                data: id
            });
        }
        // this.children.splice(id,1)

    }

    editAddress(address) {
        let obj = {
            grades: this.localGradeData,
            subjects: this.localSubjectData
        };
        if (this.otherSubject == true && this.otherSbject.value) {
            obj['otherSubject'] = this.otherSbject.value;
        }
        this.ParentService.setProfileData(obj);
        localStorage.setItem('editAddressId', JSON.stringify(address));
        if (typeof this.ParentService.profile.sp_image == 'string') {
            this.ParentService.profile = {
                sp_image: this.ParentService.profile.sp_image,
                sp_image_file: this.ParentService.profile.sp_image_file
            };
        } else {
            this.ParentService.profile = {
                sp_image: this.sp_image,
                sp_image_file: this.sp_image_file
            };
        }
        this.router.navigate(['/pages/profile/address']);

    }

    deleteAddress(address) {
        if (typeof this.ParentService.profile.sp_image == 'string') {
            this.ParentService.profile = {
                sp_image: this.ParentService.profile.sp_image,
                sp_image_file: this.ParentService.profile.sp_image_file
            };
        } else {
            this.ParentService.profile = {
                sp_image: this.sp_image,
                sp_image_file: this.sp_image_file
            };
        }
        if (address.isDefault == true) {
            this.toaster.clear();
            this.toaster.error('You cannot delete Home Address', 'Error');

        } else {
            if (address._id != undefined) {
                let dialogRef = this.dialog.open(ConfrimDeleteAddress, {
                    data: address
                });
            }
            // this.store.dispatch({
            //   type: profile.actionTypes.DELETE_ADDRESS,
            //   payload: address._id
            // });
        }

    }

    ngOnChanges() {
        this.errorMessage = null;
    }

    editChild(data) {
        if (typeof this.ParentService.profile.sp_image == 'string') {
            this.ParentService.profile = {
                sp_image: this.ParentService.profile.sp_image,
                sp_image_file: this.ParentService.profile.sp_image_file
            };
        } else {
            this.ParentService.profile = {
                sp_image: this.sp_image,
                sp_image_file: this.sp_image_file
            };
        }
        if (data != undefined) {
            let dialogRef = this.dialog.open(EditChildDialog, {
                data: {childData: data}
            });
        } else {

        }

    }

    tutorGrade(e) {

        this.tutorGrades[e.source.value] = e.checked;
        this.localGradeData = {};
        for (let data in this.tutorGrades) {
            if (this.tutorGrades[data]) {
                this.localGradeData[data] = this.tutorGrades[data];
            }
        }
    }

    tutorSubject(e) {
        this.tutorSubjects[e.source.value] = e.checked;
        if (e.source.value == 'other') {
            this.otherSubject = e.checked;
            this.otherSbject.setValue('');
            this.form.controls['otherSbject'].setValue('');
            if (e.checked) {
                this.form.controls['otherSbject'].setValidators([Validators.required]);
                this.form.controls['otherSbject'].updateValueAndValidity();
            } else {
                this.form.controls['otherSbject'].setValidators([]);
                this.form.controls['otherSbject'].updateValueAndValidity();
            }

        }

        this.localSubjectData = {};
        for (let data in this.tutorSubjects) {
            if (this.tutorSubjects[data]) {
                this.localSubjectData[data] = this.tutorSubjects[data];
            }
        }
    }

    getSubjects() {
        this._spinner.show();
        this.userService.getSubjects().subscribe((result) => {
                if (result.statusCode === 200) {
                    for (let i = 0; i < result.data.length; i++) {
                        let obj = {
                            _id: result.data[i]._id,
                            name: result.data[i].name
                        };
                        this.subjectList.push(obj);
                    }
                }
            }
            , (error) => {
                this._spinner.hide();
                // this.store.dispatch(new auth.AuthLogoutSuccessAction(error));
                if (error.statusCode == 401) {
                    this.store.dispatch(new auth.AuthLogoutAction(error));
                } else if (error.message) {
                    // this.dialog.closeAll();
                    // let dialogRef = this.dialog.open(CommonErrorDialog, {
                    //     data: { message: error.message }
                    // });
                }
            }
        );

    }

    isCheckedSubject(id) {
        if (this.userData && this.userData.parent)
            for (let subcat of this.userData.parent.subjects) {
                if (subcat._id == id) return true;
            }
        return false;
    }

    isCheckedSubject1(id) {
        if (this.userData && this.userData.parent)
            for (let i = 0; i < this.subjectList.length; i++) {
                if (this.subjectList[i]._id == id) return true;

            }
        return false;
    }

    isCheckedGrade(id) {
        if (this.userData && this.userData.parent && this.userData.parent.gradeLevel)
            for (let subcat of this.userData.parent.gradeLevel) {
                if (subcat == id) return true;
            }
        return false;
    }

    gotoContact() {
        this.router.navigate(['/pages/contact-us']);
    }

    ngOnDestroy() {
        if (this.profileStore && this.profileStore != undefined) {
            this.profileStore.unsubscribe();
        }
        // if(this.router.navigate(['/pages/profile/address']) || this.router.navigate(['/pages/profile/add-child'])){
        // }
        // else
        if (!(this.router.url === '/pages/profile/address' || this.router.url === '/pages/profile/add-child')) {
            this.ParentService.profile = {
                sp_image: File,
                sp_image_file: File
            };
        }
    }

}
