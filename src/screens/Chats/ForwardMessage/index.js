import React from "react";
import { View, Keyboard, Platform, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { Container } from "native-base";

import ShareContact from "./ShareContact";
import ShareRecently from "./ShareRecently";
import { HeaderApp, AppImage, AppText } from "components";
import I18n from "helper/locales";
import { Colors } from "helper";
import { ICON } from "assets";
import styles from "./styles";

class ForwardMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabId: I18n.t("tabbar.groupChat"),
            onTab: true,
            valueSearch: ""
        };
    }

    renderContent() {
        return this.renderTabContent();
    }

    // componentDidMount() {
    //     Toast.show({
    //         text: "Wrong password!",
    //         buttonText: "Okay",
    //         type: "success"
    //     });
    // }

    renderTabContent() {
        const { tabId, valueSearch } = this.state;
        switch (tabId) {
            case I18n.t("tabbar.groupChat"):
                return <ShareRecently {...this.props} search={valueSearch} />;
            case I18n.t("tabbar.contactNumber"):
                return <ShareContact {...this.props} search={valueSearch} />;
            default:
                return <ShareRecently {...this.props} search={valueSearch} />;
        }
    }

    _selectedTab(tabId) {
        this.setState({ tabId, onTab: false, valueSearch: "" });
    }

    renderTabbar(onPressTab, source1, source2, tabName) {
        // const { isActive } = this.state;
        const { tabId } = this.state;
        return (
            <TouchableOpacity style={[styles.regularTab]} onPress={() => onPressTab()}>
                <AppImage
                    local
                    style={{ width: 20, height: 20 }}
                    resizeMode="contain"
                    source={tabName == tabId ? source1 : source2}
                />
                <AppText
                    style={[styles.tabTitle, { color: tabName == tabId ? "white" : "gray" }]}
                    text={tabName.toUpperCase()}
                />
            </TouchableOpacity>
        );
    }

    renderFooter() {
        const { tabId } = this.state;
        return (
            <View style={styles.containerTabbar}>
                {this.renderTabbar(
                    () => this._selectedTab(I18n.t("tabbar.groupChat")),
                    ICON.GROUP_ACTIVE,
                    ICON.GROUP_INACTIVE,
                    I18n.t("tabbar.groupChat")
                )}
                {this.renderTabbar(
                    () => this._selectedTab(I18n.t("tabbar.contactNumber")),
                    ICON.contact_active,
                    ICON.contact_inactive,
                    I18n.t("tabbar.contactNumber")
                )}
            </View>
        );
    }

    render() {
        const { navigation } = this.props;
        const { onTab, valueSearch } = this.state;
        console.log("valueSearch", valueSearch);
        return (
            <Container style={{ backgroundColor: Colors.SKY_BLUE }}>
                <HeaderApp
                    changeTab={true}
                    isSearch={onTab}
                    title={I18n.t("forwardMessage.forwardMessage")}
                    navigation={navigation}
                    onChangeText={value => this.setState({ valueSearch: value })}
                    isBack
                    rightOnPress={() => this.setState({ onTab: true })}
                />
                {this.renderContent()}
                {/* {this.renderFooter()} */}
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {};
}
ForwardMessage = connect(mapStateToProps)(ForwardMessage);
export default ForwardMessage;
