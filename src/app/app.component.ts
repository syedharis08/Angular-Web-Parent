import { Component, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { GlobalState } from './global.state';
import { BaImageLoaderService, BaThemePreloader, BaThemeSpinner } from './theme/services';
import { BaThemeConfig } from './theme/theme.config';
import { layoutPaths } from './theme/theme.constants';
import { Store } from '@ngrx/store';
import 'style-loader!./app.scss';
// import 'style-loader!./theme/initial.scss';
// import { Subscription } from 'rxjs/Rx';
// import { CookieService } from 'ngx-cookie';
import { ActivatedRoute } from '@angular/router';
// import { BreadcrumbService } from 'ng2-breadcrumb/ng2-breadcrumb';
import * as auth from './auth/state/auth.actions';
import { Router } from '@angular/router';
import * as sessionsDetails from './pages/all-sessions/state/all-sessions.actions';

/*
 * App Component
 * Top Level Component
 */
@Component({
    selector: 'app',
    template: `
        <main [ngClass]="{'menu-collapsed': isMenuCollapsed}" baThemeRun>

            <ba-page-top id="moveUp" prefix="Sylvan"></ba-page-top>

            <div class="additional-bg"></div>
            <router-outlet></router-outlet>
            <pop-up></pop-up>
            <pop-up-otp></pop-up-otp>
            <loader></loader>
        </main>
    `,
    encapsulation: ViewEncapsulation.None,

})
export class App {
    public token;
    isMenuCollapsed: boolean = false;
    direction = 'ltl';
    cookiesCollected: any = {};
    userData: any = {};

    // public sessionStore:Subscription

    constructor(private _state: GlobalState,
                private store: Store<any>,
                private router: Router,
                private _imageLoader: BaImageLoaderService,
                private _spinner: BaThemeSpinner,
                private viewContainerRef: ViewContainerRef,
                // private cookieService:CookieService,
                private themeConfig: BaThemeConfig,
                // private breadcrumbService: BreadcrumbService,
                private route: ActivatedRoute) {
        localStorage.removeItem('userData');

        this.route.queryParams.subscribe((params1: any) => {
            if (params1 && params1 != undefined) {
                if (params1.location != undefined) {
                    // breadcrumbService.hideRoute('/home/browse-tutor?location=' + params1.location);
                }
                if (params1.referralCode) {
                    let domainParts = window.location.host.split('.');
                    domainParts.shift();
                    let domain = '.' + domainParts.join('.');
                    let now = new Date();
                    let time = now.getTime();
                    time += 3600 * 1000;
                    now.setTime(time);
                    document.cookie = 'referralCode=' + params1.referralCode + '; domain=' + domain + ';path=/' + '; expires=' + now.toUTCString() + '; SameSite=Strict; secure';
                }
                if (location.search) {
                    let stringParams = location.search.substring(1);
                    let params = JSON.parse('{"' + decodeURI(stringParams).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
                    if (params.source) {
                        this.userData.source = params.source;
                    }
                    if (params.campaignid) {
                        this.userData.campaignid = params.campaignid;
                    }
                    if (params.adgroupid) {
                        this.userData.adgroupid = params.adgroupid;
                    }
                    if (params.cid) {
                        this.userData.cid = params.cid;
                    }
                    if (params.k) {
                        this.userData.k = params.k;
                    }
                    if (params.placement) {
                        this.userData.placement = params.placement;
                    }
                    if (params.match) {
                        this.userData.match = params.match;
                    }
                    if (params.network) {
                        this.userData.network = params.network;
                    }
                    if (params.device) {
                        this.userData.device = params.device;
                    }
                    if (params.gclid) {
                        this.userData.gclid = params.gclid;
                    }
                    if (params.adposition) {
                        this.userData.adposition = params.adposition;
                    }
                    if (params.gaid) {
                        this.userData.gaid = params.gaid;
                    }
                    if (params.utm_campaign) {
                        this.userData.utm_campaign = params.utm_campaign;
                    }
                    if (params.utm_medium) {
                        this.userData.utm_medium = params.utm_medium;
                    }
                    if (params.utm_source) {
                        this.userData.utm_source = params.utm_source;
                    }
                    if (params.utm_content) {
                        this.userData.utm_content = params.utm_content;
                    }
                    if (params.utm_term) {
                        this.userData.utm_term = params.utm_term;
                    }
                    if (params.source2) {
                        this.userData.source2 = params.source2;
                    }
                    if (params.source3) {
                        this.userData.source3 = params.source3;
                    }
                    if (params.referralcode) {
                        let domainParts = window.location.host.split('.');
                        domainParts.shift();
                        let domain = '.' + domainParts.join('.');
                        let now = new Date();
                        let time = now.getTime();
                        time += 3600 * 1000;
                        now.setTime(time);
                        document.cookie = 'referralCode=' + params.referralcode + '; domain=' + domain + ';path=/' + '; expires=' + now.toUTCString() + '; SameSite=Strict; secure';
                    }

                    if (params.source || params.campaignid || params.adgroupid || params.cid || params.k || params.placement || params.match || params.network || params.device || params.gclid || params.adposition || params.gaid || params.utm_campaign || params.utm_source || params.utm_content || params.utm_term || params.source2 || params.source3) {
                        let domainParts = window.location.host.split('.');
                        domainParts.shift();
                        let domain = '.' + domainParts.join('.');
                        let now = new Date();
                        let time = now.getTime();
                        time += 3600 * 1000;
                        now.setTime(time);
                        document.cookie = 'userData=' + JSON.stringify(this.userData) + '; domain=' + domain + ';path=/' + '; expires=' + now.toUTCString() + '; SameSite=Strict; secure';
                        localStorage.setItem('userData', JSON.stringify(this.userData));
                    }
                }
            }
        });
        themeConfig.config();
        if (document.cookie) {
            let cookieData = document.cookie;
            // if (cookieData.split('tokenSylvanParent=')) {
            //     let cookie = cookieData.split('tokenSylvanParent=');

            //     if (cookie[1] && cookie[1] != undefined) {
            //         localStorage.setItem('token', cookie[1]);
            //     }

            // } else {
            //     localStorage.removeItem('token');
            // }

            let getCookies = function () {
                let pairs = document.cookie.split(';');
                let cookies = {};
                for (let i = 0; i < pairs.length; i++) {
                    let pair = pairs[i].split('=');
                    cookies[(pair[0] + '').trim()] = encodeURIComponent(pair[1]);
                }
                return cookies;
            };
            this.cookiesCollected = getCookies();
            if (this.cookiesCollected.userData) {
                localStorage.setItem('userData', decodeURIComponent(this.cookiesCollected.userData));
            }
            if (this.cookiesCollected.tokenSylvanParent) {
                localStorage.setItem('token', this.cookiesCollected.tokenSylvanParent);

            } else {
                // localStorage.removeItem('token');
            }
            if (this.cookiesCollected.bookingData) {

                localStorage.setItem('bookingAvailable', this.cookiesCollected.bookingData);

            }
            if (this.cookiesCollected.tutorUId) {
                localStorage.setItem('tutorUId', this.cookiesCollected.tutorUId);
                let domainParts = window.location.host.split('.');
                domainParts.shift();
                let domain = '.' + domainParts.join('.');
                document.cookie = 'tutorUId' + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;' + 'domain=' + domain + '; SameSite=Strict; secure';
                this.router.navigate(['/home/tutor-details']);

                // document.cookie = 'tutorId' + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            } else if (localStorage.getItem('bookingAvailable') != undefined && localStorage.getItem('bookingAvailable') === 'true') {

                if (localStorage.getItem('tutor_detail')) {
                    this.router.navigate(['/home/browse-tutor']);
                } else {
                    this.router.navigate(['/pages/all-sessions/sessions']);

                }

            }

            if (localStorage.getItem('token') === undefined) {
                // localStorage.removeItem('token');
            }
            if (localStorage.getItem('bookingAvailable') === undefined) {
                localStorage.removeItem('bookingAvailable');
            }

        } else {
        }

    }

    public ngAfterViewInit(): void {
        // hide spinner once all loaders are completed
        BaThemePreloader.load().then((values) => {
            // this._spinner.hide();
        });

        this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
            setTimeout(() => {
                this.isMenuCollapsed = isCollapsed;
            });
        });
    }

    ngAfterViewChecked() {

    }

    private _loadImages(): void {
        // register some loaders
        BaThemePreloader.registerLoader(this._imageLoader.load(layoutPaths.images.root + 'sky-bg.jpg'));
    }

}
