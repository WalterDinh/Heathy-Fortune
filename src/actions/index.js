// export action creators
import * as types from "./types";

import * as userActions from "./userActions";
import * as registerActions from "./registerActions";
import * as loginActions from "./loginActions";
import * as checkPhoneAction from "./forgotPassAction/checkPhoneAction";
import * as resetPassAction from "./forgotPassAction/resetPassAction";
import * as alertActions from "./alertActions";
import * as eventActions from "./eventActions";
import * as chatHistoriesAction from "./chat/chatHistoriesAction";
import * as chatActions from "./chat/chatActions";
import * as sampleChatActions from "./chat/sampleChatActions";
import * as callActions from "./callActions";
import * as doctorActions from "./doctorActions";
import * as localNotificationActions from "./localNotificationActions";
import * as langAction from "./langAction";
import * as settingActions from "./settingActions";
import * as meetingAgendaActions from "./meetingAgendaActions";
import * as newsActions from "./newsActions";

export {
    userActions,
    registerActions,
    types,
    loginActions,
    checkPhoneAction,
    doctorActions,
    resetPassAction,
    alertActions,
    eventActions,
    chatHistoriesAction,
    callActions,
    localNotificationActions,
    langAction,
    settingActions,
    meetingAgendaActions,
    newsActions,
    chatActions,
    sampleChatActions
};
