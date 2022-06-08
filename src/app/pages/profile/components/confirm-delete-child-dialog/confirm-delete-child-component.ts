import { Component, ViewChild, ViewChildren, QueryList, ElementRef, Renderer, Input, Output, EventEmitter, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as profile from '../../state/profile.actions';
import * as app from '../../../../state/app.actions';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { EmailValidator, EqualPasswordsValidator, NameValidator } from '../../../../theme/validators';
import { BaThemeSpinner } from '../../../../theme/services';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import 'style-loader!./confirm-delete-child.component.scss';

@Component({
    selector: 'confirm-delete-child',
    templateUrl: `./confirm-delete-child.component.html`
})
export class ConfrimDeleteChild {



    constructor(
        public dialogRef: MatDialogRef<ConfrimDeleteChild>,
        @Inject(MAT_DIALOG_DATA) public childData: any,
        private renderer: Renderer,
        private store: Store<any>,
        private fb: FormBuilder,
        private router: Router,
        private modalService: NgbModal) {
        // window.scroll(0, 0);
        let el = $('#moveUp');
        $('html,body').animate({ scrollTop: (el.offset().top - 50) }, 'slow', () => {
            el.focus();
        });


    }
    ngOnInit() {


    }
    deleteChild() {
        if (this.childData != undefined) {
            this.store.dispatch({
                type: profile.actionTypes.DELETE_CHILD,
                payload: this.childData._id
            });
        }
    }
    closeDialog() {
        this.dialogRef.close();
    }

    //File uploader








}
