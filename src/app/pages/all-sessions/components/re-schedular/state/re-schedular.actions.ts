import { Action } from '@ngrx/store';

export const actionTypes = {
    // SET_AVAILABILTY: 'SET_AVAILABILTY',
    // SET_AVAILABILTY_SUCCESS: 'SET_AVAILABILTY_SUCCESS',
    RESCHEDULE_BOOKING:'RESCHEDULE_BOOKING',
    RESCHEDULE_BOOKING_SUCCESS:'RESCHEDULE_BOOKING_SUCCESS',
    GOTO_RESCHEDULE:'GOTO_RESCHEDULE',
    GOTO_RESCHEDULE_SUCCESS:'GOTO_RESCHEDULE_SUCCESS',
    RESCHEDULE_BOOKING_DATA:'RESCHEDULE_BOOKING_DATA',
    RESCHEDULE_BOOKING_DATA_SUCCESS:'RESCHEDULE_BOOKING_DATA_SUCCESS'
    
};

type credentials = {};

// export class AppSetAvailabilty implements Action {
//     type = actionTypes.SET_AVAILABILTY;
//     constructor(public payload: credentials) { }
// };
// export class AppSetAvailabiltySuccess implements Action {
//     type = actionTypes.SET_AVAILABILTY_SUCCESS;
//     constructor(public payload: credentials) { }
// };
export class RescheduleData implements Action {
    type = actionTypes.RESCHEDULE_BOOKING_DATA;
    constructor(public payload: credentials) { }
};
export class RescheduleDataSuccess implements Action {
    type = actionTypes.RESCHEDULE_BOOKING_DATA_SUCCESS;
    constructor(public payload: credentials) { }
};
export class Reschedule implements Action {
    type = actionTypes.RESCHEDULE_BOOKING;
    constructor(public payload: credentials) { }
};
export class RescheduleSuccess implements Action {
    type = actionTypes.RESCHEDULE_BOOKING_SUCCESS;
    constructor(public payload: credentials) { }
};
export class GotoReschedule implements Action {
    type = actionTypes.GOTO_RESCHEDULE;
    constructor(public payload: credentials) { }
};
export class GotoRescheduleSuccess implements Action {
    type = actionTypes.GOTO_RESCHEDULE_SUCCESS;
    constructor(public payload: credentials) { }
};


export type Actions
= Reschedule
|RescheduleSuccess;
