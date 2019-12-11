import React from "react";
import { View, Alert } from "react-native";
import { connect } from "react-redux";
import { AppImage, AppText, Button, HeaderTransparent } from "components";
import styles from "./styles";
import { USER_TYPE, ALERT_TYPE } from "helper/Consts";
import { Icon } from "native-base";
import { GlobalStyles, Colors } from "helper";
import I18n from "helper/locales";
import { logoutRequest, updateUserProfile } from "actions/userActions";
import _ from "lodash";
import { LOGIN_SUCCESS } from "actions/types";
import { userActions, alertActions } from "actions";

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: {}
        };
    }

    componentDidUpdate(prevProps) {
        const { userReducer } = this.props;
        if (userReducer != prevProps.userReducer) {
            if (userReducer.type == LOGIN_SUCCESS) {
                const { data } = userReducer;
                this.setState({ userData: data });
            }
        }
    }

    componentDidMount() {
        const { userReducer, dispatch } = this.props;
        const { data } = userReducer;
        dispatch(userActions.requestTag());

        this.setState({ userData: data });
    }

    confirm() {
        Alert.alert(
            "Xác nhận",
            "Bạn có chắc muốn đăng xuất khỏi tài khoản của mình",
            [
                // { text: "Ask me later", onPress: () => console.log("Ask me later pressed") },
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => this.onSignOut() }
            ],
            { cancelable: false }
        );
    }

    renderHeader() {
        const { navigation } = this.props;
        const { userData } = this.state;
        if (_.isEmpty(userData)) {
            return null;
        } else {
            const { first_name, last_name, type, address } = userData;
            return (
                <View style={styles.headerContent}>
                    <View style={styles.headerWrap}>
                        <AppText
                            text={first_name.toUpperCase() + " " + last_name.toUpperCase()}
                            style={styles.nameText}
                        />
                        {type === USER_TYPE.CUSTOMER && <AppText text={address} style={styles.address} />}
                        {/* {type === USER_TYPE.EXPERT && <AppText text={"Bệnh viện"} />} */}
                        {type === USER_TYPE.EXPERT ? <AppText text="Khách Hàng" /> : <AppText text="Tư vấn viên" />}
                    </View>
                </View>
            );
        }
    }

    onNavigateTo(nameScreen) {
        const { navigation } = this.props;
        switch (nameScreen) {
            case I18n.t("profile.info"):
                navigation.navigate("ProfileEdit");
                break;
            case I18n.t("profile.setting"):
                navigation.navigate("ProfileSetting");
                break;
            case "History":
                navigation.navigate("HistoryStack");
                break;
            case I18n.t("profile.advice"):
                navigation.navigate("NotificationStack");
                break;
            case I18n.t("profile.calendar"):
                navigation.navigate("MeetingAgendaStack");
                break;
            default:
                break;
        }
    }

    renderItem(iconName, text, color) {
        return (
            <View style={styles.itemWrap}>
                <Button
                    onPress={() => this.onNavigateTo(text)}
                    style={[GlobalStyles.btnText, styles.btn]}
                    centerContent={
                        <View style={styles.centerBtn}>
                            <Icon
                                name={iconName}
                                type="MaterialCommunityIcons"
                                style={[styles.iconStyle, color ? { color: color } : {}]}
                            />
                            <AppText text={text} style={styles.textBtn} />
                        </View>
                    }
                />
            </View>
        );
    }

    renderContentFunction() {
        return (
            <View style={styles.bodyContent}>
                <View style={styles.bodyTopContent}>
                    {this.renderItem("account-edit", I18n.t("profile.info"))}
                    {this.renderItem("comment-question-outline", I18n.t("profile.advice"), Colors.Hopbush)}
                    {this.renderItem("history", "History", Colors.Deluge)}
                </View>
                <View style={styles.bodyBottomContent}>
                    {this.renderItem("calendar-check", I18n.t("profile.calendar"), Colors.Deluge)}
                    {this.renderItem("settings-outline", I18n.t("profile.setting"), Colors.Mobster)}
                    {this.renderItem("bell-ring-outline", I18n.t("profile.noti"), Colors.Hopbush)}
                </View>
            </View>
        );
    }

    async onSignOut() {
        const { dispatch, navigation, userReducer } = this.props;
        navigation.navigate("LoginStack");
        // dispatch(updateUserProfile({ id: userReducer.data.id, device_id: "" }));
        try {
            await userActions.updateUserProfile({ id: userReducer.data.id, devide_id: "" });
        } catch (error) {
            setTimeout(() => {
                const paramsAlert = {
                    content: I18n.t("profileEdit.updateFailed"),
                    title: I18n.t("Alert.notice"),
                    type: ALERT_TYPE.ERROR
                };
                dispatch(alertActions.openAlert(paramsAlert));
            }, 100);
        }
        setTimeout(() => {
            dispatch(logoutRequest());
        }, 100);
    }

    renderFooter() {
        return (
            <View style={styles.footerWrap}>
                <Button title={I18n.t("profile.signout")} style={styles.btnSignOut} onPress={() => this.confirm()} />
            </View>
        );
    }

    onPressBack() {
        const { dispatch, navigation } = this.props;
        navigation.navigate("NotificationStack");
        // navigation.goBack();
    }

    render() {
        const { navigation } = this.props;
        const { userData } = this.state;
        if (_.isEmpty(userData)) {
            return null;
        } else {
            const { img_url } = userData;
            return (
                <View style={styles.containerStyle}>
                    <HeaderTransparent onPressBack={() => this.onPressBack()} navigation={navigation} absolute />

                    <View style={{ backgroundColor: Colors.Deluge }}>
                        <AppImage
                            source={{ uri: img_url ? img_url : "https://i.imgur.com/Htnp2Ra.png" }}
                            style={styles.imageHeader}
                            resizeMode="cover"
                        />
                    </View>
                    <View style={styles.content}>
                        {this.renderHeader()}
                        {this.renderContentFunction()}
                        {this.renderFooter()}
                    </View>
                </View>
            );
        }
    }
}

function mapStateToProps(state) {
    return {
        userReducer: state.userReducer
    };
}
Profile = connect(mapStateToProps)(Profile);

export default Profile;
