import React from "react";
import { View, TouchableOpacity, KeyboardAvoidingView, Alert } from "react-native";
import { connect } from "react-redux";
import { AppImage, AppText, HeaderApp, Button, Container, ItemListDoctor } from "components";
import styles from "./styles";
import { PD, DEVICE, DIMENSION } from "helper/Consts";
import { Input, Item, Form, Icon, CheckBox, Picker } from "native-base";
import { Colors, Const } from "helper";
import I18n from "helper/locales";
import _ from "lodash";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { FONT_SF } from "assets";
import moment from "moment";
import AutocompleteTags from "../ProfileEdit/AutocompleteTags";
import DateTimePicker from "react-native-modal-datetime-picker";
import { doctorActions, userActions, types, eventActions, chatHistoriesAction, alertActions } from "actions";
import Autocomplete from "./Autocomplete";
import { numberToCurrency } from "helper/convertLang";
import { AppModal } from "components";
import { HeaderTransparent } from "components";
import { listDoctorAsync } from "sagas/doctorSaga";
import BackgroundTimer from "react-native-background-timer";
import { reBookEvent, createEventSuccess } from "actions/eventActions";

const DEFAULT_AVATAR = "https://i.imgur.com/Htnp2Ra.png";
const AVATAR_SIZE = DEVICE.DEVICE_WIDTH * 0.08;

const FORMAT_STRING = "YYYY";
const FORMAT_MONTH = "MM ";
const FORMAT_DATE = "DD ";
const FORMAT_TIME = "HH:mm";

