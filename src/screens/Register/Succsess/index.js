import React from "react";
import { connect } from "react-redux";
import { View, KeyboardAvoidingView, Text, Modal, Platform, TouchableOpacity, ImageBackground } from "react-native";
import { Header, AppImage, Container, Input, Button, HeaderTransparent, AppText } from "components";
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
import { requestLogin } from "actions/userActions";

class Succsess extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focus: false
        };
        this.inputRefs = {};
        this.params = this.props.navigation.getParam("params");
    }
    onPress() {
        const { navigation } = this.props;
        navigation.navigate("StartLogin");
    }

    componentDidMount() {
        const { dispatch } = this.props;
        setTimeout(() => {
            dispatch(requestLogin(this.params));
        }, 500);
    }

    componentDidUpdate(prevProps) {
        const { userReducer, navigation } = this.props;
        if (prevProps.userReducer !== userReducer) {
            if (userReducer.type === types.LOGIN_FAILED) {
                setTimeout(() => {
                    // Alert.alert("Error", userReducer.errorMessage);
                }, 50);
                return;
            }
            if (userReducer.type === types.LOGIN_SUCCESS) {
                navigation.navigate("MainTabContainer");
                return;
            }
        }
    }

    // componentDidUpdate(prevProps) {
    //     const { registerReducer, navigation } = this.props;
    //     const { password, username } = this.state;
    //     if (prevProps.registerReducer !== registerReducer) {
    //         if (registerReducer.type === types.SEND_REGISTER_SUCCESS) {
    //             setTimeout(() => {
    //                 this.props.navigation.navigate("StartLogin");
    //             }, 1000);
    //             return;
    //         }
    //     }
    // }

    render() {
        const h3 = DEVICE.DEVICE_HEIGHT * 0.06;
        const { focus, password, enterPassword } = this.state;
        const { navigation } = this.props;
        return (
            <Container style={{ backgroundColor: Colors.SKY_BLUE }} scrollEnabled={focus}>
                <ImageBackground source={Images.BG} style={{ flex: 1 }}>
                    <HeaderTransparent onPressBack={() => navigation.navigate("Login")} title="Tạo tài khoản" />
                    {/* <AppImage local source={ICON.INF} style={styles.icon} resizeMode={"contain"} /> */}
                    <View
                        style={{
                            justifyContent: "center",
                            flex: 1,
                            paddingVertical: PD.PADDING_6,
                            paddingHorizontal: PD.PADDING_6
                        }}
                    >
                        {/* <AppImage local source={ICON.SUCCESS} style={styles.success} resizeMode={"contain"} /> */}
                        <AppText text="Chúc mừng bạn đã đăng ký thành công tài khoản của Expert" style={styles.text} />
                    </View>
                </ImageBackground>
            </Container>
        );
    }
}
function mapStateToProps(state) {
    return {
        userReducer: state.userReducer
    };
}
Succsess = connect(mapStateToProps)(Succsess);
export default Succsess;
