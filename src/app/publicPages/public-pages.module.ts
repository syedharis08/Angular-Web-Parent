import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GooglePlaceModule } from 'ng2-google-place-autocomplete';
import { routing } from './public-pages.routes';
import { PublicPages } from './public-pages.component';
import { RouterModule } from '@angular/router';
// import { Login } from './components/login/login.component';
// import { NouisliderModule } from 'ng2-nouislider';
// import { TutorModule } from './tutor/tutor.module';
//  import { Tutor } from './tutor/tutor.component';
// import { SliderModule } from 'primeng/primeng';
// import { NgxPaginationModule } from 'ngx-pagination';

import {
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatIconModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    MatSelectModule,
    MatDialogModule,
    MatExpansionModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
} from '@angular/material';
// import { FileUploadModule } from 'ng2-file-upload';
import { NgaModule } from '../theme/nga.module';
import { StarRatingModule } from 'angular-star-rating';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        routing,
        MatTabsModule,
        MatInputModule,
        MatButtonModule,
        MatAutocompleteModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        MatRadioModule,
        MatDialogModule,
        MatSelectModule,
        MatTooltipModule,
        GooglePlaceModule,
        MatExpansionModule,
        // TutorModule,
        
        // NouisliderModule,
        // SliderModule,
        // NgxPaginationModule,
        // FileUploadModule,
        NgaModule,
        // StarRatingModule.forRoot(),
    ],
    declarations: [
        PublicPages,
 
        
       

    ],
    entryComponents: [
    ]
})
export class PublicPageModule { }
