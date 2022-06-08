import { Action } from '@ngrx/store';

export const actionTypes = {

    GET_ALL_DISPUTES: 'GET_ALL_DISPUTES',
    GET_ALL_DISPUTES_SUCCESS: 'GET_ALL_DISPUTES_SUCCESS',
    GET_ALL_DISPUTES_COUNT: 'GET_ALL_DISPUTES_COUNT',
    GET_ALL_DISPUTES_COUNT_SUCCESS: 'GET_ALL_DISPUTES_COUNT_SUCCESS',
    GET_DISPUTE_BY_ID:'GET_DISPUTE_BY_ID',
    GET_DISPUTE_BY_ID_SUCCESS:'GET_DISPUTE_BY_ID_SUCCESS',
};

type credentials = {};
export class GetDisputesbyId implements Action {
    type = actionTypes.GET_DISPUTE_BY_ID;
    constructor(public payload: credentials) { }
};

export class GetDisputesbyIdSuccess implements Action {
    type = actionTypes.GET_DISPUTE_BY_ID_SUCCESS;
    constructor(public payload: credentials) { }
};
export class GetAllDisputes implements Action {
    type = actionTypes.GET_ALL_DISPUTES;
    constructor(public payload: credentials) { }
};

export class GetAllDisputesSuccess implements Action {
    type = actionTypes.GET_ALL_DISPUTES_SUCCESS;
    constructor(public payload: credentials) { }
};
export class GetAllDisputesCount implements Action {
    type = actionTypes.GET_ALL_DISPUTES_COUNT;
    constructor(public payload: credentials) { }
};

export class GetAllDisputesCountSuccess implements Action {
    type = actionTypes.GET_ALL_DISPUTES_COUNT_SUCCESS;
    constructor(public payload: credentials) { }
};


export type Actions
    = GetAllDisputes
    | GetAllDisputesSuccess
    | GetAllDisputesCount
    | GetAllDisputesCountSuccess
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

