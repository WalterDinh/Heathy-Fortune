import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Colors, Const, GlobalStyles } from "helper";
import { DIMENSION, DEVICE, PD } from "helper/Consts";
import { FONT_SF } from "assets";
import { Icon } from "native-base";
import { AppText, AppImage } from "components";
import { responsiveFontSize } from "react-native-responsive-dimensions";

const BUTTON_CIRCLE_WIDTH = DEVICE.DEVICE_WIDTH * 0.23;
const CIRCLE_HEIGHT = DEVICE.DEVICE_WIDTH * 0.135;
const CIRCLE_RADIUS = CIRCLE_HEIGHT * 0.5;

class ButtonCircle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isClicked: false
        };
    }

    onPress = () => {
        const { isClicked } = this.state;
        const { onPress } = this.props;
        if (!isClicked) {
            onPress();
        }
    };

    render() {
        const {
            style,
            isSelected,
            iconName,
            title,
            iconType = "Ionicons",
            iconStyle = {},
            titleStyle = {},
            navigation
        } = this.props;
        return (
            <View style={styles.btnContainer}>
                <TouchableOpacity {...this.props} onPress={() => this.onPress()} style={[style, styles.btn]}>
                    <View style={styles.btnContent}>
                        <View style={[styles.outlineCircle, isSelected ? { borderColor: Colors.Hopbush } : {}]}>
                            {navigation === "user" ? (
                                <AppImage source={{ uri: iconName }} style={styles.outlineAvatar} resizeMode="cover" />
                            ) : (
                                <Icon
                                    type={iconType}
                                    name={iconName}
                                    style={[styles.icon, iconStyle, isSelected ? { color: Colors.Limed_Spruce } : {}]}
                                />
                            )}
                        </View>
                        <AppText
                            text={title}
                            style={[styles.text, titleStyle, isSelected ? { color: Colors.Limed_Spruce } : {}]}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    btnContainer: {
        width: BUTTON_CIRCLE_WIDTH,
        justifyContent: "center",
        alignItems: "center"
    },
    btn: {},
    btnContent: {
        justifyContent: "center",
        alignItems: "center"
    },
    outlineCircle: {
        height: CIRCLE_HEIGHT,
        width: CIRCLE_HEIGHT,
        borderRadius: CIRCLE_RADIUS,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        borderColor: Colors.Dusty_Gray
    },
    outlineAvatar: {
        height: CIRCLE_HEIGHT * 0.9,
        width: CIRCLE_HEIGHT * 0.9,
        borderRadius: CIRCLE_RADIUS * 0.9
        // borderWidth: 1,
        // justifyContent: "center",
        // alignItems: "center",
        // borderColor: Colors.Dusty_Gray
    },
    icon: {
        color: Colors.Gray_Chateau,
        fontSize: responsiveFontSize(3.5)
    },
    text: {
        paddingTop: PD.PADDING_2,
        color: Colors.Gray_Chateau,
        fontFamily: FONT_SF.BOLD
    }
});

export default ButtonCircle;
