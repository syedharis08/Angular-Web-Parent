import { Action } from '@ngrx/store';

export const actionTypes = {
   
    GET_ALL_REPORTS: 'GET_ALL_REPORTS',
    GET_ALL_REPORTS_SUCCESS: 'GET_ALL_REPORTS_SUCCESS',
    GET_ALL_REPORTS_COUNT: 'GET_ALL_REPORTS_COUNT',
    GET_ALL_REPORTS_COUNT_SUCCESS: 'GET_ALL_REPORTS_COUNT_SUCCESS',

};

type credentials = {};

export class GetAllReports implements Action {
    type = actionTypes.GET_ALL_REPORTS;
    constructor(public payload: credentials) { }
};

export class GetAllReportsSuccess implements Action {
    type = actionTypes.GET_ALL_REPORTS_SUCCESS;
    constructor(public payload: credentials) { }
};
export class GetAllReportsCount implements Action {
    type = actionTypes.GET_ALL_REPORTS_COUNT;
    constructor(public payload: credentials) { }
};

export class GetAllReportsCountSuccess implements Action {
    type = actionTypes.GET_ALL_REPORTS_COUNT_SUCCESS;
    constructor(public payload: credentials) { }
};  


export type Actions 
= GetAllReports
|GetAllReportsSuccess
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

