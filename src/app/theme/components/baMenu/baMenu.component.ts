import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { BaMenuService } from '../../services';
import { Store } from '@ngrx/store';
import * as app from '../../../state/app.actions';

import 'style-loader!./baMenu.scss';

@Component({
    selector: 'ba-menu',
    templateUrl: './baMenu.html'
})
export class BaMenu {

    @Input() sidebarCollapsed: boolean = false;
    @Input() menuHeight: number;

    @Output() expandMenu = new EventEmitter<any>();

    public menuItems: any[];
    protected _menuItemsSub: Subscription;
    public showHoverElem: boolean;
    public hoverElemHeight: number;
    public hoverElemTop: number;
    protected _onRouteChange: Subscription;
    public outOfArea: number = -200;

    //public currentUser;

    constructor(private _router: Router, private _service: BaMenuService, private store: Store<any>) {
        //currentUser=authService.user;
    }

    public updateMenu(newMenuItems) {
        this.menuItems = newMenuItems;
        this.selectMenuAndNotify();
    }

    public selectMenuAndNotify(): void {
        if (this.menuItems) {
            this.menuItems = this._service.selectMenuItem(this.menuItems);
            this.store.dispatch({
                type: app.actionTypes.APP_ACTIVE_MENU_ITEM,
                payload: this._service.getCurrentItem()
            });

        }
    }

    public ngOnInit(): void {
        this._onRouteChange = this._router.events.subscribe((event) => {

            if (event instanceof NavigationEnd) {
                if (this.menuItems) {
                    this.selectMenuAndNotify();
                } else {
                    // on page load we have to wait as event is fired before menu elements are prepared
                    setTimeout(() => this.selectMenuAndNotify());
                }
            }
        });

        this._menuItemsSub = this._service.menuItems.subscribe(this.updateMenu.bind(this));
    }

    public ngOnDestroy(): void {
        if (this._onRouteChange) {
            this._onRouteChange.unsubscribe();
        }
        if (this._menuItemsSub) {
            this._menuItemsSub.unsubscribe();
        }
    }

    public hoverItem($event): void {
        this.showHoverElem = true;
        this.hoverElemHeight = $event.currentTarget.clientHeight;
        // TODO: get rid of magic 66 constant
        this.hoverElemTop = $event.currentTarget.getBoundingClientRect().top - 66;
    }

    public toggleSubMenu($event): boolean {
        let submenu = jQuery($event.currentTarget).next();

        if (this.sidebarCollapsed) {
            this.expandMenu.emit(null);
            if (!$event.item.expanded) {
                $event.item.expanded = true;
            }
        } else {
            $event.item.expanded = !$event.item.expanded;
            submenu.slideToggle();
        }

        return false;
    }

}
