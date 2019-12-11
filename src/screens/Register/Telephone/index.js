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

class Telephone extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: "",
            error: "",
            cca2: "VN",
            check: null,
            callingCode: "84",
            name: "Vietnam",
            focus: false
        };
        this.inputRefs = {};
    }

    accountKitOnSuccess(token) {
        const { navigation } = this.props;
        const { phone } = this.state;
        console.log("accountKitOnSuccess", token);
        navigation.navigate("Information", { username: this.convertPhoneRegister() });
    }

    accountKitOnError(error) {
        console.log("accountKitOnError", error);
    }

    async onNext() {
        const { cca2 } = this.state;
        const error = Helper.checkValid(this.inputRefs);
        if (!error) {
            openAccountKit(
                // phoneCode,
                this.convertPhoneNumber(),
                cca2,
                token => this.accountKitOnSuccess(token),
                error => this.accountKitOnError(error)
            );
        } else {
            this.setState({
                error
            });
        }
    }

    convertPhoneNumber() {
        let { callingCode } = this.state;

        let phone = this.convertPhoneRegister();

        let first = phone.slice(0, 1);
        if (first == "0") {
            return Platform.OS == "android" ? "84" + phone.slice(1, phone.length) : phone.slice(1, phone.length);
        } else {
            return Platform.OS == "android" ? phone : phone.slice(callingCode.length, phonet.length);
        }
    }

    convertPhoneRegister() {
        let { phone, callingCode } = this.state;

        let phoneNumber = "";
        let first = phone.slice(0, 1);
        if (first == "0") {
            phoneNumber = callingCode + phone.slice(1, phone.length);
        } else {
            phoneNumber = callingCode + phone;
        }
        if (callingCode == "84") {
            phoneNumber = "0" + phoneNumber.slice(2, phoneNumber.length);
        }

        return phoneNumber;
    }

    onFocusChange = () => {
        this.setState(prevState => ({
            focus: !prevState.focus
        }));
    };
    onBlurChange = () => {
        this.setState(prevState => ({ focus: !prevState.focus }));
    };

    onPress() {
        const { navigation } = this.props;
        navigation.navigate("Information");
    }

    render() {
        const h3 = DEVICE.DEVICE_HEIGHT * 0.06;
        const { focus, phone, error, check, name, callingCode, cca2 } = this.state;
        const { navigation } = this.props;
        return (
            <ImageBackground source={Images.BG} style={{ flex: 1 }}>
                <HeaderTransparent navigation={navigation} title={I18n.t("register.title")} />
                <KeyboardAvoidingView
                    style={{ flex: 1, marginBottom: DEVICE.DEVICE_HEIGHT * 0.05 }}
                    behavior="padding"
                    enabled
                >
                    <Container scrollEnabled={focus}>
                        <AppImage local source={ICON.INF} style={styles.icon} resizeMode={"contain"} />
                        <View style={styles.input}>
                            <Input
                                leftIconName="phone"
                                transparent
                                clearButton
                                inputStyle={{ fontSize: responsiveFontSize(2.5) }}
                                nameValue={I18n.t("register.telephone")}
                                type={Const.INPUT_TYPE.PHONE_NUMBER}
                                onRef={ref => (this.inputRefs["phone"] = ref)}
                                placeholder={I18n.t("register.placeholderTele")}
                                placeholderTextColor={Colors.WHITE_COLOR}
                                onChangeText={e => this.setState({ phone: e, error: "" })}
                                value={this.state.phone}
                            />
                        </View>
                        <View style={{ height: 30, justifyContent: "center" }}>
                            <AppText style={styles.error} text={error} />
                        </View>

                        <Button
                            title={I18n.t("register.button")}
                            isShadow
                            onPress={() => this.onNext()}
                            rightIcon
                            style={{ backgroundColor: Colors.Deluge, width: "90%" }}
                        />
                    </Container>
                </KeyboardAvoidingView>
            </ImageBackground>
        );
    }
}
export default Telephone;
