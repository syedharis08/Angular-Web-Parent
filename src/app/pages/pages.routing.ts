import { ContactComponent } from './socials/contact/contact.component';
import { PaymentsComponent } from './payments/components/payments.component';
import { Routes, RouterModule } from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders, Component } from '@angular/core';
import { AuthGuard } from '../auth/service/auth-service/auth-guard.service';
import { AuthGuardAdmin } from '../auth/service/auth-service/auth-guard-admin.service';
import { AuthGuardCustomer } from '../auth/service/auth-service/auth-guard-customer.service';
import { AuthGuardServiceProvider } from '../auth/service/auth-service/auth-guard-service-provider.service';
import { AuthGuardDriver } from '../auth/service/auth-service/auth-guard-driver.service';
import { ReferFriend } from './socials/referfriend/refer.component';
import { FaqComponent } from './socials/faq/faq.component';
// import { BrowseTutor } from '../publicPages/components/browse-tutor/browse-tutor.component';

export const routes: Routes = [

    {
        path: 'pages',
        component: Pages,

        children: [
            { path: 'home', redirectTo: '/home/browse-tutor', pathMatch: 'full' },
            { path: '', redirectTo: 'all-sessions', pathMatch: 'full' },
            { path: 'profile', loadChildren: 'app/pages/profile/profile.module#ProfileModule', canActivate: [AuthGuard] },
            { path: 'book-session', loadChildren: 'app/pages/book-session/book-session.module#BookSessionModule', canActivate: [AuthGuardCustomer] },
            { path: 'all-sessions', loadChildren: 'app/pages/all-sessions/all-sessions.module#AllSessionsModule', canActivate: [AuthGuard] },
            { path: 'session-reports', loadChildren: 'app/pages/session-report/session-report.module#SessionReportModule', canActivate: [AuthGuard] },
            { path: 'payments', component: PaymentsComponent, canActivate: [AuthGuard] },
            { path: 'contact-us', component: ContactComponent, canActivate: [AuthGuard] },
            { path: 'refer-friend', component: ReferFriend, canActivate: [AuthGuard] },
            // { path: 'disputes', loadChildren: 'app/pages/disputes/disputes.module#AllDisputesModule' },
            { path: 'faq', component: FaqComponent, canActivate: [AuthGuard] },
            
            { path: 'notification', loadChildren: 'app/pages/notification/notifications.module#NotificationsModule',canActivate: [AuthGuard] },
        ]
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
