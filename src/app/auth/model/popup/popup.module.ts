import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PopUpComponent } from './popup.component';
import { PopUpService } from './popup.service';
@NgModule({
    declarations: [PopUpComponent],
    exports: [PopUpComponent],
    imports: [CommonModule],
    providers: [PopUpService]
})
export class PopUpModule { }