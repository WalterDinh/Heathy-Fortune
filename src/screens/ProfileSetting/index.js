import React from "react";
import { View, KeyboardAvoidingView, ScrollView, TouchableHighlight, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { HeaderTransparent, AppText } from "components";
import { VERSION } from "helper/Consts";
import I18n from "helper/locales";
import styles from "./styles";

class ProfileSetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                <HeaderTransparent
                    navigation={navigation}
                    containerStyle={styles.containerHeader}
                    title={I18n.t("profileSetting.title")}
                />
                <View style={styles.content}>
                    <AppText text={`${I18n.t("profileSetting.version")}(${VERSION})`} />
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
ProfileSetting = connect(mapStateToProps)(ProfileSetting);

export default ProfileSetting;
