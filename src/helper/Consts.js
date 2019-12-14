import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Dimensions, Platform, StatusBar } from "react-native";
import { getStatusBarHeight, isIphoneX } from "react-native-iphone-x-helper";

export const HOST = "http://45.117.170.39/econsult/api/";

export const VERSION = "1.3.6";

//TODO: NEW

export const NEWPASSWORD = "updatePassword/";
export const TAG_URL = "tagUser/";
export const LOGIN_URL = "login/";
export const USER_URL = "user/";
export const TRANSACTION_URL = "transaction/";
export const EVENT = "event/";
export const CALENDAR_EVENT = "calendar_event/";

export const PRICE_PER_MINUTE = 1000;

export const CHECK_PHONE_API = "checkPhoneNumber/";
export const REQUEST_CODE_API = "resetPasswordViaEmail/";
export const CONFIRM_CODE_API = "verifyCode/";
export const RESET_PASS_API = "updatePassword/";
export const REGISTER = `user/`;
export const GET_CONTACT_API = `contact/`;
export const GET_MAP_TEACHER_API = `user/`;
// chat
export const CHAT_HISTORIES = `chatRoomUser/`;
export const CHAT_ROOM = `chatRoom/`;
export const CHAT_HISTORIES_SEARCH = `chatRoomUserSearch/`;

// end chat
export const TRANSACTION = `transaction/`;
// export const HOST = 'http://api.regallogistics.com/TMSStaging_new';
export const URL = `${HOST}/TMS_WebServices.asmx`;

export const LANGUAGE_ENGLISH = "en";
export const LANGUAGE_VIETNAM = "vi";

export const DEVICE = {
    DEVICE_WIDTH: Dimensions.get("window").width,
    DEVICE_HEIGHT: Dimensions.get("window").height
};
// Consts
export const FONT_SIZE = {
    CONTENT_SIZE: responsiveFontSize(1.4),
    INFO_SIZE: responsiveFontSize(1.2),
    HEADER: responsiveFontSize(2.3),
    TITLE: responsiveFontSize(2.5),
    ICON: Platform.OS == "ios" ? responsiveFontSize(5) : responsiveFontSize(5),
    INPUT: responsiveFontSize(2.0),
    BUTTON: responsiveFontSize(2.0)
};

export const STRING = {
    userName: "User name",
    password: "Password",
    NOTI: "notification"
};

export const LOCAL_STORAGE = {
    DEVICE_TOKEN: "DEVICE_TOKEN",
    MISSED_CALLS_SEEN: "MISSED_CALLS_SEEN"
};

export const PD = {
    PADDING_1: 4,
    PADDING_2: 8,
    PADDING_3: 12,
    PADDING_4: 16,
    PADDING_5: 20,
    PADDING_6: 24
};

export const DIMENSION = {
    INPUT_HEIGHT: DEVICE.DEVICE_HEIGHT < 700 ? 45 : 55,
    INPUT_RADIUS: DEVICE.DEVICE_HEIGHT < 700 ? 22.5 : 27.5,
    BUTTON_HEIGHT: DEVICE.DEVICE_HEIGHT < 700 ? 45 : 55,
    BUTTON_RADIUS: DEVICE.DEVICE_HEIGHT < 700 ? 22.5 : 27.5,
    H1: DEVICE.DEVICE_WIDTH * 0.35,
    H2: DEVICE.DEVICE_WIDTH * 0.28,
    H3: DEVICE.DEVICE_WIDTH * 0.23,
    MAP_BOTTOM_BAR_HEIGHT: DEVICE.DEVICE_HEIGHT * 0.075,
    MAP_SUBJECT_BTN_WIDTH: DEVICE.DEVICE_WIDTH * 0.2,
    // chat
    CHAT_BUBBLE_WIDTH: DEVICE.DEVICE_WIDTH * 0.75,
    CHAT_AVATAR_WIDTH: DEVICE.DEVICE_WIDTH * 0.12,
    // header
    STATUS_BAR_HEIGHT: Platform.OS === "ios" ? getStatusBarHeight(isIphoneX()) : StatusBar.currentHeight,
    HEADER_HEIGHT: 55,
    // new
    BORDER_BOTTOM_LEFT_RADIUS: DEVICE.DEVICE_WIDTH * 0.15,
    NEW_HEADER_HEIGHT: DEVICE.DEVICE_HEIGHT * 0.22
};

export const INPUT_TYPE = {
    EMAIL: "EMAIL",
    PASSWORD: "PASSWORD",
    PHONE_NUMBER: "PHONE_NUMBER",
    PHONE_EMAIL: "PHONE_EMAIL"
};

export const STATUS_CODE = {
    SUCCESS: [200, 201, 204],
    AUTH: [401],
    NOTFOUND: [404]
};

export const GENDER = {
    MALE: 0,
    FEMALE: 1,
    OTHER: 2
};

export const CHECK = {
    LEARNER: 0,
    TEACHER: 1
};

export const CHAT_TYPE = {
    TEXT: 0,
    IMAGE: 1,
    FILE: 2,
    LOCATION: 3,
    CONTACT: 4,
    CHANGE_NAME: 5,
    ADD_MEMBER: 6,
    LEAVE_ROOM: 7,
    DELETE_MESSAGE: 8,
    EDITED_MESSAGE: 9,
    IMAGES: 10,
    REPLY: 11
};

export const GROUP_TYPE = {
    PRIVATE: 0,
    GROUP: 1
};

export const USER_TYPE = {
    EXPERT: 0,
    CUSTOMER: 1
};

export const ALERT_TYPE = {
    SUCCESS: "SUCCESS",
    INFO: "INFO",
    ERROR: "ERROR",
    WARNING: "WARING"
};

export const EVENT_STATUS = {
    WAIT: 0,
    ACCEPTED: 1,
    DONE: 2,
    CANCEL: 3
};
