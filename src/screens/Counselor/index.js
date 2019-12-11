import React from "react";
import { View, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { AppImage, AppText, Button, HeaderTransparent } from "components";
import styles from "./styles";
import { USER_TYPE } from "helper/Consts";
import { Icon } from "native-base";
import { GlobalStyles, Colors } from "helper";
import I18n from "helper/locales";
import { logoutRequest } from "actions/userActions";
import _ from "lodash";
import { LOGIN_SUCCESS } from "actions/types";
import { userActions } from "actions";
import * as actionType from "../../actions/types";
import { Container } from "components";

class Counselor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: {}
        };
        // props.dispatch(userActions.requestTag());
    }

    componentDidUpdate(prevProps) {
        const { userReducer } = this.props;
        console.log("dataaaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAAAAAA", userReducer.dataUser);
        if (userReducer != prevProps.userReducer) {
            if (userReducer.type == actionType.GET_USER_SUCCESS) {
                // const { dataUser } = userReducer;
                this.setState({ userData: userReducer.dataUser });
            }
        }
    }

    componentDidMount() {
        const { userReducer, dispatch, navigation } = this.props;
        const { dataUser } = userReducer;
        if (!_.isEmpty(navigation.getParam("item")) || !_.isEmpty(navigation.getParam("watch"))) {
            const item = navigation.getParam("item") ? navigation.getParam("item") : navigation.getParam("watch");
            console.log("=====================================");
            console.log("item", item);
            console.log("=====================================");

            // const id = item.id;
            dispatch(userActions.requestUser(item.id));
        } else {
            this.setState({ userData: dataUser });
        }
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
                        {type === USER_TYPE.EXPERT && (
                            <AppText text={I18n.t("profile.expert")} style={styles.address} />
                        )}
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
    renderTitle(nameIcon, title) {
        return (
            <View style={styles.iteamTitle}>
                <View style={{ justifyContent: "center", flex: 1 }}>
                    <Icon name={nameIcon} type="MaterialCommunityIcons" style={styles.itemIcon} />
                </View>
                <View style={{ justifyContent: "center", flex: 6 }}>
                    <AppText text={title} style={styles.textBtn} />
                </View>
            </View>
        );
    }
    renderBody(text) {
        return (
            <View style={styles.iteamTitle}>
                <View style={{ justifyContent: "center", flex: 1 }} />
                <View style={{ justifyContent: "center", flex: 6 }}>
                    {_.isString(text) ? (
                        <AppText text={text} style={styles.text} />
                    ) : (
                        !_.isEmpty(text) &&
                        text.map((item, index) => (
                            <View key={index}>
                                <AppText key={index} text={item.tag_name} style={styles.text} />
                            </View>
                        ))
                    )}
                </View>
            </View>
        );
    }

    onPressBack() {
        const { dispatch, navigation } = this.props;
        // navigation.navigate("NotificationStack");
        navigation.goBack();
        dispatch(userActions.removeUser());
    }
    renderFooter() {
        return (
            <View style={styles.footerWrap}>
                <Button title={I18n.t("Counselor.put")} style={styles.btnSignOut} onPress={() => this.go()} />
            </View>
        );
    }
    go() {
        const { userReducer, navigation } = this.props;
        navigation.navigate("NewEvent", { dataDoctor: userReducer.dataUser });
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
                    <HeaderTransparent
                        onPressBack={() => this.onPressBack()}
                        navigation={navigation}
                        absolute
                        iconStyle={{ color: Colors.Gray_Chateau }}
                        title={I18n.t("Counselor.title")}
                    />
                    <AppImage
                        source={{ uri: img_url ? img_url : "https://i.imgur.com/Htnp2Ra.png" }}
                        style={styles.imageHeader}
                        resizeMode="cover"
                    />
                    <View style={styles.content}>
                        {this.renderHeader()}
                        {this.renderTitle("newspaper", I18n.t("Counselor.spen"))}
                        {this.renderBody(_.isEmpty(userData.tag) ? [] : userData.tag)}
                        {this.renderTitle("map-marker", I18n.t("Counselor.address"))}
                        {this.renderBody(_.isEmpty(userData.address) ? "" : userData.address)}
                        {!_.isEmpty(navigation.getParam("watch")) ? null : this.renderFooter()}
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
Counselor = connect(mapStateToProps)(Counselor);

export default Counselor;
