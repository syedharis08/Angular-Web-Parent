import { Action, ActionReducer } from '@ngrx/store';

const initialState: any = {
    tutorLive: null

};

export const sessionsDetails: ActionReducer<any> = (state = initialState, action: Action) => {
    switch (action.type) {
        case 'GET_ALL_UPCOMING_SESSIONS_SUCCESS':
            return Object.assign({}, state, { upcoming: action.payload.result });
        case 'GET_ALL_PAST_SESSIONS_SUCCESS':
            return Object.assign({}, state, { past: action.payload.result });
        case 'GET_BOOKING_BY_ID_SUCCESS':
            return Object.assign({}, state, { bookingById: action.payload });
        case 'GET_CANCELLATION_POLICIES_SUCCESS':
            return Object.assign({}, state, { policies: action.payload });
        case 'CHECK_TUTOR_LIVE_SUCCESS':
            return Object.assign({}, state, { tutorLive: action.payload });
        case 'GET_ALL_UPCOMING_SESSIONS_COUNT_SUCCESS':
            return Object.assign({}, state, { upcomingCount: action.payload });

        case 'GET_ALL_PAST_SESSIONS_COUNT_SUCCESS':
            return Object.assign({}, state, { pastCount: action.payload });
        case 'GET_DISPUTE_BY_ID_SUCCESS':
            return Object.assign({}, state, { disputeById: action.payload });
        case 'CHECK_BOOKINGS_SUCCESS':
            return Object.assign({}, state, { anyBookings: action.payload });

        case 'GET_INVOICE_LIST_SUCCESS':
            return Object.assign({}, state, { invoiceList: action.payload });
            case 'GET_INVOICE_COUNT_SUCCESS':
            return Object.assign({}, state, { invoiceCount: action.payload });

        default:
            return state;
    }
};
