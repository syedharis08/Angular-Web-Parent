import { Component, OnInit } from '@angular/core';
import 'style-loader!./my-login.component.scss';
import { CommonService } from '../../../../services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TutorService } from '../../../../services/tutor-service/tutor.service';
import { Router } from '@angular/router';

@Component({
    selector: 'my-login',
    templateUrl: './my-login.component.html'
})
export class MyLoginComponent implements OnInit {

    public form: FormGroup;

    constructor(public commonService: CommonService, private fb: FormBuilder, public tutorService: TutorService,
                public router: Router) {

    }

    ngOnInit() {
        if (!localStorage.getItem('timezoneOffsetZone')) {
            localStorage.setItem('timezoneOffsetZone', 'America/New_York');
        }
        this.form = this.fb.group({
            userName: ['', Validators.required],
            password: ['Qwerty@123', Validators.required]
        });
    }

    formSubmit() {
        if (this.form.valid) {
            let formData = new FormData();
            formData.append('userName', this.form.value.userName);
            formData.append('password', this.form.value.password);
            formData.append('deviceType', 'WEB');
            formData.append('deviceName', '11111');
            formData.append('deviceToken', '11111');

            this.tutorService.loginByUserName(formData).subscribe(res => {
                localStorage.setItem('token', res.data.accessToken);
                this.router.navigate(['/pages/refer-friend']);
                setTimeout(() => {
                    window.location.reload()
                });
                console.log(res, 'passwordpasswordpassword');
            });
        }
    }

}
