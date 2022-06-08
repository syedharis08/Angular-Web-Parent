import { FaqComponent } from './socials/faq/faq.component';
import { ReferFriend } from './socials/referfriend/refer.component';
import { PaymentService } from './../services/payments/payments.service';

import { ReactiveFormsModule } from '@angular/forms';
import { PaymentsComponent } from './payments/components/payments.component';
// import { CalendarEventService } from './book-session/components/schedular/components/calender-event/calendar-event.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './pages.routing';
import { NgaModule } from '../theme/nga.module';
import { Pages } from './pages.component';
import { PagesMenuService } from './pages.menu';
import { TextMaskModule } from 'angular2-text-mask';
import { BaMsgCenterService } from '../theme/components/baMsgCenter/baMsgCenter.service';

//Material modules for usage in payment page
import { 
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatExpansionModule
 } from '@angular/material';
import { ContactComponent } from './socials/contact/contact.component';
import { CancelDialog } from './book-session/components/schedular/components/cancellation/cancel.component';
import { CancelSessionPoliciesDialog } from './all-sessions/components/cancel-session-policies/cancel-session-policies-dialog.component';


@NgModule({
    imports: [
        CommonModule, 
        NgaModule,
        routing,
        ReactiveFormsModule,
        TextMaskModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        MatRadioModule,
        MatExpansionModule
    ],
    declarations: [
        Pages,
        PaymentsComponent,
        ContactComponent,
        ReferFriend,
        FaqComponent,
        CancelDialog,
        CancelSessionPoliciesDialog
        
    ],
    entryComponents: [
        CancelDialog,
        CancelSessionPoliciesDialog
        // CompletedBookingDialog

    ],
    providers: [PagesMenuService, PaymentService,BaMsgCenterService],
  
})

export class PagesModule { }
