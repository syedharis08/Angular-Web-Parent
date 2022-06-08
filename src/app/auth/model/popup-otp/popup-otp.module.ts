import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PopUpOtpComponent } from './popup-otp.component';
import { PopUpOtpService } from './popup-otp.service';
@NgModule({
    declarations: [PopUpOtpComponent],
    exports: [PopUpOtpComponent],
    imports: [CommonModule],
    providers: [PopUpOtpService]
})
export class PopUpOtpModule { }