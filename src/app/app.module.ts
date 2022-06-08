import { NgModule, ApplicationRef, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminAuthModule } from './auth/auth.module';
import { AUTH_PROVIDERS, provideAuth, JwtHelper } from 'angular2-jwt';
import { AuthGuard } from './auth/service/auth-service/auth-guard.service';
import { AuthGuardPublic } from './auth/service/auth-service/auth-guard-public.service';
import { AuthService } from './auth/service/auth-service/auth.service';
import { LoaderComponent } from './auth/model/loader/loader.component';
import { StarRatingModule } from 'angular-star-rating';
import { LoaderService } from './auth/model/loader/loader.service';
import { AuthGuardAdmin } from './auth/service/auth-service/auth-guard-admin.service';
import { AuthGuardCustomer } from './auth/service/auth-service/auth-guard-customer.service';
import { AuthGuardServiceProvider } from './auth/service/auth-service/auth-guard-service-provider.service';
import { AuthGuardDriver } from './auth/service/auth-service/auth-guard-driver.service';
import { PopUpComponent } from './auth/model/popup/popup.component';
import { PopUpOtpComponent } from './auth/model/popup-otp/popup-otp.component';
import { CommonService } from './services/common.service';
import { PopUpService } from './auth/model/popup/popup.service';
import { PopUpOtpService } from './auth/model/popup-otp/popup-otp.service';
import { NotificationService } from './services/notification/notification.service';
import { DisputesService } from './services/disputes-service/disputes-service';
import { AllSessionService } from './services/all-sessions-service/all-sessions.service';
import { ApiService } from './services/api-service/api.service';
import { ParentService } from './services/parent-service/parent.service';
import { BookSessionService } from './services/session-service/session.service';
import { TutorService } from './services/tutor-service/tutor.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { CalendarEventService } from './services/calender-service/calendar-event.service';
import { CalendarEventRescheduleService } from './services/calender-reschedule-service/calender-reschedule.service';
import { SelectPaymentService } from './services/select-payment/select-payments.service';

// import { CookieModule } from 'ngx-cookie';
/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { routing } from './app.routing';

// App is our top level component
import { App } from './app.component';
import { CsvService } from "angular2-json2csv";
import { AppState, InternalStateType } from './app.service';
// import { Ng2BreadcrumbModule } from 'ng2-breadcrumb/ng2-breadcrumb';
import { AppStoreModule } from './app.store';
import { GlobalState } from './global.state';
import { NgaModule } from './theme/nga.module';
import { PagesModule } from './pages/pages.module';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PublicPageModule } from './publicPages/public-pages.module';
import { CustomOption } from './theme/components/toaster/toaster-option';
import { ToastOptions } from 'ng2-toastr/src/toast-options';
import { Ng2UtilsModule } from 'ng2-utils';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { MatSidenavModule } from '@angular/material';

// import * as Raven from 'raven-js';
// import { MatDialogModule } from '@angular/material/dialog';
// import { MatDialogModule } from '@angular/material';

// import { StoreDevtoolsModule } from '@ngrx/store-devtools';
// Raven.config('http://9eff0eab28f449a58880f224066896df@sentry.clicklabs.in:8080/39').install();
// export class RavenErrorHandler implements ErrorHandler {
//     handleError(err: any): void {
//     Raven.captureException(err.originalError || err);
//     }
//     }
// Application wide providers
const APP_PROVIDERS = [
    AppState,
    GlobalState
];


export type StoreType = {
    state: InternalStateType,
    restoreInputValues: () => void,
    disposeOldHosts: () => void
};

/**
 *  AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
    bootstrap: [App],
    declarations: [
        App,
        PopUpComponent,
        PopUpOtpComponent,
        LoaderComponent,

        // NouisliderComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        RouterModule,
        FormsModule,
        AdminAuthModule,
        // MatDialogModule,
        BrowserAnimationsModule,
        InfiniteScrollModule,
        CommonModule,
        StarRatingModule.forRoot(),
        Ng2UtilsModule,
        MatSidenavModule,

        // StoreDevtoolsModule.instrumentOnlyWithExtension({
        //     maxAge: 5
        // }),
        // Ng2BreadcrumbModule.forRoot(),

        ToastModule.forRoot(),
        ToastrModule.forRoot({
            positionClass: 'toast-bottom-left',
            preventDuplicates: true,
            enableHtml: true
        }),

        AppStoreModule,
        ReactiveFormsModule,
        NgaModule.forRoot(),
        NgbModule.forRoot(),
        PagesModule,
        PublicPageModule,
        NgxPaginationModule,
        routing
    ],
    providers: [
        ENV_PROVIDERS,
        APP_PROVIDERS,
        AuthService,
        NgbActiveModal,
        CommonService,
        ApiService,
        PopUpService,
        TutorService,
        AuthGuard,
        PopUpOtpService,
        AuthGuardPublic,
        AuthGuardAdmin,
        AuthGuardCustomer,
        AuthGuardServiceProvider,
        AuthGuardDriver,
        JwtHelper,
        CsvService,
        NotificationService,
        BookSessionService,
        ParentService,
        DisputesService,
        LoaderService,
        CalendarEventService,
        AllSessionService,
        CalendarEventRescheduleService,
        SelectPaymentService,
        provideAuth({
            headerName: 'Authorization',
            tokenName: 'token',
            tokenGetter: (() => sessionStorage.getItem('token')),
            globalHeaders: [{ 'Content-Type': 'application/json' }],
            noJwtError: true
        }),
        { provide: ToastOptions, useClass: CustomOption },
        // { provide: ErrorHandler, useClass: RavenErrorHandler }
    ]
})

export class AppModule {

    constructor(public appRef: ApplicationRef,
        public appState: AppState) {
    }

    hmrOnInit(store: StoreType) {
        if (!store || !store.state) return;
        // set state
        this.appState._state = store.state;
        // set input values
        if ('restoreInputValues' in store) {
            let restoreInputValues = store.restoreInputValues;
            setTimeout(restoreInputValues);
        }
        this.appRef.tick();
        delete store.state;
        delete store.restoreInputValues;
    }

    hmrOnDestroy(store: StoreType) {
        const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
        // save state
        const state = this.appState._state;
        store.state = state;
        // recreate root elements
        store.disposeOldHosts = createNewHosts(cmpLocation);
        // save input values
        store.restoreInputValues = createInputTransfer();
        // remove styles
        removeNgStyles();
    }

    hmrAfterDestroy(store: StoreType) {
        // display new elements
        store.disposeOldHosts();
        delete store.disposeOldHosts;
    }
}
