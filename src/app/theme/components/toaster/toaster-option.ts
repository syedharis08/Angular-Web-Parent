import { ToastOptions } from 'ng2-toastr';

export class CustomOption extends ToastOptions {
    animate = 'flyLeft';
    newestOnTop = true;
    positionClass = 'toast-bottom-left';
    enableHTML = true;
    maxShown = 1;
    toastLife = 5000;
}