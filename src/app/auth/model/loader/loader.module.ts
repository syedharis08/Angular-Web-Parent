import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderComponent } from './Loader.component';
import { LoaderService } from './Loader.service';
@NgModule({
    declarations: [LoaderComponent],
    exports: [LoaderComponent],
    imports: [CommonModule],
    providers: [LoaderService]
})
export class LoaderModule { }