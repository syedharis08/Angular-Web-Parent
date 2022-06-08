import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Effect, Actions } from '@ngrx/effects';
import * as sessionsDetails from './../../state/all-sessions.actions';
import { Subscription } from 'rxjs/Rx';
import 'style-loader!./session-invoice.component.scss';
import { AllSessionService } from '../../../../services/all-sessions-service/all-sessions.service';
import * as moment from 'moment';
import { BookSessionService } from '../../../../services/session-service/session.service';

import { MatDialog } from '@angular/material';
import { NoInvoiceDialogComponent } from '../../../../auth/model/no-invoice-dialog/no-invoice-dialog.component';
import { CommonErrorDialog } from '../../../../auth/model/common-error-dialog/common-error-dialog';
import { LoaderService } from '../../../../auth/model/loader/loader.service';
import { BaThemeSpinner } from '../../../../theme/services/baThemeSpinner';

@Component({
    selector: 'session-invoice',
    templateUrl: `./session-invoice.component.html`,
    styleUrls: ['./session-invoice.component.scss']

})
export class SessionInvoiceComponent {

    public sessionStore: Subscription;
    public upcomingSessions = [];
    public invoices = [];
    public tabIndex = 0;
    public totalItems;
    public totalAmount;
    public status;
    public data: any;
    startDate: any;
    endDate: any;
    public profileStore: Subscription;
    userData: any;
    students: any;

    filterObj: any = {
        studentId: '',
        limit: 10,
        skip: 0,
        page: 1,
        startTime: '',
        endTime: ''
    };

    openModalCount = 1;

