import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as profile from '../../state/profile.actions';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { NameValidator } from '../../../../theme/validators';
import { Router } from '@angular/router';
import 'style-loader!./add-child.scss';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Subscription } from 'rxjs/Rx';
import { CommonService } from '../../../../services/common.service';

@Component({
    selector: 'add-child',
    templateUrl: './add-child.html'
})
export class AddChild {
    dateToSend: Date;
    public loggedIn: boolean;
    public profileData: any = {};
    public currentUser: any;
    public showFirstnameError: boolean = false;
    public showLastnameError: boolean = false;
    public showGenderError: boolean = false;
    public showGradeError: boolean = false;
    public showSchoolError: boolean = false;
    lastDateInput: Date | null;
    public profileStore: Subscription;
    userData;
    public form: FormGroup;
    public secondStepForm: FormGroup;

    // @ViewChild('fileUpload') public _fileUpload: ElementRef;
    @ViewChild('docUpload') public _docUpload: ElementRef;
    // onDateInput = (e: MatDatepickerInputEvent<Date>) => this.lastDateInput = e.value;
    public school: AbstractControl;
    public firstName: AbstractControl;
    public lastName: AbstractControl;
    public dob: AbstractControl;
    public age: AbstractControl;
    public document: AbstractControl;
    public address: AbstractControl;
    public grade: AbstractControl;
    public dobModel;
    public gender: AbstractControl;
    public docArray: any = [];
    public showArrayError: boolean;
    public formData: any;
    public maxDate = new Date();
    public showAgeError: boolean;

    constructor(        private renderer: Renderer,        private store: Store<any>,        private fb: FormBuilder,
        public commonService: CommonService) {

        this.form = fb.group({
            firstName: ['', Validators.compose([Validators.required, Validators.pattern(commonService.CONSTANT.namePattern), Validators.maxLength(64)])],
            lastName: ['', Validators.compose([Validators.required, Validators.pattern(commonService.CONSTANT.namePattern), Validators.maxLength(64)])],
            dob: ['', Validators.compose([Validators.required])],
            age: ['', Validators.compose([Validators.required])],
            gender: ['', Validators.compose([Validators.required, NameValidator.seltBox])],
            grade: ['', Validators.compose([Validators.required, NameValidator.seltBox])],
            school: ['', Validators.compose([])]
        });
        this.showArrayError = false;
        this.firstName = this.form.controls['firstName'];
        this.lastName = this.form.controls['lastName'];
        this.school = this.form.controls['school'];
        this.age = this.form.controls['age'];
        this.dob = this.form.controls['dob'];
        this.gender = this.form.controls['gender'];
        this.grade = this.form.controls['grade'];
        this.gender.setValue('select');
        this.grade.setValue('select');

    }

    ngOnInit() {
        // window.scroll(0, 0);
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
    }

    addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
        let selectedDate = event.target.value;
        let date = selectedDate.getDate();
        let month = selectedDate.getMonth();
        let year = selectedDate.getFullYear();
        this.dateToSend = new Date(year, month, date);
        this.dobModel = this.dateToSend;
        this.calculateAge(selectedDate);

    }

    onUpdateClick(data) {

    }

    calculateAge(data) {
        if (data && data != undefined) {
            let ageDifMs = Date.now() - data.getTime();
            let ageDate = new Date(ageDifMs); // miliseconds from epoch

            let birthdate = Math.abs(ageDate.getUTCFullYear() - 1970);
            let age = birthdate.toString();
            this.age.setValue(age);
        } else {
            this.age.setValue('0');
        }

    }

    //File uploader
    docFileSelector(): boolean {
        this.renderer.invokeElementMethod(this._docUpload.nativeElement, 'click');
        return false;
    }

    fileChange(event) {
        this.showArrayError = false;

        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            this.docArray.push(file);
        }

    }

    onSubmit(values) {
        if (this.form.invalid) {
            this.fireAllErrors(this.form);
            let el = $('#moveUp');
            $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
                el.focus();
            });
        } else {
            if (this.docArray.length > 4) {
                this.showArrayError = true;
                return;
            } else {
                this.showArrayError = false;
            }
            if (this.form.valid) {
                this.showFirstnameError = false;
                this.showSchoolError = false;
                this.showGradeError = false;
                this.showGenderError = false;
                this.showAgeError = false;
                this.showLastnameError = false;
                let formData = new FormData();
                if (values) {
                    formData.append('firstName', values.firstName);
                    formData.append('lastName', values.lastName);
                    formData.append('dob', this.dateToSend.toDateString());
                    formData.append('age', values.age);
                    formData.append('gender', values.gender);
                    formData.append('gradeLevel', values.grade);

                    formData.append('school', values.school || '');

                    if (this.docArray && this.docArray.length > 0) {
                        for (let i = 0; i < this.docArray.length; i++) {
                            formData.append('academicReports', this.docArray[i]);
                        }
                    }

                }
                this.store.dispatch({
                    type: profile.actionTypes.ADD_CHILD,
                    payload: formData
                });
            } else {
                let el = $('#moveUp');
                $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
                    el.focus();
                });
            }
        }
    }

    deleteDoc(id) {
        this._docUpload.nativeElement.value = null;
        this.docArray.splice(id, 1);
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

    ngOnDestroy() {
        if (this.profileStore && this.profileStore != undefined) {
            this.profileStore.unsubscribe();
        }
    }

}
