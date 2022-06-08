import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import * as app from '../../state/app.actions';
import 'rxjs/add/operator/map';
import * as moment1 from 'moment-timezone';

@Injectable()
export class ApiService {
    token;
    headerToken;
    headers;
    options;
    utcOffset;

    constructor(public http: Http, private store: Store<any>) {
    }

    getToken(authRequired, utcOffset) {

        this.headers = new Headers({'content-language': 'en'});
        this.headers.set('X-Frame-Options', 'SAMEORIGIN');
        this.headers.set('X-Content-Type-Options', 'nosniff');
        this.token = localStorage.getItem('token');
        this.headerToken = 'Bearer ' + this.token;
        this.utcOffset = (((new Date()).getTimezoneOffset() * 60000) * -1);
        if (authRequired === true && utcOffset === false) {
            this.headers = this.headers ? this.headers : {};
            this.headers.set('Authorization', this.headerToken);
            if (this.headers.has('utcoffset')) {
                this.headers.delete('utcoffset');
            }
        } else if (authRequired === true && utcOffset === true) {
            this.headers.set('Authorization', this.headerToken);
            this.headers.set('utcoffset', this.utcOffset);
            this.headers.set('utcoffsetzone', moment1.tz.guess());

        } else if (authRequired === false && utcOffset === false) {
            if (this.headers.has('Authorization')) {
                this.headers.delete('Authorization');
            }
            if (this.headers.has('utcoffset')) {
                this.headers.delete('utcoffset');
            }
        } else if (authRequired === false && utcOffset === true) {
            if (this.headers.has('Authorization')) {
                this.headers.delete('Authorization');
            }
            this.headers.set('utcoffset', this.utcOffset);
            this.headers.set('utcoffsetzone', moment1.tz.guess());
        }

        this.options = new RequestOptions({headers: this.headers});

        return this.options;
    }

    getFileUploadTokenLatLong(authRequired, utcOffset) {

        this.headers = new Headers();
        this.token = localStorage.getItem('token');
        this.headerToken = 'Bearer ' + this.token;
        // this.headerToken = this.token;
        this.utcOffset = (((new Date()).getTimezoneOffset() * 60000) * -1);
        if (authRequired === true && utcOffset === false) {
            this.headers = this.headers ? this.headers : {};
            this.headers.set('Authorization', this.headerToken);
            if (this.headers.has('utcoffset')) {
                this.headers.delete('utcoffset');
            }
        } else if (authRequired === true && utcOffset === true) {
            this.headers.set('Authorization', this.headerToken);
            this.headers.set('utcoffset', this.utcOffset);
            this.headers.set('utcoffsetzone', moment1.tz.guess());

        } else if (authRequired === false && utcOffset === false) {
            if (this.headers.has('Authorization')) {
                this.headers.delete('Authorization');
            }
            if (this.headers.has('utcoffset')) {
                this.headers.delete('utcoffset');
            }
        } else if (authRequired === false && utcOffset === true) {
            if (this.headers.has('Authorization')) {
                this.headers.delete('Authorization');
            }
            this.headers.set('utcoffset', this.utcOffset);
            this.headers.set('utcoffsetzone', moment1.tz.guess());
        }
        this.options = new RequestOptions({headers: this.headers});
        return this.options;
    }

