import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

import { NgPipesModule } from 'ngx-pipes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routing } from './disputes.routing';
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
import { SingleDispute } from './components/single-dispute/single-dispute.component';
import { AllDisputes } from './components/all-disputes/all-disputes.component';
import { Disputes } from './disputes.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgaModule,
        NgxPaginationModule,
        routing,
        MatCardModule,
        MatSelectModule,
        MatInputModule,
        NgbModalModule,
        // MatDatepickerModule,
        // MatStepperModule,
        // MatSliderModule,
        NgPipesModule,
        MultiselectDropdownModule,
        MatChipsModule,
        MatCheckboxModule

    ],
    declarations: [
        Disputes,
        SingleDispute,
        AllDisputes
        
    ],
    entryComponents: [
       

    ],

})
export class AllDisputesModule { }
