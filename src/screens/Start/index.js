import React from "react";
import { View, ImageBackground } from "react-native";
import { connect } from "react-redux";
import { AppImage, AppText, Button, AppImageCircle } from "components";
import { ICON, Images } from "assets";
import { PD, DEVICE } from "helper/Consts";
import LinearGradient from "react-native-linear-gradient";
import { Colors } from "helper";
import styles from "./styles";

const _ = require("lodash");

class Start extends React.Component {
    constructor(props) {
        super(props);
        this.firstTime = true;
    }
    onPress = () => {};
    render() {
        return (
            <ImageBackground source={Images.BG} style={{ width: "100%", height: "100%" }}>
                <AppImage local source={ICON.INF} style={styles.icon} resizeMode={"contain"} />
                <View style={{ flex: 1, justifyContent: "flex-end", paddingVertical: PD.PADDING_6 }}>
                    <View style={styles.mg}>
                        <Button
                            title="LOGIN"
                            isShadow
                            onPress={() => this.onPress()}
                            rightIcon
                            style={{ width: "94%", backgroundColor: Colors.Deluge }}
                        />
                    </View>
                    <View style={styles.mg}>
                        <Button
                            title="REGISTER"
                            isShadow
                            onPress={() => this.onPress()}
                            rightIcon
                            style={{ width: "90%", backgroundColor: Colors.Hopbush }}
                        />
                    </View>
                </View>
            </ImageBackground>
        );
    }
}
export default Start;
