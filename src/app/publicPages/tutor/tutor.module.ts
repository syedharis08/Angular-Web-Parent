import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { BrowseTutor } from './components/browse-tutor/browse-tutor.component';
import { routing } from './tutor.routing';
// import { MatInputModule } from '@angular/material/input';
import { TutorDetails } from './components/tutor-details/tutor-details.component';
import { SliderModule } from 'primeng/primeng';
// import { SidebarModule } from 'ng-sidebar';

import { Tutor } from './tutor.component';
// import { NouisliderModule } from 'ng2-nouislider';
// import { NouisliderComponent } from 'ng2-nouislider';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoginDialog } from '../../auth/model/session-login-dialog/session-login-dialog.component';
import { FindTutor } from './components/find-tutor-dialog/find-tutor-dialog.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StarRatingModule } from 'angular-star-rating';


// import {CompleteProfileDialog} from '../../auth/model/complete-profile-dialog/complete-profile-dialog.component';
import {
    MatInputModule,
    MatButtonModule,
    // MatIconModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    MatSelectModule,
    MatDialogModule,
    MatExpansionModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSidenavModule,
} from '@angular/material';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { MyLoginComponent } from './components/my-login';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgaModule,
        routing,
        MatInputModule,
        SliderModule,
        StarRatingModule.forRoot(),
        MatButtonModule,
        InfiniteScrollModule,

        NgbModule,

        // MatAutocompleteModule,
        // MatIconModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatSidenavModule,
        MatSelectModule,
        MatRadioModule,
        MatTabsModule,
        MatSelectModule,
        MatDialogModule,
        MatExpansionModule,
        MatTooltipModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NgxPaginationModule,

    ],
    declarations: [
        BrowseTutor,
        TutorDetails,
        Tutor,
        LoginDialog,
        FindTutor,
        MyLoginComponent
        // CompleteProfileDialog
        // NouisliderComponent
    ],
    entryComponents: [
        LoginDialog,
        FindTutor,
        // CompleteProfileDialog
    ]
})
export class TutorModule { }
