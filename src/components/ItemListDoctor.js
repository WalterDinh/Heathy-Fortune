import React from "react";
import { View, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { DIMENSION, DEVICE, PD } from "helper/Consts";
import { Colors } from "helper";
import { Images } from "../assets/index";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { ButtonCircle, AppText, AppImage, ScheduleCard } from "./index";
import { Icon } from "react-native-elements";
import { FONT_SF } from "assets";
const _ = require("lodash");

const AVATAR_SIZE = DEVICE.DEVICE_WIDTH * 0.096;
const AVATAR_SIZE_RADIUS = AVATAR_SIZE * 0.5;
const DEFAULT_AVATAR = "https://i.imgur.com/Htnp2Ra.png";
export default class ItemListDoctor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }
    _onPress(item) {
        const { onPress = () => {} } = this.props;
        onPress(item);
    }
    onPressExpert(item) {
        const { navigation } = this.props;
        navigation.navigate("Counselor", { item });
    }
    _onChat(item) {
        const { onChat = () => {} } = this.props;
        onChat(item);
    }
    _onAdd(item) {
        const { onAdd = () => {} } = this.props;
        onAdd(item);
    }
    renderItem(item, index) {
        const { checkList } = this.props;
        return (
            <TouchableOpacity
                style={styles.boxItem}
                onPress={() => (checkList ? this._onAdd(item) : this._onPress(item))}
            >
                <AppImage
                    source={{ uri: item.img_url ? item.img_url : DEFAULT_AVATAR }}
                    resizeMode="cover"
                    style={styles.avatarItem}
                />
                <View style={{ flex: 4, justifyContent: "center" }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <AppText text={item.last_name} style={styles.doctorName} />
                        <View style={styles.boxrating}>
                            <View style={styles.boxCenter}>
                                <Icon name="md-star" type="ionicon" color="#fff" size={responsiveFontSize(1.8)} />
                            </View>

                            <View style={styles.boxCenter}>
                                <AppText text="0" style={styles.textNumberStar} />
                            </View>
                        </View>
                    </View>
                    <AppText text={item.address} style={styles.textWorkplace} />
                </View>

                <View style={styles.containerIcon}>
                    <TouchableOpacity
                        style={[styles.boxIcon, { backgroundColor: Colors.Hopbush }]}
                        onPress={() => this._onChat(item)}
                    >
                        <Icon name="md-chatbubbles" type="ionicon" color="#fff" size={responsiveFontSize(2.8)} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.boxIcon, { backgroundColor: Colors.Victoria }]}
                        onPress={() => this.onPressExpert(item)}
                    >
                        <Icon name="md-information" type="ionicon" color="#fff" size={responsiveFontSize(4.0)} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    }
 
    render() {
        const { containerStyle, data, onLoadMore } = this.props;
        const listDoctor = _.orderBy(data, ["id"], ["asc"]);

        return this.renderItem(data);
    }
}
const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "90%",
        backgroundColor: "white"
    },
    doctorName: {
        fontFamily: FONT_SF.REGULAR,
        marginRight: responsiveFontSize(0.8),
        color: "#241332",
        lineHeight: responsiveFontSize(1.95),
        fontSize: responsiveFontSize(1.9)
    },
    textWorkplace: {
        fontFamily: FONT_SF.REGULAR,
        color: "#241332",
        opacity: 0.56,
        fontSize: responsiveFontSize(1.5)
    },
    textNumberStar: {
        paddingTop: responsiveFontSize(0.2),
        paddingRight: responsiveFontSize(0.2),
        fontFamily: FONT_SF.BOLD,
        lineHeight: responsiveFontSize(1.3),
        fontSize: responsiveFontSize(1.3),
        color: Colors.WHITE_COLOR
    },
    boxItem: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        height: DEVICE.DEVICE_HEIGHT * 0.08
    },
    avatarItem: {
        marginLeft: responsiveFontSize(2),
        marginRight: responsiveFontSize(1.5),
        width: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE_RADIUS,
        height: AVATAR_SIZE
    },
    boxrating: {
        flexDirection: "row",
        backgroundColor: Colors.Bittersweet,
        alignItems: "center",
        height: DEVICE.DEVICE_WIDTH * 0.05,
        justifyContent: "space-evenly",
        width: DEVICE.DEVICE_WIDTH * 0.1,
        borderRadius: DEVICE.DEVICE_WIDTH * 0.5
    },
    boxCenter: {
        alignItems: "center",
        justifyContent: "center"
    },
    boxIcon: {
        marginHorizontal: PD.PADDING_1,
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE_RADIUS,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        textAlignVertical: "center"
    },
    containerIcon: {
        flexDirection: "row",
        position: "absolute",
        right: responsiveFontSize(1.5),
        bottom: responsiveFontSize(1.5)
    }
});
