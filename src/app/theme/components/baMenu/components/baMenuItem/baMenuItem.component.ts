import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GlobalState } from '../../../../../global.state';
import { AuthService } from '../../../../../auth/service/auth-service/auth.service';

import 'style-loader!./baMenuItem.scss';

@Component({
    selector: 'ba-menu-item',
    templateUrl: './baMenuItem.html'
})
export class BaMenuItem {

    @Input() menuItem: any;
    @Input() child: boolean = false;

    @Output() itemHover = new EventEmitter<any>();
    @Output() toggleSubMenu = new EventEmitter<any>();

    public isMenuCollapsed: boolean = false;

    constructor(private authService: AuthService,
                private _state: GlobalState) {
    }

    public onHoverItem($event): void {
        this.itemHover.emit($event);
    }

    public onToggleSubMenu($event, item): boolean {
        $event.item = item;
        this.toggleSubMenu.emit($event);
        return false;
    }

    public closeMenu() {
        this.isMenuCollapsed = true;
        this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
        return false;
    }

    public authCheck(): boolean {
        if (this.menuItem.auth) {
            if (this.authService.user.userType == this.menuItem.auth) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }

    }

}
