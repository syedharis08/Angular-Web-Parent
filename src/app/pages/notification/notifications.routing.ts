import { Routes, RouterModule } from '@angular/router';
import { Notifications } from './notifications.component';
//import { TopNotifications } from 'components/top/top-notifications-component'
//import { TopNotifications } from 'components/top/top-notifications-component'
import { AllNotifications } from './components/all-notifications/all-notifications.component';


const routes: Routes = [
    {
        path: '',
        component: Notifications,
        children: [
            //{ path: 'top-notifications', component:TopNotifications  },
            { path: 'all-notifications', component: AllNotifications }
        ]
    }
];

export const routing = RouterModule.forChild(routes);
