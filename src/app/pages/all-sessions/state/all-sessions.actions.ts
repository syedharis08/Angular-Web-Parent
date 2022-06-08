import { Action } from '@ngrx/store';

export const actionTypes = {

    GET_ALL_UPCOMING_SESSIONS: 'GET_ALL_UPCOMING_SESSIONS',
    GET_ALL_DISPUTE_REASONS: 'GET_ALL_DISPUTE_REASONS',
    GET_INVOICE_LIST: 'GET_INVOICE_LIST',
    GET_INVOICE_COUNT: 'GET_INVOICE_COUNT',
    GET_ALL_UPCOMING_SESSIONS_SUCCESS: 'GET_ALL_UPCOMING_SESSIONS_SUCCESS',
    GET_ALL_PAST_SESSIONS: 'GET_ALL_PAST_SESSIONS',
    GET_ALL_PAST_SESSIONS_SUCCESS: 'GET_ALL_PAST_SESSIONS_SUCCESS',
    GET_BOOKING_BY_ID: 'GET_BOOKING_BY_ID',
    GET_BOOKING_BY_ID_SUCCESS: 'GET_BOOKING_BY_ID_SUCCESS',
    GET_CANCELLATION_POLICIES: 'GET_CANCELLATION_POLICIES',
    GET_CANCELLATION_POLICIES_SUCCESS: 'GET_CANCELLATION_POLICIES_SUCCESS',
    CANCEL_BOOKING_BY_ID: 'CANCEL_BOOKING_BY_ID',
    CANCEL_TUTOR_BOOKING: 'CANCEL_TUTOR_BOOKING',
    ACCEPT_TUTOR_BOOKING: 'ACCEPT_TUTOR_BOOKING',
    CANCEL_TUTOR_BOOKING_SUCCESS: 'CANCEL_TUTOR_BOOKING_SUCCESS',
    ACCEPT_TUTOR_BOOKING_SUCCESS: 'CANCEL_TUTOR_BOOKING_SUCCESS',
    CANCEL_BOOKING_BY_ID_SUCCESS: 'CANCEL_BOOKING_BY_ID_SUCCESS',
    GET_ALL_UPCOMING_SESSIONS_COUNT: 'GET_ALL_UPCOMING_SESSIONS_COUNT',
    GET_ALL_UPCOMING_SESSIONS_COUNT_SUCCESS: 'GET_ALL_UPCOMING_SESSIONS_COUNT_SUCCESS',
    GET_ALL_PAST_SESSIONS_COUNT: 'GET_ALL_PAST_SESSIONS_COUNT',
    GET_ALL_PAST_SESSIONS_COUNT_SUCCESS: 'GET_ALL_PAST_SESSIONS_COUNT_SUCCESS',
    RATE_TUTOR: 'RATE_TUTOR',
    ONLY_RATE_TUTOR: 'ONLY_RATE_TUTOR',
    APPROVE_BOOKING: 'APPROVE_BOOKING',
    CHECK_TUTOR_LIVE: 'CHECK_TUTOR_LIVE',
    CHECK_TUTOR_LIVE_SUCCESS: 'CHECK_TUTOR_LIVE_SUCCESS',
    BOOK_AGAIN: 'BOOK_AGAIN',
    BOOK_AGAIN_SUCCESS: 'BOOK_AGAIN_SUCCESS',
    CHECK_BOOKINGS: 'CHECK_BOOKINGS',
    CHECK_BOOKINGS_SUCCESS: 'CHECK_BOOKINGS_SUCCESS',
    GET_DISPUTE_BY_ID: 'GET_DISPUTE_BY_ID',
    GET_DISPUTE_BY_ID_SUCCESS: 'GET_DISPUTE_BY_ID_SUCCESS',
    GET_INVOICE_COUNT_SUCCESS:'GET_INVOICE_COUNT_SUCCESS',
    GET_INVOICE_LIST_SUCCESS:'GET_INVOICE_LIST_SUCCESS',

};

type credentials = {};
export class CheckBooking implements Action {
    type = actionTypes.CHECK_BOOKINGS;
    constructor(public payload: credentials) { }
};
export class GetDisputesbyId implements Action {
    type = actionTypes.GET_DISPUTE_BY_ID;
    constructor(public payload: credentials) { }
};

