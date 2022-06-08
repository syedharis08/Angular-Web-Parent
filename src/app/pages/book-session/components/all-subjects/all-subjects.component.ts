import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import * as tutor from '../../../../publicPages/tutor/state/tutor.actions';
import { ToastrService } from 'ngx-toastr';
import { TutorService } from '../../../../services/tutor-service/tutor.service';
import { BookSessionService } from '../../../../services/session-service/session.service';
import 'style-loader!./all-subjects.scss';

@Component({
    selector: 'all-subjects',
    templateUrl: './all-subjects.html',
    styleUrls: ['./all-subjects.scss']
})

export class AllSubjects {
    subjectarray2: any;
    subjectarray1: any;
    showEmptyError: boolean = false;
    public addedSubjects = [];
    public allsubjects;
    public checked: boolean;
    public subjectData;
    public tutor_id;
    public subjectErrorr: boolean = false;
    public subjectArray = [];
    public categories = [];
    public selected_sub1 = [];
    public newarr1 = [];

    constructor(private store: Store<any>, private modalService: NgbModal, private router: Router,
                public dialog: MatDialog, public tutorService: TutorService, public sessionService: BookSessionService,
    ) {
        let el = $('#moveUp');
        $('html,body').animate({scrollTop: (el.offset().top - 50)}, 'slow', () => {
            el.focus();
        });
        this.subjectArray = [];
        this.categories = [];
        this.tutor_id = localStorage.getItem('tutor_Id');
        if (this.tutor_id && this.tutor_id != undefined) {
            this.store.dispatch({
                type: tutor.actionTypes.GET_TUTOR_SUBJECTS,
                payload: this.tutor_id
            });
        } else {
            this.store.dispatch({
                type: tutor.actionTypes.GET_SUBJECTS
            });
        }
        if (localStorage.getItem('selected_subjects') != undefined) {
            this.addedSubjects = JSON.parse(localStorage.getItem('selected_subjects'));
            let cc = [];
            cc = this.addedSubjects;
            for (let x in cc) {
                if (cc.hasOwnProperty(x)) {
                    this.selected_sub1.push(cc[x]);

                    this.newarr1.push(cc[x].subcategoryId);
                }
            }
            if (this.selected_sub1.length > 0) {
                this.subjectArray = this.selected_sub1;
            }
        }

        this.store.select('tutor').subscribe((res: any) => {
                if (res) {
                    this.allsubjects = [];
                    this.subjectarray1 = [];
                    this.subjectarray2 = [];

                    if (res.tutorSubjects && res.tutorSubjects && res.tutorSubjects.data) {
                        this.allsubjects = [...res.tutorSubjects.data];
                        let subjectarray1 = this.allsubjects.splice(this.allsubjects.length / 2);
                        this.subjectarray1 = subjectarray1;
                        let subjectarray2 = this.allsubjects;
                        this.subjectarray2 = subjectarray2;
                    } else {
                        this.allsubjects = [];
                        if (res && res.subjects && res.subjects.data) {
                            this.allsubjects = [...res.subjects.data];
                            let subjectarray1 = this.allsubjects.splice(this.allsubjects.length / 2);
                            this.subjectarray1 = subjectarray1;
                            let subjectarray2 = this.allsubjects;
                            this.subjectarray2 = subjectarray2;

                        }
                    }
                }
            });
    };

    ngOnInit() {

    }

    ngOnDestroy() {
        if (localStorage.getItem('selected_subjects') != undefined) {
            localStorage.removeItem('selected_subjects');

        }
    }

    isChecked(id) {
        for (let subcat of this.addedSubjects) {
            if (subcat.subCategoryId == id) return true;
        }
        return false;
    }

    selectSubject(cboxValue, data) {
        let obj = {
            categoryId: data._id,
            subCategoryId: cboxValue._id,
            subCategoryName: cboxValue.name
        };
        let flag = true;
        if (this.subjectArray.length == 0) {
            this.subjectArray.push(obj);
            return;
        }
        for (let i = 0; i < this.subjectArray.length; i++) {
            if (this.subjectArray[i].subCategoryId == obj.subCategoryId) {

                this.subjectArray.splice(i, 1);
                flag = false;
                break;
            } else {

                continue;
            }
        }
        if (flag) {
            this.subjectArray.push(obj);
        } else {

        }

    }

    addSubjects() {
        this.subjectErrorr = false;
        this.showEmptyError = false;
        if (this.subjectArray.length == 0) {
            this.showEmptyError = true;
            return;
        }
        if (this.subjectArray.length > 3) {
            this.subjectErrorr = true;
            return;
        } else {
            this.showEmptyError = false;
            this.subjectErrorr = false;
            this.sessionService.updateStepperIndex(0);
            this.sessionService.changeStep.next(0);
            this.sessionService.addSubjects(this.subjectArray);
            this.router.navigate(['/pages/book-session/session']);
        }
    }


}