    getFileUploadToken(authRequired, utcOffset) {

        this.headers = new Headers({'content-language': 'en'});
        this.headers.set('X-Frame-Options', 'SAMEORIGIN');
        this.headers.set('X-Content-Type-Options', 'nosniff');
        this.token = localStorage.getItem('token');
        this.headerToken = 'Bearer ' + this.token;
        // this.headerToken = this.token;
        this.utcOffset = (((new Date()).getTimezoneOffset() * 60000) * -1);
        if (authRequired === true && utcOffset === false) {
            this.headers = this.headers ? this.headers : {};
            this.headers.set('Authorization', this.headerToken);
            if (this.headers.has('utcoffset')) {
                this.headers.delete('utcoffset');
            }
        } else if (authRequired === true && utcOffset === true) {
            this.headers.set('Authorization', this.headerToken);
            this.headers.set('utcoffset', this.utcOffset);
            this.headers.set('utcoffsetzone', moment1.tz.guess());

        } else if (authRequired === false && utcOffset === false) {
            if (this.headers.has('Authorization')) {
                this.headers.delete('Authorization');
            }
            if (this.headers.has('utcoffset')) {
                this.headers.delete('utcoffset');
            }
        } else if (authRequired === false && utcOffset === true) {
            if (this.headers.has('Authorization')) {
                this.headers.delete('Authorization');
            }
            this.headers.set('utcoffset', this.utcOffset);
            this.headers.set('utcoffsetzone', moment1.tz.guess());

        }
        this.options = new RequestOptions({headers: this.headers});
        return this.options;
    }

    getApi(url, authRequired, utcOffset) {
        return this.http.get(url, this.getToken(authRequired, utcOffset))
            .map((res: Response) => {
                return res.json();
            })

            .catch((error: any) => {
                try {
                    if (navigator.onLine == false) {
                        this.store.dispatch({
                            type: app.actionTypes.APP_INTERNET_NOT_WORKING, payload: error
                        });
                    }
                    return (Observable.throw(error.json()));
                } catch (jsonError) {
                    // If the error couldn't be parsed as JSON data
                    // then it's possible the API is down or something
                    // went wrong with the parsing of the successful
                    // response. In any case, to keep things simple,
                    // we'll just create a minimum representation of
                    // a parsed error.
                    let minimumViableError = {
                        success: false
                    };
                    return (Observable.throw(minimumViableError));
                }
            });

    }

    // getRegisterApi(url, authRequired, utcOffset) {
    //     return this.http.get(url, this.getRegisterToken(authRequired, utcOffset))
    //         .map((res: Response) => {
    //             return res.json();
    //         })

    //         .catch((error: any) => {
    //             try {
    //                 if (navigator.onLine == false) {
    //                     this.store.dispatch({
    //                         type: app.actionTypes.APP_INTERNET_NOT_WORKING, payload: error
    //                     });
    //                 }
    //                 return (Observable.throw(error.json()));
    //             } catch (jsonError) {
    //                 // If the error couldn't be parsed as JSON data
    //                 // then it's possible the API is down or something
    //                 // went wrong with the parsing of the successful
    //                 // response. In any case, to keep things simple,
    //                 // we'll just create a minimum representation of
    //                 // a parsed error.
    //                 let minimumViableError = {
    //                     success: false
    //                 };
    //                 return (Observable.throw(minimumViableError));
    //             }
    //         });

    // }
    postFileApiLatLong(url, authRequired, utcOffset) {
        return this.http.post(url, '', this.getFileUploadTokenLatLong(authRequired, utcOffset))
            .map((res: Response) => res.json())

            .catch((error: any) => {
                try {
                    return (Observable.throw(error.json()));
                } catch (jsonError) {
                    // If the error couldne parsed as JSON data
                    // then it's possible the API is down or something
                    // went wrong with the parsing of the successful
                    // response. In any case, to keep things simple,
                    // we'll just create a minimum representation of
                    // a parsed error.
                    let minimumViableError = {
                        success: false
                    };
                    return (Observable.throw(minimumViableError));
                }
            });

    }

    postApi(url, data, authRequired, utcOffset) {

        return this.http.post(url, data, this.getToken(authRequired, utcOffset))
            .map((res: Response) => res.json())

            .catch((error: any) => {
                try {
                    return (Observable.throw(error.json()));
                } catch (jsonError) {
                    // If the error couldne parsed as JSON data
                    // then it's possible the API is down or something
                    // went wrong with the parsing of the successful
                    // response. In any case, to keep things simple,
                    // we'll just create a minimum representation of
                    // a parsed error.
                    let minimumViableError = {
                        success: false
                    };
                    return (Observable.throw(minimumViableError));
                }
            });

    }

