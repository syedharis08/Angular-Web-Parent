import { Component } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import {
    Routes, Router,
    Event as RouterEvent,
    NavigationStart,
    NavigationEnd,
    NavigationCancel,
    NavigationError
} from '@angular/router';
import { Store } from '@ngrx/store';
import { BaMenuService } from '../theme';
import { PagesMenuService } from './pages.menu';
import { BaThemePreloader, BaThemeSpinner } from '../theme/services';

@Component({
    selector: 'pages',
    template: `

        <div id="alMain" class="al-main">
            <div class=" ">
                <router-outlet>

                </router-outlet>
            </div>
        </div>
        <ba-footer></ba-footer>

        <ba-back-top position="200"></ba-back-top>
    `
})
export class Pages {
    public sessionStore: Subscription;
    PAGES_MENU;
    public upcomingSession: boolean = false;
    navigationLoading: boolean = false;

    constructor(private router: Router, private _menuService: BaMenuService, private PagesMenuService: PagesMenuService, private _spinner: BaThemeSpinner, private store: Store<any>) {

        // if (localStorage.getItem('tutorUId')) {
        //     this.router.navigate(['/home/tutor-details']);
        // }
        // this.sessionStore=this.store.select('sessionsDetails').debounceTime(100).subscribe((res: any) => {
        //     if(res)
        //     {
        //        if(res.anyBookings && res.anyBookings !=undefined){
        //            this.upcomingSession=res.anyBookings.upcomingSession;
        //            if(this.upcomingSession){
        //                this.router.navigate(['/pages/all-sessions/sessions']);
        //            }
        //        }
        //     }

        // });

        this.PAGES_MENU = this.PagesMenuService.pageMenu();
        this._menuService.updateMenuByRoutes(<Routes>this.PAGES_MENU);

        router.events.subscribe((event: RouterEvent) => {
            this.navigationInterceptor(event);
        });

        BaThemePreloader.load().then((values) => {
            this._spinner.hide();
        });

    }

    navigationInterceptor(event: RouterEvent): void {
        if (event instanceof NavigationStart) {
            this.navigationLoading = true;
            //this._spinner.show();
        }
        if (event instanceof NavigationEnd) {
            this.navigationLoading = false;
            //this._spinner.hide();
        }
        if (event instanceof NavigationCancel) {
            this.navigationLoading = false;
            //this._spinner.hide();
        }
        if (event instanceof NavigationError) {
            this.navigationLoading = false;
            //this._spinner.hide();
        }
    }

    ngAfterViewInit() {
        // document.getElementById('hideAll').style.display = 'none';

    }

}