    constructor(private store: Store<any>, private router: Router, private sessionService: AllSessionService, private bookingService: BookSessionService,
                private dialog: MatDialog, private loader: LoaderService, private _spinner: BaThemeSpinner) {

        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });

        this.store.dispatch({
            type: sessionsDetails.actionTypes.CHECK_BOOKINGS
        });

        this.upcomingSessions = [];
        this.getStudents();

        this.sessionStore = this.store.select('sessionsDetails').subscribe((res: any) => {

            // if (localStorage.getItem('savedFilter'))

            if (res) {
                if (res && res.invoiceList && res.invoiceList.result && res.invoiceList.result.bookings) {

                    this.invoices = [];
                    this.totalItems = 0;
                    if (res.invoiceList.result.bookings.length > 0) {
                        // this.invoices =
                    } else {
                        this.openModalCount++;
                        this.totalItems = 0;
                        if (this.openModalCount <= 1) {
                            this.dialog.open(NoInvoiceDialogComponent);
                        }
                    }
                }

                if (res && res.invoiceCount && res.invoiceCount.count) {
                    this.totalAmount = res.invoiceCount.totalAmount;
                    this.totalItems = res.invoiceCount.count;
                    if (this.totalItems > 0) {
                        this.setTableValues(res.invoiceList.result.bookings);
                    }
                    res.invoiceCount.count = null;
                }
            }

        });

    }

    ngOnInit() {
        // if (localStorage.getItem('savedFilter')) {
        //     this.filterObj = JSON.parse(localStorage.getItem('savedFilter'));
        //     this.getInvoiceList();
        // }
    }

    getSubjects(data) {
        let temp: any = [];
        data.forEach(val => {
            val.subcategories.forEach(val1 => {
                temp.push(val1.name);
            });
        });
        return temp;
    }

    getInvoiceList() {

        let tempFilterObj: any = JSON.parse(JSON.stringify(this.filterObj));
        this.openModalCount = 0;

        if (this.filterObj.startTime) {
            tempFilterObj.startTime = JSON.parse(JSON.stringify(moment(this.filterObj.startTime).format('YYYY-MM-DD[T00:00:00.000Z]')));
        } else {
            let dialogRef = this.dialog.open(CommonErrorDialog, {
                data: {message: 'Please Select Start Date'}
            });
            return;
        }
        if (this.filterObj.endTime) {
            tempFilterObj.endTime = JSON.parse(JSON.stringify(moment(this.filterObj.endTime).format('YYYY-MM-DD[T23:59:59.999Z]')));
        } else {
            let dialogRef = this.dialog.open(CommonErrorDialog, {
                data: {message: 'Please Select End Date'}
            });
            return;
        }

        this.store.dispatch({
            type: sessionsDetails.actionTypes.GET_INVOICE_LIST,
            payload: tempFilterObj
        });
    }

    getStudents() {
        this.bookingService.getStudentList().subscribe(res => {
            this.students = res.data;
            if (this.students.length == 1) {
                this.filterObj.studentId = this.students[0]._id;
            }
        });
    }

    onChangeDate(e, flag) {
        if (flag == 'start') {
        } else {
        }
    }

    searchFun() {
        let startTime = moment(this.filterObj.startTime).startOf('day').format('');
        let endTime = moment(this.filterObj.endTime).endOf('day').format('');
        if (startTime && endTime && startTime > endTime) {
            let dialogRef = this.dialog.open(CommonErrorDialog, {
                data: {message: 'Start Date must be before the End Date.'}
            });
        } else {
            this.getInvoiceList();
        }
    }

    clearSearchFun() {
        this.filterObj.endTime = '';
        this.filterObj.startTime = '';
        this.filterObj.studentId = '';
        this.invoices = [];
        this.totalItems = 0;
    }

    genPdfFun() {
        // htmltemplate:
        const source = this.returnSrc();

        let fd = new FormData();
        // fd.append('htmltemplate', source);
        fd.append('height', 14.2);
        fd.append('width', 11);

        if (this.filterObj.studentId) {
            fd.append('studentId', this.filterObj.studentId);
        }

        if (this.filterObj.startTime) {

            let startTime = JSON.parse(JSON.stringify(moment(this.filterObj.startTime).format('YYYY-MM-DD[T00:00:00.000Z]')));

            // let tempStart = new Date(this.filterObj.startTime).toISOString();
            fd.append('startTime', startTime);
        } else {
            let dialogRef = this.dialog.open(CommonErrorDialog, {
                data: {message: 'Please Select Start Date'}
            });
            return;
        }
        if (this.filterObj.endTime) {
            let endTime = JSON.parse(JSON.stringify(moment(this.filterObj.endTime).format('YYYY-MM-DD[T23:59:59.999Z]')));

            // let tempEnd = new Date(this.filterObj.endTime).toISOString();
            fd.append('endTime', endTime);
        } else {
            let dialogRef = this.dialog.open(CommonErrorDialog, {
                data: {message: 'Please Select End Date'}
            });
            return;
        }

        // startTime:2019-01-18T11:41:22.300Z

        this._spinner.show();

        this.bookingService.generatePdfService(fd).subscribe(res => {

            if (window.location.hostname === 'localhost') {
                window.open(res.data + '?5naOj0l0ut1G9UwNYgM1O');
            } else {
                window.open(res.data);
            }

            this._spinner.hide();
        }, () => {
            this._spinner.hide();
        });

    }

    pageChangedUpcoming(page) {
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
        let self = this;
        this.filterObj.page = page;
        this.filterObj.skip = (this.filterObj.page - 1) * this.filterObj.limit;
        this.getInvoiceList();
    }

    setTableValues(data) {

        data.forEach((ele) => {
            let totalAmount = 0;
            // set subjects
            ele.mySubjects = this.getSubjects(ele.subjects);
            // set subjects ended

            // amount start
            let sessionTime = (ele.sessionEndTime - ele.sessionStartTime) / 60000;
            if (!sessionTime) {
                sessionTime = ele.payments.actualSessionTime;
            } else {
                let sessionTimeRem = sessionTime % 15;
                if (sessionTimeRem < 7.5) {
                    sessionTime = sessionTime - sessionTimeRem;
                } else {
                    sessionTime = sessionTime + (15 - sessionTimeRem);
                }
                sessionTime = sessionTime / 60;
            }

            let amount = (ele.payments.hourlyRate * sessionTime) || 0;
            ele.amount = amount;
            // amount ended

            //promo
            let sessionTimeForPromo = (ele.sessionEndTime - ele.sessionStartTime) / 60000;
            let sessionTimeRemForPromo = sessionTimeForPromo % 15;
            if (sessionTimeRemForPromo < 7.5) {
                sessionTimeForPromo = sessionTimeForPromo - sessionTimeRemForPromo;
            } else {
                sessionTimeForPromo = sessionTimeForPromo + (15 - sessionTimeRemForPromo);
            }
            sessionTimeForPromo = sessionTimeForPromo / 60;

            let promoDiscount = ele.payments.promoDiscount || 0;

            let referralDiscount = ele.payments.referralDiscount || 0;

            // promo ended

            if (ele.payments.parentPromoDiscount && ele.payments.parentPromoDiscount.type) {

                if (ele.payments.parentReferral) {
                    let parentReferral = ele.payments.parentReferral;
                    if (parentReferral.type == 'FLAT')
                        referralDiscount = parentReferral.discount;
                    else
                        referralDiscount = parentReferral.discount * amount * 0.01;
                }

                if (ele.payments.parentPromoDiscount) {
                    let parentPromoDiscount = ele.payments.parentPromoDiscount;
                    if (parentPromoDiscount.type == 'FLAT') {
                        promoDiscount = parentPromoDiscount.discount;
                        if (promoDiscount > (amount - referralDiscount))
                            promoDiscount = amount - referralDiscount;
                    } else
                        promoDiscount = parentPromoDiscount.discount * (amount - referralDiscount) * 0.01;
                }
                if (promoDiscount) {
                    if (promoDiscount > amount) promoDiscount = amount;
                }
            }

            if (ele.payments.parentReferral && ele.payments.parentReferral.type) {
                if (ele.payments.parentReferral) {
                    let parentReferral = ele.payments.parentReferral;
                    if (parentReferral.type == 'FLAT')
                        referralDiscount = parentReferral.discount;
                    else
                        referralDiscount = parentReferral.discount * amount * 0.01;
                }
            }

            let discount = promoDiscount + referralDiscount;
            promoDiscount = discount;
            let secondCharge = 0;
            if (ele.payments.partialAmountCharged || ele.payments.partialAmountLeft) {
                let tempChargeAmount = ele.payments.partialAmountCharged;
                if (ele.payments.partialAmountLeft) {
                    tempChargeAmount = ele.payments.partialAmountLeft;
                }
                secondCharge = tempChargeAmount;
            }

            totalAmount = totalAmount + (ele.payments.amountCharged + secondCharge);
            ele.promoDiscount = promoDiscount;

            // both added
            // let discount = promoDiscount + referralDiscount;
            // promoDiscount = discount;
            // ele.promoDiscount = promoDiscount;
            //
            // // total amount
            // // let myTotalAmount = 0;
            // let totalAmount = 0;
            // let secondCharge = 0;
            //
            // if ((ele.payments.partialAmountCharged || ele.payments.partialAmountLeft) && (ele.payments.partialAmountCharged !== undefined)) {
            //     let tempChargeAmount = ele.payments.partialAmountCharged;
            //     if (ele.payments.partialAmountLeft) {
            //         tempChargeAmount = ele.payments.partialAmountLeft;
            //     }
            //     secondCharge = tempChargeAmount;
            // }
            //
            // totalAmount = ele.payments.amountCharged + secondCharge;

            // if ((ele.payments.partialAmountCharged || ele.payments.partialPayment) && (ele.payments.partialAmountCharged !== undefined)) {
            //     secondCharge = ele.payments.partialAmountCharged;
            // }

            // totalAmount = totalAmount + (ele.payments.amountCharged + secondCharge);
            // let myTotalAmount = 0
            // myTotalAmount = myTotalAmount + (amount + secondCharge - totalPromo);
            ele.myTotalAmount = totalAmount;

// total amount ended

        });

        this.invoices = data;

    }

    returnSrc() {
        return `






<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        @font-face {
            font-display: swap;
            font-family: 'font-bold';
            src: url('https://parentsylvanlive.clicklabs.in/assets/fonts/proxima-nova-semibold-webfont.woff')
        }

        @font-face {
            font-display: swap;
            font-family: 'font-full-bold';
            src: url('https://parentsylvanlive.clicklabs.in/assets/fonts/ProximaNova-Bold.woff')
        }

    @font-face {
            font-display: swap;
            font-family: 'font-light';
            src: url('https://parentsylvanlive.clicklabs.in/assets/fonts/ProximaNova-Reg.woff')
        }


        .main-title {
            text-align: left;
            font-size: 30px;
            padding: 18px;
            width: 310px;
            font-family: 'font-full-bold';
            min-width: 304px;
            color: #595959;
        }

        .th-style {
            font-family: 'font-full-bold';
            font-size: 12px;
            color: #255fa6;
            padding: 8px 0;
            /*text-align: left;*/
            margin-left: 10px;
            vertical-align: top;
        }

        .my-info {
            margin-left: -20px;
            font-size: 15px;
            list-style-type: none;
            /*font-weight: 400;*/
            line-height: 22px;
            font-family: 'font-light';
        }

        .service-period {
            color: #255fa6;
            font-size: 15px;
            /*font-weight: 600;*/
            text-transform: uppercase;
            font-family: 'font-full-bold';
            white-space: nowrap;
        }

        .set-value {
            font-family: 'font-light';
            font-size: 12px;
            padding: 9px 0;
        }

        .paid-text{
        vertical-align: middle; font-family:'font-bold';text-align: right;padding: 7px 0;font-size: 16px;
        }

        .top-invoice {
            color: #255fa6;
            font-size: 29px;
            padding: 22px 8px;
            text-align: right;
            font-weight: 900;
            font-family: 'font-full-bold';
            white-space: nowrap;
            min-width: 200px;
        }

        .thank-you {
            text-align: center;
            color: #255fa6;
            font-size: 13px;
            font-family: 'font-bold';
            text-transform: uppercase;
        }

        .showTextTop {
            vertical-align: top;
        }

        .total-paid-row {
            border-top: 1px #78acdb solid;
            border-bottom: 1px #78acdb solid;
        }


    </style>
</head>
<body style="padding: 20px" class="set-body-font">
<table style="width: 100%;border-collapse: collapse">
    <tr>
        <th class="main-title">
            mySylvan Marketplace+
        </th>
        <th class="top-invoice">
            INVOICE
        </th>
    </tr>
    <tr>
        <td>
            <ul class="my-info">
                <li>{{parentName}}</li>
                <li>{{address1}}</li>
                <li>{{address2}}</li>
                <li>{{cityZip}}</li>
                <li>{{phoneNo}}</li>
                <li>{{Email}}</li>
            </ul>
        </td>
        <td style="text-align: right;vertical-align: top;">
            <b class="service-period">INVOICE DATE:</b>
            <span style="font-family:'font-light';font-size: 16px">{{invoiceDate}}</span>
        </td>
    </tr>
    <tr>
        <!--        <td style=""></td>-->
        <td style="text-align: right;width: 80%" colspan="2">
            <b class="service-period"> Service period:</b>
            <span style="font-family:'font-light';font-size: 14px">{{servicePeriod}}</span>
        </td>
    </tr>
</table>
<br>
<table style="width: 100%;border-collapse: collapse">
    <tr style="   border-top: 1px #78acdb solid; font-family:'font-bold'">
        <td class="th-style" style="width:12%">
            Date
        </td>
        <td class="th-style" style="width:54%">
            Description
        </td>
        <td class="th-style" style="width:12%;margin-right: 5px;text-align: right">
            Session Cost
        </td>
        <td class="th-style" style="width: 12%;margin-right: 5px;text-align: right">
            Promotions/ Discounts
        </td>
        <td class="th-style" style="width: 12%;text-align: right">
            Amount Charged
        </td>
    </tr>
    {{#each dataList}}
    <tr style="border-top: 1px #78acdb solid;">
        <td class="set-value">
            {{this.date}}
        </td>
        <td class="set-value">
            {{description}}
        </td>
        <td class="set-value" style="padding-left: 10px;text-align: right">
            {{actualSessionAmount}}
        </td>
        <td class="set-value" style="text-align: right">
            -{{promotionAmount}}
        </td>
        <td class="set-value" style="text-align: right">
            {{amountCharged}}
        </td>
    </tr>
    {{/each}}

    <tr class="total-paid-row">

        <td class="set-value">

        </td>
        <td class="set-value">

        </td>
        <td class="set-value" style="padding-left: 10px;text-align: right">
        </td>
        <td class="paid-text" >
         <p>Total Paid</p>
        </td>
        <td class="paid-text">
          <p>{{totalPaidAmount}}</p>
        </td>

<!--        <td></td>-->
<!--        <td></td>-->
<!--        <td></td>-->
<!--        <td  style="vertical-align: middle; font-family:'font-bold';text-align: right;">-->
<!--            <p>Total Paid</p>-->
<!--        </td>-->
<!--        <td style="vertical-align: middle; font-family:'font-bold';text-align: right;">-->
<!--              <p>{{totalPaidAmount}}</p>-->
<!--        </td>-->

    </tr>
</table>
<br>
<div class="thank-you">
    Thank you for your business!
</div>
<br>
<br>
</div>
</body>
</html>












`;
    }

    ngOnDestroy() {
        if (this.sessionStore) {
            this.sessionStore.unsubscribe();
        }
        if (this.profileStore) {
            this.profileStore.unsubscribe();
        }
    }

