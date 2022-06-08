import { Component } from '@angular/core';
import { GlobalState } from '../../../global.state';
import 'style-loader!./baFooter.scss';
import { Store } from '@ngrx/store';
import * as auth from '../../../auth/state/auth.actions';
import { Router } from '@angular/router';
import { environment } from '../../../environment/environment';
import { CommonService } from '../../../services/common.service';
import { CONSTANT } from '../../../shared/constant/constant';

@Component({
    selector: 'ba-footer',
    templateUrl: './baFooter.html'
})
export class BaFooter {

    wordPressLink: string;
    public isScrolled: boolean;
    public isMenuCollapsed: boolean = false;
    public user;
    public storeData;
    public name;
    public profilePicture;
    public dateYear;

    constructor(private _state: GlobalState, private store: Store<any>, private router: Router,
                public commonService: CommonService) {
        let date = new Date();
        this.dateYear = date.getFullYear();
        this.profilePicture = 'assets/img/user.png';
    }

    ngOnInit() {
        if (process.env.ENV == 'development') {
            this.wordPressLink = CONSTANT.wordPressDevLink;
        }
        if (process.env.ENV == 'production') {
            this.wordPressLink = CONSTANT.wordPressQualLink;
        }
        if (process.env.ENV == 'demo') {
            this.wordPressLink = CONSTANT.wordPressDemoLink;
        }
        if (process.env.ENV == 'test') {
            this.wordPressLink = CONSTANT.wordPressTestLink;
        }

        if (process.env.ENV == 'live') {
            this.wordPressLink = CONSTANT.wordPressLiveLink;
        }
    }

    tutorAppIos() {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Footer',
            eventAction: 'App Downloads',
            eventLabel: 'Available for iOS (Parents)'
        });
        let url = 'https://itunes.apple.com/us/app/Sylvan-InHome/id1358252309?ls=1&mt=8';
        window.open(url, '_blank');

    }

    tutorAppAnd() {
        ga('send', {
            hitType: 'event',
            eventCategory: 'Footer',
            eventAction: 'App Downloads',
            eventLabel: 'Available for Android (Parents)'
        });
        let url = 'https://play.google.com/store/apps/details?id=com.sylvan.inhomeparent';
        window.open(url, '_blank');
    }

    public ngAfterViewInit() {
        this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
            setTimeout(() => {
                this.isMenuCollapsed = isCollapsed;
            });
        });
    }

    ngOnDestroy() {
        if (this.storeData) {
            this.storeData.unsubscribe();
        }
        this.name = null;
        this.profilePicture = null;
    }

    becomeTutor() {
        let url = this.wordPressLink + 'become-a-tutor/';
        window.open(url, '_blank');
    }

    baltimore() {
        let url = environment.APP.API_URL + environment.APP.PARENT_PANEL + 'home/browse-tutor?lat=39.2904&long=76.6122&location=Baltimore';
        window.open(url, '_blank');
    }

    boston() {
        let url = environment.APP.API_URL + environment.APP.PARENT_PANEL + 'home/browse-tutor?lat=42.3601&long=71.0589&location=Boston';
        window.open(url, '_blank');
    }

    dc() {
        let url = environment.APP.API_URL + environment.APP.LEAD_GEN + 'dc-and-md-suburbs/';
        window.open(url, '_blank');
    }

    metro() {
        window.open('https://sylvanqual-wordpress.clicklabs.in/western-philadelphia-suburbs/', '_blank');
    }

    aboutUs() {
        let url = this.wordPressLink + 'about-us/';
        window.open(url, '_blank');
    }

    fb() {
        window.open('https://www.facebook.com/SylvanLearning', '_blank');
        // window.open('https://www.facebook.com/sylvaninhome', '_blank');
    }

    youTube() {
        window.open('https://www.youtube.com/channel/UC5ZxlAI00XrI1Xo44S8KVAQ', '_blank');
    }

    hq() {
        let token = localStorage.getItem('token');
        if (token) {
            this.router.navigate(['/pages/contact-us']);
        } else {
            if (process.env.ENV == 'development') {
                window.open(CONSTANT.wordPressDevLink + 'contact-us/', '_blank');
            }
            if (process.env.ENV == 'production') {
                window.open(CONSTANT.wordPressQualLink + 'contact-us/', '_blank');
            }
            if (process.env.ENV == 'demo') {
                window.open(CONSTANT.wordPressDemoLink + 'contact-us/', '_blank');
            }
            if (process.env.ENV == 'test') {
                window.open(CONSTANT.wordPressTestLink + 'contact-us/', '_blank');
            }
            if (process.env.ENV == 'live') {

                window.open(CONSTANT.wordPressLiveLink + 'contact-us/', '_blank');
            }
        }
    }

    policy() {
        // let url = this.wordPressLink + 'privacy-policy/';

        // if (process.env.ENV == 'live') {
        //     url = 'https://www.sylvanlearning.com/marketplaceplus/privacy-policy/';
        //   }
        //
        //
        window.open(CONSTANT.privacyUrl, '_blank'); //prod
    }

    terms() {
        // let url = this.wordPressLink + 'terms-of-use/';
        //
        // if (process.env.ENV == 'live') {
        //     url = 'https://www.sylvanlearning.com/marketplaceplus/terms-of-use';
        //   }

        window.open(CONSTANT.termsUrl, '_blank');
    }

    toggleMenu() {
        this.isMenuCollapsed = !this.isMenuCollapsed;
        this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
        return false;
    }

    scrolledChanged(isScrolled) {
        if (this.isScrolled != undefined) {
            this.isScrolled = isScrolled;
        }
    }

    logout() {
        this.store.dispatch(new auth.AuthLogoutAction());
    }

    titleCase(input) {
        if (input != undefined) {
            let smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;
            input = input.toLowerCase();
            return input.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function (match, index, title) {
                if (index > 0 && index + match.length !== title.length &&
                    match.search(smallWords) > -1 && title.charAt(index - 2) !== ':' &&
                    (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
                    title.charAt(index - 1).search(/[^\s-]/) < 0) {
                    return match.toLowerCase();
                }
                if (match.substr(1).search(/[A-Z]|\../) > -1) {
                    return match;
                }
                return match.charAt(0).toUpperCase() + match.substr(1);
            });
        }
    }

}
