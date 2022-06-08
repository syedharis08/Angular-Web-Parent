import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Rx';
import 'style-loader!./faq.component.scss';
import * as profile from '../../profile/state/profile.actions';
import { CommonService } from '../../../services/common.service';
import { BaThemeSpinner } from '../../../theme/services';

@Component({
    selector: 'faq',
    templateUrl: './faq.component.html'
})

export class FaqComponent {
    public storeData: Subscription;
    public faq;

    constructor(private store: Store<any>, public commonService: CommonService, private _spinner: BaThemeSpinner) {
        localStorage.removeItem('page');
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
        this.store.dispatch({
            type: profile.actionTypes.FAQ
        });

        this.storeData = this.store.select('profile').subscribe((res: any) => {
            if (res) {
                if (res.faq && res.faq != undefined && res.faq.parentFaqs && res.faq.parentFaqs != undefined && res.faq.parentFaqs.length > 0) {
                    this.faq = res.faq.parentFaqs;
                }
            }
        });
    }

    faqGa(data) {
        ga('send', {
            hitType: 'event',
            eventCategory: 'FAQ Parent',
            eventAction: 'FAQ Parent',
            eventLabel: 'FAQ Parent' + ', ' + data
        });
    }
}
