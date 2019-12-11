import React from "react";
import { View, FlatList, Alert, Platform, AsyncStorage, Keyboard, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import styles from "./styles";
import { HeaderApp, AppText } from "components";
import CardAvatar from "./Component/CardAvatar";
import { chatHistoriesAction, types, alertActions } from "actions";
import { createGroupName, localSearch } from "./Component/Functions";
import I18n from "helper/locales";
import firebase from "firebase";
import { DEVICE, GROUP_TYPE, STRING, PD, CHAT_TYPE } from "helper/Consts";
import FABButton from "./Component/FABButton";
import ModalGroupSelect from "./Component/ModalGroupSelect";
import { Const, Colors } from "helper";
import { getChatRoomDetail, leaveGroupChat } from "actions/chat/chatHistoriesAction";
import OptionFunction from "./Component/OptionFunction";
import chatFn from "../Chat/Functions";
import { Button, Icon, SwipeRow } from "native-base";
import { Swipeable, RectButton } from "react-native-gesture-handler";

// import { SwipeRow } from "react-native-swipe-list-view";

const _ = require("lodash");
const moment = require("moment");
const PAGE_LIMIT = 10;
const END_PAGE = "Invalid page.";
const NUMBER_MESS = 20;

class ChatHistories extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listGroup: [],
            refresh: false,
            page: 1,
            numberOfPage: 1,
            firstTime: true,
            keyboardHeight: 0,
            isVisible: false,
            option: false,
            indexs: [],
            member: [],
            pressNoti: false
        };
        this.refUpdateChanel = firebase.database().ref(`/user-update-message/${props.userReducer.data.id}`);
        this.searchText = "";
        this.listNotificationSilent = [];
        this.swiper = [];
    }

    componentWillMount() {
        let { navigateReducer, navigation } = this.props;
        const firstTime = navigation.getParam("firstTime");
        AsyncStorage.getItem(STRING.NOTI).then(result => {
            if (result) {
                AsyncStorage.removeItem(STRING.NOTI).then(() => {
                    getChatRoomDetail(navigateReducer.roomId).then(res => {
                        const { id } = res.response;
                        if (res.error) {
                        } else {
                            //             if (currentRoot.key == "Chat") {
                            this.params = {
                                routeName: "Chat",
                                params: { id, chatRoomInfo: res.response },
                                key: `${id}-chat`
                            };
                            setTimeout(() => {
                                navigation.navigate(this.params);
                            }, 600);
                        }
                    });
                });
            }
        });
    }

    componentDidMount() {
        // load lai trang khi tu man khac vao
        this.refUpdateChanel.limitToLast(1).on("child_added", childSnapshot => {
            this.onHotReload();
        });
        this.onRefresh();

        // KEYBOARD SHOW EVENT
        this.keyboardWillShowListener = Keyboard.addListener("keyboardDidShow", e => {
            this.setState({ keyboardHeight: e.endCoordinates.height - 60 });
        });

        // KEYBOARD HIDE EVENT
        this.keyboardWillShowListener = Keyboard.addListener("keyboardDidHide", e => {
            this.setState({ keyboardHeight: 0 });
        });

        this.getNotificationSilent();
    }

    componentDidUpdate(prevProps) {
        let { chatHistoriesReducer, navigateReducer, navigation } = this.props;
        let { page, refresh } = this.state;
        if (chatHistoriesReducer !== prevProps.chatHistoriesReducer) {
            if (chatHistoriesReducer.type == types.CHAT_HISTORIES_SUCCESS) {
                let listGroup = chatHistoriesReducer.data.results;
                let numberOfPage = chatHistoriesReducer.data.numberOfPage;
                this.setState({ listGroup, refresh: false, numberOfPage });
            }
            if (chatHistoriesReducer.type == types.CHAT_HISTORIES_FAILED) {
                this.setState({ refresh: false });
            }
        }
        if (prevProps.navigateReducer !== navigateReducer) {
            if (navigateReducer.screen) {
                getChatRoomDetail(navigateReducer.roomId).then(res => {
                    const { id } = res.response;
                    if (res.error) {
                    } else {
                        //             if (currentRoot.key == "Chat") {
                        this.params = {
                            routeName: "Chat",
                            params: { id, chatRoomInfo: res.response },
                            key: `${id}-chat`
                        };
                        setTimeout(() => {
                            navigation.navigate(this.params);
                        }, 600);
                    }
                });
            }
        }
    }

    getNotificationSilent() {
        const { userReducer } = this.props;
        firebase
            .database()
            .ref(`/status/`)
            .orderByChild("id")
            .endAt(userReducer.data.id)
            .limitToLast(1)
            .once("value", childSnapshot => {
                const message = childSnapshot.toJSON();
                let value = message ? Object.values(message) : "";
                value &&
                    value[0].notificationSilent &&
                    (this.listNotificationSilent = Object.values(value[0].notificationSilent));
                this._closeOptionFn();
            });
    }

    updateNotificationSilent() {
        const { userReducer } = this.props;
        let { id } = this.state;
        let arr = [...this.listNotificationSilent];
        if (this.checkNoti()) {
            arr.push(id);
        } else {
            arr.splice(arr.indexOf(id), 1);
        }
        let params = {
            notificationSilent: arr
        };
        if (this.selectedSwiper) {
            this.selectedSwiper.close();
            this.selectedSwiper = null;
        }

        firebase
            .database()
            .ref(`/status/`)
            .orderByChild("id")
            .endAt(userReducer.data.id)
            .limitToLast(1)
            .once("value", childSnapshot => {
                const message = childSnapshot.toJSON();
                let value = message ? Object.values(message) : "";
                if (_.isEmpty(value) || value[0].id != userReducer.data.id) {
                    return;
                } else {
                    const key = Object.keys(message);
                    firebase
                        .database()
                        .ref(`/status/${key[0]}`)
                        .update(params)
                        .then(() => {
                            this.listNotificationSilent = arr;
                            this.setState({
                                id: "",
                                pressNoti: false
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            this.setState({
                                id: "",
                                pressNoti: false
                            });
                        });
                }
            });
    }

    loadGroup(id, page) {
        const { dispatch } = this.props;
        let params = {
            user_id: id,
            page: page
        };
        dispatch(chatHistoriesAction.chatHistoriesRequest(params));
    }

    onEndReached() {
        let { numberOfPage, page, firstTime } = this.state;

        if (firstTime || !_.isEmpty(this.searchText)) {
            this.setState({ firstTime: false });
        } else {
            const { userReducer } = this.props;
            const user = userReducer.data;
            if (page < numberOfPage) {
                page++;
                this.setState({ page }, () => {
                    this.loadGroup(user.id, page);
                });
            } else {
            }
        }
    }

    onHotReload() {
        const { userReducer } = this.props;
        const user = userReducer.data;
        if (!_.isEmpty(this.searchText)) {
            this.searchGroupChat(this.searchText);
        } else {
            this.setState({ page: 1 }, () => {
                this.loadGroup(user.id, 1);
            });
        }
    }

    onRefresh() {
        const { userReducer } = this.props;
        const user = userReducer.data;
        if (!_.isEmpty(this.searchText)) {
            this.searchGroupChat(this.searchText);
        } else {
            this.setState({ page: 1, refresh: true }, () => {
                this.loadGroup(user.id, 1);
            });
        }
    }

    navigateToChat(chatRoom) {
        const { navigation, userReducer, contactReducer } = this.props;
        const { chat_room } = chatRoom;
        const { name, users, type } = chat_room;
        const userData = userReducer.data;
        let dataContact = contactReducer.data.response;
        let { groupName, avatar } = createGroupName(name, users, userData.id, dataContact, type);
        // NAVIGATE TO CHAT SCREEN
        navigation.navigate("Chat", { id: chat_room.id, chatRoomInfo: chatRoom, groupName, avatar });
    }

    showSettingNotification(id, index, member) {
        this.refChannel = firebase.database().ref(`/chat-group/${id}`);
        this.setState(
            {
                // option: true,
                id,
                member
            },
            () => {
                if (this.selectedSwiper && this.selectedSwiper !== this.swiper[index]) {
                    this.selectedSwiper.close();
                }
                this.swiper[index].openRight();
                this.selectedSwiper = this.swiper[index];
            }
        );
    }

    _closeOptionFn() {
        this.setState({
            option: false
        });
    }

    renderItem(item, index) {
        const { userReducer, contactReducer } = this.props;
        const userData = userReducer.data;
        if (_.isEmpty(userData)) {
            return null;
        } else {
            const { chat_room, last_message_seen_index } = item;
            const {
                id,
                last_message_time,
                name,
                users,
                last_message,
                last_message_index,
                last_message_type,
                type
            } = chat_room;

            let time = last_message_time;
            let dataContact = contactReducer.data.response;
            let covertData = createGroupName(name, users, userData.id, dataContact, type);
            let groupName = covertData.groupName;
            let source = covertData.avatar;
            let unreadMessage = last_message_index - last_message_seen_index;
            return (
                <CardAvatar
                    userId={userData.id}
                    messageType={last_message_type}
                    chatRoom={chat_room}
                    time={time}
                    source={source}
                    groupName={groupName}
                    lastMessage={last_message}
                    unreadMessage={unreadMessage}
                    onPress={() => this.navigateToChat(item)}
                    onLongPress={() => this.showSettingNotification(id, index, users)}
                    notificationSilent={this.listNotificationSilent.indexOf(id) > -1}
                    loadingNotiSilent={id == this.state.id && this.state.pressNoti}
                />
            );
        }
    }

    searchGroupChat(e) {
        let { userReducer } = this.props;
        let param = {
            search: e.trim(),
            user_id: userReducer.data.id,
            type: ""
        };
        this.setState({ refresh: true }, () => {
            chatHistoriesAction.searchGroupChat(param).then(response => {
                if (response.error) {
                } else {
                    this.setState({ listGroup: response.response });
                }
                this.setState({ refresh: false });
            });
        });
    }

    closeSwiper() {
        this.selectedSwiper ? this.selectedSwiper.close() : null;
        this.selectedSwiper = "";
    }

    onChangeText(e) {
        let { chatHistoriesReducer } = this.props;
        let listGroup = chatHistoriesReducer.data.results;
        this.closeSwiper();

        if (!_.isEmpty(e)) {
            this.searchText = e.trim();
            this.searchGroupChat(e);
        } else {
            this.searchText = "";
            this.setState({ listGroup });
        }
    }

    emptyList() {
        let { refresh } = this.state;
        return (
            !refresh && (
                <View style={styles.containerEmpty}>
                    <AppText text={I18n.t("chat.emptyList")} style={styles.emptyText} />
                    <AppText text={I18n.t("chat.suggest")} style={styles.emptySuggest} />
                </View>
            )
        );
    }

    toggleModal() {
        const { isVisible } = this.state;
        this.setState({ isVisible: !isVisible });
    }

    onCreatedRoomSuccess(id, chatRoomInfo) {
        let { navigation } = this.props;
        this.setState({ isVisible: false }, () => {
            setTimeout(() => {
                navigation.navigate("Chat", { id, chatRoomInfo });
            }, 100);
        });
    }

    onCreatedRoomError() {
        const { dispatch } = this.props;
        this.setState({ isVisible: false }, () => {
            setTimeout(() => {
                const paramsAlert = {
                    content: I18n.t("Alert.createChatGroupError"),
                    title: I18n.t("Alert.notice"),
                    type: Const.ALERT_TYPE.ERROR
                };
                dispatch(alertActions.openAlert(paramsAlert));
            }, 500);
        });
    }

    checkNoti() {
        let { id } = this.state;
        return this.listNotificationSilent.indexOf(id) < 0;
    }

    onPressNoti() {
        this.setState({ pressNoti: true }, () => {
            this.updateNotificationSilent();
            this._closeOptionFn();
        });
    }

    sendTofirebase(systemMess) {
        const { id } = this.state;
        firebase
            .database()
            .ref(`/chat-group/${id}`)
            .push(systemMess[0])
            .then(data => {
                const item = Object.values(data.toJSON());
            })
            .catch(error => console.log("error", error));
    }

    sendSystemMessageToRoom(type, memberInfo) {
        const { id, member } = this.state;
        const { userReducer } = this.props;
        const user = chatFn.converUser(userReducer.data);
        const userDetail = userReducer.data.user;
        const name = `${userDetail.first_name} ${userDetail.last_name}`;
        firebase
            .database()
            .ref(`/chat-group/${id}`)
            .limitToLast(1)
            .once("value")
            .then(data => {
                // TODO: GET LAST MESSAGE INDEX
                let last_message_index = 0;
                if (_.isEmpty(data.toJSON())) {
                    last_message_index = 0;
                } else {
                    const item = Object.values(data.toJSON());
                    last_message_index = item[0].index;
                }
                let systemMess = "";
                switch (type) {
                    case CHAT_TYPE.LEAVE_ROOM:
                        systemMess = chatFn.convertSystemLeaveRoom(name, user, last_message_index, member);
                        this.sendTofirebase(systemMess);
                        break;
                    default:
                        break;
                }
            });
    }

    async onLeaveGroup() {
        const { id } = this.state;
        const { userReducer, dispatch, navigation } = this.props;
        const userId = userReducer.data.id;
        const response = await leaveGroupChat(id, userId);
        if (response.error) {
            const paramsAlert = {
                content: I18n.t("Alert.leaveGroupChatError"),
                title: I18n.t("Alert.notice"),
                type: Const.ALERT_TYPE.ERROR
            };
            dispatch(alertActions.openAlert(paramsAlert));
        } else {
            if (this.selectedSwiper) {
                this.selectedSwiper.close();
                this.selectedSwiper = null;
            }
            this.onRefresh();
            let createdAt = moment.utc().valueOf();
            this.sendSystemMessageToRoom(CHAT_TYPE.LEAVE_ROOM, []);
            firebase
                .database()
                .ref(`/user-update-message/${userId}`)
                .push({ createdAt })
                .then(data => {
                    // navigation.navigate("ChatHistories");
                })
                .catch(error => {
                    console.log("error ", error);
                });
        }
    }

    _funcNotification() {
        const noti = this.checkNoti();
        Alert.alert(I18n.t("Alert.notice"), noti ? I18n.t("Alert.requestOff") : I18n.t("Alert.requestOn"), [
            {
                text: I18n.t("Alert.cancel"),
                style: "cancel"
            },
            { text: "OK", onPress: () => this.onPressNoti() }
        ]);
    }

    _funcLeaveGroup() {
        Alert.alert(I18n.t("Alert.notice"), I18n.t("Alert.askDeleteGroup"), [
            {
                text: I18n.t("Alert.cancel"),
                style: "cancel"
            },
            { text: "OK", onPress: () => this.onLeaveGroup() }
        ]);
    }

    _pressFunction(func) {
        setTimeout(() => {
            switch (func) {
                case "notification":
                    this._funcNotification();
                    break;
                case "leave":
                    this._funcLeaveGroup();
                    break;
                default:
                    break;
            }
        }, 100);
    }

    renderRight() {
        const notification = this.checkNoti();
        return (
            <View style={styles.functionWrap}>
                <TouchableOpacity
                    onPress={() => this._pressFunction("notification")}
                    style={{ justifyContent: "center", alignItems: "center", paddingLeft: PD.PADDING_2 }}
                >
                    <Icon
                        name={notification ? "ios-notifications-off" : "ios-notifications"}
                        style={{ color: notification ? Colors.RED_COLOR : Colors.MAIN_COLOR }}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => this._pressFunction("leave")}
                    style={{ justifyContent: "center", alignItems: "center", paddingLeft: PD.PADDING_2 }}
                >
                    <Icon name={"ios-trash"} style={{ color: Colors.RED_COLOR }} />
                </TouchableOpacity>
            </View>
        );
    }

    onRowOpen(item, index) {
        this.setState({ id: item.chat_room.id }, () => {});
    }

    renderSwipeRow(item, index) {
        return (
            <Swipeable
                renderLeftActions={() => {}}
                ref={ref => (this.swiper[index] = ref)}
                renderRightActions={() => this.renderRight()}
                rightThreshold={-75}
                onSwipeableWillOpen={() => {
                    if (this.selectedSwiper && this.selectedSwiper !== this.swiper[index]) {
                        this.selectedSwiper.close();
                    }
                    this.selectedSwiper = this.swiper[index];
                }}
                onSwipeableOpen={() => this.onRowOpen(item, index)}
            >
                {this.renderItem(item, index)}
            </Swipeable>
        );
    }

    render() {
        let { listGroup, refresh, keyboardHeight, isVisible, option } = this.state;
        let { navigation } = this.props;
        return (
            <View style={styles.container}>
                <HeaderApp
                    isSearch
                    title={I18n.t("chat.header")}
                    navigation={navigation}
                    rightOnPress={e => this.onChangeText(e)}
                />
                <View style={{ flex: 1, backgroundColor: Colors.CONTENT_COLOR }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={listGroup}
                        contentContainerStyle={{ paddingBottom: keyboardHeight }}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={listGroup}
                        onEndReached={() => this.onEndReached()}
                        onEndReachedThreshold={Platform.OS == "android" ? 0.1 : 0}
                        renderItem={({ item, index }) => this.renderSwipeRow(item, index)}
                        refreshing={refresh}
                        onRefresh={() => this.onRefresh()}
                        ListEmptyComponent={() => this.emptyList()}
                    />
                </View>
                <FABButton onPress={() => this.toggleModal()} />
                <ModalGroupSelect
                    isVisible={isVisible}
                    leftOnPress={() => this.toggleModal()}
                    onCreatedRoomSuccess={(id, chatRoomInfo) => this.onCreatedRoomSuccess(id, chatRoomInfo)}
                    onCreatedRoomError={() => this.onCreatedRoomError()}
                />

                {/* <OptionFunction
                    visible={option}
                    closeOption={() => this._closeOptionFn()}
                    notification={this.checkNoti()}
                    onPressNoti={() => this.onPressNoti()}
                    onPressLeave={() => this.onLeaveGroup()}
                    // message={selectedMess}
                    // mine={mine}
                    // roomId={roomId}
                    // ondeleted={() => this._updateMessage()}
                /> */}
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        userReducer: state.userReducer,
        chatHistoriesReducer: state.chatHistoriesReducer,
        contactReducer: state.contactReducer,
        navigateReducer: state.navigateReducer
    };
}
ChatHistories = connect(mapStateToProps)(ChatHistories);
export default ChatHistories;
