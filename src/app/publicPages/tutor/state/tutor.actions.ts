import { Action } from '@ngrx/store';

export const actionTypes = {

    BROWSE_TUTORS: 'BROWSE_TUTORS',
    BROWSE_TUTOR_SUCCESS: 'BROWSE_TUTOR_SUCCESS',
    BROWSE_TUTORS_MARKET: 'BROWSE_TUTORS_MARKET',
    ADDRESS_LOCATION: 'ADDRESS_LOCATION',
    GET_TUTOR_RATING_COUNT_BY_UID:'GET_TUTOR_RATING_COUNT_BY_UID',
    BROWSE_TUTORS_MARKET_SUCCESS: 'BROWSE_TUTORS_MARKET_SUCCESS',
    GET_MARKET_COUNT: 'GET_MARKET_COUNT',
    GET_MARKET_COUNT_SUCCESS: 'GET_MARKET_COUNT_SUCCESS',
    GET_COUNT: 'GET_COUNT',
    GET_COUNT_SUCCESS: 'GET_COUNT_SUCCESS',
    GET_SUBJECTS: 'GET_SUBJECTS',
    GET_SUBJECTS_SUCCESS: 'GET_SUBJECTS_SUCCESS',
    GET_TUTOR_SUBJECTS: 'GET_TUTOR_SUBJECTS',
    GET_TUTOR_SUBJECTS_SUCCESS: 'GET_TUTOR_SUBJECTS_SUCCESS',
    AUTH_GET_LAT_LONG: 'AUTH_GET_LAT_LONG',
    AUTH_GET_LAT_LONG_SUCCESS: 'AUTH_GET_LAT_LONG_SUCCESS',
    FIRST_GET_LAT_LONG: 'FIRST_GET_LAT_LONG',
    FIRST_GET_LAT_LONG_SUCCESS: 'FIRST_GET_LAT_LONG_SUCCESS',
    GET_TUTOR_DETAILS: 'GET_TUTOR_DETAILS',
    GET_TUTOR_DETAILS_BY_UID:'GET_TUTOR_DETAILS_BY_UID',
    GET_TUTOR_RATINGS_BY_UID: 'GET_TUTOR_RATINGS_BY_UID',
    // GET_TUTOR_RATING_SUCCESS: 'GET_TUTOR_RATING_SUCCESS',
    GET_TUTOR_DETAILS_SUCCESS: 'GET_TUTOR_DETAILS_SUCCESS',
    GET_TUTOR_RATINGS: 'GET_TUTOR_RATINGS',
    GET_TUTOR_RATING_SUCCESS: 'GET_TUTOR_RATING_SUCCESS',
    GET_ADDRESS_STUDENTS: 'GET_ADDRESS_STUDENTS',
    GET_ADDRESS_STUDENTS_SUCCESS: 'GET_ADDRESS_STUDENTS_SUCCESS',
    GET_TUTOR_RATING_COUNT: 'GET_TUTOR_RATING_COUNT',
    GET_TUTOR_RATING_SUCCESS_COUNT: 'GET_TUTOR_RATING_SUCCESS_COUNT',
    SET_ZIPCODE:'SET_ZIPCODE',
    BROWSE_TUTOR_ERROR:'BROWSE_TUTOR_ERROR',
    BROWSE_TUTOR_ERROR_SUCCESS:'BROWSE_TUTOR_ERROR_SUCCESS'

};

// type credentials = {
//     emailOrPhone: string,
//     password: string,
//     deviceType: string
// };

