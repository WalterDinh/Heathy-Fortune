import React from "react";
import { View, StyleSheet, StatusBar, ScrollView, FlatList, Platform } from "react-native";
import { connect } from "react-redux";
import { DIMENSION, DEVICE, PD } from "helper/Consts";
import { isIphoneX, getStatusBarHeight } from "react-native-iphone-x-helper";
import { Colors } from "helper";
import { ButtonCircle, AppImage, AppText } from "./index";
import I18n from "helper/locales";
import { Icon } from "native-base";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { FONT_SF } from "assets";
import { TouchableOpacity } from "react-native-gesture-handler";
const hitSlop = {
    top: PD.PADDING_2,
    bottom: PD.PADDING_2,
    left: PD.PADDING_2,
    right: PD.PADDING_2
};

const HEADER_HEIGHT = DIMENSION.NEW_HEADER_HEIGHT;
const BORDER_RADIUS = DIMENSION.BORDER_BOTTOM_LEFT_RADIUS;
const DEFAULT_AVATAR = "https://i.imgur.com/Htnp2Ra.png";
const AVATAR_SIZE = DEVICE.DEVICE_WIDTH * 0.15;
class HeaderApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedId: "1"
        };
    }

    convertBackgroundColor() {
        const { selectedId } = this.state;
        let colorBackground = Colors.Victoria;
        switch (selectedId) {
            case 0:
                colorBackground = Colors.Victoria;
                break;
            case 1:
                colorBackground = Colors.Athens_Gray;
                break;
            case 2:
                colorBackground = Colors.Athens_Gray;
                break;
            case 3:
                colorBackground = Colors.Alizarin_Crimson;
                break;
            case 4:
                colorBackground = Colors.Revolver;
                break;
            case 5:
                colorBackground = Colors.Bleached_Cedar;
                break;
            case 6:
                colorBackground = Colors.Deluge;
                break;
            default:
                colorBackground = Colors.Victoria;
                break;
        }
        return colorBackground;
    }

    onPress(props) {
        const { navigation, colorBackground } = this.props;
        const { routes, index } = navigation.state;
        console.log("routes", routes);

        this.setState({ selectedId: props.id }, () => {
            navigation.navigate(routes[props.id].routeName);
        });
    }

    renderHeader() {
        const { selectedId } = this.state;
        const { navigation, colorBackground, containerStyle, userReducer } = this.props;
        console.log("userReduceruserReducer", userReducer);
        let name = userReducer.data ? userReducer.data.last_name : I18n.t("header.you");
        if (name.length > 15) {
            name = userReducer.data.last_name.substr(0, 15) + "...";
        }
        let avatar = userReducer.data ? userReducer.data.img_url : DEFAULT_AVATAR;
        const { routes, index } = navigation.state;
        const MENU = [
            {
                id: 1,
                // title: I18n.t("header.you"),
                title: name.toUpperCase(),
                iconName: avatar,
                iconType: "MaterialCommunityIcons",
                navigate: "user"
            },
            {
                id: 0,
                title: I18n.t("header.advice"),
                iconName: "comment-question-outline",
                iconType: "MaterialCommunityIcons",
                navigate: "Element"
            },
            {
                id: 2,
                title: I18n.t("header.eventWaiting"),
                iconName: "comment-alert-outline",
                iconType: "MaterialCommunityIcons",
                navigate: "Element"
            },
            {
                id: 3,
                title: I18n.t("header.chat"),
                iconName: "comment-text-multiple-outline",
                iconType: "MaterialCommunityIcons",
                navigate: "Element"
            },
            {
                id: 4,
                title: I18n.t("header.calendar"),
                iconName: "calendar-clock",
                iconType: "MaterialCommunityIcons",
                navigate: "Element"
            },
            {
                id: 5,
                title: I18n.t("header.category"),
                iconName: "account-multiple-outline",
                iconType: "MaterialCommunityIcons",
                navigate: "Element"
            },
            {
                id: 6,
                title: I18n.t("header.new"),
                iconName: "newspaper",
                iconType: "MaterialCommunityIcons",
                navigate: "Element"
            },
            {
                id: 7,
                title: I18n.t("header.history"),
                iconName: "history",
                iconType: "MaterialCommunityIcons",
                navigate: "MettingAgendaStack"
            },
            {
                id: 8,
                title: I18n.t("header.noti"),
                iconName: "bell-ring-outline",
                iconType: "MaterialCommunityIcons",
                navigate: "MettingAgendaStack"
            }
        ];
        return (
            <View style={styles.innerContent}>
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    style={{ flex: 5, paddingTop: 10 }}
                    data={MENU}
                    keyExtractor={(item, index) => `${index}`}
                    renderItem={({ item, idx }) => (
                        <ButtonCircle
                            key={idx}
                            isSelected={item.id == index}
                            iconName={item.iconName}
                            iconType={item.iconType}
                            title={item.title}
                            onPress={() => this.onPress(item)}
                            navigation={item.navigate}
                        />
                    )}
                />
                <View style={{ flex: Platform.OS === "android" ? 0.25 : 0.5 }} />
            </View>
        );
    }

    _onPressBack = props => {
        const { navigation, onPressBack } = this.props;
        if (onPressBack) {
            console.log("press Back", onPressBack);
            onPressBack();
            return;
        }
        navigation.goBack();
    };

    renderBackHeader() {
        const { title, avatar } = this.props;
        return (
            <View style={styles.innerContent}>
                <View style={{ flex: 1, paddingLeft: "5%" }}>
                    <View style={{ paddingTop: HEADER_HEIGHT * 0.05 }}>
                        <TouchableOpacity onPress={this._onPressBack}>
                            <Icon name="chevron-left" type="MaterialCommunityIcons" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.contentWrap}>
                        <AppImage
                            source={{ uri: avatar ? avatar : DEFAULT_AVATAR }}
                            style={styles.avatarStyle}
                            resizeMode="cover"
                        />
                        <View style={{ flex: 1, paddingHorizontal: PD.PADDING_2 }}>
                            <AppText
                                numberOfLines={2}
                                text={title}
                                style={{ fontSize: responsiveFontSize(3.2), fontFamily: FONT_SF.BOLD }}
                            />
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    render() {
        const { navigation, containerStyle, isBack = false } = this.props;

        return (
            <View style={[styles.container, containerStyle]}>
                <StatusBar translucent barStyle="dark-content" backgroundColor={Colors.WHITE_COLOR} />
                <View style={styles.statusBar} />
                <View style={styles.content}>
                    {!isBack && this.renderHeader()}
                    {isBack && this.renderBackHeader()}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 0,
        top: 0,
        width: DEVICE.DEVICE_WIDTH,
        height: HEADER_HEIGHT,
        zIndex: 2,
        flex: 1
        // backgroundColor: "green"
    },
    content: {
        flex: 1
        // paddingTop: DIMENSION.STATUS_BAR_HEIGHT
    },
    innerContent: {
        flex: 1,
        borderBottomLeftRadius: BORDER_RADIUS,
        backgroundColor: Colors.WHITE_COLOR
    },
    contentWrap: {
        paddingLeft: "5%",
        flexDirection: "row",
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-start"
        // backgroundColor: "red"
    },
    avatarStyle: {
        height: AVATAR_SIZE,
        width: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2
    },
    statusBar: {
        height: DIMENSION.STATUS_BAR_HEIGHT,
        backgroundColor: Colors.WHITE_COLOR
    }
});

function mapStateToProps(state) {
    return {
        navigateReducer: state.navigateReducer,
        userReducer: state.userReducer
    };
}

HeaderApp = connect(mapStateToProps)(HeaderApp);
export default HeaderApp;
