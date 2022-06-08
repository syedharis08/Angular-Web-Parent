import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgUploaderModule } from 'ngx-uploader';
import { TopNotifications } from './../pages/notification/components/top/top-notifications-component';
import { MatDialogModule } from '@angular/material';
import { BaThemeConfig } from './theme.config';
import { LogoutDialog } from './../auth/model/logout/logout.component';
import { RatingPopupDialog } from './../pages/notification/components/rating-popup/rating-popup.component';
import { CompleteProfileDialog } from './../auth/model/complete-profile-dialog/complete-profile-dialog.component';
import { CommonNotificationPopup } from './../pages/notification/components/common-notification-popup/common-notification-popup';
import { BookingAccepted } from './../pages/notification/components/booking-accept-popup/booking-accept-popup.component';
import { BookingReschedule } from './../pages/notification/components/booking-reschedule-popup/booking-reschedule-popup.component';
import { BookingRejected } from './../pages/notification/components/booking-rejected-popup/booking-rejected-popup.component';
import { BookingCancelled } from './../pages/notification/components/booking-cancelled-popup/booking-cancelled-popup.component';
import { BaThemeConfigProvider } from './theme.configProvider';
import { RaiseDisputeDialog } from './../pages/all-sessions/components/raise-dispute/raise-dispute.component';
import { CompletedBookingDialog } from './../pages/book-session/components/completed-booking-dialog/completed-booking-dialog.component';
import { ContactTutorDialog } from './../pages/all-sessions/components/contact-tutor/contact-tutordialog.component';
import { StarRatingModule } from 'angular-star-rating';
import { DatexPipe } from './../pipes/pipes';
// import { TooltipModule } from "ngx-tooltip-selectable";
import {
    BaAmChart,
    BaBackTop,
    BaCard,
    BaChartistChart,
    BaCheckbox,
    BaContentTop,
    BaFullCalendar,
    BaMenuItem,
    BaMenu,
    BaMsgCenter,
    BaMultiCheckbox,
    BaPageTop,
    BaPictureUploader,
    BaSidebar,
    BaFooter,
    BaFileUploader

} from './components';
import {
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatStepperModule,
    MatChipsModule,
    MatCheckboxModule,
    MatSliderModule
} from '@angular/material';
import { BaCardBlur } from './components/baCard/baCardBlur.directive';

import {
    BaScrollPosition,
    BaSlimScroll,
    BaThemeRun
} from './directives';

import {
    BaAppPicturePipe,
    BaKameleonPicturePipe,
    BaProfilePicturePipe
} from './pipes';

import {
    BaImageLoaderService,
    BaMenuService,
    BaThemePreloader,
    BaThemeSpinner,
    NotificationService
} from './services';

import {
    EmailValidator,
    EqualPasswordsValidator,
    NameValidator
} from './validators';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowseTuttorError450 } from '../auth/model/browse-tutor-450-error/browse-tutor-450-error-dialog.component';
import { BrowseTuttorError451 } from '../auth/model/browse-tutor-451-error/browse-tutor-451-error-dialog.component';
import { CommonErrorDialog } from '../auth/model/common-error-dialog/common-error-dialog';
import { ErrorDialog } from '../auth/model/401-error/401-error-dialog.component';
import { NoTutorDialog } from '../auth/model/no-tutor-dialog/no-tutor-dialog.component';
import { CheckTutorDialog } from '../auth/model/check-tutor-dialog/check-tutor-dialog';
import { NoInvoiceDialogComponent } from '../auth/model/no-invoice-dialog/no-invoice-dialog.component';
import { ReminderConfirmComponent } from '../shared/components/reminder-confirm/reminder-confirm.component';
import { MultiSessionCardChangeComponent } from '../shared/components/multi-session-card-change/multi-session-card-change.component';
import { AcceptBookingHoursAvailableComponent } from '../shared/components/accept-booking-hours-available/accept-booking-hours-available.component';
import { NoHourAvailable } from '../auth/model/no-hour-available/no-hour-available';
import { NoReservationHourAvailable } from '../auth/model/no-reservation-hour-available/no-reservation-hour-available';
import { NoTodayHourAvailable } from '../auth/model/no-today-hour-available';