class NewEvent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataEvent: {},
            isDateTimePickerVisible: false,
            isDateTimePickerVisibleEnd: false,
            startDate: moment(),
            disabled: false,
            modalTag: false,
            modal: false,
            spinner: false,
            text: "",
            title: "",
            dataDoctor: {},
            value: 0,
            money: 0,
            showModelChooseUser: false,
            name: "",
            listChooseUser: [],
            listUser: [props.userReducer.data],
            selectedItem: [],
            member: [],
            description: "",
            endTime: moment(),
            checked: true,
            checked1: false,
            selected: "0"
        };
        this.page = 1;
    }

    componentDidMount() {
        const { userReducer, dispatch, navigation } = this.props;
        // dispatch(doctorActions.getListDoctorRequest({ page: this.page }));
        if (navigation.getParam("dataDoctor")) {
            const data = navigation.getParam("dataDoctor");
            console.log('navigation.getParam("dataDoctor")', data);
            this.setState({
                member: [{ username: userReducer.data.username }, { username: data.username }],
                listUser: [userReducer.data, data],
                disabled: true,
                dataDoctor: data,
                money: data.price,
                editEvent: false
            });
        } else {
            const data = navigation.getParam("item");
            console.log("dataitemmmmmmmmmmmmmmmmmmmmmmmm", data.member);
            this.setState({
                // member: [{ username: userReducer.data.username }, { username: data.member[1] }],
                member: data.member,
                listUser: [userReducer.data, data],
                disabled: true,
                dataDoctor: data,
                money: data.price,
                title: data.title,
                description: data.description,
                endTime: moment(data.appointment_end_time),
                startDate: moment(data.appointment_time),
                editEvent: true
            });
        }
    }
    async componentDidUpdate(prevProps) {
        const { userReducer, doctorReducer, eventReducer, navigation, dispatch } = this.props;
        const { title, selected, dataDoctor, editEvent } = this.state;

        if (prevProps !== this.props) {
            if (doctorReducer.type === types.SEARCH_DOCTOR_SUCCESS) {
                let listChooseUser = [];
                doctorReducer.searchDoctor.results.map(n => {
                    if (n.username !== userReducer.data.username) {
                        listChooseUser.push(n);
                    }
                });
                this.setState({
                    listChooseUser: listChooseUser
                });
            }
            if (eventReducer.type === types.CREATE_EVENT_SUCCESS) {
                let content = {
                    notificationId: !editEvent
                        ? [userReducer.data.device_id, dataDoctor.device_id]
                        : [dataDoctor.member[0].device_id, dataDoctor.member[1].device_id],
                    noti: {
                        body: !editEvent
                            ? `${dataDoctor.last_name} ${I18n.t("notification.createEventSuccess")}`
                            : `${this.onFilter(dataDoctor.member)}  ${I18n.t("notification.createEventSuccess")}`,
                        title: "Thông báo"
                    },
                    message: {
                        sender: userReducer.data,
                        to: dataDoctor,
                        type: "eventInactive"
                    }
                };
                console.log("notificationId", content);
                await chatHistoriesAction.sendNotiForOther(content);
                await dispatch(eventActions.eventRequest({ page1: 1 }));
                navigation.popToTop();
            }
        }
    }

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };
    showDateEndTimePicker = () => {
        this.setState({ isDateTimePickerVisibleEnd: true });
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    handleDatePicked = date => {
        this.setState({ startDate: date, endTime: date }, () => this.hideDateTimePicker());
    };

    handleDatePickedEnd = date => {
        this.setState({ endTime: date }, () => this.hideDateTimePickerEnd());
    };
    hideDateTimePickerEnd = () => {
        this.setState({ isDateTimePickerVisibleEnd: false });
    };
    _changeTagClose() {
        this.setState({ modalTag: false });
    }
    // changeTagClose() {
    //     this.setState({ modal: false });
    // }

    // onComplete(data) {
    //     this.setState({ selectedItem: data }, () => {
    //         this.changeTagClose();
    //         this.saveChange();
    //     });
    // }
    _changeTag() {
        this.setState({ modalTag: true });
    }

    _saveChange() {
        this.setState({ spinner: true }, async () => {
            this.setState({ spinner: false }, () => {});
        });
    }

    renderTag() {
        const { selectedItem, disabled } = this.state;
        const tag = selectedItem;
        return (
            <View style={{ width: "100%", paddingTop: PD.PADDING_2 }}>
                <Button
                    onPress={() => this._changeTag()}
                    style={styles.tagContent}
                    disabled={disabled}
                    centerContent={
                        tag.length == 0 ? (
                            <AppText
                                text={I18n.t("profileEdit.emptyTag")}
                                style={{
                                    color: Colors.WHITE_COLOR,
                                    fontSize: responsiveFontSize(2)
                                }}
                            />
                        ) : (
                            tag.map((item, index) => {
                                return (
                                    <View style={[styles.tagWrap, { marginVertical: responsiveFontSize(0.5) }]}>
                                        <AppText
                                            text={item.tag_name}
                                            key={item.id}
                                            style={{
                                                color: Colors.WHITE_COLOR,
                                                fontSize: responsiveFontSize(2)
                                            }}
                                        />
                                    </View>
                                );
                            })
                        )
                    }
                />
            </View>
        );
    }

    renderName() {
        const { dispatch, userReducer, doctorReducer, navigation } = this.props;
        const { member, listUser, disabled } = this.state;
        const data = navigation.getParam("item");
        console.log("====================================", member);

        return (
            <View style={{ width: "100%", paddingTop: PD.PADDING_2 }}>
                {navigation.getParam("dataDoctor") ? (
                    <Button
                        disabled={disabled}
                        onPress={() => this.setState({ showModelChooseUser: true })}
                        style={styles.tagContent}
                        centerContent={
                            listUser.map((item, index) => {
                                return (
                                    <View style={[styles.tagWrap, { justifyContent: "flex-start" }]}>
                                        <AppImage
                                            source={{
                                                uri: item.img_url ? item.img_url : DEFAULT_AVATAR
                                            }}
                                            resizeMode="cover"
                                            style={styles.avatarItem}
                                        />
                                        <AppText
                                            text={item.last_name}
                                            style={{
                                                color: Colors.WHITE_COLOR,
                                                fontSize: responsiveFontSize(2)
                                            }}
                                        />
                                    </View>
                                );
                            })
                            // )
                        }
                    />
                ) : (
                    <Button
                        disabled={disabled}
                        onPress={() => this.setState({ showModelChooseUser: true })}
                        style={styles.tagContent}
                        centerContent={
                            data.member.map((item, index) => {
                                return (
                                    <View style={[styles.tagWrap, { justifyContent: "flex-start" }]}>
                                        <AppImage
                                            source={{
                                                uri: item.img_url ? item.img_url : DEFAULT_AVATAR
                                            }}
                                            resizeMode="cover"
                                            style={styles.avatarItem}
                                        />
                                        <AppText
                                            text={item.last_name}
                                            style={{
                                                color: Colors.WHITE_COLOR,
                                                fontSize: responsiveFontSize(2)
                                            }}
                                        />
                                    </View>
                                );
                            })
                            // )
                        }
                    />
                )}
            </View>
        );
    }

    renderTitle(nameIcon, title) {
        return (
            <View style={styles.containerTitle}>
                <View style={styles.boxIcon}>
                    <Icon name={nameIcon} type="MaterialCommunityIcons" style={styles.icon} />
                </View>
                <View style={styles.boxTitle}>
                    <AppText text={title} style={styles.title} />
                </View>
            </View>
        );
    }

    renderInput() {
        const { title } = this.state;
        return (
            <View style={styles.containerInput}>
                <Input
                    // multiline={true}
                    style={{ color: "white", width: "100%" }}
                    value={title}
                    onChangeText={title => this.setState({ title })}
                />
            </View>
        );
    }

    renderDescription() {
        const { description } = this.state;
        return (
            <View style={styles.containerDescription}>
                <Input
                    multiline={true}
                    style={{ color: "white", width: "100%" }}
                    value={description}
                    onChangeText={description => this.setState({ description })}
                />
            </View>
        );
    }

    renderCredit() {
        const { money } = this.state;
        return (
            <View style={styles.containerPrice}>
                <Input
                    disabled
                    value={`${numberToCurrency(money).toString()}`}
                    onChangeText={money => this.setState({ money })}
                    keyboardType="number-pad"
                    style={styles.inputPrice}
                />
            </View>
        );
    }
    convertEndTime(itemValue) {
        let { startDate, selected } = this.state;
        let dateToAdd = startDate;
        console.log("selected", selected);
        this.setState({
            selected: itemValue,
            endTime: moment(dateToAdd).add(itemValue, "m")
        });
    }

    renderEndTime() {
        let { endTime, isDateTimePickerVisibleEnd, checked, checked1, startDate } = this.state;
        const year = moment(endTime).format(FORMAT_STRING);
        const month = moment(endTime).format(FORMAT_MONTH);
        const date = moment(endTime).format(FORMAT_DATE);
        const time = moment(endTime).format(FORMAT_TIME);
        return (
            <View>
                <AppText text="Kết Thúc" style={styles.titleField} />
                <View>
                    <View style={styles.containerTime}>
                        <CheckBox
                            checked={checked}
                            style={{ marginRight: PD.PADDING_4 }}
                            onPress={() => this.setState({ checked: !checked })}
                        />
                        <AppText text="Tuỳ chọn thời gian" style={styles.text} />
                    </View>
                    <TouchableOpacity
                        style={styles.btnCalender}
                        onPress={this.showDateEndTimePicker}
                        disabled={!checked}
                    >
                        <View
                            style={{
                                flex: 3,
                                flexDirection: "row",
                                justifyContent: "center"
                            }}
                        >
                            <AppText text={`${date}-${month}-${year}    ${time}`} style={styles.text} />
                            <DateTimePicker
                                isVisible={isDateTimePickerVisibleEnd}
                                onConfirm={this.handleDatePickedEnd}
                                onCancel={this.hideDateTimePickerEnd}
                                date={new Date(endTime)}
                                minimumDate={new Date(startDate)}
                                mode="datetime"
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: PD.PADDING_4 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            paddingBottom: PD.PADDING_2
                        }}
                    >
                        <CheckBox
                            checked={!checked}
                            style={{ marginRight: PD.PADDING_4 }}
                            onPress={() => this.setState({ checked: !checked })}
                        />
                        <AppText text="Chọn theo mốc thời gian" style={styles.text} />
                    </View>
                    <View style={[styles.btnCalender]}>
                        <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" style={{ color: Colors.WHITE_COLOR }} />}
                            textStyle={{ color: Colors.WHITE_COLOR }}
                            placeholderStyle={{ color: Colors.WHITE_COLOR }}
                            enabled={!checked}
                            style={{ color: Colors.WHITE_COLOR }}
                            placeholderIconColor={Colors.WHITE_COLOR}
                            selectedValue={this.state.selected}
                            onValueChange={(itemValue, itemIndex) => this.convertEndTime(itemValue)}
                            // placeholder="Chọn mốc thời gian"
                        >
                            <Picker.Item label="Chọn mốc thời gian" value="0" key="0" />
                            <Picker.Item label="30 phút" value="30" key="1" />
                            <Picker.Item label="60 phút" value="60" key="2" />
                            <Picker.Item label="90 phút" value="90" key="3" />
                            <Picker.Item label="120 phút" value="120" key="4" />
                        </Picker>
                    </View>
                </View>
            </View>
        );
    }

    renderStartTime() {
        let {
            startDate,
            isDateTimePickerVisible,
            modalTag,
            modal,
            name,
            showModelChooseUser,
            listUser,
            listChooseUser
        } = this.state;
        const year = moment(startDate).format(FORMAT_STRING);
        const month = moment(startDate).format(FORMAT_MONTH);
        const date = moment(startDate).format(FORMAT_DATE);
        const time = moment(startDate).format(FORMAT_TIME);
        return (
            <View style={{ marginBottom: PD.PADDING_4 }}>
                <AppText text="Bắt đầu" style={styles.titleField} />
                <TouchableOpacity style={styles.btnCalender} onPress={this.showDateTimePicker}>
                    <View style={styles.boxDate}>
                        <AppText text={`${date}-${month}-${year}    ${time}`} style={styles.text} />
                        <DateTimePicker
                            isVisible={isDateTimePickerVisible}
                            onConfirm={this.handleDatePicked}
                            onCancel={this.hideDateTimePicker}
                            date={new Date(startDate)}
                            minimumDate={new Date(startDate)}
                            mode="datetime"
                        />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
    onSearch = () => {
        const { dispatch, navigation, userReducer } = this.props;
        const { name } = this.state;
        dispatch(doctorActions.searchDoctorRequest({ name }));
    };
    onChooseUser = item => {
        const { userReducer } = this.props;
        this.setState({
            member: [{ username: userReducer.data.username }, { username: item.username }],
            showModelChooseUser: false,
            listUser: [userReducer.data, item]
        });
    };
    onCreatEvent() {
        const { title, description, selected, checked } = this.state;
        const { dispatch } = this.props;
        if (title == "" || description == "") {
            const paramsAlert = {
                content: "Vui lòng nhập trường còn để trống",
                title: I18n.t("Alert.notice"),
                type: Const.ALERT_TYPE.ERROR
            };
            dispatch(alertActions.openAlert(paramsAlert));
        } else if (checked) {
            this.onSendService();
        } else {
            if (selected > 0) {
                this.onSendService();
            } else {
                const paramsAlert = {
                    content: "Vui lòng chọn thời gian kết thúc",
                    title: I18n.t("Alert.notice"),
                    type: Const.ALERT_TYPE.ERROR
                };
                dispatch(alertActions.openAlert(paramsAlert));
            }
        }
    }
    onFilter() {
        const { userReducer } = this.props;
        const { dataDoctor } = this.state;
        for (let i = 0; i < dataDoctor.member.length; i++) {
            if (dataDoctor.member[i].id !== userReducer.data.id) return dataDoctor.member[i];
        }
    }
    onSendService() {
        const { dispatch, userReducer, navigation } = this.props;
        const {
            member,
            selectedItem,
            money,
            startDate,
            title,
            description,
            endTime,
            selected,
            checked,
            editEvent,
            dataDoctor
        } = this.state;
        const params = {
            member,
            title,
            description,
            // tag: selectedItem,
            price: money,
            appointment_time: startDate,
            status: 0,
            name_creator: userReducer.data.id,
            appointment_end_time: endTime
        };
        if (editEvent) {
            reBookEvent({ id: dataDoctor.id, body: params }).then(res => {
                if (res.error) {
                    const paramsAlert = {
                        content: "Hẹn lại không thành công",
                        title: I18n.t("Alert.notice"),
                        type: Const.ALERT_TYPE.ERROR
                    };
                    dispatch(alertActions.openAlert(paramsAlert));
                } else {
                    dispatch(createEventSuccess(res.response));
                }
            });
        } else {
            dispatch(eventActions.createEventRequest(params));
        }
    }
    render() {
        const { navigation } = this.props;
        const {
            startDate,
            isDateTimePickerVisible,
            modalTag,
            modal,
            name,
            showModelChooseUser,
            listUser,
            dataDoctor,
            listChooseUser,
            selected,
            editEvent
        } = this.state;
        const year = moment(startDate).format(FORMAT_STRING);
        const month = moment(startDate).format(FORMAT_MONTH);
        const date = moment(startDate).format(FORMAT_DATE);
        const time = moment(startDate).format(FORMAT_TIME);
        // console.log("selecterrrrrrrrrrrrrrrrrrrrrrrrrr", this.onFilter());
        return (
            <View style={styles.container}>
                <KeyboardAvoidingView
                    style={{ flex: 1, paddingBottom: DEVICE.DEVICE_HEIGHT * 0.05 }}
                    behavior="padding"
                    enabled
                >
                    <View style={{ flex: 1 }}>
                        <HeaderApp
                            isBack
                            title="Tạo mới"
                            navigation={navigation}
                            avatar={!editEvent ? dataDoctor.img_url : this.onFilter().img_url}
                        />
                        <Container
                            style={{
                                marginTop: DIMENSION.NEW_HEADER_HEIGHT,
                                paddingHorizontal: "5%"
                            }}
                        >
                            {this.renderTitle("clock-outline", "Thời Gian")}
                            <View style={styles.dateView}>
                                {this.renderStartTime()}
                                {this.renderEndTime()}
                            </View>
                            {/* {this.renderTitle("newspaper", "Danh mục")}
                            {this.renderTag()} */}
                            {this.renderTitle("palette-swatch", "Tiêu đề")}
                            {this.renderInput()}
                            {this.renderTitle("message-bulleted", "Mô tả")}
                            {this.renderDescription()}
                            {this.renderTitle("credit-card", "Phí tư vấn (đồng/giờ)")}
                            {this.renderCredit()}
                            {this.renderTitle("account-multiple-outline", "Người Tham Gia")}
                            {this.renderName()}
                            <Button
                                title="Xác Nhận"
                                isShadow
                                rightIcon
                                onPress={() => this.onCreatEvent()}
                                style={styles.btnActive}
                            />
                        </Container>
                    </View>
                </KeyboardAvoidingView>
                {/* <AutocompleteTags
                    show={modalTag}
                    // show={true}
                    onClose={() => this._changeTagClose()}
                    onComplete={selectedItem => this._onComplete(selectedItem)}
                />
                <AppModal visible={showModelChooseUser}>
                    <View style={{ flex: 1 }}>
                        <HeaderTransparent
                            navigation={navigation}
                            containerStyle={{ backgroundColor: Colors.Victoria }}
                            onPressBack={() => this.setState({ showModelChooseUser: false })}
                            title={I18n.t("profileEdit.searchCondition")}
                        />
                        <View style={styles.searchContainer}>
                            <View style={styles.inputWrap}>
                                <TouchableOpacity onPress={() => this.onSearch()}>
                                    <Icon name="magnify" type="MaterialCommunityIcons" style={styles.icon} />
                                </TouchableOpacity>
                                <Input
                                    placeholder={I18n.t("profileEdit.searchCondition")}
                                    value={name}
                                    onChangeText={name => this.setState({ name })}
                                />
                                <Icon
                                    name="close"
                                    type="MaterialCommunityIcons"
                                    style={styles.icon}
                                    onPress={() => this.setState({ name: "" })}
                                />
                            </View>
                            <View
                                style={{
                                    width: "100%",
                                    height: "88%"
                                }}
                            >
                                <ItemListDoctor
                                    navigation={navigation}
                                    style={{
                                        width: "100%",
                                        maxHeight: "100%",
                                        backgroundColor: "red"
                                    }}
                                    data={listChooseUser}
                                    onPress={item => navigation.navigate("Counselor", { watch: item })}
                                    onAdd={item => this.onChooseUser(item)}
                                />
                            </View>
                        </View>
                    </View>
                </AppModal> */}
                {/* <Autocomplete
                    show={modalTag}
                    // show={true}
                    onClose={() => this.changeTagClose()}
                    onComplete={selectedItem => this.onComplete(selectedItem)}
                /> */}
            </View>
        );
    }
}
function mapStateToProps(state) {
    return {
        userReducer: state.userReducer,
        eventReducer: state.eventReducer,
        doctorReducer: state.doctorReducer
    };
}
NewEvent = connect(mapStateToProps)(NewEvent);

export default NewEvent;
