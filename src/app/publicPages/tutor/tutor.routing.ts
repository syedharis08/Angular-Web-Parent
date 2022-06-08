import { Routes, RouterModule } from '@angular/router';

import { Tutor } from './tutor.component';
import { BrowseTutor } from './components/browse-tutor/browse-tutor.component';
import { TutorDetails } from './components/tutor-details/tutor-details.component';
import { ModuleWithProviders } from '@angular/core';
import { MyLoginComponent } from './components/my-login';

export const routes: Routes = [
    {
        path: '',
        component: Tutor,
        children: [
            { path: '', redirectTo: 'browse-tutor', pathMatch: 'full' },
            { path: 'browse-tutor', component:BrowseTutor },
            { path: 'tutor-details', component:TutorDetails },
            { path: 'my-login', component:MyLoginComponent },
            //   { path: 'profile', loadChildren: 'app/pages/profile/profile.module#ProfileModule',canActivate: [AuthGuard] },

        ]
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
