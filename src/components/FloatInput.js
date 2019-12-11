import React from "react";
import { View, TextInput, TouchableOpacity, Keyboard } from "react-native";
// import { Item, Input, Label, Picker } from "native-base";
import { ICON, FONT_SF } from "assets";
import { FONT_SIZE, DIMENSION, PD } from "helper/Consts";
import { Colors, Const } from "helper";
import { AppImage, AppText } from "components";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import SimplePicker from "react-native-simple-picker";
import { Dropdown } from "react-native-material-dropdown";
import _ from "lodash";
import AutocompleteLocation from "./AutocompleteLocation";

class FloatInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focus: false,
            // selectedValue: "",
            isDateTimePickerVisible: false,
            press: false,
            showModal: false,
            keyboardShow: false
        };
        this.picker = "";
        this.input = "";

        this.keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    componentDidMount() {
        // const { initValue, list, picker } = this.props;
        // let { selectedValue } = this.state;
        // if (picker) {
        //     this.setState({
        //         selectedValue: initValue
        //     });
        // }
    }

    _keyboardDidShow = () => {
        this.setState({ keyboardShow: true });
    };

    _keyboardDidHide = () => {
        this.setState({ focus: false, keyboardShow: false });
    };

    // onPickerFloatInput = gender => {
    //     this.props.onPicker(gender);
    // };

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    handleDatePicked = date => {
        console.log("A date has been picked: ", date);
        let d = moment(date).isBefore(moment()) ? moment(date) : moment();
        this.props.onDatePicker(d.format("YYYY-MM-DD"));
        this.hideDateTimePicker();
    };

    onClickPicker() {
        this.picker.focus();
    }

    onClickEditer() {
        this.setState({ press: true }, () => {
            this.input ? this.input.focus() : "";
        });
    }

    getLocation() {
        this.setState({ showModal: true });
    }

    convertList(list) {
        let listPicker = [];
        list.map(el => {
            listPicker = [
                ...listPicker,
                {
                    value: el
                }
            ];
        });
        return listPicker;
    }

    render() {
        let {
            label,
            iconStyle = {},
            containerStyle = {},
            inputStyle = {},
            editer = false,
            onChangeText = () => {},
            onValueChange = () => {},
            picker,
            list = [],
            initValue,
            datePicker,
            onDatePicker = () => {},
            onPicker = () => {},
            onGetLocation = () => {},
            location,
            brief = false
        } = this.props;
        let { focus, selectedValue, isDateTimePickerVisible, press, showModal, keyboardShow } = this.state;

        return (
            <View style={[focus ? styles.itemWrapBlue : styles.itemWrap, containerStyle]}>
                <View style={styles.inputWrap}>
                    <View>
                        <AppText style={focus ? styles.labelBlue : styles.label} text={label} />
                        {location ? (
                            <AutocompleteLocation
                                {...this.props}
                                ref={ref => (this.inputLocation = ref)}
                                showModal={showModal}
                                onPressText={() => this.setState({ showModal: true })}
                                onPressCancel={() => this.setState({ showModal: false })}
                                location
                                icon
                                editable={editer}
                                onFocus={() => this.setState({ focus: true })}
                                onBlur={() => this.setState({ focus: false, press: false })}
                                style={[styles.input, inputStyle]}
                                onChange={(street1, location) => {
                                    onGetLocation(street1, location.lng, location.lat);
                                    this.setState({ showModal: false });
                                }}
                                // onPress={press && null}
                                multiline={true}
                            />
                        ) : picker ? (
                            editer ? (
                                <View
                                    style={{ width: "100%" }}
                                    // onPress={() => this.onClickPicker()}
                                >
                                    <Dropdown
                                        ref={ref => (this.picker = ref)}
                                        data={this.convertList(list)}
                                        // pickerStyle={styles.pickerStyle}
                                        // labelFontSize={responsiveFontSize(1.9)}
                                        fontSize={responsiveFontSize(2.6)}
                                        textColor={Colors.BLACK_TEXT_COLOR}
                                        onChangeText={(value, index) => onPicker(index)}
                                        value={list[initValue]}
                                        inputContainerStyle={{
                                            borderBottomColor: "transparent",
                                            // backgroundColor: "green",
                                            // scaleX: 1,
                                            // scaleY: 1
                                            justifyContent: "flex-end",
                                            // minHeight: 0,
                                            bottom:
                                                Const.DEVICE.DEVICE_HEIGHT < 700
                                                    ? responsiveFontSize(1.2)
                                                    : responsiveFontSize(0.45)
                                        }}
                                        affixTextStyle={styles.pickerText}
                                        itemTextStyle={styles.pickerText}
                                        style={styles.pickerText}
                                        titleTextStyle={styles.pickerText}
                                        containerStyle={styles.pickerStyle}
                                    />
                                </View>
                            ) : (
                                <TextInput
                                    {...this.props}
                                    ref={ref => (this.input = ref)}
                                    editable={!datePicker && !picker && editer}
                                    style={[styles.input, inputStyle]}
                                    onChangeText={text => onChangeText(text)}
                                    onFocus={() => this.setState({ focus: true })}
                                    onBlur={() => this.setState({ focus: false, press: false })}
                                    selectionColor={Colors.MAIN_COLOR}
                                    multiline={true}
                                />
                            )
                        ) : (
                            <TextInput
                                {...this.props}
                                ref={ref => (this.input = ref)}
                                editable={!datePicker && !picker && editer}
                                style={[styles.input, inputStyle]}
                                onChangeText={text => onChangeText(text)}
                                onFocus={() => this.setState({ focus: true })}
                                onBlur={() => this.setState({ focus: false, press: false })}
                                selectionColor={Colors.MAIN_COLOR}
                                multiline={true}
                            />
                        )}
                    </View>
                </View>

                {editer ? (
                    datePicker ? (
                        <View style={[styles.iconWrap]}>
                            <DateTimePicker
                                isVisible={isDateTimePickerVisible}
                                onConfirm={this.handleDatePicked}
                                onCancel={this.hideDateTimePicker}
                                date={
                                    new Date(initValue)
                                    // isDateTimePickerVisible
                                    //     ? new Date(moment(initValue, "YYYY-MM-DD").format("YYYY,MM,DD"))
                                    //     : 0
                                }
                            />
                            <TouchableOpacity
                                style={[
                                    styles.iconWrap,
                                    {
                                        paddingVertical: Const.PD.PADDING_4,
                                        paddingLeft: "1000%",
                                        paddingRight: PD.PADDING_1 + 1
                                    }
                                ]}
                                onPress={this.showDateTimePicker}
                            >
                                <AppImage
                                    local
                                    source={ICON.CALENDAR}
                                    style={[styles.icon, iconStyle]}
                                    resizeMode={"contain"}
                                />
                            </TouchableOpacity>
                        </View>
                    ) : brief ? (
                        <TouchableOpacity style={styles.editBrief} onPress={() => this.onClickEditer()}>
                            <AppImage
                                local
                                source={focus ? ICON.CLOSE_BLUE : ICON.PENCIL}
                                style={[styles.icon, iconStyle]}
                                resizeMode={"contain"}
                            />
                        </TouchableOpacity>
                    ) : !picker ? (
                        <View style={[styles.iconWrap]}>
                            <TouchableOpacity
                                style={[
                                    styles.iconWrap,
                                    {
                                        paddingVertical: Const.PD.PADDING_4,
                                        paddingLeft: location ? "1000%" : "100%",
                                        paddingRight: PD.PADDING_1 + 1
                                    }
                                ]}
                                onPress={() => (location ? this.getLocation() : this.onClickEditer())}
                            >
                                <AppImage
                                    local
                                    source={focus ? ICON.CLOSE_BLUE : ICON.PENCIL}
                                    style={[styles.icon, iconStyle]}
                                    resizeMode={"contain"}
                                />
                            </TouchableOpacity>
                        </View>
                    ) : null
                ) : null}
            </View>
        );
    }
}

