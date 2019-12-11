import React from "react";
import { View, Alert, ImageBackground, TouchableOpacity, StatusBar, Dimensions, TextInput } from "react-native";
import { connect } from "react-redux";
import { Const, Colors } from "helper/index";
import { types, userActions } from "actions/index";
import { Container, Button, AppImage, Input, AppText, AppImageCircle, AppSlider } from "components/index";
import styles from "./styles";
import I18n from "helper/locales";
import { Icon } from "native-base";
import Modal from "react-native-modal";

const width = Const.DEVICE.DEVICE_WIDTH;
const height = Const.DEVICE.DEVICE_HEIGHT;

class EndCall extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 50
        };
    }

    componentDidMount() {}

    componentDidUpdate() {}

    render() {
        const { value } = this.state;
        const { isModalVisible, onBackdropPress, onPress, duration, startTime, price, balance } = this.props;
        return (
            <Modal transparent={true} isVisible={isModalVisible} onBackdropPress={onBackdropPress}>
                <View style={{ width: "100%", height: "100%" }}>
                    <View style={{ marginTop: "20%", alignItems: "center", witdh: "80%" }}>
                        <View
                            style={{
                                width: 80,
                                height: 80,
                                justifyContent: "center",
                                borderRadius: 40,
                                borderColor: "white",
                                alignItems: "center",
                                backgroundColor: Colors.WHITE_COLOR,
                                zIndex: 999
                            }}
                        >
                            <View
                                style={{
                                    width: 70,
                                    height: 70,
                                    justifyContent: "center",
                                    borderRadius: 35,
                                    alignItems: "center",
                                    backgroundColor: Colors.MAIN_COLOR
                                }}
                            >
                                <AppImage
                                    source={require("../../assets/icon/ic-horizontalCall.png")}
                                    style={{ width: 30, height: 15 }}
                                />
                            </View>
                        </View>
                        <View
                            style={{
                                marginTop: -40,
                                backgroundColor: "white",
                                padding: 30,
                                width: "90%",
                                alignItems: "center",
                                borderRadius: 5
                            }}
                        >
                            <AppText text="Kết thúc cuộc gọi" style={styles.titleAlert} />

                            <AppText text="Thời gian gọi: " style={styles.contentAlert}>
                                <AppText text={duration} style={{ fontWeight: "normal" }} />
                            </AppText>
                            <AppText text="Bắt đầu từ: " style={styles.contentAlert}>
                                <AppText text={startTime} style={{ fontWeight: "normal" }} />
                            </AppText>
                            <AppText text="Tổng cước thanh toán: " style={styles.contentAlert}>
                                <AppText text={price + " đ"} style={{ fontWeight: "normal" }} />
                            </AppText>
                            <AppText text="Số dư tài khoản: " style={styles.contentAlert}>
                                <AppText text={balance + " đ"} style={{ fontWeight: "normal" }} />
                            </AppText>
                            <View style={{ marginTop: 5 }}>
                                <AppText text="Đánh giá chất lượng" style={styles.contentAlert} />
                            </View>
                            <View style={{ height: 30, width: "90%" }}>
                                <AppSlider value={value} onSlidingComplete={value => this.setState({ value })} />
                            </View>
                            <AppText
                                text={`(Điểm đánh giá : ${value}/100)`}
                                style={{
                                    marginTop: 10,
                                    fontSize: Const.FONT_SIZE.CONTENT_SIZE + 4
                                }}
                            />
                            <Button
                                style={{ width: 150, height: 40, marginTop: 20 }}
                                title={"OK"}
                                onPress={() => onPress(value)}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

function mapStateToProps(state) {
    return {};
}
EndCall = connect(mapStateToProps)(EndCall);

export default EndCall;
