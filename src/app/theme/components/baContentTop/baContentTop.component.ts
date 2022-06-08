import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as app from '../../../state/app.actions';

@Component({
    selector: 'ba-content-top',
    styleUrls: ['./baContentTop.scss'],
    templateUrl: './baContentTop.html',
})
export class BaContentTop {

    public activePageTitle: string = '';

    constructor(private store: Store<any>) {
        this.store
            .select('app')
            .subscribe((res: any) => {
                if (res.activeMenuItem && res.activeMenuItem.title) {
                    this.activePageTitle = res.activeMenuItem.title;
                }
            });
    }
}
