import React from "react";
import { View, ImageBackground, AsyncStorage, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { Const, Helper, Colors } from "helper";
import { types, userActions } from "actions/index";
import { Container, Button, AppImage, Input, AppText, HeaderTransparent } from "components";
import styles from "./styles";
import { ICON, FONT_SF, Images } from "assets";
import I18n from "helper/locales";
import { requestLogin } from "actions/loginActions";
import CountryPicker from "react-native-country-picker-modal";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { getPassword } from "actions/userActions";

const width = Const.DEVICE.DEVICE_WIDTH;
const height = Const.DEVICE.DEVICE_HEIGHT;

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: "",
            password: "",
            error: "",
            check: null,
            callingCode: "84",
            name: "Vietnam",
            cca2: "VN",
            scrollEnabled: false
        };
        this.inputRefs = {};
    }

    componentDidUpdate(prevProps) {
        const { userReducer, navigation, dispatch } = this.props;
        const { password } = this.state;
        if (prevProps.userReducer !== userReducer) {
            if (userReducer.type === types.LOGIN_SUCCESS) {
                dispatch(getPassword(password));
                AsyncStorage.getItem(Const.LOCAL_STORAGE.DEVICE_TOKEN).then(deviceToken => {
                    const result = userActions.updateNotificationId({ id: userReducer.data.id, deviceToken });
                });
                if (userReducer.data.type === 1) {
                    userReducer.data && userReducer.data.active
                        ? navigation.navigate("MainTabContainer")
                        : navigation.navigate("MainTabContainer");
                    // : navigation.navigate("DrawerAppTeacher");
                } else {
                    navigation.navigate("MainTabContainer");
                }
                return;
            }
        }
    }

    convertPhoneNumber() {
        let { phoneNumber, callingCode } = this.state;

        let phone = "";
        // let first = phoneNumber.slice(0, 1);
        // if (first == "0") {
        //     phone = callingCode + phoneNumber.slice(1, phoneNumber.length);
        // } else {
        //     phone = callingCode + phoneNumber;
        // }
        // if (callingCode == 84) {
        //     phone = "0" + phone.slice(2, phone.length);
        // }
        phone = phoneNumber;

        return phone;
    }

    onLogin() {
        let { phoneNumber, password } = this.state;
        const { dispatch } = this.props;

        if (!Helper.checkValid(this.inputRefs)) {
            this.setState({ error: "" });
            let params = {
                username: this.convertPhoneNumber(),
                password: password
            };
            dispatch(requestLogin(params));
        } else {
            this.setState({
                error: Helper.checkValid(this.inputRefs)
            });
        }
    }
    setValue(type) {
        this.setState({ callingCode: type.callingCode, cca2: type.cca2, name: type.name, check: 1 });
    }
    renderInputs() {
        const { phoneNumber, password, check, callingCode, name, country, cca2 } = this.state;
        return (
            <View style={styles.inputsWrap}>
                {/* <TouchableOpacity style={styles.dropdown} onPress={() => this.picker.openModal()}>
                    <View style={{ justifyContent: "center", marginBottom: 5 }}>
                        <CountryPicker
                            ref={ref => (this.picker = ref)}
                            onChange={value => this.setValue(value)}
                            cca2={cca2}
                            translation="eng"
                            closeable={true}
                            filterable={true}
                        />
                    </View>
                    <View
                        style={{
                            flex: 3,
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row"
                        }}
                    >
                        <AppText
                            text={`${`(+`} ${callingCode} ${`)`}`}
                            style={{ fontSize: responsiveFontSize(2.0), alignItems: "center" }}
                        />
                        <AppText
                            text={name}
                            numberOfLines={1}
                            style={{
                                fontSize: responsiveFontSize(2.0),
                                alignItems: "center",
                                marginLeft: 10
                            }}
                        />
                    </View>
                </TouchableOpacity> */}
                <Input
                    inputStyle={{ fontSize: responsiveFontSize(2.5) }}
                    keyboardType="numeric"
                    // nameValue={I18n.t("phoneNumber")}
                    // type={Const.INPUT_TYPE.PHONE_NUMBER}
                    // onRef={ref => (this.inputRefs["phoneNumber"] = ref)}
                    clearButton
                    transparent
                    leftIconName="phone"
                    placeholder={I18n.t("loginScreen.phoneNumber")}
                    onChangeText={e => this.setState({ phoneNumber: e.trim() })}
                    value={phoneNumber}
                    onFocus={() => this.setState({ scrollEnabled: true })}
                    onBlur={() => this.setState({ scrollEnabled: false })}
                    containerStyles={styles.inputContainer}
                />
                <Input
                    secureTextEntry={true}
                    inputStyle={{ fontSize: responsiveFontSize(2.5) }}
                    nameValue={I18n.t("loginScreen.password")}
                    type={Const.INPUT_TYPE.PASSWORD}
                    onRef={ref => (this.inputRefs["password"] = ref)}
                    clearButton
                    transparent
                    leftIconName="key"
                    placeholder={I18n.t("loginScreen.password")}
                    onChangeText={e => this.setState({ password: e.trim() })}
                    value={password}
                    onFocus={() => this.setState({ scrollEnabled: true })}
                    onBlur={() => this.setState({ scrollEnabled: false })}
                    containerStyles={styles.inputContainer}
                    // placeholderTextColor="red"
                />
            </View>
        );
    }
    goSignUp() {
        this.setState(
            {
                phoneNumber: "",
                password: "",
                error: ""
            },
            () => {
                const { navigation } = this.props;
                navigation.navigate("Telephone");
            }
        );
    }
    render() {
        const { navigation } = this.props;
        const { scrollEnabled } = this.state;
        return (
            <ImageBackground style={{ width: "100%", height: "100%" }} source={Images.BG}>
                <HeaderTransparent navigation={navigation} />
                <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
                    <Container scrollEnabled={scrollEnabled}>
                        <AppImage source={ICON.INF} resizeMode="contain" style={styles.logoApp} />
                        {this.renderInputs()}
                        <AppText style={styles.errorText} text={this.state.error} />
                        <Button
                            onPress={() => this.onLogin()}
                            style={styles.btn}
                            isShadow
                            title={I18n.t("loginScreen.login")}
                        />
                        <Button
                            textContent
                            title={I18n.t("loginScreen.forgotPassword")}
                            style={styles.btnText}
                            tStyle={styles.btnTextStyle}
                            onPress={() => navigation.navigate("CheckNumber")}
                        />
                        <View style={styles.btnBottomWrap}>
                            <Button
                                textContent
                                title={I18n.t("loginScreen.createAccount") + I18n.t("loginScreen.expert")}
                                tStyle={styles.btnTextStyle}
                                onPress={() => this.goSignUp()}
                            />
                        </View>
                    </Container>
                </KeyboardAvoidingView>
            </ImageBackground>
        );
    }
}

function mapStateToProps(state) {
    return {
        userReducer: state.userReducer
    };
}
Login = connect(mapStateToProps)(Login);
export default Login;
