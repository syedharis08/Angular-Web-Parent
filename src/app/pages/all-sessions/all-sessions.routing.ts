import { Routes, RouterModule } from '@angular/router';
import { AllSession } from './all-sessions.component';
import { SessionDetail } from './components/session-details/session-details.component';
import { SingleSessionDetail } from './components/single-session-detail/single-session-detail.component';
import { RescheduleSession } from './components/reschedule-session/reschedule-session.component';
import { RescheduleSessionDetail } from './components/reschedule-session-detail/reschedule-session-detail.component';
import { SingleDispute } from './components/single-dispute/single-dispute.component';
import { SelectPaymentsTutorComponent } from './components/select-payment/components/select-payments.component';
import { SessionInvoiceComponent } from './components/session-invoice/session-invoice.component';

const routes: Routes = [
    {
        path: '',
        component: AllSession,
        children: [
            { path: '', redirectTo: 'sessions', pathMatch: 'full' },
            { path: 'sessions', component: SessionDetail },
            { path: 'session-invoice', component: SessionInvoiceComponent },
            { path: 'session-details', component: SingleSessionDetail },
            { path: 'reschedule-session', component: RescheduleSession },
            { path: 'reschedule-session-detail', component: RescheduleSessionDetail },
            { path: 'dispute-detail', component: SingleDispute },
            { path: 'Select-payment', component: SelectPaymentsTutorComponent },

        ]
    }



];

export const routing = RouterModule.forChild(routes);