export class MarketTutors implements Action {
    type = actionTypes.BROWSE_TUTORS_MARKET;
    constructor(public payload: any = {}) { }
}
export class BrowseTutorErrorSucc implements Action {
    type = actionTypes.BROWSE_TUTOR_ERROR_SUCCESS;
    constructor(public payload: any = {}) { }
}
export class BrowseTutorError implements Action {
    type = actionTypes.BROWSE_TUTOR_ERROR;
    constructor(public payload: any = {}) { }
}
export class MarketTutorsSuccess implements Action {
    type = actionTypes.BROWSE_TUTORS_MARKET_SUCCESS;
    constructor(public payload: any = {}) { }
}
export class MarketTutorsCount implements Action {
    type = actionTypes.GET_MARKET_COUNT;
    constructor(public payload: any = {}) { }
}
export class MarketTutorsCountSuccess implements Action {
    type = actionTypes.GET_MARKET_COUNT_SUCCESS;
    constructor(public payload: any = {}) { }
}
export class GetAdressStudents implements Action {
    type = actionTypes.GET_ADDRESS_STUDENTS;
    constructor(public payload: any = {}) { }
}
export class TutorCountUId implements Action {
    type = actionTypes.GET_TUTOR_RATING_COUNT_BY_UID;
    constructor(public payload: any = {}) { }
}
export class TutorCount implements Action {
    type = actionTypes.GET_TUTOR_RATING_COUNT;
    constructor(public payload: any = {}) { }
}
export class RatingsCount implements Action {
    type = actionTypes.GET_TUTOR_RATING_SUCCESS_COUNT;
    constructor(public payload: any = {}) { }
}
export class GetAdressStudentsSuccess implements Action {
    type = actionTypes.GET_ADDRESS_STUDENTS_SUCCESS;
    constructor(public payload: any = {}) { }
}
export class AuthGetLatLong implements Action {
    type = actionTypes.AUTH_GET_LAT_LONG;
    constructor(public payload: any = {}) { }
}

export class AuthGetLatLongSuccess implements Action {
    type = actionTypes.AUTH_GET_LAT_LONG_SUCCESS;
    constructor(public payload: any = {}) { }
}
export class TutorRating implements Action {
    type = actionTypes.GET_TUTOR_RATINGS;
    constructor(public payload: any = {}) { }
}
export class TutorRatingByUid implements Action {
    type = actionTypes.GET_TUTOR_RATINGS_BY_UID;
    constructor(public payload: any = {}) { }
}

export class TutorRatingSuccess implements Action {
    type = actionTypes.GET_TUTOR_RATING_SUCCESS;
    constructor(public payload: any = {}) { }
}
export class FirstGetLatLong implements Action {
    type = actionTypes.FIRST_GET_LAT_LONG;
    constructor(public payload: any = {}) { }
}

export class FirstGetLatLongSuccess implements Action {
    type = actionTypes.FIRST_GET_LAT_LONG_SUCCESS;
    constructor(public payload: any = {}) { }
}

export class GetSubjects implements Action {
    type = actionTypes.GET_SUBJECTS;
    constructor(public payload: any = {}) { }
}
export class GetTutorSubjects implements Action {
    type = actionTypes.GET_TUTOR_SUBJECTS;
    constructor(public payload: any = {}) { }
}
export class GetTutorSubjectsSuccess implements Action {
    type = actionTypes.GET_TUTOR_SUBJECTS_SUCCESS;
    constructor(public payload: any = {}) { }
}
export class GetTutorDetails implements Action {
    type = actionTypes.GET_TUTOR_DETAILS;
    constructor(public payload: any = {}) { }
}
export class GetTutorDetailsByUId implements Action {
    type = actionTypes.GET_TUTOR_DETAILS_BY_UID;
    constructor(public payload: any = {}) { }
}
export class GetTutorDetailsSuccess implements Action {
    type = actionTypes.GET_TUTOR_DETAILS_SUCCESS;
    constructor(public payload: any = {}) { }
}
export class GetSubjectsSuccess implements Action {
    type = actionTypes.GET_SUBJECTS_SUCCESS;
    constructor(public payload: any = {}) { }
}
export class GetCount implements Action {
    type = actionTypes.GET_COUNT;
    constructor(public payload: any = {}) { }
}
export class GetCountSuccess implements Action {
    type = actionTypes.GET_COUNT_SUCCESS;
    constructor(public payload: any = {}) { }
}

export class BrowseTutor implements Action {
    type = actionTypes.BROWSE_TUTORS;
    constructor(public payload: any = {}) { }
}
export class BrowseTutorSuccess implements Action {
    type = actionTypes.BROWSE_TUTOR_SUCCESS;
    constructor(public payload: any = {}) { }
}
export class AddressLocation implements Action {
    type = actionTypes.ADDRESS_LOCATION;
    constructor(public payload: any = {}) { }
}
export type Actions
    = '';
