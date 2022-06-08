import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
// import * as profile from '../../state/profile.actions';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator, NameValidator } from '../../../../theme/validators';
import { ActivatedRoute } from '@angular/router';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { Router } from '@angular/router';
// import * as auth from '../../../auth/state/auth.actions';
import 'style-loader!./complete-profile-dialog.scss';

@Component({
    selector: 'complete-profile-dialog',
    templateUrl:'./complete-profile.html'
})


export class CompleteProfileDialog {


    constructor(public dialogRef: MatDialogRef<CompleteProfileDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private store: Store<any>,
        private toastrService: ToastrService,
        private router: Router) {




    }
    closeDialog() {
        this.dialogRef.close();
    }
    ngOnInit() {

    }
    goToProfile() {
        this.dialogRef.close();
        localStorage.setItem('comeFromDialog','true');
        this.router.navigate(['/pages/profile/parent-profile']);
    }





}