    postApi1(url, data, authRequired, utcOffset) {

        this.headers = new Headers({'content-language': 'en'});
        this.headers.set('X-Frame-Options', 'SAMEORIGIN');
        this.headers.set('X-Content-Type-Options', 'nosniff');
        this.token = localStorage.getItem('token');
        this.headerToken = 'Bearer ' + this.token;
        this.utcOffset = (((new Date()).getTimezoneOffset() * 60000) * -1);
        this.headers.set('Authorization', this.headerToken);
        this.headers.set('utcoffset', this.utcOffset);
        this.headers.set('utcoffsetzone', localStorage.getItem('timezoneOffsetZone'));

        this.options = new RequestOptions({headers: this.headers});
        // let url = environment.APP.API_URL + environment.APP.GET_AVAILABILTY + '?startDate=' + start + '&endDate=' + end;
        return this.http.post(url, data, this.options)
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

    postFileApi(url, data, authRequired, utcOffset) {
        return this.http.post(url, data, this.getFileUploadToken(authRequired, utcOffset))
            .map((res: Response) => res.json())

            .catch((error: any) => {
                try {
                    return (Observable.throw(error.json()));
                } catch (jsonError) {
                    // If the error couldne parsed as JSON data
                    // then it's possible the API is down or something
                    // went wrong with the parsing of the successful
                    // response. In any case, to keep things simple,
                    // we'll just create a minimum representation of
                    // a parsed error.
                    let minimumViableError = {
                        success: false
                    };
                    return (Observable.throw(minimumViableError));
                }
            });

    }

    deleteApi(url, data, authRequired, utcOffset) {
        this.getToken(authRequired, utcOffset);
        this.options = new RequestOptions({
            'headers': this.headers,
        });

        return this.http.delete(url, this.options)
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

    deleteApiDel(url, data, authRequired, utcOffset) {
        this.getToken(authRequired, utcOffset);
        this.options = new RequestOptions({
            'headers': this.headers,
            'body': data
        });

        return this.http.delete(url, this.options)
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

    putApi(url, data, authRequired, utcOffset) {
        return this.http.put(url, data, this.getToken(authRequired, utcOffset))
            .map((res: Response) => res.json())

            .catch((error: any) => {
                try {
                    return (Observable.throw(error.json()));
                } catch (jsonError) {
                    // If the error couldn't be parsed as JSON data
                    // then it's possible the API is down or something
                    // went wrong with the parsing of the successful
                    // response. In any case, to keep things simple,
                    // we'll just create a minimum representation of
                    // a parsed error.
                    let minimumViableError = {
                        success: false
                    };
                    return (Observable.throw(minimumViableError));
                }
            });

    }

    putPathApi(url, authRequired, utcOffset) {
        return this.http.put(url, this.getToken(authRequired, utcOffset))
            .map((res: Response) => res.json())

            .catch((error: any) => {
                try {
                    return (Observable.throw(error.json()));
                } catch (jsonError) {
                    // If the error couldn't be parsed as JSON data
                    // then it's possible the API is down or something
                    // went wrong with the parsing of the successful
                    // response. In any case, to keep things simple,
                    // we'll just create a minimum representation of
                    // a parsed error.
                    let minimumViableError = {
                        success: false
                    };
                    return (Observable.throw(minimumViableError));
                }
            });

    }

    putFileApi(url, data, authRequired, utcOffset) {
        return this.http.put(url, data, this.getFileUploadToken(authRequired, utcOffset))
            .map((res: Response) => res.json())

            .catch((error: any) => {
                try {
                    return (Observable.throw(error.json()));
                } catch (jsonError) {
                    // If the error couldn't be parsed as JSON data
                    // then it's possible the API is down or something
                    // went wrong with the parsing of the successful
                    // response. In any case, to keep things simple,
                    // we'll just create a minimum representation of
                    // a parsed error.
                    let minimumViableError = {
                        success: false
                    };
                    return (Observable.throw(minimumViableError));
                }
            });

    }

}
