import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

import { NgPipesModule } from 'ngx-pipes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routing } from './session-report.routing';
import { NgxPaginationModule } from 'ngx-pagination';
// import {MatInputModule} from '@angular/material/input';
import {
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatStepperModule,
    MatChipsModule,
    MatCheckboxModule,
    MatSliderModule,
} from '@angular/material';

import { NgaModule } from '../../theme/nga.module';
import { Reports } from './components/reports/reports.component';
import { SessionReports } from './components/session-reports/session-reports.component';
import { SessionReport } from './session-report.component';
 import { FullReports } from './components/full-reports/full-reports.component';



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgaModule,
        NgxPaginationModule,
        routing,
        MatSelectModule,
        MatInputModule,
        NgbModalModule,
        MatDatepickerModule,
        MatStepperModule,
        MatSliderModule,
        NgPipesModule,
        MultiselectDropdownModule,
        MatChipsModule,
        MatCheckboxModule

    ],
    declarations: [
        Reports,
        SessionReports,
        SessionReport,
        FullReports
        // BookSession,
        // Session,
        // AllSubjects,
        
    ],
    entryComponents: [
       

    ],

})
export class SessionReportModule { }
