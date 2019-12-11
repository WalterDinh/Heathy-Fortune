import React from "react";
import { View, Alert, FlatList, TouchableOpacity, Dimensions, WebView } from "react-native";
import { connect } from "react-redux";
import { AppImage, AppText, Button, HeaderTransparent } from "components";
import styles from "./styles";
import { USER_TYPE, DIMENSION, DEVICE, PD } from "helper/Consts";
import { Icon, Fab } from "native-base";
import { GlobalStyles, Colors } from "helper";
import I18n from "helper/locales";
import { logoutRequest } from "actions/userActions";
import _ from "lodash";
import { LOGIN_SUCCESS } from "actions/types";
import { userActions, newsActions, types } from "actions";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { FONT_SF } from "assets";
import { getData } from "actions/newsActions";
import moment from "moment";
import HTML from "react-native-render-html";

const DEFAULT_AVATAR = "https://znews-photo.zadn.vn/Uploaded/mdf_kxrxdf/2019_07_01/13_Ha_Giang.jpg";

class News extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            list: {},
            keyboardHeight: 10,
            spinner: true
        };
        this.flatlist = 1;
    }
    componentDidMount() {
        const { dispatch, navigation, newsReducer } = this.props;
        this.setState({ loading: true });
        dispatch(newsActions.getNewsRequest());
        this.setState({ list: newsReducer.listNews.results });
    }

    componentDidUpdate(prevProps) {
        const { userReducer, newsReducer } = this.props;
        if (prevProps !== this.props) {
            if (newsReducer.type === types.GET_NEWS_SUCCESS) {
                console.log("vào đây");
                this.setState({
                    list: newsReducer.listNews.results
                });
            }
        }
    }
    _onPressButton(item) {
        this.props.navigation.navigate("DetailNews", { item: item });
    }

    renderCard(item) {
        return (
            <TouchableOpacity style={styles.card} onPress={() => this._onPressButton(item)}>
                <AppText
                    text={item.title == null ? "trống" : item.title}
                    style={{
                        fontSize: responsiveFontSize(2.5),
                        fontFamily: FONT_SF.BOLD,
                        lineHeight: responsiveFontSize(2.5)
                    }}
                />
                <AppText
                    text={moment(item.created_time == null ? 0 : item.created_time).format("LLL")}
                    style={{
                        fontSize: responsiveFontSize(2),
                        lineHeight: responsiveFontSize(2.5),
                        color: "#9599B3",
                        marginBottom: PD.PADDING_3
                    }}
                />
                {item.img ? <AppImage source={{ uri: item.img }} resizeMode="cover" style={styles.img} /> : null}
                <AppText
                    text={item.content}
                    style={{
                        fontSize: responsiveFontSize(2),
                        lineHeight: responsiveFontSize(2.5),
                        color: "#9599B3",
                        marginTop: PD.PADDING_4
                    }}
                />
                <TouchableOpacity
                    style={{
                        marginTop: DEVICE.DEVICE_HEIGHT * 0.04,
                        // height: responsiveFontSize(2.5),
                        alignItems: "flex-end"
                    }}
                    onPress={() => this._onPressButton(item)}
                >
                    <AppText
                        text="Read more"
                        style={{
                            fontSize: responsiveFontSize(2),
                            lineHeight: responsiveFontSize(2.5),
                            color: "#D47FA6",
                            marginBottom: PD.PADDING_3
                        }}
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    }

    renderEmpty() {
        return (
            <View
                style={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                    backgroundColor: "red",
                    height: "100%",
                    width: "100%"
                }}
            >
                <AppText text="Không có tin tức" style={{ fontSize: responsiveFontSize(2.5) }} />
            </View>
        );
    }
    renderBody() {
        const { list, keyboardHeight } = this.state;

        return (
            <FlatList
                ref={ref => (this.flatlist = ref)}
                contentContainerStyle={{ paddingBottom: keyboardHeight }}
                showsVerticalScrollIndicator={false}
                data={list}
                extraData={this.state}
                renderItem={({ item }) => this.renderCard(item)}
                keyExtractor={(item, index) => `${index}`}
            />
        );
    }

    render() {
        const { list } = this.state;
        console.log("=====================================");
        console.log("list", list);
        console.log("=====================================");
        return (
            <View style={styles.containerStyle}>
                {/* {this.renderCard()} */}
                {this.renderBody()}
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        newsReducer: state.newsReducer
    };
}
News = connect(mapStateToProps)(News);

export default News;
