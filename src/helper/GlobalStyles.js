import { Platform } from "react-native";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Colors } from "helper";
import { FONT_SF } from "assets";
import { DIMENSION, DEVICE } from "./Consts";

const GlobalStyles = {
    shadowStyle: {
        shadowColor: "rgba(0, 0, 0, 0.4)",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: 2,
        shadowOpacity: 1,
        elevation: 4
    },
    tabShadowStyle: {
        shadowColor: "rgba(0, 0, 0, 0.4)",
        shadowOffset: {
            width: 0,
            height: -2
        },
        shadowRadius: 4,
        shadowOpacity: 1,
        elevation: 20
    },
    transparent: {
        backgroundColor: "rgba(0, 0, 0, 0.2)"
    },
    shadowWhite: {
        shadowColor: "rgba(255, 255, 255, 0.6)",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: 2,
        shadowOpacity: 1,
        elevation: 4
    },
    iconWhite: {
        color: Colors.WHITE_COLOR,
        fontSize: responsiveFontSize(3)
    },
    shadowStyle2: {
        shadowColor: "rgba(0, 0, 0, 0.2)",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: 2,
        shadowOpacity: 1,
        elevation: 4
    },
    btnText: {
        paddingHorizontal: 0,
        paddingVertical: 0,
        height: "auto",
        backgroundColor: "transparent"
    },
    agendaDark: {
        color: Colors.WHITE_COLOR,
        backgroundColor: Colors.Revolver,
        calendarBackground: Colors.Bleached_Cedar,
        agendaKnobColor: Colors.Athens_Gray,
        textSectionTitleColor: Colors.WHITE_COLOR,
        selectedDayBackgroundColor: "#00adf5",
        selectedDayTextColor: "#ffffff",
        todayTextColor: "#00adf5",
        dayTextColor: Colors.WHITE_COLOR,
        textDisabledColor: "#d9e1e8",
        dotColor: "#00adf5",
        selectedDotColor: Colors.WHITE_COLOR,
        arrowColor: Colors.WHITE_COLOR,
        monthTextColor: Colors.WHITE_COLOR,
        indicatorColor: Colors.WHITE_COLOR,
        // textDayFontFamily: FONT_SF.LIGHT,
        // textMonthFontFamily: FONT_SF.LIGHT,
        // textDayHeaderFontFamily: FONT_SF.LIGHT,
        // textDayFontSize: responsiveFontSize(DEVICE.DEVICE_HEIGHT / DEVICE.DEVICE_WIDTH > 2 ? 1.5 : 2),
        // textDayHeaderFontSize: responsiveFontSize(DEVICE.DEVICE_HEIGHT / DEVICE.DEVICE_WIDTH > 2 ? 1.5 : 2),
        // textMonthFontSize: responsiveFontSize(2.5),
        "stylesheet.calendar.header": {
            week: {
                marginTop: Platform.OS == "android" ? 0 : 5,
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 2
            }
        }
    }
};

export default GlobalStyles;
