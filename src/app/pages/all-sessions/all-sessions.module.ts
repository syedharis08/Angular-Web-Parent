import { RatingDialog } from './components/rating/rating.component';
// import { RaiseDisputeDialog } from './components/raise-dispute/raise-dispute.component';
// import { ContactTutorDialog } from './components/contact-tutor/contact-tutordialog.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModalModule, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
// import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

import { NgPipesModule } from 'ngx-pipes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routing } from './all-sessions.routing';
import { NgxPaginationModule } from 'ngx-pagination';
// import {MatInputModule} from '@angular/material/input';
import { StarRatingModule } from 'angular-star-rating';
import {
    MatRadioModule,
    MatExpansionModule,
    MatInputModule,
    MatCardModule,
    // MatDatepickerModule,
    // MatSelectModule,
    // MatStepperModule,
    // MatChipsModule,
    // MatCheckboxModule,
    // MatSliderModule,
    MatTabsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatChipsModule,
    MatSliderModule,
    MatButtonModule,
    MatTooltipModule
} from '@angular/material';

import { NgaModule } from '../../theme/nga.module';
import { AllSession } from './all-sessions.component';
import { SessionDetail } from './components/session-details/session-details.component';
import { SingleSessionDetail } from './components/single-session-detail/single-session-detail.component';
import { CancelSessionDialog } from './components/cancel-session/cancel-session-dialog.component';
// import { CancelSessionPoliciesDialog } from './components/cancel-session-policies/cancel-session-policies-dialog.component';
import { RescheduleSession } from './components/reschedule-session/reschedule-session.component';
// import { CalendarEventService } from './../services/calender-service/calendar-event.service';
import { CalendarEventComponent } from './components/re-schedular/components/calender-event/calendar-event.component';
import { CalenderComponent } from './components/re-schedular/components/calender/calender.component';
import { ReSchedular } from './components/re-schedular/re-schedular.component';
import { RescheduleSessionDetail } from './components/reschedule-session-detail/reschedule-session-detail.component';
import { SingleDispute } from './components/single-dispute/single-dispute.component';
import { SelectPaymentsTutorComponent } from './components/select-payment/components/select-payments.component';
import { SessionInvoiceComponent } from './components/session-invoice/session-invoice.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgaModule,
        NgxPaginationModule,
        routing,
        MatRadioModule,
        MatExpansionModule,
        NgbModalModule,
        StarRatingModule.forRoot(),
        MatCardModule,
        // MatStepperModule,
        MatInputModule,
        NgPipesModule,
        // MultiselectDropdownModule,
        // MatChipsModule,
        // MatCheckboxModule,
        MatTabsModule,
        MatSelectModule,
        NgbRatingModule,
        MatInputModule,
        MatDatepickerModule,
        MatSelectModule,
        MatChipsModule,
        MatCheckboxModule,
        MatSliderModule,
        MatButtonModule,
        // MatIconModule,
        MatRadioModule,
        MatExpansionModule,
        MatTooltipModule,


    ],
    declarations: [
        AllSession,
        SessionDetail,
        SessionInvoiceComponent,
        SingleSessionDetail,
        CancelSessionDialog,
        // CancelSessionPoliciesDialog,
        RescheduleSession,
        ReSchedular,
        CalenderComponent,
        CalendarEventComponent,
        SelectPaymentsTutorComponent,
        SingleDispute,
        // RaiseDisputeDialog,
        RescheduleSessionDetail,
        RatingDialog

        // Session,
        // AllSubjects,
    ],
    entryComponents: [
        CancelSessionDialog,
        // CancelSessionPoliciesDialog,
        // ContactTutorDialog,
        // RaiseDisputeDialog,
        RatingDialog

    ],

})
export class AllSessionsModule { }
