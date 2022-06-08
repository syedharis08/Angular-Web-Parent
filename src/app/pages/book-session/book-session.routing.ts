import { Schedular } from './components/schedular/schedular.component';
import { Routes, RouterModule } from '@angular/router';
import { BookSession } from './book-session.component';
import { Session } from './components/session/session.component';
import { AllSubjects } from './components/all-subjects/all-subjects.component';
import { SelectTutor } from './components/select-tutor/select-tutor.component';
import { SelectTutorDetails } from './components/select-tutor-details/select-tutor-details.component';
import { SelectPaymentsComponent } from './components/select-payment/components/select-payments.component';
import { MultipleSessionComponent } from './components/schedular/components/multiple-session/multiple-session.component';
const routes: Routes = [
    {
        path: '',
        component: BookSession,
        children: [
            { path: '', redirectTo: 'session', pathMatch: 'full' },  
            { path: 'session', component: Session },
            { path: 'steptwo', component: Schedular },
            { path: 'add-subjects', component:AllSubjects },
            { path: 'select-tutor', component:SelectTutor },
            { path: 'tutor-details', component:SelectTutorDetails },
            { path: 'select-card', component:SelectPaymentsComponent },
            { path: 'Schedule', component: MultipleSessionComponent }
            
        ]
    }



];

export const routing = RouterModule.forChild(routes);
