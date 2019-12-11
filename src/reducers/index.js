import * as loadingReducer from "./loadingReducer";
import * as userReducer from "./userReducer";
import * as registerReducer from "./registerReducer";
import * as eventReducer from "./eventReducer";
import * as chatHistoriesReducer from "./chatReducer/chatHistoriesReducer";
import * as alertReducer from "./alertReducer";
import * as callReducer from "./callReducer";
import * as localNotificationReducer from "./localNotificationReducer";
import * as languageReducer from "./languageReducer";
import * as settingReducer from "./settingReducer";
import * as navigateReducer from "./navigateReducer";
import * as doctorReducer from "./doctorReducer";
import * as meetingAgendaReducer from "./meetingAgendaReducer";
import * as newsReducer from "./newsReducer";
import * as chatReducer from "./chatReducer/chatReducer";
import * as chatSampleReducer from "./chatReducer/chatSampleReducer";

export default Object.assign(
    loadingReducer,
    userReducer,
    registerReducer,
    alertReducer,
    chatHistoriesReducer,
    callReducer,
    localNotificationReducer,
    languageReducer,
    settingReducer,
    navigateReducer,
    eventReducer,
    doctorReducer,
    meetingAgendaReducer,
    newsReducer,
    chatReducer,
    chatSampleReducer
);