//  function validateInput() {
//         const { nameValue } = this.props;
//         const { text } = this.state;
//         const ValidateInput = new Validate(nameValue, text);
//         return ValidateInput.validateBlank();
// }

const styles = {
    itemWrap: {
        flex: 1,
        // minHeight: DIMENSION.INPUT_HEIGHT,
        flexDirection: "row",
        alignItems: "flex-end",
        borderBottomWidth: 1,
        borderBottomColor: Colors.DIABLED_BUTTON
    },
    itemWrapBlue: {
        flex: 1,
        // minHeight: DIMENSION.INPUT_HEIGHT,
        flexDirection: "row",
        alignItems: "flex-end",
        borderBottomWidth: 2,
        borderBottomColor: Colors.MAIN_COLOR
    },
    inputWrap: {
        flex: 7
    },
    input: {
        // flex: 1,
        padding: 0,
        fontSize: responsiveFontSize(2.2),
        minHeight: responsiveFontSize(4.95),
        fontFamily: FONT_SF.REGULAR,
        color: Colors.BLACK_TEXT_COLOR,
        width: "100%"
    },
    iconWrap: {
        flex: 1,
        height: responsiveFontSize(4.95),
        justifyContent: "center",
        alignItems: "flex-end"
    },
    icon: {
        height: 12,
        aspectRatio: 1
    },
    label: {
        height: responsiveFontSize(3),
        fontSize: responsiveFontSize(1.9),
        fontFamily: FONT_SF.REGULAR,
        color: Colors.DIABLED_BUTTON
    },
    labelBlue: {
        height: responsiveFontSize(3),
        fontSize: responsiveFontSize(1.9),
        fontFamily: FONT_SF.REGULAR,
        color: Colors.MAIN_COLOR
    },
    pickerText: {
        fontSize: responsiveFontSize(2.2),
        // height: responsiveFontSize(3.6),
        fontFamily: FONT_SF.REGULAR,
        color: Colors.BLACK_TEXT_COLOR
    },
    pickerStyle: {
        justifyContent: "center",
        // alignSelf: "auto",
        height: responsiveFontSize(4.95)
        // backgroundColor: "pink"
        // paddingBottom: responsiveFontSize(1.5)
        // marginBottom: 0
    },
    editBrief: {
        position: "absolute",
        zIndex: 2,
        top: 0,
        width: "100%",
        height: responsiveFontSize(3) + PD.PADDING_2,
        // height: 60 - responsiveFontSize(3.6),
        justifyContent: "center",
        alignItems: "flex-end",
        paddingRight: PD.PADDING_1
    }
};

export default FloatInput;