export class GetDisputesbyIdSuccess implements Action {
    type = actionTypes.GET_DISPUTE_BY_ID_SUCCESS;
    constructor(public payload: credentials) { }
};
export class OnlyRateTutor implements Action {
    type = actionTypes.ONLY_RATE_TUTOR;
    constructor(public payload: credentials) { }
};
export class DisputeReasons implements Action {
    type = actionTypes.GET_ALL_DISPUTE_REASONS;
    constructor(public payload: credentials) { }
};
export class CheckBookingSuccess implements Action {
    type = actionTypes.CHECK_BOOKINGS_SUCCESS;
    constructor(public payload: credentials) { }
};
export class TutorLive implements Action {
    type = actionTypes.CHECK_TUTOR_LIVE;
    constructor(public payload: credentials) { }
};
export class TutorLiveSuccess implements Action {
    type = actionTypes.CHECK_TUTOR_LIVE_SUCCESS;
    constructor(public payload: credentials) { }
};
export class BookAgain implements Action {
    type = actionTypes.BOOK_AGAIN;
    constructor(public payload: credentials) { }
};
export class BookAgainSuccess implements Action {
    type = actionTypes.BOOK_AGAIN_SUCCESS;
    constructor(public payload: credentials) { }
};
export class GetAllUpcomingSessions implements Action {
    type = actionTypes.GET_ALL_UPCOMING_SESSIONS;
    constructor(public payload: credentials) { }
};
export class GetAllUpcomingSessionsSuccess implements Action {
    type = actionTypes.GET_ALL_UPCOMING_SESSIONS_SUCCESS;
    constructor(public payload: credentials) { }
};
export class GetInvoiceListSuccess implements Action {
    type = actionTypes.GET_INVOICE_LIST_SUCCESS;
    constructor(public payload: credentials) { }
};
export class GetInvoiceCountSuccess implements Action {
    type = actionTypes.GET_INVOICE_COUNT_SUCCESS;
    constructor(public payload: credentials) { }
};
export class GetAllPastSessions implements Action {
    type = actionTypes.GET_ALL_UPCOMING_SESSIONS;
    constructor(public payload: credentials) { }
};
export class RateTutor implements Action {
    type = actionTypes.RATE_TUTOR;
    constructor(public payload: credentials) { }
};
export class ApproveBooking implements Action {
    type = actionTypes.APPROVE_BOOKING;
    constructor(public payload: credentials) { }
};
// export class GetAllPastSessionsSuccess implements Action {
//     type = actionTypes.GET_ALL_UPCOMING_SESSIONS_SUCCESS;
//     constructor(public payload: credentials) { }
// };
export class GetBookingById implements Action {
    type = actionTypes.GET_BOOKING_BY_ID;
    constructor(public payload: credentials) { }
};
export class GetBookingByIdSuccess implements Action {
    type = actionTypes.GET_BOOKING_BY_ID_SUCCESS;
    constructor(public payload: credentials) { }
};
export class GetCancellationPolicy implements Action {
    type = actionTypes.GET_CANCELLATION_POLICIES;
    constructor(public payload: credentials) { }
};
export class GetCancellationPolicySuccess implements Action {
    type = actionTypes.GET_CANCELLATION_POLICIES_SUCCESS;
    constructor(public payload: credentials) { }
};
export class CancelBookingById implements Action {
    type = actionTypes.CANCEL_BOOKING_BY_ID;
    constructor(public payload: credentials) { }
};
export class CancelTutorBooking implements Action {
    type = actionTypes.CANCEL_TUTOR_BOOKING;
    constructor(public payload: credentials) { }
};
export class CancelTutorBookingSuccess implements Action {
    type = actionTypes.CANCEL_TUTOR_BOOKING_SUCCESS;
    constructor(public payload: credentials) { }
};
export class AcceptTutorBooking implements Action {
    type = actionTypes.ACCEPT_TUTOR_BOOKING;
    constructor(public payload: credentials) { }
};
export class AcceptTutorBookingSuccess implements Action {
    type = actionTypes.ACCEPT_TUTOR_BOOKING_SUCCESS;
    constructor(public payload: credentials) { }
};
export class CancelBookingByIdSucess implements Action {
    type = actionTypes.CANCEL_BOOKING_BY_ID_SUCCESS;
    constructor(public payload: credentials) { }
};
export class GetFeedbackCount implements Action {
    type = actionTypes.GET_ALL_UPCOMING_SESSIONS_COUNT;
    constructor(public payload: credentials) { }
};
export class GetFeedbackCountSuccess implements Action {
    type = actionTypes.GET_ALL_UPCOMING_SESSIONS_COUNT_SUCCESS;
    constructor(public payload: credentials) { }
};
export class GetPastSessionCount implements Action {
    type = actionTypes.GET_ALL_PAST_SESSIONS_COUNT;
    constructor(public payload: credentials) { }
};
export class GetPastSessionCountSuccess implements Action {
    type = actionTypes.GET_ALL_PAST_SESSIONS_COUNT_SUCCESS;
    constructor(public payload: credentials) { }
};

export type Actions
    = ''

    ;

