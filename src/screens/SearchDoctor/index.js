import React from "react";
import {
    View,
    ImageBackground,
    AsyncStorage,
    KeyboardAvoidingView,
    TouchableOpacity,
    FlatList,
    ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import { Const, Helper, Colors, Convert } from "helper";
import { types, userActions, doctorActions, chatActions } from "actions/index";
import {
    Container,
    Button,
    AppImage,
    Input,
    HeaderApp,
    AppText,
    ItemListDoctor,
    ItemCategory,
    HeaderTransparent,
    ItemBorder
} from "components";
import { DIMENSION, DEVICE, PD } from "helper/Consts";
import styles from "./styles";
import { ICON, FONT_SF, Images } from "assets";
import I18n from "helper/locales";
import CountryPicker from "react-native-country-picker-modal";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Header } from "react-navigation";
import { listDoctorAsync } from "sagas/doctorSaga";
const _ = require("lodash");

const width = Const.DEVICE.DEVICE_WIDTH;
const height = Const.DEVICE.DEVICE_HEIGHT;

class SearchDoctor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listDoctor: [],
            listTag: [],
            listTag2: [],
            listTagSelected: [],
            tagName: "",
            loading: false
        };
        this.page = 1;
    }
    componentDidMount() {
        const { userReducer, dispatch } = this.props;
        console.log("userReducer", userReducer);
        dispatch(doctorActions.getListDoctorRequest({ page: this.page }));
    }

    componentDidUpdate(prevProps) {
        const { userReducer, doctorReducer } = this.props;
        if (prevProps !== this.props) {
            if (doctorReducer.type === types.GET_LIST_DOCTOR_SUCCESS) {
                let listDoctor = [];
                doctorReducer.dataDoctor.listDoctor.results.map(n => {
                    if (n.username !== userReducer.data.username) listDoctor.push(n);
                });
                this.setState({
                    listDoctor: listDoctor,
                    listTag: [...this.state.listTag, ...doctorReducer.dataDoctor.listTag],
                    listTag2: [...this.state.listTag2, ...doctorReducer.dataDoctor.listTag]
                });
            }
            if (doctorReducer.type === types.SEARCH_DOCTOR_SUCCESS) {
                let listDoctor = [];
                doctorReducer.searchDoctor.results.map(n => {
                    if (n.username !== userReducer.data.username) listDoctor.push(n);
                });
                this.setState({
                    listDoctor
                });
            }
        }
    }
    _onChat(item) {
        const { userReducer, dispatch, eventReducer } = this.props;
        const params = {
            user_ids: [{ user_ids: item.id }, { user_ids: userReducer.data.id }]
        };
        console.log("_onChat", params);

        dispatch(chatActions.requestCreateGroupChat(params));
    }
    onSearch = item => {
        const { dispatch } = this.props;
        const { listTagSelected } = this.state;
        let listTag = [];
        listTagSelected.map(n => listTag.push(n.tag_id));
        const params = { listTagSelected: listTag, name: item };
        if (!_.isEmpty(listTagSelected) || !_.isEmpty(item)) {
            dispatch(doctorActions.searchDoctorRequest(params));
        }
    };
    onChooseTag = item => {
        const { listTagSelected } = this.state;
        console.log("aassassasasasasdsadasdasdasdasdsasd", listTagSelected);
        const listTag = _.findIndex(listTagSelected, el => {
            return el.tag_id == item.tag_id;
        });
        console.log("cascascs", listTag);
        if (listTag > -1) {
            this.onRemoveTag(item);
        } else {
            this.setState({ listTagSelected: [...listTagSelected, item] });
        }
    };
    _onLoadMore() {
        const { userReducer, dispatch, eventReducer, doctorReducer } = this.props;
        const { loading } = this.state;
        if (!_.isEmpty(doctorReducer.dataDoctor)) {
            const countPage = Math.ceil(doctorReducer.dataDoctor.listDoctor.count / 10);
            console.log("userReducer", countPage);
            if (this.page < countPage && loading == false) {
                this.setState({ loading: true });
                this.page = this.page + 1;
                dispatch(doctorActions.getListDoctorRequest({ page: this.page }));
            }
        }
    }
    onSearchTag = tagName => {
        const { listTag, listTag2 } = this.state;
        if (_.isEmpty(tagName)) {
            this.setState({ listTag: listTag2 });
        } else {
            let newData = listTag2.filter(item => {
                const itemData = Convert.removeDiacritics(item.tag_name).toUpperCase();
                const textData = Convert.removeDiacritics(tagName).toUpperCase();
                console.log("ass", textData);
                return itemData.indexOf(textData) > -1;
            });
            this.setState({ listTag: newData });
        }
    };
    onRemoveTag(item) {
        const { listTagSelected } = this.state;
        console.log("aassassasasasasdsadasdasdasdasdsasd", listTagSelected);
        let listTag = _.pick(item, ["tag_id", "tag_name"]);
        const filteredItems = listTagSelected.filter(function(item) {
            return item.tag_id !== listTag.tag_id;
        });
        this.setState({ listTagSelected: filteredItems });
    }
    goNewEvent(item) {
        const { navigation } = this.props;
        navigation.navigate("NewEvent", { dataDoctor: item });
    }
    renderFooter = () => {
        //it will show indicator at the bottom of the list when data is loading otherwise it returns null
        if (!this.state.loading) return null;
        return <ActivityIndicator style={{ color: "#000" }} />;
    };
    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#CED0CE"
                }}
            />
        );
    };
    render() {
        const { navigation } = this.props;
        const { listDoctor, listTag, tag_id, tagName, listTagSelected } = this.state;
        console.log("listTag", listTag);
        return (
            <View style={{ zIndex: 1 }}>
                {/* <HeaderApp
                    isBacks
                    containerStyle={{ zIndex: 5 }}
                    navigation={navigation}
                    title={I18n.t("NewPasswordScreen.newPass")}
                /> */}
                <KeyboardAvoidingView behavior="padding" enabled style={styles.content}>
                    <View
                        style={{ height: DEVICE.DEVICE_HEIGHT * 0.11, zIndex: 2, backgroundColor: Colors.Revolver }}
                    />
                    <View style={{ zIndex: 2 }}>
                        <ItemCategory
                            data={listTag}
                            listTagSelected={listTagSelected}
                            onRemoveTag={item => this.onRemoveTag(item)}
                            onPress={item => this.onChooseTag(item)}
                            tagsSelected={tagName}
                            onSearch={item => this.onSearchTag(item)}
                            onClick={item => this.onSearch(item)}
                        />
                    </View>
                    <View
                        style={{
                            width: "100%",
                            zIndex: 2,
                            marginLeft: responsiveFontSize(2.5),
                            height: DEVICE.DEVICE_HEIGHT * 0.06,
                            justifyContent: "flex-end"
                        }}
                    >
                        <AppText
                            text={I18n.t("header.list")}
                            style={{
                                color: "#998FA2",
                                fontSize: responsiveFontSize(1.7),
                                fontFamily: FONT_SF.SEMIBOLD
                            }}
                        />
                    </View>
                    <View
                        style={{
                            width: "100%",
                            height: DEVICE.DEVICE_HEIGHT * 0.4
                        }}
                    >
                        <FlatList
                            style={styles.container}
                            data={listDoctor}
                            showsVerticalScrollIndicator={false}
                            // ItemSeparatorComponent={this.renderSeparator()}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <ItemListDoctor
                                    checkList
                                    navigation={navigation}
                                    data={item}
                                    onChat={item => this._onChat(item)}
                                    onAdd={item => this.goNewEvent(item)}
                                />
                            )}
                            // onEndReachedThreshold={0.4}
                            // ListFooterComponent={this.renderFooter()}
                            // onEndReached={() => this._onLoadMore()}
                        />
                    </View>
                </KeyboardAvoidingView>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        userReducer: state.userReducer,
        doctorReducer: state.doctorReducer
    };
}
SearchDoctor = connect(mapStateToProps)(SearchDoctor);
export default SearchDoctor;
