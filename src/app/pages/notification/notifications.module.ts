import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgPipesModule } from 'ngx-pipes';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routing } from './notifications.routing';
// import { ContactTutorDialog } from '../../pages/all-sessions/components/contact-tutor/contact-tutordialog.component';
import { AllNotifications } from './components/all-notifications/all-notifications.component';
import { Notifications } from './notifications.component';
import { NgaModule } from '../../theme/nga.module';
import { StarRatingModule } from 'angular-star-rating';
// import { TopListsModule } from '../side-panel/side-panel.module';
// import { MatCardModule, MdPaginatorModule, MdTooltipModule } from '@angular/material';
import { MatCardModule } from '@angular/material/card';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        // MdCardModule,
        // MdTooltipModule,
        // MdPaginatorModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        routing,
        NgbModalModule,
        NgaModule,
        MatCardModule,
        StarRatingModule,
        // TopListsModule,
        NgPipesModule
    ],
    declarations: [
        Notifications,
        // ContactTutorDialog,
        AllNotifications
    ],
    entryComponents: [
        // ContactTutorDialog
    ]
})

export class NotificationsModule { }
