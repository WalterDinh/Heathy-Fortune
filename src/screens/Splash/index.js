import React from "react";
import { View, ImageBackground } from "react-native";
import { connect } from "react-redux";
import { AppImage } from "components";
import { DEVICE, DIMENSION } from "helper/Consts";
import LinearGradient from "react-native-linear-gradient";
import { Colors } from "helper";
import { Images } from "assets";
const _ = require("lodash");

class Splash extends React.Component {
    constructor(props) {
        super(props);
        this.firstTime = true;
    }
    componentWillMount() {
        setTimeout(() => {
            if (this.firstTime) {
                this.firstTime = false;
                let { userReducer, navigation } = this.props;
                if (userReducer && !_.isEmpty(userReducer.data)) {
                    navigation.navigate("MainTabContainer");
                    // if (userReducer.data.type === 1) {
                    //     console.log("vao day 2");
                    //     userReducer.data && userReducer.data.active
                    //         ? navigation.navigate("DrawerAppTeacher")
                    //         : navigation.navigate("Element");
                    // } else {
                    //     console.log("vao day 3");
                    //     navigation.navigate("DrawerApp");
                    // }
                } else {
                    navigation.navigate("StartLogin");
                }
            }
        }, 1000);
    }
    renderStatusBar() {
        const { statusBar = true } = this.props;
        return (
            statusBar && (
                <View style={styles.statusBar}>
                    <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
                </View>
            )
        );
    }
    render() {
        return (
            <ImageBackground source={Images.BG} style={{ flex: 1 }}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    {/* <AppImage
                        local
                        resizeMode="contain"
                        style={{ width: DEVICE.DEVICE_WIDTH * 0.35, height: DEVICE.DEVICE_WIDTH * 0.35 }}
                        // source={require("../../assets/backgroundLogin.png")}
                        source={require("../../assets/logoLogin.png")}
                    /> */}
                    <LinearGradient
                        colors={Colors.GRADIENT1}
                        style={{
                            height: DEVICE.DEVICE_HEIGHT,
                            width: DEVICE.DEVICE_WIDTH,
                            top: 0,
                            bottom: 0,
                            position: "absolute",
                            zIndex: -1
                        }}
                    />
                </View>
            </ImageBackground>
        );
    }
}

const styles = {
    statusBar: {
        position: "absolute",
        top: 0,
        width: DEVICE.DEVICE_WIDTH,
        backgroundColor: Colors.STATUSBAR,
        height: DIMENSION.STATUS_BAR_HEIGHT
    }
};

function mapStateToProps(state) {
    return {
        userReducer: state.userReducer
    };
}
Splash = connect(mapStateToProps)(Splash);
export default Splash;
