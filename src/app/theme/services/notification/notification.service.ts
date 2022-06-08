import { Injectable } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../../environment/environment';
import 'rxjs/add/operator/map';

@Injectable()
export class NotificationService {
    token = localStorage.getItem('token');
    headerToken = 'Bearer ' + this.token;

    constructor(private commonService: CommonService, public http: Http) {
    }

    /*getNotifications() {
      let observable = new Observable(observer => {

        this.commonService.getSocketConnection.on('message', (data) => {
          observer.next(data);
        });
        //todo: delete this  return statement
        return () => {
          this.socket.disconnect();
        };
      })
      return observable;
    }*/

    getAllNotifications(payload) {
        let token = localStorage.getItem('token');
        let headerToken = 'Bearer ' + token;
        let headers = new Headers({'Content-Type': 'application/json', 'content-language': 'en'});
        headers.set('X-Frame-Options', 'SAMEORIGIN');
        headers.set('X-Content-Type-Options', 'nosniff');
        headers.append('Authorization', headerToken);
        let options = new RequestOptions({headers: headers});
        let skip = (payload.currentPage - 1) * payload.limit;

        let url = environment.APP.API_URL + environment.APP.GET_ALL_NOTIFICATION + '?limit=' + payload.limit + '&skip=' + skip;

        return this.http.get(url, options)
            .map((res: Response) => {
                return res.json();
            })
            .catch((error: any) => {
                try {
                    return (Observable.throw(error.json()));
                } catch (jsonError) {
                    let minimumViableError = {
                        success: false
                    };
                    return (Observable.throw(minimumViableError));
                }
            });

    }

    clearAllNotifications() {
        let token = localStorage.getItem('token');
        let headerToken = 'Bearer ' + token;
        let headers = new Headers({'Content-Type': 'application/json', 'content-language': 'en'});
        headers.set('X-Frame-Options', 'SAMEORIGIN');
        headers.set('X-Content-Type-Options', 'nosniff');
        headers.append('Authorization', headerToken);
        let options = new RequestOptions({headers: headers});

        let url = environment.APP.API_URL + environment.APP.CLEAR_ALL_NOTIFICATION;

        return this.http.get(url, options)
            .map((res: Response) => {

                return res.json();
            })
            .catch((error: any) => {
                try {
                    return (Observable.throw(error.json()));
                } catch (jsonError) {
                    let minimumViableError = {
                        success: false
                    };
                    return (Observable.throw(minimumViableError));
                }
            });

    }

    readNotification(data) {
        data = {notificationID: [data._id]};

        let token = localStorage.getItem('token');
        let headerToken = 'Bearer ' + token;
        let headers = new Headers({'Content-Type': 'application/json', 'content-language': 'en'});
        headers.set('X-Frame-Options', 'SAMEORIGIN');
        headers.set('X-Content-Type-Options', 'nosniff');
        headers.append('Authorization', this.headerToken);
        let options = new RequestOptions({headers: headers});

        let url = environment.APP.API_URL + environment.APP.READ_NOTIFICATION;
        return this.http.put(url, data, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                try {
                    return (Observable.throw(error.json()));
                } catch (jsonError) {
                    let minimumViableError = {
                        success: false
                    };
                    return (Observable.throw(minimumViableError));
                }
            });

    }

    readAllNotification() {
        let data = {markAllAsRead: true};

        let token = localStorage.getItem('token');
        let headerToken = 'Bearer ' + token;
        let headers = new Headers({'Content-Type': 'application/json', 'content-language': 'en'});
        headers.set('X-Frame-Options', 'SAMEORIGIN');
        headers.set('X-Content-Type-Options', 'nosniff');
        headers.append('Authorization', this.headerToken);
        let options = new RequestOptions({headers: headers});

        let url = environment.APP.API_URL + environment.APP.READ_NOTIFICATION;
        return this.http.put(url, data, options)
            .map((res: Response) => res.json())
            .catch((error: any) => {
                try {
                    return (Observable.throw(error.json()));
                } catch (jsonError) {
                    let minimumViableError = {
                        success: false
                    };
                    return (Observable.throw(minimumViableError));
                }
            });

    }

}
