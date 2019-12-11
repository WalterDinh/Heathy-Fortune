import React from "react";
import { Dimensions } from "react-native";
import { connect } from "react-redux";
import { Spinner } from "native-base";

class LoadingScreen extends React.Component {
    // componentDidUpdate(prevProps) {
    //     console.log("componentDidUpdate", prevProps);

    //     const { navigation } = this.props;
    //     const chatRoomInfo = navigation.getParam("chatRoomInfo");
    //     const id = this.props.navigation.getParam("id");
    //     navigation.replace("Chat", { id, chatRoomInfo }, `${id}-chat`);
    // }

    // componentDidMount() {
    //     console.log("componentDidMount", this.props);

    //     const { navigation } = this.props;
    //     const chatRoomInfo = navigation.getParam("chatRoomInfo");
    //     const id = this.props.navigation.getParam("id");
    //     navigation.replace("Chat", { id, chatRoomInfo }, `${id}-chat`);
    // }

    render() {
        return <Spinner />;
    }
}

function mapStateToProps(state) {
    return {};
}
LoadingScreen = connect(mapStateToProps)(LoadingScreen);

export default LoadingScreen;
