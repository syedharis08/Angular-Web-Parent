import { Action } from '@ngrx/store';

export const actionTypes = {
   STEPONE_DATA:'STEPONE_DATA',
   STEPONE_DATA_SUCCESS:'STEPONE_DATA_SUCCESS',
   SELECT_TUTOR:'SELECT_TUTOR',
   SELECT_TUTOR_SUCCESS:'SELECT_TUTOR_SUCCESS',
   GET_TUTOR_DETAILS:'GET_TUTOR_DETAILS',
   GET_TUTOR_DETAILS_SUCCESS:'GET_TUTOR_DETAILS_SUCCESS',
   GET_TUTOR_COUNT:'GET_TUTOR_COUNT',
   GET_TUTOR_COUNT_SUCCESS:'GET_TUTOR_COUNT_SUCCESS',
   GOTO_BOOK_SESSION_STEP2:'GOTO_BOOK_SESSION_STEP2',
   GOTO_BOOK_SESSION_STEP2_SUCCESS:'GOTO_BOOK_SESSION_STEP2_SUCCESS',
   GOTO_BOOK_SESSION_STEP3:'GOTO_BOOK_SESSION_STEP3',
   GOTO_BOOK_SESSION_STEP3_SUCCESS:'GOTO_BOOK_SESSION_STEP3_SUCCESS',
   GO_TO_PAYMENTS:'GO_TO_PAYMENTS',
   GO_TO_PAYMENTS_SUCCESS:'GO_TO_PAYMENTS_SUCCESS',
   COMPLETE_BOOKING:'COMPLETE_BOOKING',
   COMPLETE_BOOKING_SUCCESS:'COMPLETE_BOOKING_SUCCESS',
   SELECT_GET_TUTOR_RATINGS:'SELECT_GET_TUTOR_RATINGS',
   SELECT_GET_TUTOR_RATING_SUCCESS:'SELECT_GET_TUTOR_RATING_SUCCESS',
   SELECT_GET_TUTOR_RATING_COUNT:'SELECT_GET_TUTOR_RATING_COUNT',
   SELECT_GET_TUTOR_RATING_SUCCESS_COUNT:'SELECT_GET_TUTOR_RATING_SUCCESS_COUNT',
   GOTO_BOOK_SESSION_STEP2_FALSE:'GOTO_BOOK_SESSION_STEP2_FALSE',
   CHECK_TUTOR_AVAILABILITY: 'CHECK_TUTOR_AVAILABILITY',
   CHECK_TUTOR_AVAILABILITY_SUCCESS: 'CHECK_TUTOR_AVAILABILITY_SUCCESS',

    // APP_SET_SERVICE_RADIUS: 'APP_SET_SERVICE_RADIUS',

};

type credentials = {};
export class TutorRating implements Action {
    type = actionTypes.SELECT_GET_TUTOR_RATINGS;
    constructor(public payload: credentials) { }
};
export class TutorRatingCountSucc implements Action {
    type = actionTypes.SELECT_GET_TUTOR_RATING_SUCCESS_COUNT;
    constructor(public payload: credentials) { }
};
export class RatingCount implements Action {
    type = actionTypes.SELECT_GET_TUTOR_RATING_COUNT;
    constructor(public payload: credentials) { }
};
export class TutorRatingSuccess implements Action {
    type = actionTypes.SELECT_GET_TUTOR_RATING_SUCCESS;
    constructor(public payload: credentials) { }
};
export class GetDuration implements Action {
    type = actionTypes.STEPONE_DATA;
    constructor(public payload: credentials) { }
};
export class GetDurationSuccess implements Action {
    type = actionTypes.STEPONE_DATA_SUCCESS;
    constructor(public payload: credentials) { }
};
export class BrowseTutor implements Action {
    type = actionTypes.SELECT_TUTOR;
    constructor(public payload: any = {}) { }
}
export class BrowseTutorSuccess implements Action {
    type = actionTypes.SELECT_TUTOR_SUCCESS;
    constructor(public payload: any = {}) { }
}
export class GetTutorDetails implements Action {
    type = actionTypes.GET_TUTOR_DETAILS;
    constructor(public payload: any = {}) { }
}
export class GetTutorDetailsSuccess implements Action {
    type = actionTypes.GET_TUTOR_DETAILS_SUCCESS;
    constructor(public payload: any = {}) { }
}
export class GetCount implements Action {
    type = actionTypes.GET_TUTOR_COUNT;
    constructor(public payload: any = {}) { }
}
export class Step2False implements Action {
    type = actionTypes.GOTO_BOOK_SESSION_STEP2_FALSE;
    constructor(public payload: any = {}) { }
}

export class GetCountSuccess implements Action {
    type = actionTypes.GET_TUTOR_COUNT_SUCCESS;
    constructor(public payload: any = {}) { }
}
export class GoToStep2 implements Action {
    type = actionTypes.GOTO_BOOK_SESSION_STEP2;
    constructor(public payload: any = {}) { }
}
export class GoToStep2Success implements Action {
    type = actionTypes.GOTO_BOOK_SESSION_STEP2_SUCCESS;
    constructor(public payload: any = {}) { }
}
export class GoToStep3 implements Action {
    type = actionTypes.GOTO_BOOK_SESSION_STEP3;
    constructor(public payload: any = {}) { }
}
export class GoToStep3Success implements Action {
    type = actionTypes.GOTO_BOOK_SESSION_STEP3_SUCCESS;
    constructor(public payload: any = {}) { }
    
}
export class GoToPayments implements Action {
    type = actionTypes.GO_TO_PAYMENTS;
    constructor(public payload: any = {}) { }
    
}
export class GoToPaymentsSuccess implements Action {
    type = actionTypes.GO_TO_PAYMENTS_SUCCESS;
    constructor(public payload: any = {}) { }
    
}
export class CreateBooking implements Action {
    type = actionTypes.COMPLETE_BOOKING;
    constructor(public payload: any = {}) { }
    
}
export class CreateBookingSuccess implements Action {
    type = actionTypes.COMPLETE_BOOKING_SUCCESS;
    constructor(public payload: any = {}) { }
    
}

export class CheckTutorAvailability implements Action {
    type = actionTypes.CHECK_TUTOR_AVAILABILITY;
    constructor(public payload: any = {}) { }
    
}
export class CheckTutorAvailabilitySuccess implements Action {
    type = actionTypes.CHECK_TUTOR_AVAILABILITY_SUCCESS;
    constructor(public payload: any = {}) { }
    
}
export type Actions 
= CheckTutorAvailability | CheckTutorAvailabilitySuccess
// | AppSetServiceRadii
// | AppSetServiceRadiiSuccess
// | AppGetQualification
// | AppGetQualificationSuccess
// | AppSetQualification
// | AppSetQualificationSuccess
// | AppDeleteQualification
// | AppDeleteQualificationSuccess
// | AppGetExpertise
// | AppGetExpertiseSuccess
// | AppSetExpertise
// | AppSetExpertiseSuccess
// | AppUpdateExpertise
// | AppUpdateExpertiseSuccess
// | AppGetEquipments
// | AppGetEquipmentsSuccess
// | AppUpdateEquipments
// | AppUpdateEquipmentsSuccess
// | AppSettingsError
// | AppAddMachine
// | AppAddMachineSuccess
// | AppUploadFile
// | AppUploadFileSuccess
;

