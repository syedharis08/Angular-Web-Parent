import { Action } from '@ngrx/store';

export const actionTypes = {
    GET_PARENT_PROFILE: 'GET_PARENT_PROFILE',
    GET_PARENT_PROFILE_SUCCESS: 'GET_PARENT_PROFILE_SUCCESS',
    GO_TO_BROWSE_TUTOR: 'GO_TO_BROWSE_TUTOR',
    UPDATE_PARENT_PROFILE: 'UPDATE_PARENT_PROFILE',
    UPDATE_PARENT_PROFILE_SUCCESS: 'UPDATE_PARENT_PROFILE_SUCCESS',
    // VERIFY_NUMBER:'VERIFY_NUMBER',
    AUTH_OTP: 'AUTH_OTP',
    AUTH_OTP_SUCCESS: 'AUTH_OTP_SUCCESS',
    AUTH_RESEND_OTP: 'AUTH_RESEND_OTP',
    AUTH_RESEND_OTP_SUCCESS: 'AUTH_RESEND_OTP_SUCCESS',
    UPDATE_PASSWORD: 'UPDATE_PASSWORD',
    ADD_ADDRESS: 'ADD_ADDRESS',
    ADDRESS_ADD_SUCCESS: 'ADDRESS_ADD_SUCCESS',
    UPDATE_PASSWORD_SUCCESS: 'UPDATE_PASSWORD_SUCCESS',
    ADD_CHILD: 'ADD_CHILD',
    DELETE_CHILD: 'DELETE_CHILD',
    ADD_CHILD_SUCCESS: 'ADD_CHILD_SUCCESS',
    DELETE_ADDRESS: 'DELETE_ADDRESS',
    EDIT_CHILD: 'EDIT_CHILD',
    EDIT_CHILD_SUCCESS: 'EDIT_CHILD_SUCCESS',
    EDIT_ADDRESS: 'EDIT_ADDRESS',
    EDIT_ADDRESS_SUCCESS: 'EDIT_ADDRESS_SUCCESS',
    FAQ: 'FAQ',
    FAQ_SUCCESS: 'FAQ_SUCCESS',
    GET_REFERRAL_AMOUNT: 'GET_REFERRAL_AMOUNT',
    GET_REFERRAL_AMOUNT_SUCCESS: 'GET_REFERRAL_AMOUNT_SUCCESS',
    CLEAN_FIELD: 'CLEAN_FIELD'

};

type credentials = {};
export class CleanField implements Action {
    type = actionTypes.CLEAN_FIELD;
    constructor(public payload: credentials) { }
};
export class ReferralAmount implements Action {
    type = actionTypes.GET_REFERRAL_AMOUNT;
    constructor(public payload: credentials) { }
};
export class BrowseRoute implements Action {
    type = actionTypes.GO_TO_BROWSE_TUTOR;
    constructor(public payload: credentials) { }
};
export class ReferralAmountSuccess implements Action {
    type = actionTypes.GET_REFERRAL_AMOUNT_SUCCESS;
    constructor(public payload: credentials) { }
};

export class Faq implements Action {
    type = actionTypes.FAQ;
    constructor(public payload: credentials) { }
};
export class FaqSuccess implements Action {
    type = actionTypes.FAQ_SUCCESS;
    constructor(public payload: credentials) { }
};
export class EditAddress implements Action {
    type = actionTypes.EDIT_ADDRESS;
    constructor(public payload: credentials) { }
};
export class EditAddressSuccess implements Action {
    type = actionTypes.EDIT_ADDRESS_SUCCESS;
    constructor(public payload: credentials) { }
};
export class GetParentProfile implements Action {
    type = actionTypes.GET_PARENT_PROFILE;
    constructor(public payload: credentials) { }
};
export class GetParentProfileSuccess implements Action {
    type = actionTypes.GET_PARENT_PROFILE_SUCCESS;
    constructor(public payload: credentials) { }
};
export class UpdateParentProfile implements Action {
    type = actionTypes.UPDATE_PARENT_PROFILE;
    constructor(public payload: credentials) { }
};
export class UpdateParentProfileSuccess implements Action {
    type = actionTypes.UPDATE_PARENT_PROFILE_SUCCESS;
    constructor(public payload: credentials) { }
};
export class AddChild implements Action {
    type = actionTypes.ADD_CHILD;
    constructor(public payload: credentials) { }
};
export class ResenOtp implements Action {
    type = actionTypes.AUTH_RESEND_OTP;
    constructor(public payload: credentials) { }
};
export class ResenOtpSuccess implements Action {
    type = actionTypes.AUTH_RESEND_OTP_SUCCESS;
    constructor(public payload: credentials) { }
};
export class UpdatePassword implements Action {
    type = actionTypes.UPDATE_PASSWORD;
    constructor(public payload: credentials) { }
};
export class AddAddress implements Action {
    type = actionTypes.ADD_ADDRESS;
    constructor(public payload: credentials) { }
};
export class DeleteChild implements Action {
    type = actionTypes.DELETE_CHILD;
    constructor(public payload: credentials) { }
};
export class AddAddressSuccess implements Action {
    type = actionTypes.ADDRESS_ADD_SUCCESS;
    constructor(public payload: credentials) { }
};
export class AddChildSuccess implements Action {
    type = actionTypes.ADD_CHILD_SUCCESS;
    constructor(public payload: credentials) { }
};
export class DeleteAddress implements Action {
    type = actionTypes.DELETE_ADDRESS;
    constructor(public payload: credentials) { }
};
export class EditChild implements Action {
    type = actionTypes.EDIT_CHILD;
    constructor(public payload: credentials) { }
};
export class EditChildSuccess implements Action {
    type = actionTypes.EDIT_CHILD_SUCCESS;
    constructor(public payload: credentials) { }
};


export type Actions
    = GetParentProfile
    | GetParentProfileSuccess
    | UpdateParentProfile
    | UpdateParentProfileSuccess
    | Faq
    | FaqSuccess
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