//     setValue(){

//     let totalAmount = 0;
//     let dataList = bookings.map((ele)=>{
// //actual cost
//         let sessionTime = (ele.sessionEndTime - ele.sessionStartTime) / 60000;
//         if (!sessionTime)
//             sessionTime = ele.payments.actualSessionTime;
//         else {
//             let sessionTimeRem = sessionTime % 15;
//             if (sessionTimeRem < 7.5) {
//                 sessionTime = sessionTime - sessionTimeRem;
//             } else {
//                 sessionTime = sessionTime + (15 - sessionTimeRem);
//             }
//             sessionTime = sessionTime / 60;
//         }
//
//         let amount = (ele.payments.hourlyRate * sessionTime) || 0;
//         amount = util.roundToTwoDecimals(amount);
//         let subjectsData = ' ';
//         ele.subjects.forEach((subject)=>{
//
//             subject.subcategories.forEach( (subElement)=>{
//                 subjectsData = subjectsData + subElement.name + ', ';
//             })
//         });
//         subjectsData = subjectsData.substring(0, subjectsData.length - 2);
//
//
// //promo
//         let sessionTimeForPromo = (ele.sessionEndTime - ele.sessionStartTime) / 60000;
//         let sessionTimeRemForPromo = sessionTimeForPromo % 15;
//         if (sessionTimeRemForPromo < 7.5) {
//             sessionTimeForPromo = sessionTimeForPromo - sessionTimeRemForPromo;
//         } else {
//             sessionTimeForPromo = sessionTimeForPromo + (15 - sessionTimeRemForPromo);
//         }
//         sessionTimeForPromo = sessionTimeForPromo / 60;
//
//         let promoDiscount = ele.payments.promoDiscount || 0;
//
//         let referralDiscount = ele.payments.referralDiscount || 0;
//
//         if (ele.payments.parentPromoDiscount && ele.payments.parentPromoDiscount.type) {
//
//             if (ele.payments.parentReferral) {
//                 let parentReferral=ele.payments.parentReferral;
//                 if (parentReferral.type=='FLAT')
//                     referralDiscount=parentReferral.discount;
//                 else
//                     referralDiscount=parentReferral.discount*amount*0.01;
//             }
//
//             if (ele.payments.parentPromoDiscount) {
//                 let parentPromoDiscount=ele.payments.parentPromoDiscount;
//                 if (parentPromoDiscount.type=='FLAT') {
//                     promoDiscount=parentPromoDiscount.discount;
//                     if (promoDiscount>(amount-referralDiscount))
//                         promoDiscount=amount-referralDiscount;
//                 }
//                 else
//                     promoDiscount=parentPromoDiscount.discount*(amount-referralDiscount)*0.01;
//             }
//             if (promoDiscount) {
//                 if (promoDiscount>amount) promoDiscount=amount;
//                 promoDiscount = util.roundToTwoDecimals(promoDiscount);
//             }
//         }
//
//         if (ele.payments.parentReferral && ele.payments.parentReferral.type) {
//             if (ele.payments.parentReferral) {
//                 let parentReferral=ele.payments.parentReferral;
//                 if (parentReferral.type=='FLAT')
//                     referralDiscount=parentReferral.discount;
//                 else
//                     referralDiscount=parentReferral.discount*amount*0.01;
//             }
//             referralDiscount = util.roundToTwoDecimals(referralDiscount);
//         }
//
//         let discount = promoDiscount + referralDiscount;
//         promoDiscount = util.roundToTwoDecimals(discount);
//         let secondCharge = 0;
//         if (ele.payments.partialAmountCharged || ele.payments.partialAmountLeft){
//             let tempChargeAmount = ele.payments.partialAmountCharged;
//             if(ele.payments.partialAmountLeft){
//                 tempChargeAmount = ele.payments.partialAmountLeft;
//             }
//             secondCharge = util.roundToTwoDecimals(tempChargeAmount);
//         }
//         totalAmount = totalAmount + (ele.payments.amountCharged + secondCharge);
//

}
