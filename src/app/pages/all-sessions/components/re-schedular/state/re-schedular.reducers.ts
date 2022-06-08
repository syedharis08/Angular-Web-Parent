import { Action, ActionReducer } from '@ngrx/store';

const initialState: any = {
    mySchedule: null,
    setAvailabilySuccess: null
};

export const reschedular: ActionReducer<any> = (state = initialState, action: Action) => {
    switch (action.type) {

        // case 'SET_AVAILABILTY':
        //     return Object.assign({}, state);

        case 'RESCHEDULE_BOOKING_SUCCESS':
            return Object.assign({}, state, { rescheduled: action.payload });
            case 'GOTO_RESCHEDULE_SUCCESS':
            return Object.assign({}, state, { rescheduledStepData: action.payload });
            case 'RESCHEDULE_BOOKING_DATA_SUCCESS':
            return Object.assign({}, state, { rescheduleData: action.payload });
        default:
            return state;
    }
};
