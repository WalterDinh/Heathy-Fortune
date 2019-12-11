import React from "react";
import { View, FlatList, TouchableOpacity, TextInput } from "react-native";
import { connect } from "react-redux";
import { AppText } from "components";
import styles from "./styles";
import { DIMENSION, DEVICE, PD } from "helper/Consts";
import { Icon, Fab } from "native-base";
import { Colors, Convert } from "helper";
import I18n from "helper/locales";
import _ from "lodash";
import { types, sampleChatActions, chatHistoriesAction } from "actions";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { FONT_SF } from "assets";
import moment from "moment";
import chatFn from "../Chat/Functions";
import firebase from "firebase";
class SampleQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            title: "",
            keyboardHeight: 10,
            data: [],
            list: []
        };
        this.flatlist = 1;
        this.user = chatFn.converUser(props.userReducer.data);
    }

    componentDidMount() {
        const { dispatch, navigation, chatSampleReducer, userReducer } = this.props;
        this.setState({ loading: true });
        dispatch(sampleChatActions.requestSampleChat(userReducer.data.id));
        // this.setState({
        //     data: chatSampleReducer.dataSample.response.results,
        //     list: chatSampleReducer.dataSample.response.results
        // });
    }

    componentDidUpdate(prevProps) {
        const { userReducer, chatSampleReducer } = this.props;
        if (prevProps !== this.props) {
            if (chatSampleReducer.type === types.GET_SAMPLE_CHAT_SUCCESS) {
                console.log("vào đây");

                this.setState({
                    data: chatSampleReducer.dataSample.response.results,
                    list: chatSampleReducer.dataSample.response.results
                });
            }
        }
    }

    // _onRefresh

    _onSearch(text) {
        const { list } = this.state;
        let dataSearch = list.filter(el => {
            let valueSearch = Convert.removeDiacritics(text.trim()).toUpperCase();
            let title = Convert.removeDiacritics(el.title).toUpperCase();
            return title.includes(valueSearch);
        });
        this.setState({ data: dataSearch });
    }

    _onPressBack() {
        this.props.navigation.goBack();
    }

    _goNewEvent() {
        const { navigation } = this.props;
        navigation.navigate("NewSampleQuestion");
    }

    renderHead() {
        const { title } = this.state;
        return (
            <View style={styles.containerHeader}>
                <View style={{ flexDirection: "column", height: DEVICE.DEVICE_HEIGHT * 0.17 }}>
                    <View
                        style={{
                            paddingTop: DIMENSION.NEW_HEADER_HEIGHT * 0.08,
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                    >
                        <TouchableOpacity onPress={() => this._onPressBack()} style={{ flex: 1 }}>
                            <Icon name="chevron-left" type="MaterialCommunityIcons" />
                        </TouchableOpacity>
                        <TextInput
                            style={{
                                height: 45,
                                flex: 6,
                                fontSize: responsiveFontSize(2.0),
                                textAlign: "right",
                                marginHorizontal: PD.PADDING_4
                            }}
                            placeholder="Tìm kiếm"
                            onChangeText={value => this._onSearch(value)}
                            // value={value}
                        />
                        <View style={{ flex: 1 }}>
                            <Icon name="magnify" type="MaterialCommunityIcons" />
                        </View>
                    </View>
                    <View style={styles.contentWrap}>
                        <View style={{ flex: 1, marginLeft: PD.PADDING_6 }}>
                            <AppText
                                numberOfLines={2}
                                text="Trả Lời"
                                style={{ fontSize: responsiveFontSize(3.0), fontFamily: FONT_SF.BOLD }}
                            />
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    _updateLastMessage(messages) {
        const { chatHistoriesReducer, navigation } = this.props;
        const { currentRoom } = chatHistoriesReducer;
        const { id } = currentRoom;
        let params = chatFn.lastMessParam(messages, id, this.user, messages.index).lastMessage;
        chatHistoriesAction.updateLastMessage(params).then(() => {
            navigation.goBack();
        });
    }

    _sendMs(item) {
        const { chatHistoriesReducer } = this.props;
        const { currentRoom } = chatHistoriesReducer;
        const { last_message_index } = currentRoom;
        const { description } = item;
        const message = chatFn.convertMessage(description, this.user, last_message_index);
        this.refChannel = firebase
            .database()
            .ref(`/chat-group/${currentRoom.id}`)
            .push(message[0])
            .then(res => {
                this._updateLastMessage(message[0]);
            })
            .catch(error => console.log("error", error));
    }

    renderCard(item) {
        return (
            <TouchableOpacity
                onPress={() => this._sendMs(item)}
                style={{
                    borderRadius: DEVICE.DEVICE_HEIGHT * 0.05,
                    backgroundColor: Colors.WHITE_COLOR,
                    flexDirection: "column",
                    padding: DEVICE.DEVICE_HEIGHT * 0.03,
                    marginVertical: PD.PADDING_4
                }}
            >
                <AppText text={item.title} style={{ fontSize: responsiveFontSize(2.25), fontFamily: FONT_SF.BOLD }} />
                <AppText text={item.description} style={{ fontSize: responsiveFontSize(1.75) }} />
            </TouchableOpacity>
        );
    }

    renderBody() {
        const { keyboardHeight, data } = this.state;
        return (
            <FlatList
                // initialNumToRender={initialRender}
                ref={ref => (this.flatlist = ref)}
                contentContainerStyle={{ paddingBottom: keyboardHeight }}
                showsVerticalScrollIndicator={false}
                data={data}
                extraData={this.state}
                renderItem={({ item }) => this.renderCard(item)}
                keyExtractor={(item, index) => `${index}`}
                // refreshing={refresh}
                // onRefresh={() => this._onRefresh()}
                // ListEmptyComponent={this.renderEmptyStudent()}
            />
        );
    }

    render() {
        const { value, list } = this.state;
        console.log("list", list);
        return (
            <View style={{ backgroundColor: Colors.Athens_Gray, flex: 1, flexDirection: "column" }}>
                {this.renderHead()}
                <View style={{ paddingHorizontal: "5%", flexDirection: "column", flex: 1 }}>{this.renderBody()}</View>
                <Fab
                    active={true}
                    direction="up"
                    containerStyle={{ zIndex: 8 }}
                    style={{ backgroundColor: Colors.Hopbush }}
                    position="bottomRight"
                    onPress={() => this._goNewEvent()}
                >
                    <Icon name="add" style={{ color: "#fff" }} />
                </Fab>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        userReducer: state.userReducer,
        chatSampleReducer: state.chatSampleReducer,
        chatHistoriesReducer: state.chatHistoriesReducer
    };
}
SampleQuestion = connect(mapStateToProps)(SampleQuestion);

export default SampleQuestion;
