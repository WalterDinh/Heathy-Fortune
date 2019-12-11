import React from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import { Const } from "helper";
import { types } from "actions/index";
import { ItemListChat } from "components";
import styles from "./styles";
import I18n from "helper/locales";
import { chatActions } from "actions";
const _ = require("lodash");
const width = Const.DEVICE.DEVICE_WIDTH;
const height = Const.DEVICE.DEVICE_HEIGHT;
import firebase from "firebase";

class ListChat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listEventChat: []
        };
        this.refUpdateChanel = firebase.database().ref(`/user-update-message/${props.userReducer.data.id}`);
    }
    componentDidMount() {
        const { userReducer, dispatch, chatReducer } = this.props;
        console.log("userReducer", userReducer);
        dispatch(chatActions.requestListChat());
        this.refUpdateChanel.limitToLast(1).on("child_added", childSnapshot => {
            dispatch(chatActions.requestListChat());
        });
    }

    // async convertAppointmentTime(array) {
    //     let dataArray = [...array];
    //     // let dataArray = [...eventReducer.eventHistory.results, ...listEvent];
    //     let index = 0;
    //     for (const i in dataArray) {
    //         dataArray[i].last_message_time = moment(dataArray[i].last_message_time).unix();
    //         index++;
    //     }
    //     if (index == dataArray.length) {
    //         return dataArray;
    //     }
    // }

    componentDidUpdate(prevProps) {
        const { eventReducer, chatReducer, dispatch } = this.props;
        if (prevProps !== this.props) {
            if (chatReducer.type === types.GET_LIST_CHAT_SUCCESS) {
                let listChat = [];
                chatReducer.dataGroup.results.map(n => {
                    if (!_.isEmpty(n.last_message)) {
                        listChat.push(n);
                    }
                });
                console.log("mimi", listChat);
                this.setState({
                    listEventChat: _.orderBy(listChat, ["last_message_time"], ["asc"])
                });
            }
            if (chatReducer.type === types.CHAT_ROOM_CURRENT_SUCCESS || chatReducer.type === types.SAVE_CHAT_MESSAGE) {
                dispatch(chatActions.requestListChat());
            }
        }
    }

    render() {
        const { navigation, userReducer } = this.props;
        const { listEvent, listChat, listEventChat } = this.state;
        console.log("acacscsacas", listEventChat);
        return (
            <View style={{ zIndex: 1, flex: 1, backgroundColor: "#9599B3" }}>
                {/* <HeaderApp
                    isBack
                    containerStyle={{ zIndex: 5 }}
                    navigation={navigation}
                    title={I18n.t("header.list")}
                /> */}
                <View style={styles.boxList}>
                    <ItemListChat
                        dataEventChat={listEventChat}
                        myProfile={userReducer.data}
                        onPress={item => navigation.navigate("DetailEvent", { item })}
                        onChat={item => navigation.navigate("Chat", { id: item.id, chatRoomInfo: item })}
                    />
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
ListChat = connect(mapStateToProps)(ListChat);
export default ListChat;
