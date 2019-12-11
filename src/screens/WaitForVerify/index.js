import React, { Component } from "react";
import { connect } from "react-redux";
import { View } from "react-native";
import { HeaderApp, AppText, Button } from "components";
import I18n from "helper/locales";
import styles from "./styles";
import { getUserData, logoutRequest } from "actions/userActions";
import { Const } from "helper";
import { alertActions } from "actions";
const INACTIVE = 0;
const ACTIVE = 1;
class WaitForVerify extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onReload() {
        const { navigation, userReducer, dispatch } = this.props;
        const id = userReducer.data.id;
        getUserData({ id }).then(res => {
            if (res.error) {
                let paramsAlert = {
                    content: I18n.t("Alert.networkErr"),
                    title: I18n.t("Alert.notice"),
                    type: Const.ALERT_TYPE.ERROR
                };
                dispatch(alertActions.openAlert(paramsAlert));
            } else {
                if (res.response.aactive == ACTIVE) {
                    navigation.navigate("Splash");
                } else {
                    let paramsAlert = {
                        content: I18n.t("Alert.waitVertify"),
                        title: I18n.t("Alert.notice"),
                        type: Const.ALERT_TYPE.WARNING
                    };
                    dispatch(alertActions.openAlert(paramsAlert));
                }
            }
        });
    }

    logout() {
        const { dispatch, navigation } = this.props;
        dispatch(logoutRequest());
        navigation.navigate("LoginStack");
    }

    render() {
        return (
            <View style={styles.container}>
                <HeaderApp menu={false} title={I18n.t("waitForVerify.title")} />
                <View style={styles.body}>
                    <View style={styles.textView}>
                        <AppText text={I18n.t("waitForVerify.description")} style={styles.text} />
                    </View>
                    <Button
                        title={I18n.t("waitForVerify.reload")}
                        tStyle={styles.button}
                        onPress={() => this.onReload()}
                    />
                    <Button
                        title={I18n.t("waitForVerify.signout")}
                        tStyle={styles.button}
                        onPress={() => this.logout()}
                    />
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        userReducer: state.userReducer
    };
}

WaitForVerify = connect(mapStateToProps)(WaitForVerify);
export default WaitForVerify;
