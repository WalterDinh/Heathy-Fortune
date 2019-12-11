import React from "react";
import {
    View,
    ImageBackground,
    AsyncStorage,
    KeyboardAvoidingView,
    TouchableOpacity,
    RefreshControl,
    Platform,
    ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import { Const, Helper, Colors } from "helper";
import { types, userActions, eventActions, chatActions } from "actions/index";
import { Container, Button, AppImage, Input, HeaderApp, AppText, HeaderTransparent, ItemListHistory } from "components";
import { DIMENSION, DEVICE, PD } from "helper/Consts";
import styles from "./styles";
import { ICON, FONT_SF, Images } from "assets";
import I18n from "helper/locales";
import { requestLogin } from "actions/loginActions";
import CountryPicker from "react-native-country-picker-modal";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Header } from "react-navigation";
import { Fab, Icon } from "native-base";
import firebase from "firebase";
import _ from "lodash";
import { FlatList } from "react-native-gesture-handler";
// import StarRating from 'react-native-star-rating';

const width = Const.DEVICE.DEVICE_WIDTH;
const height = Const.DEVICE.DEVICE_HEIGHT;
const moment = require("moment");
class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listEvent: [],
            page: 1,
            loading: false,
            refreshing: false
        };
        this.page = 1;
    }
    async componentWillMount() {
        this.firebaseA = firebase
            .database()
            .ref(`video-call/${this.props.userReducer.data.id}`)
            .limitToLast(1)
            .on("child_added", childSnapshot => {
                let lastItem = childSnapshot.toJSON();
                const { to, caller, status } = lastItem;
                const userRe = this.props.userReducer || {};
                console.log("lastItem___________", lastItem);
                if (status === "dialing") {
                    const { data = {}, type = "" } = userRe;
                    const { id: myId = 0 } = data;
                    // getUserData()
                    if (to === myId && !!userRe && type !== "LOGOUT" && !!data) {
                        // const { settingReducer = {} } = this.props;
                        // const { data = {} } = settingReducer;
                        const data = {
                            soundCall: true,
                            vibrationCall: true,
                            onlineStatus: true
                        };
                        const { soundCall = true, vibrationCall = true, onlineStatus = true } = data;
                        // console.log("test reducer", settingReducer, soundCall, vibrationCall);
                        // if (!!settingReducer && onlineStatus) {
                        // ServiceHandle.get(`call_log_user/${userRe.data.id}/`)
                        //     .then(res => {
                        //         if (!res.error) {
                        //             lastItem.isRingtone = soundCall;
                        //             lastItem.isCallVibration = vibrationCall;
                        this.props.navigation.push("IncomingCall", {
                            callData: lastItem
                        });
                        //         }
                        //     })
                        //     .catch(e => {
                        //         console.log("error get call", e);
                        //     });
                        // }
                    }
                }
                if (status === "finished" && !!userRe && !!userRe.data) {
                    firebase
                        .database()
                        .ref(`video-call/${userRe.data.id}`)
                        .remove();
                }
            });

        this.convertAppointmentTime(this.props.eventReducer.eventHistory.results).then(response => {
            this.setState({
                listEvent: _.orderBy(response, ["appointment_time_new"], ["asc"])
            });
        });
    }

    async convertAppointmentTime(array) {
        let dataArray = [...array];
        // let dataArray = [...eventReducer.eventHistory.results, ...listEvent];
        let index = 0;
        for (const i in dataArray) {
            dataArray[i].appointment_time_new = moment(dataArray[i].appointment_time).unix();
            index++;
        }
        if (index == dataArray.length) {
            return dataArray;
        }
    }

    // componentDidMount() {
    //     const { userReducer, dispatch } = this.props;
    //     console.log("userReducer", userReducer);
    //     dispatch(eventActions.getHistoryEvent({ appointment_timestamp__gte: moment().unix() }));
    // }
    componentDidUpdate(prevProps) {
        const { eventReducer, dispatch, navigation, chatReducer } = this.props;
        const { refreshing, loading, listEvent } = this.state;
        if (prevProps !== this.props) {
            if (eventReducer.type === types.GET_EVENT_SUCCESS) {
                this.convertAppointmentTime(eventReducer.eventHistory.results).then(response => {
                    this.setState({
                        listEvent: _.orderBy(response, ["appointment_time_new"], ["asc"])
                    });
                });
                // this.setState({
                //     listEvent: _.orderBy(eventReducer.eventHistory.results, ["appointment_time"], ["asc"])
                // });
            }
            if (eventReducer.type === types.GET_HISTORY_SUCCESS) {
                let dataArray = [...eventReducer.eventHistory.results, ...listEvent];
                this.convertAppointmentTime(dataArray).then(response => {
                    this.setState({
                        listEvent: _.orderBy(response, ["appointment_time_new"], ["asc"])
                    });
                });
            }
        }
    }

    _onPressItem(item) {
        console.log("item", item);
        const { navigation } = this.props;
        navigation.navigate("DetailEvent", { historyDetail: item });
    }

    getSender = item => {
        const { userReducer } = this.props;
        let sender = [];

        item.map(i => {
            if (i.id != userReducer.data.id) sender.push({ user_ids: i.id });
        });
        console.log("item", sender);
        return sender;
    };
    _onChat(item) {
        const { userReducer, dispatch, eventReducer } = this.props;
        const param = {
            user_ids: this.getSender(item.member),
            name: item.title
        };
        console.log("_onChat", param);
        dispatch(chatActions.requestCreateGroupChat(param));
    }

    _onNextPage() {
        const { userReducer, dispatch, eventReducer } = this.props;
        const countPage = Math.ceil(eventReducer.eventHistory.count / 10);
        console.log("userReducer", countPage, eventReducer.eventHistory.count);
        if (this.page < countPage) {
            // this.page = this.page + 1;
            // let param = {
            //     page2: this.state.page + 1
            // };
            let page = this.state.page + 1;
            this.setState({ page: page }, () => {
                // dispatch(getTeacherRequest(param));
                dispatch(eventActions.eventRequest({ page2: page }));
            });
            // dispatch(eventActions.eventRequest({ page2: this.page }));
        }
    }

    // onEndReachedTeacher(page) {
    //     const { dispatch } = this.props;
    //     let param = {
    //         type: 1,
    //         search: this.valueSearch.toLowerCase(),
    //         page: page + 1
    //     };
    //     this.setState({ page: page + 1, footer: true }, () => {
    //         dispatch(getTeacherRequest(param));
    //     });
    // }

    render() {
        const { navigation, eventReducer, userReducer } = this.props;
        const { listEvent, loading } = this.state;
        console.log("listEventlistEventlistEventlistEventlistEventlistEvent", listEvent);
        return (
            <View style={{ zIndex: 1, flex: 1, backgroundColor: "#9599B3" }}>
                <HeaderApp isBack containerStyle={{ zIndex: 5 }} navigation={navigation} title="Lịch sử" />
                <View
                    style={{
                        // marginTop: DIMENSION.NEW_HEADER_HEIGHT/4,
                        zIndex: 2,
                        width: "100%",
                        maxHeight: "100%"
                    }}
                >
                    <FlatList
                        style={styles.container}
                        data={listEvent}
                        // initialScrollIndex={listEvent.length == 2 || listEvent.length == 3 ? 0 : listEvent.length - 1}
                        showsVerticalScrollIndicator={false}
                        // getItemLayout={(dataEventChat, index) => ({
                        //     length: DEVICE.DEVICE_WIDTH,
                        //     offset: DEVICE.DEVICE_WIDTH * index,
                        //     index
                        // })}
                        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => this._onNextPage()} />}
                        keyExtractor={(item, index) => index.toString()}
                        // refreshing={loading}
                        // onRefresh={() => this._onNextPage()}
                        inverted
                        renderItem={({ item, index }) => (
                            <ItemListHistory
                                data={item}
                                index={index}
                                onPress={item => this._onPressItem(item)}
                                lastIndex={listEvent.length - 1}
                                myInfo={userReducer.data}
                            />
                        )}
                    />
                </View>
            </View>
        );
    }
    renderDone() {
        const { classReducer, userReducer } = this.props;
        const { currentSearchClass } = classReducer;
        const { comment, rating, checkRating, notification } = this.state;
        // Alert.alert('asdasd',JSON.stringify( comment));
        return (
            <View style={styles.content}>
                <View style={styles.vote}>
                    <AppText text={I18n.t("class.vote")} style={styles.textVote} />
                    <View style={[styles.rating, Styles.ViewStyle.shadowStyle]}>
                        {checkRating ? (
                            <StarRating
                                isRated
                                starSize={18}
                                rating={parseFloat(rating)}
                                disabled={checkRating}
                                onRating={rating => this.setState({ rating })}
                            />
                        ) : (
                            <StarRating
                                starSize={18}
                                rating={parseFloat(rating)}
                                onRating={rating => this.setState({ rating })}
                            />
                        )}
                        <AppText text={`  ${rating} ${I18n.t("class.star")}`} style={styles.distance} />
                    </View>
                </View>
                <View style={styles.sendComent}>
                    <AppText text={I18n.t("class.comment")} style={styles.textVote} />
                    <View style={[styles.inputContainer, Styles.ViewStyle.shadowStyle]}>
                        <TextInput
                            style={styles.inputs}
                            multiline
                            editable={!checkRating}
                            placeholderTextColor={Colors.TEXT_INPUT}
                            onChangeText={comment => this.setState({ comment })}
                            value={comment}
                        />
                    </View>
                </View>
                <AppText text={notification} style={styles.notificationText} />
                {checkRating ? null : (
                    <Button
                        isShadow
                        style={styles.buttonConfirm}
                        title={I18n.t("class.confirm")}
                        titleColor={Colors.TEXT_LOGIN}
                        onPress={() => this.onSendReview()}
                    />
                )}
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
History = connect(mapStateToProps)(History);
export default History;
