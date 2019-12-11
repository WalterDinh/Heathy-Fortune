import React from "react";
import { connect } from "react-redux";
import { View, KeyboardAvoidingView, Text, Picker, Platform, TouchableOpacity, ImageBackground } from "react-native";
import { Header, AppImage, Container, Input, Button, AppText, HeaderTransparent } from "components";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Colors, Const, Helper, ServiceHandle } from "helper";
import { DEVICE, PD } from "helper/Consts";
import styles from "./styles";
import I18n from "helper/locales";
import { ICON, Images } from "assets";
import { Icon } from "native-base";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import { CheckBox } from "react-native-elements";

const FORMAT_STRING = "YYYY";
const FORMAT_MONTH = "MMM ";
const FORMAT_DATE = "D ";
const STRING_FORMAT = "YYYY DD MM";

class Information extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fistName: "",
            error: "",
            lastName: "",
            check: false,
            check1: true,
            birth: moment(),
            isDateTimePickerVisible: false,
            focus: false,
            language: "",
            color: Colors.Deluge,
            colorUn: Colors.Dusty_Gray,
            type: 0,
            username: this.props.navigation.getParam("username"),
            disabled: false
        };
        this.inputRefs = {};
    }
    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    handleDatePicked = date => {
        console.log("A date has been picked: ", date);
        let birth = moment(date).isBefore(moment()) ? moment(date) : moment();
        this.setState({ birth }, () => this.hideDateTimePicker());
    };

    onContact() {
        const { check, check1 } = this.state;
        this.setState({
            // check: !this.state.check,
            // check1: false,
            check: !check,
            check1: !check1,
            type: check == true ? null : 1
        });
    }

    onLike() {
        const { check, check1 } = this.state;
        this.setState({
            // check1: !this.state.check1,
            // check: false,
            check: !check,
            check1: !check1,
            type: check1 == true ? null : 0
        });
    }

    checkValidate() {
        const { fistName, lastName, username, type } = this.state;
        const { navigation } = this.props;
        console.log(type, "type");
        if (fistName.trim() === "" || lastName.trim() === "") {
            this.setState({
                error: I18n.t("validate.blank")
            });
        } else {
            navigation.navigate("Password", {
                username: username,
                first_name: fistName,
                last_name: lastName,
                type: type
            });
        }
    }

    render() {
        const h3 = DEVICE.DEVICE_HEIGHT * 0.06;
        const { navigation } = this.props;
        let { birth, isDateTimePickerVisible, focus, check, check1, error, color, disabled } = this.state;
        const year = moment(birth).format(FORMAT_STRING);
        const month = moment(birth).format(FORMAT_MONTH);
        const date = moment(birth).format(FORMAT_DATE);

        return (
            <ImageBackground source={Images.BG} style={{ width: "100%", height: "100%" }}>
                <HeaderTransparent navigation={navigation} title="Tạo tài khoản" />
                <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
                    <Container scrollEnabled={focus}>
                        <AppImage local source={ICON.INF} style={styles.icon} resizeMode={"contain"} />
                        <View style={styles.mg}>
                            <Input
                                transparent
                                inputStyle={{ fontSize: responsiveFontSize(2.5) }}
                                clearButton
                                // nameValue="Email"
                                // type={Const.INPUT_TYPE.EMAIL}
                                // onRef={ref => (this.inputRefs["email"] = ref)}
                                placeholder="Họ"
                                placeholderTextColor={Colors.WHITE_COLOR}
                                onChangeText={e => this.setState({ fistName: e, error: "" })}
                                value={this.state.fistName}
                                // containerStyles={{ backgroundColor: "transparent" }}
                                onFocus={() => this.setState({ focus: true })}
                                onBlur={() => this.setState({ focus: false })}
                            />
                        </View>
                        <View style={styles.mg}>
                            <Input
                                transparent
                                inputStyle={{ fontSize: responsiveFontSize(2.5) }}
                                clearButton
                                // nameValue="Email"
                                // type={Const.INPUT_TYPE.EMAIL}
                                // onRef={ref => (this.inputRefs["email"] = ref)}
                                placeholder="Tên"
                                placeholderTextColor={Colors.WHITE_COLOR}
                                onChangeText={e => this.setState({ lastName: e, error: "" })}
                                value={this.state.lastName}
                                onFocus={() => this.setState({ focus: true })}
                                onBlur={() => this.setState({ focus: false })}
                            />
                        </View>
                        {/* <View style={styles.card}>
                            <TouchableOpacity style={styles.btnCalender} onPress={this.showDateTimePicker}>
                                <View style={{ flex: 3, flexDirection: "row" }}>
                                    <AppText text={`${date}-${month}-${year}`} style={styles.text} />
                                    <DateTimePicker
                                        isVisible={isDateTimePickerVisible}
                                        onConfirm={this.handleDatePicked}
                                        onCancel={this.hideDateTimePicker}
                                        date={new Date(birth)}
                                    />
                                </View>
                                <View style={{}}>
                                    <Icon name="md-calendar" type="ionicons" style={{ color: "white" }} />
                                </View>
                            </TouchableOpacity>
                            <View style={styles.btnCalender1}>
                                <Picker
                                    itemTextStyle={styles.text}
                                    selectedValue={this.state.language}
                                    style={{ width: 100 }}
                                    onValueChange={(itemValue, itemIndex) => this.setState({ language: itemValue })}
                                >
                                    <Picker.Item label="Nam" value="Nam" />
                                    <Picker.Item label="Nữ" value="Nu" />
                                </Picker>
                            </View>
                            </View> */}
                        <View style={styles.card}>
                            <TouchableOpacity
                                style={[
                                    styles.checkBox,
                                    { backgroundColor: check ? Colors.Deluge : Colors.Dusty_Gray }
                                ]}
                                onPress={() => this.onContact()}
                            >
                                <AppText text="Chuyên viên" style={styles.text} />
                            </TouchableOpacity>
                            <View style={{ width: PD.PADDING_6 }} />
                            <TouchableOpacity
                                style={[
                                    styles.checkBox,
                                    { backgroundColor: check1 ? Colors.Deluge : Colors.Dusty_Gray }
                                ]}
                                onPress={() => this.onLike()}
                            >
                                <AppText text="Khách hàng" style={styles.text} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ height: 30, justifyContent: "center" }}>
                            <AppText style={styles.error} text={error} />
                        </View>
                        <Button
                            title="Tiếp tục"
                            isShadow
                            onPress={() => this.checkValidate()}
                            rightIcon
                            style={{
                                backgroundColor: color,
                                // (check = true) || (check1 = true) ? Colors.Deluge : Colors.Gray_Chateau,
                                width: "90%"
                            }}
                        />
                    </Container>
                </KeyboardAvoidingView>
            </ImageBackground>
        );
    }
}
export default Information;
