import React from "react";
import { View, ImageBackground, StatusBar, Platform } from "react-native";
import { connect } from "react-redux";
import { AppImage, Button } from "components";
import { ICON, Images } from "assets";
import { PD, DEVICE } from "helper/Consts";
import styles from "./styles";
import _ from "lodash";
import I18n from "helper/locales";

const width = DEVICE.DEVICE_WIDTH;
const height = DEVICE.DEVICE_HEIGHT;
const data = [{ countryCode: "VI", flag: Images.VIE }, { countryCode: "EN", flag: Images.ENG }];

class StartLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            password: "",
            selected: "key1",
            modalVisible: false
        };
    }

    // componentDidMount() {}

    // componentDidUpdate(prevProps) {
    // }

    // onLogin() {
    //     const { dispatch } = this.props;
    //     const { userName, password } = this.state;
    //     if (userName == "") {
    //         alert(`Username can't be blank`);
    //         return;
    //     }
    //     if (password.length < 10) {
    //         alert(`Password must be 10 digits`);
    //         return;
    //     }
    // }
    // renderInputs() {
    //     const { userName, password } = this.state;
    //     return <View style={styles.inputsWrap} />;
    // }
    // onValueChange(value) {
    //     this.setState({
    //         selected: value
    //     });
    // }

    onPressLogin() {
        const { navigation } = this.props;
        navigation.navigate("Login");
    }

    onPressRegister() {
        const { navigation } = this.props;
        navigation.navigate("Telephone");
    }

    renderInputs() {
        const { userName, password } = this.state;
        return <View style={styles.inputsWrap} />;
    }
    onValueChange(value) {
        this.setState({
            selected: value
        });
    }

    render() {
        return (
            <ImageBackground source={Images.BG} style={{ width: "100%", height: "100%" }}>
                <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />
                <AppImage local source={ICON.INF} style={styles.icon} resizeMode={"contain"} />
                <View
                    style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        paddingVertical: PD.PADDING_6
                    }}
                >
                    <View style={styles.mg}>
                        <Button
                            title={I18n.t("startLogin.login")}
                            isShadow
                            onPress={() => this.onPressLogin()}
                            rightIcon
                            style={styles.btnLogin}
                        />
                    </View>
                    <View style={styles.mg}>
                        <Button
                            title={I18n.t("startLogin.register")}
                            isShadow
                            onPress={() => this.onPressRegister()}
                            rightIcon
                            style={styles.btnRegister}
                        />
                    </View>
                </View>
            </ImageBackground>
        );
    }
}

function mapStateToProps(state) {
    return {
        userReducer: state.userReducer,
        language: state.languageReducer.language
    };
}
StartLogin = connect(mapStateToProps)(StartLogin);
export default StartLogin;
