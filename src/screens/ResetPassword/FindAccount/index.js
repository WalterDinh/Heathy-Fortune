import React from "react";
import { View, StatusBar, Alert, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { HeaderImage, Button, AppText, AppSlider, Container, AppImageCircle, Input } from "components";
import I18n from "helper/locales";
import HeaderApp from "components/Header";
import { Colors, Const, Helper } from "helper";
import { ICON } from "assets";
import styles from "./styles";
import { types } from "actions";
import { requestCheckPhone } from "actions/forgotPassAction/checkPhoneAction";
import { DIMENSION } from "helper/Consts";
import CountryPicker from "react-native-country-picker-modal";
import { responsiveFontSize } from "react-native-responsive-dimensions";

const width = Const.DEVICE.DEVICE_WIDTH;
const height = Const.DEVICE.DEVICE_HEIGHT;

class FindAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: "",
            error: "",
            cca2: "VN",
            check: null,
            callingCode: "84",
            name: "Vietnam",
            focus: false
        };
        this.inputRefs = {};
    }

    componentDidUpdate(prevProps) {
        let { cca2, callingCode } = this.state;
        const { checkPhoneReducer, navigation } = this.props;
        console.log("=======>", checkPhoneReducer, `\n`, prevProps.checkPhoneReducer);
        if (prevProps.checkPhoneReducer !== checkPhoneReducer) {
            if (checkPhoneReducer.type === types.CHECK_PHONE_FAILED) {
                setTimeout(() => {
                    // Alert.alert("Error", checkPhoneReducer.errorMessage);
                }, 100);
                return;
            }
            if (checkPhoneReducer.type === types.CHECK_PHONE_SUCCESS) {
                navigation.navigate("AccountVerify", { item: { cca2, callingCode } });
                return;
            }
        }
    }

    convertPhoneNumber() {
        let { phoneNumber, callingCode } = this.state;

        let phone = "";
        let first = phoneNumber.slice(0, 1);
        if (first == "0") {
            phone = callingCode + phoneNumber.slice(1, phoneNumber.length);
        } else {
            phone = callingCode + phoneNumber;
        }
        if (callingCode == 84) {
            phone = "0" + phone.slice(2, phone.length);
        }

        return phone;
    }

    onContinue() {
        let { phoneNumber } = this.state;
        const { dispatch } = this.props;
        const error = Helper.checkValid(this.inputRefs);

        if (!error) {
            this.setState({
                error: null
            });
            let params = {
                username: this.convertPhoneNumber()
            };
            dispatch(requestCheckPhone(params));
        } else {
            this.setState({
                error
            });
        }
    }
    onFocusChange = () => {
        this.setState({ focus: true });
    };
    onBlurChange = () => {
        this.setState({ focus: false });
    };
    setValue(type) {
        console.log(("aaaaa ===>>> ", type));

        this.setState({ callingCode: type.callingCode, cca2: type.cca2, name: type.name, check: 1 });
    }
    render() {
        const { navigation } = this.props;
        const { phoneNumber, callingCode, name, cca2 } = this.state;
        return (
            <Container contentContainerStyle={{ backgroundColor: Colors.CONTENT_COLOR }} scrollEnabled={false}>
                <HeaderApp leftIcon isBack navigation={navigation} title={I18n.t("FindAccountScreen.FindAccount")} />
                {!this.state.focus && (
                    <AppText
                        text={I18n.t("FindAccountScreen.Import")}
                        style={{
                            paddingTop: 0.05 * height,
                            fontSize: 19,
                            marginHorizontal: 50,
                            textAlign: "center",
                            lineHeight: 25
                        }}
                        numberOfLines={2}
                    />
                )}
                <View style={{ marginTop: 0.05 * height }}>
                    <AppImageCircle
                        image
                        local
                        // resizeMode="repeat"
                        source={ICON.USER}
                        styleImage={{ width: DIMENSION.H3 * 0.5, height: DIMENSION.H3 * 0.5, borderRadius: 0 }}
                    />
                </View>
                <View style={styles.inputsWrap}>
                    <TouchableOpacity style={styles.dropdown} onPress={() => this.picker.openModal()}>
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
                    </TouchableOpacity>
                    <Input
                        maxLength={15}
                        inputStyle={{ fontSize: 20 }}
                        keyboardType="numeric"
                        // nameValue={I18n.t("phoneNumber")}
                        // type={Const.INPUT_TYPE.PHONE_NUMBER}
                        // onRef={ref => (this.inputRefs["phoneNumber"] = ref)}
                        clearButton
                        placeholder={I18n.t("loginScreen.phoneNumber")}
                        placeholderTextColor={Colors.DIABLED_BUTTON}
                        lSource={ICON.PHONE_BLUE}
                        lBlurSource={ICON.PHONE_WHITE}
                        onChangeText={e => this.setState({ phoneNumber: e.trim() })}
                        value={phoneNumber}
                        containerStyles={{ width: "100%" }}
                        onFocus={this.onFocusChange}
                        onBlur={this.onBlurChange}
                    />
                    <AppText
                        style={{
                            fontSize: responsiveFontSize(2.5),
                            color: "red",
                            marginVertical: 0.03 * height,
                            textAlign: "center"
                        }}
                        text={this.state.error}
                    />
                    <Button
                        tStyle={{ fontSize: responsiveFontSize(2.5) }}
                        onPress={() => this.onContinue()}
                        style={{ width: "50%" }}
                        isShadow
                        title={I18n.t("FindAccountScreen.continue")}
                    />
                </View>
            </Container>
        );
    }
}
function mapStateToProps(state) {
    return {
        checkPhoneReducer: state.checkPhoneReducer
    };
}
FindAccount = connect(mapStateToProps)(FindAccount);
export default FindAccount;