const NGA_COMPONENTS = [
    BaAmChart,
    BaBackTop,
    BaCard,
    BaChartistChart,
    BaCheckbox,
    BaContentTop,
    BaFullCalendar,
    BaMenuItem,
    BaMenu,
    BaMsgCenter,
    BaMultiCheckbox,
    BaPageTop,
    BaFooter,
    BaPictureUploader,
    BaSidebar,
    BaFileUploader
];

const NGA_DIRECTIVES = [
    BaScrollPosition,
    BaSlimScroll,
    BaThemeRun,
    BaCardBlur
];

const NGA_PIPES = [
    BaAppPicturePipe,
    BaKameleonPicturePipe,
    BaProfilePicturePipe
];

const NGA_SERVICES = [
    BaImageLoaderService,
    BaThemePreloader,
    BaThemeSpinner,
    BaMenuService
];

const NGA_VALIDATORS = [
    EmailValidator,
    EqualPasswordsValidator,
    NameValidator
];

@NgModule({
    declarations: [
        ...NGA_PIPES,
        ...NGA_DIRECTIVES,
        ...NGA_COMPONENTS,
        TopNotifications,

        // CalenderComponent,
        LogoutDialog,
        // Schedular,
        // CalendarEventComponent,
        BookingAccepted,
        ContactTutorDialog,
        CompleteProfileDialog,
        BookingCancelled,
        BookingReschedule,
        CompletedBookingDialog,
        BookingRejected,
        CommonNotificationPopup,
        RatingPopupDialog,
        RaiseDisputeDialog,
        DatexPipe,
        BrowseTuttorError450,
        CommonErrorDialog,
        CheckTutorDialog,
        BrowseTuttorError451,
        NoTutorDialog,
        NoInvoiceDialogComponent,
        ErrorDialog,
        ReminderConfirmComponent,
        NoHourAvailable,
        NoTodayHourAvailable,
        NoReservationHourAvailable,
        MultiSessionCardChangeComponent,
        AcceptBookingHoursAvailableComponent
    ],
    entryComponents: [
        LogoutDialog,
        ContactTutorDialog,
        CompleteProfileDialog,
        BookingAccepted,
        BookingCancelled,
        BookingRejected,
        BookingReschedule,
        CompletedBookingDialog,
        CommonNotificationPopup,
        RatingPopupDialog,
        RaiseDisputeDialog,
        BrowseTuttorError450,
        BrowseTuttorError451,
        NoTutorDialog,
        NoInvoiceDialogComponent,
        CommonErrorDialog,
        CheckTutorDialog,
        ErrorDialog,
        ReminderConfirmComponent,
        MultiSessionCardChangeComponent,
        AcceptBookingHoursAvailableComponent,
        NoHourAvailable,
        NoTodayHourAvailable,
        NoReservationHourAvailable
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        NgUploaderModule,
        MatDialogModule,
        StarRatingModule,
        MatInputModule,
        MatDatepickerModule,
        MatSelectModule,
        MatStepperModule,
        MatChipsModule,
        MatCheckboxModule,
        MatSliderModule,
        NgbRatingModule
        // TooltipModule
        // TooltipModule/////////

    ],
    exports: [
        ...NGA_PIPES,
        ...NGA_DIRECTIVES,
        ...NGA_COMPONENTS,
        DatexPipe

    ]
})
export class NgaModule {
    static forRoot(): ModuleWithProviders {
        return <ModuleWithProviders>{
            ngModule: NgaModule,
            providers: [
                BaThemeConfigProvider,
                BaThemeConfig,
                NotificationService,
                DatePipe,
                ...NGA_VALIDATORS,
                ...NGA_SERVICES
            ]
        };
    }
}
