import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import { JwtHelper } from 'angular2-jwt';
import { environment } from '../../../environment/environment';
import * as io from 'socket.io-client';

@Injectable()
export class AuthService {
    isLoggedIn: boolean = false;
    public user = null;
    redirectUrl: '/pages';
    jwtHelper: JwtHelper = new JwtHelper();

    private url = environment.APP.API_URL;
    public socket;

    login(isSocket?) {
        let token = localStorage.getItem('token');

        // token exist and is not expired
        if (token && token != null && token != undefined) {
            // let headerToken = token;
            // this.url += '?token=' + headerToken;
            // this.socket = io(this.url);
            //
            // this.socket.on('connect', (socket) => {
            // });
            // if (this.socket != null) {
            //     this.socket.on('messageFromServer', (socket) => {
            //     });
            // }

            this.makeSocketConnection();
            this.isLoggedIn = true;
            return this.isLoggedIn;
        } else {
            this.isLoggedIn = false;
            return this.isLoggedIn;
        }
    }

    makeSocketConnection() {

        if (!this.socket) {
            let token = localStorage.getItem('token');

            if (token && token != null && token != undefined) {
                let headerToken = token;
                this.url += '?token=' + headerToken;
                this.socket = io(this.url);
                this.socket.on('connect', (socket) => {
                });
                if (this.socket != null) {
                    this.socket.on('messageFromServer', (socket) => {
                    });
                }
            }
        }
    }

    getSocketConnection() {
        if (!this.socket) {
            this.login();
        }
        if (this.socket) {
            return this.socket;
        } else {
            return null;
        }
    }

    disconnect() {
        this.socket.disconnect();
    }

    logout(): void {
        // localStorage.removeItem('token');
        localStorage.removeItem('token');
        localStorage.removeItem('userRegisterationId');
        if (this.socket) {
            this.socket.disconnect();
        }
    }

}
