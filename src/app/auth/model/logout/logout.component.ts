import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import * as profile from '../../state/profile.actions';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator, NameValidator } from '../../../../theme/validators';
import { ActivatedRoute } from '@angular/router';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import * as auth from '../../../auth/state/auth.actions';
// import 'style-loader!./logout.scss';

@Component({
    selector: 'logout-dialog',
    templateUrl: 'logout.html',
    styleUrls: ['./logout.scss'],

})

export class LogoutDialog {
    constructor(public dialogRef: MatDialogRef<LogoutDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private store: Store<any>,
        private toastrService: ToastrService) {
    }
    closeDialog() {
        this.dialogRef.close();
    }
    ngOnInit() {
    }
    logout() {
        this.store.dispatch({
            type: auth.actionTypes.JUST_LOGOUT,
        });

    }




}
