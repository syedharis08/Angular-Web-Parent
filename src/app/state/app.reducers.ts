import { sortBy } from 'lodash';
import { Action, ActionReducer } from '@ngrx/store';

const initialState: any = {
    activeDomain: null,
    development: false,
    bookingType: null,
    userType: null,
    domains: [],
    settings: {},
    contentDashboard: [],
    systemDashboard: [],
    blocked: false
};

export const app: ActionReducer<any> = (state = initialState, action: Action) => {
    switch (action.type) {

        case 'APP_DEVELOPMENT_ENABLE':
            return Object.assign({}, state, { development: true });

        case 'APP_SETTING_ADD':
            const settings = state.settings;
            settings[action.payload.key] = action.payload.value;
            return Object.assign({}, state, { settings });

        case 'APP_CONTENT_DASHBOARD':
            return Object.assign({}, state, {
                contentDashboard: sortBy([...state.contentDashboard, action.payload], ['weight'])
            });

        case 'APP_SYSTEM_DASHBOARD':
            return Object.assign({}, state, {
                systemDashboard: sortBy([...state.systemDashboard, action.payload], ['weight'])
            });

        case 'APP_AUTHENTICATION_FAIL':
            return Object.assign({}, initialState);

        case 'APP_SIDE_BAR':
            return Object.assign({}, state, { isMenu: action.payload });

        case 'APP_ACTIVE_MENU_ITEM':
            return Object.assign({}, state, { activeMenuItem: action.payload });

        default:
            return state;
    }
};
