import { Routes, RouterModule } from '@angular/router';
import { SessionReport } from './session-report.component';
 import { SessionReports } from './components/session-reports/session-reports.component';
import { Reports } from './components/reports/reports.component';
import { FullReports } from './components/full-reports/full-reports.component';
const routes: Routes = [
    {
        path: '',
        component: SessionReport,
        children: [
            { path: '', redirectTo: 'reports', pathMatch: 'full' },  
            { path: 'reports', component:SessionReports },
            { path: 'single-report', component:Reports },
            { path: 'full-report', component:FullReports },
            // { path: 'add-subjects', component:AllSubjects },
          
        ]
    }



];

export const routing = RouterModule.forChild(routes);
