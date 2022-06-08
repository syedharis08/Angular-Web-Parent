
import {  Payments , PaymentEffects } from './pages/payments/state';
import { schedular, SchedularEffects } from './pages/book-session/components/schedular/state';
import { reschedular, ReSchedularEffects } from './pages/all-sessions/components/re-schedular/state';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreLogMonitorModule, useLogMonitor } from '@ngrx/store-log-monitor';
import { EffectsModule } from '@ngrx/effects';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { app, AppEffects } from './state';
import { auth, AuthEffects } from './auth/state';

import { profile, ProfileEffects } from './pages/profile/state';
import { session, BookSessionEffects } from './pages/book-session/state';
import { reports, ReportsEffects } from './pages/session-report/state';
import { sessionsDetails, ALLSessionEffects } from './pages/all-sessions/state';
import { disputes, DisputesEffects } from './pages/disputes/state';
import {  selectPayments , SelectPaymentEffects } from './pages/book-session/components/select-payment/state';
import { tutor, TutorEffects } from './publicPages/tutor/state';

import { notification, NotificationEffects } from './pages/notification/state';

@NgModule({
    imports: [
        StoreModule.provideStore({
            app,
            auth,
            tutor,
            profile,
            notification,
            session,
            sessionsDetails,
            schedular,
            reschedular,
            Payments,
            selectPayments,
            reports,
            disputes
        }),

        StoreDevtoolsModule.instrumentStore({
            monitor: useLogMonitor({
                visible: false,
                position: 'right'
            })
        }),

        EffectsModule.run(AppEffects),
        EffectsModule.run(TutorEffects),
        EffectsModule.run(AuthEffects),       
        EffectsModule.run(NotificationEffects),  
        EffectsModule.run(ProfileEffects),
        EffectsModule.run(BookSessionEffects),
        EffectsModule.run(ReportsEffects),
        EffectsModule.run(ALLSessionEffects),
        EffectsModule.run(SchedularEffects),
        EffectsModule.run(PaymentEffects),
        EffectsModule.run(DisputesEffects),
        EffectsModule.run(ReSchedularEffects),
        EffectsModule.run(SelectPaymentEffects),
    ],
})

export class AppStoreModule { }
