import React from "react";
import { View } from "react-native";
import { DIMENSION } from "helper/Consts";

class AppContainer extends React.PureComponent {
    render() {
        const { children, style } = this.props;
        return (
            <View style={[{ flex: 1 }, style]}>
                <View style={{ flex: 1, marginTop: DIMENSION.NEW_HEADER_HEIGHT }}>{children}</View>
            </View>
        );
    }
}

export default AppContainer;
