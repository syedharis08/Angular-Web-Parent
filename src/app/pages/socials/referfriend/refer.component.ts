import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Rx';
import * as profile from '../../profile/state/profile.actions';
import 'style-loader!./refer.component.scss';
import { CommonService } from '../../../services/common.service';
import { BaThemeSpinner } from '../../../theme/services';

@Component({
    selector: 'refer',
    templateUrl: './refer.component.html'

})
export class ReferFriend {
    referralCode: any;
    userData: any;
    public profileStore: Subscription;

    constructor(private toastrservice: ToastrService, private store: Store<any>, public commonService: CommonService,
                private baThemeSpinner: BaThemeSpinner) {

        // baThemeSpinner.show();
        localStorage.removeItem('page');

        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
        let fd = new FormData();
        fd.append('deviceType', 'WEB');

        this.store.dispatch({
            type: profile.actionTypes.GET_PARENT_PROFILE,
            payload: fd
        });
        this.profileStore = this.store.select('profile').subscribe((res: any) => {
            if (res) {
                if (res.userData && res.userData.data && res.userData != undefined && res.userData.data != undefined) {
                    this.referralCode = res.userData.data.referralCode1 ? res.userData.data.referralCode1 : '';
                }
            }
        });
    }

    copyCode(codevalue) {
        let temp = $('<input autocomplete="off">');
        $('body').append(temp);

        let iosCheck = navigator.userAgent.match(/ipad|iphone/i);
        if (iosCheck) {
            this.windowClipboard.copy(this.referralCode, 'codeValue');
            document.execCommand('copy');
        } else if (navigator.userAgent.match(/android/i)) {
            $('body').append(temp);
            temp.val($(codevalue).text()).select().val();
            document.execCommand('copy');
            temp.remove();
        } else {
            $('body').append(temp);
            temp.val($(codevalue).text()).select().val();
            this.windowClipboard.copy(temp.val($(codevalue).text()).select().val(), 'myTooltip');
            document.execCommand('copy');
            temp.remove();
        }

        ga('send', {
            hitType: 'event',
            eventCategory: 'Refer A Friend',
            eventAction: 'Copy RAF Code',
            eventLabel: 'Copy RAF Code'
        });
        let tooltip = document.getElementById('myTooltip');
        tooltip.innerHTML = 'Code Copied!';
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';
        setTimeout(() => {
            tooltip.style.visibility = 'hidden';
        }, 3000);

    }

    windowClipboard = ((window, document, navigator) => {
        let textArea,
            copy;
        let ua = navigator.userAgent;
        let is_ie = ((ua.indexOf('MSIE') > -1 || ua.indexOf('Trident/') > -1) || (navigator.appVersion.indexOf('Edge') > -1));

        let copyValue;

        function isOS() {
            return navigator.userAgent.match(/ipad|iphone/i);
        }

        function createTextArea(text) {

            if (is_ie) {
                copyValue = document.getElementById('codeValue');
            } else if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                copyValue = document.getElementById('codeValue');
            } else {
                textArea = document.createElement('textArea');
                textArea.style.position = 'absolute';
                textArea.style.opacity = 0;
                textArea.style.height = '0px';
                // textArea.style.position = 'absolute';
                textArea.value = text;

                document.body.appendChild(textArea);
            }
        }

        function selectText() {
            let range,
                selection;

            if (isOS()) {

                range = document.createRange();
                range.selectNode(textArea);
                selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                // textArea.setSelectionRange(0, 999999);
            } else {
                if (is_ie) {
                } else if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                    copyValue = document.getElementById('codeValue');
                } else {
                    textArea.select();
                }
            }
        }

        function copyToClipboard() {

        }

        copy = function (text) {
            createTextArea(text);
            selectText();
            copyToClipboard();
        };

        return {
            copy: copy
        };
    })(window, document, navigator);

}
