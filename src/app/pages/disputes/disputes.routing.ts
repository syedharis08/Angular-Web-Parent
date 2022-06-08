import { Routes, RouterModule } from '@angular/router';
import { SingleDispute } from './components/single-dispute/single-dispute.component';
import { AllDisputes } from './components/all-disputes/all-disputes.component';
import { Disputes } from './disputes.component';
const routes: Routes = [
    {
        path: '',
        component: Disputes,
        children: [
            { path: '', redirectTo: 'all-disputes', pathMatch: 'full' },  
            { path: 'all-disputes', component:AllDisputes },
            { path: 'single-dispute', component:SingleDispute },
          
          
        ]
    }



];

export const routing = RouterModule.forChild(routes);
