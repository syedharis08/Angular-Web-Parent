import { Routes, RouterModule } from '@angular/router';
import { Profile } from './profile.component';
import { ParentProfile } from './components/parent-profile/parent-profile.component';
import { ChangePassword } from './components/change-password/change-password.component';
import { AddressProfile } from './components/address/address-profile.component';
import { AddChild } from './components/add-child/add-child.component';
const routes: Routes = [
    {
        path: '',
        component: Profile,
        children: [
            { path: '', redirectTo: 'parent-profile', pathMatch: 'full' },  
            { path: 'parent-profile', component:ParentProfile },
            { path: 'change-password', component:ChangePassword },
            { path: 'address', component:AddressProfile },
            { path: 'add-child', component:AddChild }
        ]
    }
];

export const routing = RouterModule.forChild(routes);
