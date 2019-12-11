import React from "react";
import { connect } from "react-redux";
import { View, KeyboardAvoidingView, Text, Modal, Platform, TouchableOpacity, ImageBackground } from "react-native";
import { AppText, AppImage, Container, Input, Button, HeaderTransparent } from "components";
// import { Container} from 'native-base';
import CountryPicker from "react-native-country-picker-modal";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Colors, Const, Helper, ServiceHandle } from "helper";
import { DEVICE, PD } from "helper/Consts";
import { sendRegisterRequest, accountKit, checkPhoneExist } from "actions/registerActions";
import { requestCheckPhone } from "actions/forgotPassAction/checkPhoneAction";
import styles from "./styles";
import I18n from "helper/locales";
import { types } from "actions";
import { openAccountKit } from "helper/helper";
import RNAccountKit, { LoginButton, Color, StatusBarStyle } from "react-native-facebook-account-kit";
import { ICON, Images } from "assets";
import { Icon, Spinner } from "native-base";
import { forgotRequest } from "actions/userActions";
import { alertActions } from "actions";

import * as actionType from "actions/types";

class NewPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: "",
            enterPassword: "",
            error: "",
            cca2: "VN",
            check: null,
            callingCode: "84",
            name: "Vietnam",
            focus: false,
            username: this.props.navigation.getParam("username")
        };
        this.inputRefs = {};
    }

    componentDidUpdate(prevProps) {
        const { userReducer, navigation, dispatch } = this.props;
        const { password, username } = this.state;
        console.log("đã chạy vào đây");
        if (prevProps.userReducer !== userReducer) {
            console.log("sao đéo chạy vào đây");
            if (userReducer.type === actionType.FORGOT_PASSWORD_SUCCESS) {
                console.log("đéo chạy vào đây");
                setTimeout(() => {
                    const paramsAlert = {
                        content: I18n.t("profileEdit.updatePassFailed"),
                        title: I18n.t("Alert.notice"),
                        type: Const.ALERT_TYPE.SUCCESS
                    };
                    dispatch(alertActions.openAlert(paramsAlert));
                    navigation.navigate("StartLogin");
                }, 500);
            } else {
                setTimeout(() => {
                    const paramsAlert = {
                        content: "Có lỗi vui lòng thử lại",
                        title: I18n.t("Alert.notice"),
                        type: Const.ALERT_TYPE.ERROR
                    };
                    dispatch(alertActions.openAlert(paramsAlert));
                }, 500);
            }
        }
    }

    onContinue = () => {
        const { password, enterPassword, first_name, last_name, username, type } = this.state;
        const error = Helper.checkValid(this.inputRefs);
        const params = {
            username: username,
            new_password: password,
            confirm_password: enterPassword
        };
        console.log(params, "params");
        if (!error) {
            if (password === enterPassword) {
                // this.props.navigation.navigate("Succsess");
                this.props.dispatch(forgotRequest(params));
            } else {
                this.setState({ error: I18n.t("NewPasswordScreen.notMatch") });
            }
        } else {
            this.setState({
                error
            });
        }
    };

    render() {
        const h3 = DEVICE.DEVICE_HEIGHT * 0.06;
        const { focus, password, enterPassword, error } = this.state;
        const { navigation } = this.props;
        return (
            <ImageBackground source={Images.BG} style={{ flex: 1 }}>
                <HeaderTransparent navigation={navigation} title="Nhập mật khẩu mới" />
                <KeyboardAvoidingView
                    style={{ flex: 1, paddingBottom: DEVICE.DEVICE_HEIGHT * 0.05 }}
                    behavior="padding"
                    enabled
                >
                    <Container scrollEnabled={focus}>
                        <AppImage local source={ICON.INF} style={styles.icon} resizeMode={"contain"} />
                        <View style={styles.input}>
                            <Input
                                transparent
                                inputStyle={{ fontSize: responsiveFontSize(2.5) }}
                                clearButton
                                nameValue="Mật khẩu"
                                type={Const.INPUT_TYPE.PASSWORD}
                                onRef={ref => (this.inputRefs["password"] = ref)}
                                placeholder="Nhập mật khẩu"
                                placeholderTextColor={Colors.WHITE_COLOR}
                                onChangeText={password => this.setState({ password })}
                                value={password}
                                secureTextEntry
                                onFocus={() => this.setState({ focus: true })}
                                onBlur={() => this.setState({ focus: false })}
                            />
                        </View>
                        <View style={styles.input}>
                            <Input
                                transparent
                                inputStyle={{ fontSize: responsiveFontSize(2.5) }}
                                clearButton
                                nameValue="Mật khẩu"
                                type={Const.INPUT_TYPE.PASSWORD}
                                onRef={ref => (this.inputRefs["password"] = ref)}
                                placeholder="Nhập lại mật khẩu"
                                placeholderTextColor={Colors.WHITE_COLOR}
                                onChangeText={enterPassword => this.setState({ enterPassword })}
                                value={enterPassword}
                                secureTextEntry
                                onFocus={() => this.setState({ focus: true })}
                                onBlur={() => this.setState({ focus: false })}
                            />
                        </View>
                        <View style={{ height: 30, justifyContent: "center" }}>
                            <AppText style={styles.error} text={error} />
                        </View>
                        <Button
                            title="Tiếp tục"
                            isShadow
                            onPress={() => this.onContinue()}
                            rightIcon
                            style={{ backgroundColor: Colors.Deluge, width: "90%" }}
                        />
                    </Container>
                </KeyboardAvoidingView>
            </ImageBackground>
        );
    }
}

function mapStateToProps(state) {
    return {
        registerReducer: state.registerReducer,
        userReducer: state.userReducer
    };
}
NewPassword = connect(mapStateToProps)(NewPassword);

export default NewPassword;
