import { Component, ElementRef, HostListener } from '@angular/core';
import { GlobalState } from '../../../global.state';
import { Store } from '@ngrx/store';
import { layoutSizes } from '../../../theme';
import * as app from '../../../state/app.actions';

import 'style-loader!./baSidebar.scss';

@Component({
    selector: 'ba-sidebar',
    templateUrl: './baSidebar.html'
})
export class BaSidebar {
    public menuHeight: number;
    public isMenuCollapsed: boolean = false;
    public isMenuShouldCollapsed: boolean = false;

    constructor(private _elementRef: ElementRef, private _state: GlobalState, private store: Store<any>) {

        this.store
            .select('app')
            .subscribe((res: any) => {

            });

    }

    public ngOnInit(): void {
        if (this._shouldMenuCollapse()) {
            this.menuCollapse();
        }
    }

    public ngAfterViewInit(): void {
        setTimeout(() => this.updateSidebarHeight());
        this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
            setTimeout(() => {
                this.isMenuCollapsed = isCollapsed;
            });
        });
    }

    @HostListener('window:resize')
    public onWindowResize(): void {

        let isMenuShouldCollapsed = this._shouldMenuCollapse();

        if (this.isMenuShouldCollapsed !== isMenuShouldCollapsed) {
            this.menuCollapseStateChange(isMenuShouldCollapsed);
        }
        this.isMenuShouldCollapsed = isMenuShouldCollapsed;
        this.updateSidebarHeight();
    }

    public menuExpand(): void {
        this.menuCollapseStateChange(false);
    }

    public menuCollapse(): void {
        this.menuCollapseStateChange(true);
    }

    public menuCollapseStateChange(isCollapsed: boolean): void {
        this.isMenuCollapsed = isCollapsed;
        this.store.dispatch({
            type: app.actionTypes.APP_SIDE_BAR,
            payload: this.isMenuCollapsed

        });
        this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    }

    public updateSidebarHeight(): void {
        // TODO: get rid of magic 84 constant
        this.menuHeight = this._elementRef.nativeElement.childNodes[0].clientHeight + 50;
    }

    private _shouldMenuCollapse(): boolean {
        return window.innerWidth <= layoutSizes.resWidthCollapseSidebar;
    }
}
