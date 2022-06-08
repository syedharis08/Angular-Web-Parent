import { BookSessionService } from '../../../../services/session-service/session.service';
import { Component, Renderer, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';

@Component({
    selector: 'contact-tutor-dialog',
    templateUrl: `./contact-tutor-dialog.component.html`,
    styleUrls: ['./contact-tutor-dialog.component.scss']
})
export class ContactTutorDialog {
    public form: FormGroup;
    message: any;
    public contactText: AbstractControl;

    constructor(
        public dialogRef: MatDialogRef<ContactTutorDialog>, @Inject(MAT_DIALOG_DATA) public Data: any, private dialog: MatDialog,
        private renderer: Renderer, private store: Store<any>, private fb: FormBuilder, private router: Router,
        private toastservice: ToastrService, private booksessionservice: BookSessionService,
        public commonService: CommonService) {

        this.form = fb.group({
            'contactText': ['', Validators.compose([Validators.required])]
        });
        this.contactText = this.form.controls['contactText'];
    }

    ngOnInit() {
        // window.scroll(0, 0);
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
    }

    closeDialog() {
        this.dialog.closeAll();
    }

    onSubmit(value) {
        this.fireAllErrors(this.form);
        if (this.form.valid) {
            let fd = new FormData();
            fd.append('bookingId', this.Data);
            fd.append('message', value.contactText);

            this.booksessionservice.contactTutor(fd).subscribe((result) => {
                    if (result.statusCode == 200) {
                        // this.toastservice.success('Request sent Successfully!', 'Success');
                        this.dialogRef.close();

                    }
                },
                (error) => {
                    // this.toastservice.error(error.message, 'Error');
                    this.dialogRef.close();
                }
            );
        }

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

}

