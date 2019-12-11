import React from "react";
import { View, ImageBackground, AsyncStorage, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { Const, Helper, Colors } from "helper";
import { types, userActions } from "actions/index";
import {
    Container,
    Button,
    AppImage,
    ItemListChat,
    Input,
    HeaderApp,
    AppText,
    HeaderTransparent,
    ItemBorder
} from "components";
import { DIMENSION, DEVICE, PD } from "helper/Consts";
import styles from "./styles";
import { ICON, FONT_SF, Images } from "assets";
import I18n from "helper/locales";
import { requestLogin, eventActions, chatActions } from "actions";
import CountryPicker from "react-native-country-picker-modal";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Header } from "react-navigation";
const moment = require("moment");
const width = Const.DEVICE.DEVICE_WIDTH;
const height = Const.DEVICE.DEVICE_HEIGHT;

class Adivisory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listEventChat: props.eventReducer.eventInactive.results
        };
    }
    componentDidMount() {
        const { userReducer, dispatch, chatReducer } = this.props;
        console.log("userReducer", userReducer);
        // dispatch(eventActions.eventRequest({ status: 0 }));
    }
    componentDidUpdate(prevProps) {
        const { eventReducer, chatReducer, dispatch } = this.props;
        if (prevProps !== this.props) {
            if (eventReducer.type === types.GET_EVENT_SUCCESS) {
                this.setState({
                    listEventChat: eventReducer.eventInactive.results
                });
            }
        }
    }

    render() {
        const { navigation, userReducer } = this.props;
        const { listEvent, listChat, listEventChat } = this.state;
        console.log("acacscsacas", listEventChat);
        return (
            <View style={{ zIndex: 1, flex: 1, backgroundColor: "#9599B3" }}>
                <HeaderApp
                    isBack
                    containerStyle={{ zIndex: 5 }}
                    navigation={navigation}
                    title={I18n.t("header.list")}
                />
                <View
                    style={{
                        zIndex: 2,
                        width: "100%",
                        maxHeight: "100%"
                    }}
                >
                    <ItemListChat
                        dataEventChat={listEventChat}
                        myProfile={userReducer.data}
                        onPress={item => navigation.navigate("DetailEvent", { eventWating: item })}
                        onChat={item => navigation.navigate("Chat", { id: item.id, chatRoomInfo: item })}
                    />
                    {/* <ItemListChat
                        dataChat={listChat}
                        myProfile={userReducer.data}
                        onPress={item => navigation.navigate("Chat", { id: item.id, chatRoomInfo: item })}
                    /> */}
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        userReducer: state.userReducer,
        eventReducer: state.eventReducer,
        chatReducer: state.chatReducer
    };
}
Adivisory = connect(mapStateToProps)(Adivisory);
export default Adivisory;
