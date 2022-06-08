import { Component, Renderer, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as profile from '../../state/profile.actions';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import 'style-loader!./confirm-delete-address.component.scss';

@Component({
    selector: 'confirm-delete-address',
    templateUrl: `./confirm-delete-address.component.html`
})
export class ConfrimDeleteAddress {

    constructor(
        public dialogRef: MatDialogRef<ConfrimDeleteAddress>, @Inject(MAT_DIALOG_DATA) public childData: any,
        private renderer: Renderer, private store: Store<any>) {
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
    }

    ngOnInit() {
    }

    deleteAddress() {
        if (this.childData != undefined) {
            this.store.dispatch({
                type: profile.actionTypes.DELETE_ADDRESS,
                payload: this.childData._id
            });
        }
    }
    closeDialog() {
        this.dialogRef.close();
    }

}
