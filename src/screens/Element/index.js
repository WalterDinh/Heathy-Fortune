import React from "react";
import { View, ScrollView, FlatList } from "react-native";
import { connect } from "react-redux";
import {
    Container,
    Button,
    Input,
    AppImageCircle,
    FloatInput,
    FloatCalendar,
    CardIteam,
    ScheduleCard
} from "components";
import styles from "./styles";
import { ICON } from "assets";
import { Colors, Helper } from "helper";
import { Const } from "helper";
const moment = require("moment");
const _ = require("lodash");
const dataSchedule = [
    {
        id: 1,
        time: 1569551084,
        title: "Đặt lịch hẹn - Tư vấn về sức khoẻ bé",
        user: { name: "Diana Mayer", avatar: "https://i.imgur.com/Htnp2Ra.png" }
    },
    {
        id: 1,
        time: 1569551084,
        title: "Đặt lịch hẹn - Tư vấn về sức khoẻ bé",
        user: { name: "Diana Mayer", avatar: "https://i.imgur.com/Htnp2Ra.png" }
    }
];
class Element extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text1: "",
            text2: "",
            text3: "",
            text4: "",
            text5: ""
        };
        this.inputRefs = {};
    }

    onPress = () => {
        console.log(Helper.checkValid(this.inputRefs));
    };

    convertAMPM(time) {
        const AMPM = moment.unix(time).format("A");
        if (AMPM == "AM") {
            return " sáng ";
        } else {
            return " chiều ";
        }
    }

    renderItem(item, index) {
        let time =
            moment.unix(item.time).format("h") +
            "h" +
            moment.unix(item.time).format("mm") +
            this.convertAMPM(item.time) +
            moment.unix(item.time).format("DD/MM");

        return (
            <ScheduleCard
                key={index}
                userName={item.user.name}
                avatar={{ uri: item.user.avatar }}
                title={item.title}
                time={time}
            />
        );
    }
    render() {
        return (
            <ScrollView style={{ backgroundColor: Colors.Victoria }}>
                <FlatList data={dataSchedule} renderItem={({ item, index }) => this.renderItem(item, index)} />
                <View style={styles.mg}>
                    <FloatInput
                        containerStyle={{ width: "80%" }}
                        value={this.state.text4}
                        onChangeText={e => this.setState({ text4: e })}
                        label="Nơi ở"
                    />
                </View>
                <View style={styles.mg}>
                    <FloatCalendar
                        refInput={ref => (this.input = ref)}
                        containerStyle={{ width: "80%" }}
                        onPress={() => this.setState({ text5: "06-06-2018" })}
                        value={this.state.text5}
                        label="Ngày sinh"
                    />
                </View>
                <View style={styles.mg}>
                    <Button title={"{ a: a }"} />
                </View>
                <View style={styles.mg}>
                    <AppImageCircle source={ICON.PHONE_BLUE} />
                </View>
                <View style={styles.mg}>
                    <AppImageCircle checked source={ICON.PHONE_BLUE} />
                </View>
                <View style={styles.mg}>
                    <Button title="ĐĂNG NHẬP" isShadow onPress={() => console.log("press")} />
                </View>
                <View style={styles.mg}>
                    <Button
                        title="ĐĂNG NHẬP"
                        isShadow
                        onPress={() => console.log("press")}
                        leftIcon
                        lSource={ICON.MARKER_BLUE}
                    />
                </View>
                <View style={styles.mg}>
                    <Button
                        title="ĐĂNG NHẬP"
                        isShadow
                        onPress={() => this.onPress()}
                        rightIcon
                        rSource={ICON.MARKER_BLUE}
                    />
                </View>
                <View style={styles.mg}>
                    <Button
                        title="ĐĂNG NHẬP"
                        isShadow
                        onPress={() => console.log("press")}
                        leftIcon
                        lSource={ICON.MARKER_BLUE}
                        rightIcon
                        rSource={ICON.MARKER_BLUE}
                    />
                </View>
                <View style={styles.mg}>
                    <Button
                        transparent
                        title="ĐĂNG NHẬP"
                        isShadow
                        onPress={() => console.log("press")}
                        leftIcon
                        lSource={ICON.MARKER_BLUE}
                        rightIcon
                        rSource={ICON.MARKER_BLUE}
                    />
                </View>
                <View style={styles.mg}>
                    <Button
                        style={{ width: "80%", backgroundColor: Colors.WHITE_COLOR }}
                        tStyle={{ color: Colors.MAIN_COLOR }}
                        title="ĐĂNG NHẬP NGAY"
                        isShadow
                        onPress={() => console.log("press")}
                    />
                </View>
                <View style={styles.mg}>
                    <Button
                        style={{ width: "80%" }}
                        transparent
                        title="TẠO TÀI KHOẢN"
                        isShadow
                        onPress={() => console.log("press")}
                    />
                </View>
                <View style={styles.mg}>
                    <Input
                        clearButton
                        nameValue="Email"
                        type={Const.INPUT_TYPE.EMAIL}
                        onRef={ref => (this.inputRefs["email"] = ref)}
                        placeholder="Email hoặc số điện thoại"
                        placeholderTextColor={Colors.GRAY_TEXT_COLOR}
                        onChangeText={e => this.setState({ text1: e })}
                        value={this.state.text1}
                    />
                </View>
                <View style={styles.mg}>
                    <Input
                        onRef={ref => (this.inputRefs["phoneNumber"] = ref)}
                        clearButton
                        leftIcon
                        type={Const.INPUT_TYPE.PHONE_NUMBER}
                        transparent
                        placeholder="Số điện thoại"
                        lSource={ICON.PHONE_BLUE}
                        lBlurSource={ICON.PHONE_WHITE}
                        onChangeText={e => this.setState({ text2: e })}
                        value={this.state.text2}
                    />
                </View>
            </ScrollView>
        );
    }
}

function mapStateToProps(state) {
    return {};
}
Element = connect(mapStateToProps)(Element);
export default Element;
