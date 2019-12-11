import React from "react";
import { View, TouchableOpacity, FlatList, StyleSheet, TextInput } from "react-native";
import { DIMENSION, DEVICE, PD } from "helper/Consts";
import { Colors } from "helper";
import I18n from "helper/locales";
import { Images } from "../assets/index";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { ButtonCircle, AppText, AppImage, ScheduleCard, Input } from "./index";
import { Icon } from "react-native-elements";
import { FONT_SF } from "assets";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";

const HEADER_HEIGHT = DIMENSION.NEW_HEADER_HEIGHT;
const BORDER_RADIUS = DIMENSION.BORDER_BOTTOM_LEFT_RADIUS;
const HEIGHT = DEVICE.DEVICE_HEIGHT * 0.3;

export default class ItemCategory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDateTimePickerVisible: false,
            startDate: "",
            endDate: "",
            tagName: "",
            doctorName: "",
            data: props.data,
            checkDate: false
        };
    }

    showDateTimePicker = check => {
        this.setState({ isDateTimePickerVisible: true, checkDate: check });
    };

    hideDateTimePicker = () => {
        this.setState({
            isDateTimePickerVisible: false
        });
    };
    _onRemoveTag(item) {
        const { onRemoveTag = () => {} } = this.props;
        onRemoveTag(item);
    }
    handleDatePicked = date => {
        const { checkDate } = this.state;
        checkDate
            ? this.setState({ startDate: moment(date).format("DD/MM  HH:mm") })
            : this.setState({ endDate: moment(date).format("DD/MM  HH:mm") });
        console.log("A date has been picked: ", date);
        this.hideDateTimePicker();
    };
    _onChooseTag(item) {
        const { onPress = () => {} } = this.props;
        onPress(item);
    }
    renderItem = (item, selectTag) => {
        return (
            <TouchableOpacity
                style={styles.boxCenter}
                onPress={() => {
                    selectTag ? this._onRemoveTag(item) : this._onChooseTag(item);
                }}
            >
                <AppText text={item.tag_name} style={styles.tagName} />
            </TouchableOpacity>
        );
    };

    _onClick(item) {
        const { onClick = () => {} } = this.props;
        onClick(item);
    }
    _onSearch(item) {
        const { onSearch } = this.props;
        onSearch(item);
    }

    renderSearchName = () => {
        const { doctorName, tagName } = this.state;

        return (
            <View style={styles.containerCategory}>
                <TouchableOpacity
                    hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                    onPress={() => this._onClick(doctorName)}
                >
                    <Icon name="md-search" type="ionicon" color="#fff" size={responsiveFontSize(2.5)} />
                </TouchableOpacity>
                <TextInput
                    style={styles.inputContainer}
                    value={doctorName}
                    placeholder={I18n.t("placeholder.doctorName")}
                    placeholderTextColor={Colors.WHITE_COLOR}
                    onChangeText={doctorName => this.setState({ doctorName: doctorName })}
                />
                <AppImage source={Images.ARROW} resizeMode="cover" style={styles.iconArrow} />
                <TouchableOpacity
                    style={styles.boxItemCategoryRight}
                    // onPress={() => (date == "date" ? this.showDateTimePicker(false) : null)}
                >
                    <Icon name="md-pricetag" type="ionicon" color="#fff" size={responsiveFontSize(2.5)} />
                </TouchableOpacity>
                <TextInput
                    style={[styles.inputContainer, { width: "35%" }]}
                    placeholder={I18n.t("placeholder.tagName")}
                    placeholderTextColor={Colors.WHITE_COLOR}
                    onChangeText={tagName => this._onSearch(tagName)}
                />
            </View>
        );
    };

    renderCategory = (icon, location, tab, date, endDate) => {
        const { listTagSelected } = this.props;
        return (
            <View style={styles.containerCategory}>
                {/* <TouchableOpacity onPress={() => (date == "date" ? this.showDateTimePicker(true) : null)}>
                    <Icon name={icon} type="ionicon" color="#fff" size={responsiveFontSize(2.5)} />
                </TouchableOpacity> */}
                {this.renderListTag(listTagSelected, true)}
            </View>
        );
    };

    renderListTag = (data, selectTag) => {
        return (
            <View style={styles.containerListTag}>
                {selectTag ? null : (
                    <View style={styles.boxIconFilter}>
                        <Icon name="md-options" type="ionicon" color="#fff" size={responsiveFontSize(2.5)} />
                    </View>
                )}
                <View style={styles.boxListFilter}>
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => this.renderItem(item, selectTag)}
                    />
                    <View style={styles.boxRightListFilter} />
                </View>
            </View>
        );
    };
    render() {
        const { data } = this.props;
        const { startDate, endDate } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    {this.renderSearchName()}
                    {/* {this.renderCategory("md-pin", "BẠCH MAI", "MẸ VÀ BÉ")} */}
                    {this.renderCategory("md-pricetag", startDate, endDate, "date")}
                    {this.renderListTag(data, false)}
                    <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this.handleDatePicked}
                        onCancel={this.hideDateTimePicker}
                        isDarkModeEnabled={true}
                        mode="datetime"
                    />
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        height: DEVICE.DEVICE_HEIGHT * 0.4,
        width: "100%",
        alignItems: "center",
        backgroundColor: "#241332",
        justifyContent: "flex-end"
    },
    content: {
        height: HEIGHT,
        width: "100%",
        alignItems: "center",
        backgroundColor: "#241332",
        justifyContent: "flex-end"
    },
    containerListTag: {
        flexDirection: "row",
        width: "100%",
        height: HEIGHT / 4,
        justifyContent: "center",
        alignItems: "center"
    },
    boxIconFilter: {
        justifyContent: "center",
        alignItems: "center",
        width: "10%"
    },
    boxListFilter: {
        justifyContent: "center",
        alignItems: "center",
        width: "80%"
    },
    boxRightListFilter: {
        justifyContent: "center",
        alignItems: "center",
        width: "5%"
    },
    containerCategory: {
        backgroundColor: "#352641",
        width: "95%",
        borderRadius: 40,
        alignItems: "center",
        marginVertical: HEIGHT / 32,
        flexDirection: "row",
        zIndex: 1,
        justifyContent: "center",
        height: HEIGHT / 4
    },
    boxItemCategory: {
        flexDirection: "row",
        width: "90%",
        zIndex: 8,
        justifyContent: "flex-start",
        alignItems: "center"
    },
    textCategory: {
        fontFamily: FONT_SF.BOLD,
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: responsiveFontSize(1),
        color: Colors.WHITE_COLOR,
        fontSize: responsiveFontSize(1.6)
    },
    iconArrow: { height: "100%", width: "20%", position: "absolute" },
    boxItemCategoryRight: {
        flexDirection: "row",
        zIndex: 8,
        paddingLeft: "8%",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    boxCenter: {
        alignItems: "center",
        justifyContent: "center"
    },
    tagName: {
        color: "#fff",
        opacity: 0.56,
        fontFamily: FONT_SF.SEMIBOLD,
        fontSize: responsiveFontSize(1.6),
        paddingHorizontal: responsiveFontSize(2.5)
    },
    inputContainer: {
        width: "40%",
        fontFamily: FONT_SF.BOLD,
        paddingLeft: responsiveFontSize(1),
        color: Colors.WHITE_COLOR,
        fontSize: responsiveFontSize(1.6)
    }
});
