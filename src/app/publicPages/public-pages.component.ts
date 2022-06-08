import { Component } from '@angular/core';
import {
    Routes, Router,
    Event as RouterEvent,
    NavigationStart,
    NavigationEnd,
    NavigationCancel,
    NavigationError
} from '@angular/router';
import { BaImageLoaderService, BaThemePreloader, BaThemeSpinner } from '../theme/services';

@Component({
    selector: 'publicpages',
    template: `
        <div>
            <router-outlet></router-outlet>
          <ba-footer></ba-footer>
        </div> 
    `
})
export class PublicPages {

    constructor(private router: Router, private _spinner: BaThemeSpinner) {
        BaThemePreloader.load().then((values) => {
            this._spinner.hide();
        });
        router.events.subscribe((event: RouterEvent) => {
            this.navigationInterceptor(event);
        });
    }

    navigationInterceptor(event: RouterEvent): void {
        if (event instanceof NavigationStart) {
            this._spinner.show();
        }
        if (event instanceof NavigationEnd) {
            BaThemePreloader.load().then((values) => {
                this._spinner.hide();
            });
            if (jQuery('html, body')) {
                jQuery('html, body').scrollTop(0);
            }
        }
        if (event instanceof NavigationCancel) {
            BaThemePreloader.load().then((values) => {
                this._spinner.hide();
            });
        }
        if (event instanceof NavigationError) {
            BaThemePreloader.load().then((values) => {
                this._spinner.hide();
            });
        }
    }

}
