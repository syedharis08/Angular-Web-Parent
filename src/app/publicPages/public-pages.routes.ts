import { Routes, RouterModule } from '@angular/router';
import { PublicPages } from './public-pages.component';
import { Pages } from './../pages/pages.component';
import { Login } from './components/login/login.component';
// import { BrowseTutor } from './tutor/components/browse-tutor/browse-tutor.component';
 import { Tutor } from './tutor/tutor.component';
import { Address } from './components/address/address.component';
import { Verification } from './components/verification/verification.component';
import { Terms } from './components/terms/terms.component';
import { VerificationEmail } from './components/verification-email/verification-email.component';
import { VerificationMobile } from './components/verification-mobile/verification-mobile.component';
import { Documents } from './components/document/document.component';
import { AuthGuardPublic } from '../auth/service/auth-service/auth-guard-public.service';
import { AuthGuardDriver } from '../auth/service/auth-service/auth-guard-driver.service';
export const routes: Routes = [
    {
        path: '',
        component: PublicPages,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full'  },
            { path: 'home', loadChildren: 'app/publicPages/tutor/tutor.module#TutorModule' ,canActivate: [AuthGuardPublic]},
            { path: 'pages', component: Pages },
            // { path: 'home', component: BrowseTutor },
            // { path: 'tutor-details', component: TutorDetails  },
            // { path: 'address', component: Address, canActivate: [AuthGuardPublic] },
            // { path: 'document', component: Documents, canActivate: [AuthGuardPublic] },
            //  { path: 'verification', component: Verification, canActivate: [AuthGuardPublic] },
            // { path: 'verifyEmail', component: VerificationEmail, canActivate: [AuthGuardPublic] },
            // { path: 'verifyMobile', component: VerificationMobile, canActivate: [AuthGuardPublic] },
            // { path: 'terms', component: Terms, canActivate: [AuthGuardPublic] }
        ]
    }
];
export const routing = RouterModule.forChild(routes);
