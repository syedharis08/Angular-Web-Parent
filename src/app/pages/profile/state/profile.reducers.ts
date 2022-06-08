import { Action, ActionReducer } from '@ngrx/store';

const initialState: any = {
    profileData: null,
    userData: null,
    passChanged: false,
    clearFields: false,
    faq: null

};

export const profile: ActionReducer<any> = (state = initialState, action: Action) => {
    switch (action.type) {

        // case 'APP_GET_SERVICE_RADIUS':
        //     return Object.assign({}, state, initialState, {
        //         uploadFileSuccess: null,
        //         setServiceRadiiProcess: null,
        //         setQualificationProcess: null,
        //         setExpertiseProcess: null,
        //         addMachineProcess: null,
        //         deleteQualificationProcess: null,
        //         updateExpertiseProcess: null,
        //         updateEquipmentProcess: null
        //     });
        case 'GET_REFERRAL_AMOUNT_SUCCESS':
            localStorage.setItem('refferAmount', JSON.stringify(action.payload));
            return Object.assign({}, state, { refferal: action.payload });
        case 'GET_PARENT_PROFILE':
            return Object.assign({}, {});
        case 'FAQ_SUCCESS':
            return Object.assign({}, state, { faq: action.payload });
        case 'GET_PARENT_PROFILE_SUCCESS':
            return Object.assign({}, state, { userData: action.payload });
        case 'GET_PARENT_PROFILE_TOP_SUCCESS':
            return Object.assign({}, state, { userData: action.payload });

        case 'UPDATE_PASSWORD_SUCCESS':
            return Object.assign({}, state, { passChanged: true });
        case 'AUTH_OTP_SUCCESS':
            return Object.assign({}, state, { clearFields: true });
        case 'ADD_CHILD_SUCCESS':
            return Object.assign({}, state, { childAdded: true });
            case 'CLEAN_FIELD':
            return Object.assign({}, state, { clearFields: true });


        // case 'APP_GET_EXPERTISE':
        //     return Object.assign({}, state);

        // case 'APP_GET_SERVICE_RADIUS_SUCCESS':
        //     return Object.assign({}, state, { settings: action.payload });

        // case 'APP_GET_QUALIFICATION_SUCCESS':
        //     return Object.assign({}, state, action.payload);

        // case 'APP_GET_EXPERTISE_SUCCESS':
        //     return Object.assign({}, state, action.payload);

        // case 'APP_GET_EQUIPMENTS_SUCCESS':
        //     return Object.assign({}, state, action.payload);

        // case 'APP_SET_SERVICE_RADIUS':
        //     return Object.assign({}, state, { setServiceRadiiProcess: true });

        // case 'APP_SET_SERVICE_RADIUS_SUCCESS':
        //     return Object.assign({}, state, { setServiceRadiiSuccess: true });

        // case 'APP_SET_QUALIFICATION':
        //     return Object.assign({}, state, { setQualificationProcess: true, setQualificationSuccess: null });

        // case 'APP_SET_EXPERTISE':
        //     return Object.assign({}, state, { setExpertiseProcess: true, setExpertiseSuccess: null });

        // case 'APP_ADD_MACHINE':
        //     return Object.assign({}, state, { addMachineProcess: true });

        // case 'APP_ADD_MACHINE_SUCCESS':
        //     return Object.assign({}, state, { addMachineSuccess: true });

        // case 'APP_DELETE_QUALIFICATION':
        //     return Object.assign({}, state, { deleteQualificationProcess: true, deleteQualificationSuccess: null });

        // case 'APP_UPDATE_EXPERTISE':
        //     return Object.assign({}, state, { updateExpertiseProcess: true, updateExpertiseSuccess: null });

        // case 'APP_UPDATE_EQUIPMENTS':
        //     return Object.assign({}, state, { updateEquipmentProcess: true });

        // case 'APP_UPDATE_EQUIPMENTS_SUCCESS':
        //     return Object.assign({}, state, { updateEquipmentSuccess: true, updateRequest: action.payload });

        // case 'APP_DELETE_QUALIFICATION_SUCCESS':
        //     return Object.assign({}, state, { deleteQualificationProcess: null, deleteQualificationSuccess: true, deleteIndex: action.payload.index });

        // case 'APP_UPDATE_EXPERTISE_SUCCESS':
        //     return Object.assign({}, state, { updateExpertiseProcess: null, updateExpertiseSuccess: true, updateRequest: action.payload });

        // case 'APP_SET_QUALIFICATION_SUCCESS':
        //     return Object.assign({}, state, { setQualificationProcess: null, setQualificationSuccess: true });

        // case 'APP_SET_EXPERTISE_SUCCESS':
        //     return Object.assign({}, state, { setExpertiseProcess: null, setExpertiseSuccess: true });

        // case 'UPLOAD_FILE':
        //     return Object.assign({}, state, { uploadFileProcess: true, uploadFileSuccess: null, fileUpload: null });

        // case 'UPLOAD_FILE_SUCCESS':
        //     return Object.assign({}, state, action.payload, { uploadFileSuccess: true, uploadFileProcess: null });

        // case 'SETTINGS_ERROR':
        //     return Object.assign({}, state, { error: action.payload });

        default:
            return state;
    }
};
