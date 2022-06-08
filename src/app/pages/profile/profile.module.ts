import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

import { NgPipesModule } from 'ngx-pipes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routing } from './profile.routing';
import { NgxPaginationModule } from 'ngx-pagination';
// import {MatInputModule} from '@angular/material/input';
import {
//     MatTabsModule,
    MatInputModule,
//     MatButtonModule,
//     MatAutocompleteModule,
    MatDatepickerModule,
    MatSelectModule,
//     MatTooltipModule,
//     MatCardModule,
//     MatChipsModule,
//     MatIconModule,
    MatDialogModule,
//     MatSortModule,
//     MatPaginatorModule,
//     MatNativeDateModule,
    MatCheckboxModule
} from '@angular/material';

import { Profile } from './profile.component';
import { AddressProfile } from './components/address/address-profile.component';
import { AddressDialog } from './components/address-dialog/address-dialog.component';
import { EditChildDialog } from './components/edit-child-dialog/edit-child-dialog.component';

import { ChangePassword } from './components/change-password/change-password.component';
import { NgaModule } from '../../theme/nga.module';
import { ParentProfile } from './components/parent-profile/parent-profile.component';
import { AddChild } from './components/add-child/add-child.component';
import { ConfrimDeleteAddress } from './components/confirm-delete-address-dialog/confirm-delete-address-component';
import { ConfrimDeleteChild } from './components/confirm-delete-child-dialog/confirm-delete-child-component';
// import { ImageCropperComponent, CropperSettings, Bounds } from 'ngx-img-cropper';
import { ModalModule } from 'ngx-bootstrap/modal';
import * as auth from '../../../../auth/state/auth.actions';
import { OutOfHourConfirmComponent } from './components/out-of-hour-confirm/out-of-hour-confirm.component';

// import { CommonErrorDialog } from '../../auth/model/common-error-dialog/common-error-dialog';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgaModule,
        NgxPaginationModule,
        routing,
        MatSelectModule,
        MatInputModule,
        NgbModalModule,
        MatDatepickerModule,
        MatDialogModule,
        NgPipesModule,
        MatCheckboxModule,
        MultiselectDropdownModule,
        ModalModule.forRoot()

    ],
    declarations: [
        Profile,
        ParentProfile,
        ChangePassword,
        AddressProfile,
        AddChild,
        AddressDialog,
        EditChildDialog,
        ConfrimDeleteAddress,
        ConfrimDeleteChild,
        OutOfHourConfirmComponent
        // CommonErrorDialog,
        // ImageCropperComponent

    ],
    entryComponents: [
        AddressDialog,
        EditChildDialog,
        ConfrimDeleteAddress,
        ConfrimDeleteChild,
        OutOfHourConfirmComponent
        // CommonErrorDialog

    ]

})
export class ProfileModule {
}
