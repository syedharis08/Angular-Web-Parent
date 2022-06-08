import { Component, ViewChild, ElementRef, Renderer, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as profile from '../../state/profile.actions';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { NameValidator } from '../../../../theme/validators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import 'style-loader!./edit-child-dialog.scss';
import { CommonService } from '../../../../services/common.service';

@Component({
    selector: 'edit-child-dialog',
    templateUrl: `./edit-child-dialog.html`
})
export class EditChildDialog {
    showArrayError: boolean = false;
    showAgeError: boolean;
    public loggedIn: boolean;
    public profileData: any = {};
    public currentUser: any;
    lastDateInput: Date | null;
    public profileStore;
    userData;
    public form: FormGroup;
    @ViewChild('docUpload') public _docUpload: ElementRef;
    public school: AbstractControl;
    public firstName: AbstractControl;
    public lastName: AbstractControl;
    public dob: AbstractControl;
    public age: AbstractControl;
    public document: AbstractControl;
    public address: AbstractControl;
    public grade: AbstractControl;
    public gender: AbstractControl;
    public editChildData;
    public docArray: any = [];
    public childDocArray: any = [];
    public sendDocs: any = [];
    public deleteDocArray: any = [];
    public formData: any;
    public maxDate = new Date();
    public deleteId: any = [];
    public studentId: string;
    curAge;

    constructor(public dialogRef: MatDialogRef<EditChildDialog>, @Inject(MAT_DIALOG_DATA) public childData: any,
                private renderer: Renderer, private store: Store<any>, private fb: FormBuilder,
                public commonService: CommonService) {
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
        this.deleteId = [];
        this.form = fb.group({
            firstName: ['', Validators.compose([Validators.required, Validators.pattern(commonService.CONSTANT.namePattern), Validators.maxLength(64)])],
            lastName: ['', Validators.compose([Validators.required, Validators.pattern(commonService.CONSTANT.namePattern), Validators.maxLength(64)])],
            dob: ['', Validators.compose([Validators.required])],
            age: ['', Validators.compose([Validators.required])],
            gender: ['', Validators.compose([Validators.required, NameValidator.seltBox])],
            grade: ['', Validators.compose([Validators.required, NameValidator.seltBox])],
            school: ['', Validators.compose([])]
        });

        this.firstName = this.form.controls['firstName'];
        this.lastName = this.form.controls['lastName'];
        this.school = this.form.controls['school'];
        this.age = this.form.controls['age'];
        this.dob = this.form.controls['dob'];
        this.gender = this.form.controls['gender'];
        this.grade = this.form.controls['grade'];
        this.gender.setValue('select');
        this.grade.setValue('select');

        if (this.childData && this.childData != undefined) {
            if (this.childData && this.childData.childData) {
                this.editChildData = this.childData.childData;
                if (this.editChildData && this.editChildData != undefined) {
                    this.firstName.setValue(this.editChildData.firstName ? this.editChildData.firstName : '');
                    this.lastName.setValue(this.editChildData.lastName ? this.editChildData.lastName : '');
                    this.school.setValue(this.editChildData.school ? this.editChildData.school : '');
                    let result;
                    if (this.editChildData.dob) {
                        this.curAge = new Date(this.editChildData.dob);
                        result = this.calculateAge(this.curAge);
                        let newdate = new Date(this.editChildData.dob);
                        let finalDate = new Date(newdate.getUTCFullYear(), newdate.getUTCMonth(), newdate.getUTCDate()).toUTCString();
                        let newd = new Date(finalDate);
                        this.dob.setValue((newd != undefined) ? newd : '');
                    }
                    this.age.setValue(result ? result : this.editChildData.age);
                    this.gender.setValue(this.editChildData.gender ? this.editChildData.gender : '');
                    this.grade.setValue(this.editChildData.gradeLevel ? this.editChildData.gradeLevel : '');
                    this.studentId = this.editChildData._id;
                    if (this.editChildData.academicReports && this.editChildData.academicReports != undefined) {
                        this.childDocArray = this.editChildData.academicReports;
                    }
                }
            }
        }
    }

    ngOnInit() {
    }

    addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
        let selectedDate = event.value;
        this.calculateAge(selectedDate);
    }

    onUpdateClick(data) {
    }

    calculateAge(data) {
        let age;
        if (data && data != undefined) {
            let ageDifMs = Date.now() - data.getTime();
            let ageDate = new Date(ageDifMs); // miliseconds from epoch
            let birthdate = Math.abs(ageDate.getUTCFullYear() - 1970);
            age = birthdate.toString();
            this.age.setValue(age);
        } else {
            this.age.setValue('0');
        }
        return age;
    }

    //File uploader
    docFileSelector(): boolean {
        this.renderer.invokeElementMethod(this._docUpload.nativeElement, 'click');
        return false;
    }

    fileChange(event) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            this.childDocArray.push(file);
            this.sendDocs.push(file);
        }
    }

    deleteDocArrayDoc(id) {
        this.docArray.splice(id, 1);
    }

    deleteDoc(id) {
        this.deleteDocArray = (this.childDocArray.splice(id, 1));
        for (let i = 0; i < this.deleteDocArray.length; i++) {
            if (this.deleteDocArray[i]._id && this.deleteDocArray[i]._id != undefined) {
                this.deleteId.push(this.deleteDocArray[i]._id);
            }
        }
    }

    closeDialog() {
        this.dialogRef.close();
    }

    onSubmit(values) {
        if (this.form.invalid) {
            if (values.dob == '') {
                this.showAgeError = true;
            }
        }
        if (this.childDocArray.length > 4) {
            this.showArrayError = true;
            return;

        } else {
            this.showArrayError = false;
        }
        if (this.form.valid) {
            this.showAgeError = false;

            let dob = new Date(values.dob);
            let date = dob.getDate();
            let month = dob.getMonth();
            let year = dob.getFullYear();
            let dobDate = new Date(Date.UTC(year, month, date)).toUTCString();
            let id = this.studentId;
            let formData = new FormData();
            if (values) {
                formData.append('firstName', values.firstName);
                formData.append('lastName', values.lastName);
                formData.append('dob', dobDate);
                formData.append('age', values.age);
                formData.append('gender', values.gender);
                formData.append('gradeLevel', values.grade);
                formData.append('school', values.school);
                if (this.sendDocs != undefined && this.sendDocs.length > 0) {
                    for (let i = 0; i < this.sendDocs.length; i++) {
                        formData.append('academicReports', this.sendDocs[i]);
                    }
                }
                if (this.deleteId.length > 0) {
                    formData.append('academicReportsIdsToDelete', JSON.stringify(this.deleteId));
                }
            }
            this.store.dispatch({
                type: profile.actionTypes.EDIT_CHILD,
                payload: {formData: formData, id: id}
            });
        }
    }

}
