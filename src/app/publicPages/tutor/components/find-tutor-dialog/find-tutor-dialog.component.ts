import { Component, Renderer, NgZone } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';
import { BaThemeSpinner } from '../../../../theme/services';
import 'style-loader!./find-tutor-dialog.scss';
import { Store } from '@ngrx/store';
import * as tutor from '../../state/tutor.actions';

@Component({
    selector: 'find-tutor-dialog',
    templateUrl: './find-tutor-dialog.html',
})

export class FindTutor {
    public form2: FormGroup;
    public zipcode: AbstractControl;

    constructor(private fb: FormBuilder, private baThemeSpinner: BaThemeSpinner, private toastrService: ToastrService,
                private renderer: Renderer, private dialog: MatDialog, public zone: NgZone, private store: Store<any>,
    ) {
        // window.scroll(0, 0);
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
        this.form2 = fb.group({
            'zipcode': ['', Validators.compose([Validators.required, Validators.pattern(/^\d{5}$/)])],
        });

        this.zipcode = this.form2.controls['zipcode'];
    }

    closeDialog() {
        this.dialog.closeAll();
    }

    onSubmit(value) {
        if (value) {
            this.zone.runOutsideAngular(() => {

                this.store.dispatch({
                    type: tutor.actionTypes.FIRST_GET_LAT_LONG,
                    payload: value.zipcode
                });
            });
        } else {
        }
    }

}
