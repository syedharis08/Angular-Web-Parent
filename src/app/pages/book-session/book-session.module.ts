// import { CalendarEventService } from './components/schedular/components/calender-event/calendar-event.service';
import { CalendarEventComponent } from './components/schedular/components/calender-event/calendar-event.component';
import { CalenderComponent } from './components/schedular/components/calender/calender.component';
import { Schedular } from './components/schedular/schedular.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgPipesModule } from 'ngx-pipes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routing } from './book-session.routing';
import { NgxPaginationModule } from 'ngx-pagination';
import { StarRatingModule } from 'angular-star-rating';
import { SliderModule } from 'primeng/primeng';
// import {MatInputModule} from '@angular/material/input';
import {
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatStepperModule,
    MatChipsModule,
    MatCheckboxModule,
    MatSliderModule,
    MatButtonModule,
    // MatIconModule,
    MatRadioModule,
    MatExpansionModule,
    MatTooltipModule,
    MatSidenavModule,

    
   
} from '@angular/material';

import { NgaModule } from '../../theme/nga.module';
import { BookSession } from './book-session.component';
import { Session } from './components/session/session.component';
import { AllSubjects } from './components/all-subjects/all-subjects.component';
import { SelectTutor } from './components/select-tutor/select-tutor.component';
import { SelectTutorDetails } from './components/select-tutor-details/select-tutor-details.component';
import { SelectPaymentsComponent } from './components/select-payment/components/select-payments.component';
import { CancelDialog } from './components/schedular/components/cancellation/cancel.component';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { MultipleSessionComponent } from './components/schedular/components/multiple-session/multiple-session.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        StarRatingModule,
        SliderModule,
        ReactiveFormsModule,
        NgaModule,
        NgxPaginationModule,
        routing,
        MatSelectModule,
        MatInputModule,
        NgbModalModule,
        MatDatepickerModule,
        MatStepperModule,
        MatSliderModule,
        NgPipesModule,
        MultiselectDropdownModule,
        MatChipsModule,
        MatCheckboxModule,
        MatRadioModule,
        MatExpansionModule,
        MatTooltipModule,
        MatSidenavModule,
        NgbModule,
        InfiniteScrollModule,

        // SchedularModule

    ],
    declarations: [
        BookSession,
        Session,
        AllSubjects,
        MultipleSessionComponent,
        Schedular,
        CalenderComponent,
        CalendarEventComponent,
        SelectTutor,
        SelectTutorDetails,
        SelectPaymentsComponent,
        // CompletedBookingDialog

        
    ],
   
    providers: [
        // CalendarEventService

    ]

})
export class BookSessionModule { }
