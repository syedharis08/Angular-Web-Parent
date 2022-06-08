import { Action, ActionReducer } from '@ngrx/store';

const initialState: any = {
    steponeData: null,
    step2Data: null,
    step2: false,
    step3: false,

};

export const session: ActionReducer<any> = (state = initialState, action: Action) => {
    switch (action.type) {
        case 'STEPONE_DATA':
            return Object.assign({}, state);
        case 'STEPONE_DATA_SUCCESS':
            if (action.payload && action.payload != undefined) {
                localStorage.setItem('steponeData', JSON.stringify(action.payload));
            }
            return Object.assign({}, state, {steponeData: action.payload});
        case 'GOTO_BOOK_SESSION_STEP3_SUCCESS':
            if (action.payload && action.payload != undefined) {
                localStorage.setItem('step3Data', JSON.stringify(action.payload));
            }
            return Object.assign({}, state, {step2Data: action.payload, step3: true, step2: false});
        case 'SELECT_TUTOR_SUCCESS':
            return Object.assign({}, state, {tutors: action.payload ? action.payload.result : ''});
        case 'GET_TUTOR_DETAILS_SUCCESS':
            return Object.assign({}, state, {tutorDetails: action.payload});
        case 'CHECK_TUTOR_AVAILABILITY_SUCCESS':
            return Object.assign({}, state, {checkTutorData: action.payload});
        case 'GET_TUTOR_COUNT_SUCCESS':
            return Object.assign({}, state, {tutorsCount: action.payload, tutorcountSuccess: true});
        case 'GOTO_BOOK_SESSION_STEP2_SUCCESS':
            return Object.assign({}, state, {step2: true});
        case 'GOTO_BOOK_SESSION_STEP2_FALSE':

            return Object.assign({}, state, {step2: false});
        case 'GO_TO_PAYMENTS_SUCCESS':
            return Object.assign({}, state, {bookingData: action.payload, step3: false});
        case 'COMPLETE_BOOKING_SUCCESS':
            localStorage.removeItem('bookingDetails');
            localStorage.removeItem('PROMOCODE_TYPE');
            localStorage.removeItem('PROMOCODE');
            localStorage.removeItem('PROMOCODE_TYPE');
            localStorage.removeItem('refferAmount');

            return Object.assign({}, state, {bookingSuccess: action.payload, step2Data: null, step3: false, steponeData: null, bookingData: null});
        case 'SELECT_GET_TUTOR_RATING_SUCCESS':
            return Object.assign({}, state, {tutorratings: action.payload});
        case 'SELECT_GET_TUTOR_RATING_SUCCESS_COUNT':
            return Object.assign({}, state, {ratingsCount: action.payload});
        default:
            return state;
    }
};
