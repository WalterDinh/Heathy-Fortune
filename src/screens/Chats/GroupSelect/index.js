import React from "react";
import { View, FlatList, TextInput, Platform } from "react-native";
import { connect } from "react-redux";
import _ from "lodash";
import { Spinner, Icon } from "native-base";

import styles from "./styles";
import CardGroup from "./Component/CardGroup";
import { HeaderApp, AppText } from "components";
import I18n from "helper/locales";
import { chatHistoriesAction } from "actions";
import { Colors } from "helper";
import { GROUP_TYPE, DIMENSION, PD } from "helper/Consts";
import { addMemberToChat } from "actions/chat/chatHistoriesAction";
import { responsiveFontSize } from "react-native-responsive-dimensions";

const moment = require("moment");

class GroupSelect extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            idArray: [props.userReducer.id],
            groupName: "",
            isLoading: false,
            contactState: this.convertContact(),
            errorMess: "",
            spinner: true
        };
        this.contactForSearch = this.convertContact();
    }

    convertContact() {
        const { member, contactReducer } = this.props;
        let mainArray = [];
        if (_.isEmpty(member)) {
            mainArray = contactReducer;
        } else {
            for (let i in contactReducer) {
                const index = _.findIndex(member, o => {
                    return o.id == contactReducer[i].about_user.id;
                });
                if (index < 0) {
                    mainArray.push(contactReducer[i]);
                }
            }
        }
        return mainArray;
    }

    onPressGroupCard(id) {
        let { idArray } = this.state;
        const index = _.findIndex(idArray, o => {
            return o == id;
        });
        if (index > -1) {
            idArray.splice(index, 1);
        } else {
            idArray.push(id);
        }
        this.setState({ idArray });
    }

    createdRoom() {
        const { idArray, groupName } = this.state;
        const { onCreatedRoomSuccess = () => {}, onCreatedRoomError = () => {} } = this.props;
        this.setState({ isLoading: true }, async () => {
            let last_message_time = moment()
                .utc()
                .format("YYYY-MM-DDTHH:mm:ss.SSSSSS");
            let params = {};
            if (idArray.length == 2) {
                params = _.isEmpty(groupName.trim())
                    ? { user_ids: idArray, last_message_time, type: GROUP_TYPE.PRIVATE }
                    : { user_ids: idArray, last_message_time, type: GROUP_TYPE.PRIVATE, name: groupName };
            } else {
                params = _.isEmpty(groupName.trim())
                    ? { user_ids: idArray, last_message_time, type: GROUP_TYPE.GROUP }
                    : { user_ids: idArray, last_message_time, type: GROUP_TYPE.GROUP, name: groupName };
            }
            let data = await chatHistoriesAction.createdGroupChat(params);

            if (!data.error) {
                this.setState({ isLoading: false }, () => {
                    let chatRoomInfo = data.response;
                    let id = data.response.chat_room.id;
                    onCreatedRoomSuccess(id, chatRoomInfo);
                    // navigation.navigate("Chat", { id, chatRoomInfo: data.response, groupName, avatar });
                });
            } else {
                this.setState({ isLoading: false }, () => {
                    onCreatedRoomError();
                });
            }
        });
    }

    async addMemberToGroup() {
        const { chatRoomInfo, contactReducer, onAddMemberSuccess = () => {} } = this.props;
        const { idArray } = this.state;
        let memberInfo = [];
        let arrSend = [];
        for (let index = 1; index < idArray.length; index++) {
            const element = idArray[index];
            const index = _.findIndex(contactReducer, function(o) {
                return o.about_user.id == element;
            });
            if (index > -1) {
                const { user } = contactReducer[index].about_user;
                const name = user.first_name + " " + user.last_name;
                memberInfo.push(name);
            }
            arrSend.push(element);
        }
        const { id } = chatRoomInfo;
        console.log("id", chatRoomInfo);

        const body = { user_ids: arrSend, chat_room_id: id };
        const response = await addMemberToChat(id, body);
        if (response.error) {
            onAddMemberFailed();
        } else {
            console.log("12212", memberInfo);

            onAddMemberSuccess(memberInfo);
        }
    }

    rightOnPress() {
        const { member, userReducer } = this.props;
        const { idArray } = this.state;

        if (_.isEmpty(member)) {
            if (idArray.length >= 3) {
                if (userReducer.type == 0) {
                    this.setState({ errorMess: I18n.t("chat.noAuthorities") }, () => {
                        setTimeout(() => {
                            this.setState({ errorMess: "" });
                        }, 3000);
                    });
                } else {
                    this.setState({ errorMess: "" }, () => {
                        this.createdRoom();
                    });
                }
            } else {
                this.createdRoom();
            }
        } else {
            this.addMemberToGroup();
        }
    }

    searchContact(e) {
        const contactReducer = this.contactForSearch;
        this.setState({ searchText: e });
        if (!_.isEmpty(e.trim())) {
            const searchTxt = e.toLowerCase().trim();
            let mainArray = [];
            for (let i in contactReducer) {
                const phoneNumber = contactReducer[i].about_user.phone_number.toLowerCase();
                const nickName = contactReducer[i].nickname.toLowerCase();
                if (_.includes(nickName, searchTxt) || _.includes(phoneNumber, searchTxt)) {
                    mainArray.push(contactReducer[i]);
                }
            }
            this.setState({ contactState: mainArray });
        } else {
            this.setState({ contactState: contactReducer });
        }
    }

    leftOnPress() {
        const { leftOnPress = () => {} } = this.props;
        leftOnPress();
    }

    renderHeader() {
        const { navigation, member } = this.props;
        const { idArray } = this.state;
        const title = _.isEmpty(member) ? I18n.t("header.createGroupChat") : I18n.t("chat.addMember");
        return (
            <HeaderApp
                isBack
                title={title}
                leftOnPress={() => this.leftOnPress()}
                navigation={navigation}
                rightIcon
                rIconType="Ionicons"
                statusBar={Platform.OS == "ios" ? true : false}
                rightIconName="ios-checkmark"
                // rIconStyle={{ fontSize: 40, color: idArray.length < 2 ? Colors.DIABLED_BUTTON : Colors.WHITE_COLOR }}
                rIconStyle={{ fontSize: 40 }}
                rightOnPress={() => this.rightOnPress()}
                headerContainer={Platform.OS == "ios" ? {} : { paddingTop: 0, height: DIMENSION.HEADER_HEIGHT }}
            />
        );
    }

    renderSearchInput() {
        const { searchText } = this.state;
        return (
            <View style={styles.searchWrap}>
                <Icon
                    color={Colors.WHITE_COLOR}
                    style={{ color: Colors.DIABLED_BUTTON }}
                    type={"MaterialCommunityIcons"}
                    name={"magnify"}
                />
                <TextInput
                    value={searchText}
                    onChangeText={e => this.searchContact(e)}
                    style={styles.searchInput}
                    placeholder={I18n.t("groupSelect.placeholderSearch")}
                />
            </View>
        );
    }

    renderNameInput() {
        const { groupName } = this.state;
        const { member } = this.props;
        if (_.isEmpty(member)) {
            return (
                <View style={styles.inputWrap}>
                    <TextInput
                        value={groupName}
                        onChangeText={e => this.setState({ groupName: e })}
                        style={styles.inputGroupName}
                        placeholder={I18n.t("groupSelect.placeholder")}
                    />
                </View>
            );
        } else {
            return null;
        }
    }

    renderListContact() {
        const { contactState, idArray } = this.state;
        return (
            <FlatList
                ref={ref => (this.flatlist = ref)}
                contentContainerStyle={{ paddingBottom: 20 }}
                keyExtractor={(item, index) => `${index}`}
                data={contactState}
                extraData={contactState}
                renderItem={({ item, index }) => (
                    <CardGroup item={item} idArray={idArray} onPress={id => this.onPressGroupCard(id)} />
                )}
            />
        );
    }

    spiner() {
        let { isLoading } = this.state;
        return (
            isLoading && (
                <View style={styles.spinerWrap}>
                    <Spinner color="#000000" />
                </View>
            )
        );
    }

    render() {
        const { errorMess } = this.state;
        return (
            <View style={styles.container}>
                {this.renderHeader()}
                {!_.isEmpty(errorMess) && (
                    <AppText
                        text={this.state.errorMess}
                        style={{
                            marginVertical: PD.PADDING_2,
                            fontSize: responsiveFontSize(2),
                            color: "firebrick",
                            textAlign: "center"
                        }}
                    />
                )}
                {this.renderNameInput()}
                {this.renderSearchInput()}
                {this.renderListContact()}
                {this.spiner()}
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        contactReducer: state.contactReducer.data.response,
        userReducer: state.userReducer.data
    };
}
GroupSelect = connect(mapStateToProps)(GroupSelect);
export default GroupSelect;
