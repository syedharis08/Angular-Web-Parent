import { Action, ActionReducer } from '@ngrx/store';
import { toPayload } from '@ngrx/effects';

const initialState: any = {
    tutors: null,
    loggedIn: false,
    tutorcountSuccess: false,
    latLongResult: null,
    continueBooking: null

};

export const tutor: ActionReducer<any> = (state = initialState, action: Action) => {

    switch (action.type) {

        case 'BROWSE_TUTOR_SUCCESS':

            return Object.assign({}, state, { continueBooking: null, tutors: action.payload ? action.payload.result : '' });
        case 'BROWSE_TUTORS_MARKET_SUCCESS':

            return Object.assign({}, state, { tutors: action.payload ? action.payload.result : '' });
        case 'GET_COUNT_SUCCESS':
            return Object.assign({}, state, { tutorsCount: action.payload, tutorcountSuccess: true });
        case 'ADDRESS_LOCATION':
            return Object.assign({}, state, { continueBooking: action.payload });
        case 'GET_MARKET_COUNT_SUCCESS':
            return Object.assign({}, state, { tutorsCount: action.payload, tutorcountSuccess: true });
        case 'SET_ZIPCODE':
            return Object.assign({}, state, { zipcode: action.payload });
        case 'BROWSE_TUTOR_ERROR':
            return Object.assign({}, state, { tutors: 0, tutorsCount: 0 });
        case 'BROWSE_TUTOR_ERROR_SUCCESS':
            return Object.assign({}, state, { tutors: 0, tutorsCount: 0 });
        case 'GET_SUBJECTS_SUCCESS':
            return Object.assign({}, state, { subjects: action.payload, tutorSubjects: null });
        case 'GET_TUTOR_SUBJECTS_SUCCESS':
            return Object.assign({}, state, { tutorSubjects: action.payload });
        case 'AUTH_GET_LAT_LONG':
            return Object.assign({}, state, { latLong: action.payload });
        case 'AUTH_GET_LAT_LONG_SUCCESS':
            return Object.assign({}, state, { latLongResult: action.payload });
        case 'FIRST_GET_LAT_LONG_SUCCESS':
            return Object.assign({}, state, { latLongResult: action.payload });
        case 'GET_TUTOR_DETAILS_SUCCESS':
            return Object.assign({}, state, { tutorDetails: action.payload });
        case 'GET_ADDRESS_STUDENTS_SUCCESS':
            return Object.assign({}, state, { parentDetails: action.payload });
        case 'GET_TUTOR_RATING_SUCCESS':
            return Object.assign({}, state, { tutorratings: action.payload });
        case 'GET_TUTOR_RATING_SUCCESS_COUNT':
            return Object.assign({}, state, { ratingsCount: action.payload });
        default:
            return state;
    }
};
