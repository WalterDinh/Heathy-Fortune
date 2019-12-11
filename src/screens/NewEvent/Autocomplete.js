import React from "react";
import { Animated, StyleSheet, View, FlatList, Keyboard, KeyboardAvoidingView } from "react-native";
import { Button, HeaderTransparent, AppText } from "components";
import { connect } from "react-redux";
import { DEVICE, PD, DIMENSION } from "helper/Consts";
import { Colors, GlobalStyles } from "helper";
import I18n from "helper/locales";
import { isIphoneX } from "react-native-iphone-x-helper";
import _ from "lodash";
import { removeDiacritics } from "helper/convertLang";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Icon, Input } from "native-base";
const hipSlop = {
    top: 8,
    bottom: 8,
    left: 8,
    right: 8
};
class Autocomplete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            translateY: new Animated.Value(DEVICE.DEVICE_HEIGHT),
            value: "",
            selectedTag: [],
            tagData: []
        };
    }

    componentDidMount() {
        const { userReducer, doctorReducer } = this.props;
        const { tagData, data } = userReducer;
        const { dataDoctor } = doctorReducer;

        this.setState({ tagData: dataDoctor.listDoctor.results });
        let tagDataUser = data.tag;
        let mainArray = tagDataUser;
        this.setState({ selectedTag: mainArray });
    }

    componentDidUpdate(prevProps) {
        const { show } = this.props;
        if (prevProps.show !== show) {
            if (this.props.show) {
                Animated.spring(this.state.translateY, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true
                }).start();
            } else {
                Animated.spring(this.state.translateY, {
                    toValue: DEVICE.DEVICE_HEIGHT,
                    duration: 1000,
                    useNativeDriver: true
                }).start();
            }
        }
    }

    _onPressItem(item) {
        let { selectedTag } = this.state;
        const selected = _.findIndex(selectedTag, el => {
            return el.tag_id == item.tag_id;
        });
        if (selected > -1) {
            selectedTag.splice(selected, 1);
        } else {
            selectedTag.push(item);
        }
        this.setState({ selectedTag });
    }

    _onSearch(text) {
        const { userReducer, doctorReducer } = this.props;
        const { tagData } = userReducer;
        const { dataDoctor } = doctorReducer;
        console.log("dataDoctor", dataDoctor.listDoctor.results);
        let dataTag = [];
        this.setState({ value: text }, () => {
            if (text) {
                const textSearch = removeDiacritics(text.toLowerCase());
                for (i in dataDoctor.listDoctor.results) {
                    const stringSearch = removeDiacritics(dataDoctor.listDoctor.results[i].tag_name.toLowerCase());
                    if (_.includes(stringSearch, textSearch)) {
                        dataTag.push(dataDoctor.listDoctor.results[i]);
                    }
                }
            } else {
                dataTag = dataDoctor.listDoctor.results;
            }
            this.setState({ tagData: dataTag });
        });
    }

    _onClose() {
        const { userReducer, onClose = () => {} } = this.props;
        const { tagData, data } = userReducer;
        const { dataDoctor } = doctorReducer;
        Keyboard.dismiss();
        this.setState({ tagData: dataDoctor.listDoctor.results });
        onClose();
    }

    renderItem(item, index) {
        const { selectedTag } = this.state;
        const selected = _.findIndex(selectedTag, el => {
            return el.tag_id == item.tag_id;
        });
        return (
            <View key={index} style={{ paddingVertical: PD.PADDING_2 }}>
                <Button
                    textContent
                    tStyle={{ color: Colors.Victoria }}
                    title={item.username}
                    onPress={() => this._onPressItem(item)}
                />
            </View>
        );
    }

    renderSelectedTag(item, index) {
        return (
            <View style={styles.tagWrap}>
                <View style={styles.textTagWrap}>
                    <AppText numberOfLines={1} text={item.username} style={styles.textTag} />
                </View>
                <TouchableOpacity hipSlop={hipSlop} onPress={() => this._onPressItem(item)}>
                    <Icon name="close" type="MaterialCommunityIcons" style={styles.closeIcon} />
                </TouchableOpacity>
            </View>
        );
    }

    _clearInput() {
        this.refInput._root.clear();
        this._onSearch("");
    }

    render() {
        const { onComplete = () => {} } = this.props;
        const { value, selectedTag, tagData } = this.state;
        console.log("dataDoctor", tagData);
        return (
            <Animated.View style={[styles.container, { transform: [{ translateY: this.state.translateY }] }]}>
                <View style={{ flex: 1, backgroundColor: Colors.Athens_Gray, paddingBottom: isIphoneX() ? 30 : 0 }}>
                    <HeaderTransparent
                        containerStyle={{ backgroundColor: Colors.Victoria }}
                        // title={I18n.t("profileEdit.selectedTag")}
                        title="Tìm kiếm"
                        onPressBack={() => this._onClose()}
                    />
                    <View style={styles.searchContainer}>
                        <View style={styles.inputWrap}>
                            <Icon name="magnify" type="MaterialCommunityIcons" style={styles.icon} />
                            <Input
                                ref={ref => (this.refInput = ref)}
                                placeholder={I18n.t("profileEdit.searchCondition")}
                                value={value}
                                onChangeText={e => this._onSearch(e)}
                            />
                            <Icon
                                name="close"
                                type="MaterialCommunityIcons"
                                style={styles.icon}
                                onPress={() => this._clearInput()}
                            />
                        </View>
                        <View style={{ width: "100%", paddingTop: PD.PADDING_1, flex: 1 }}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                numColumns={2}
                                data={selectedTag}
                                keyExtractor={(item, index) => `${index}`}
                                renderItem={({ item, index }) => this.renderSelectedTag(item, index)}
                                extraData={selectedTag.length}
                            />
                        </View>
                        <View style={{ width: "100%", flex: 5 }}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                numColumns={1}
                                data={tagData}
                                keyExtractor={(item, index) => `${index}`}
                                renderItem={({ item, index }) => this.renderItem(item, index)}
                                extraData={selectedTag.length}
                            />
                        </View>
                    </View>
                    <View style={{ paddingVertical: PD.PADDING_1 }}>
                        <Button
                            title={`${I18n.t("profileEdit.complete")} (${selectedTag.length})`}
                            style={{ height: 45, width: "90%" }}
                            onPress={() => onComplete(selectedTag)}
                        />
                    </View>
                </View>
            </Animated.View>
        );
    }
}

function mapStateToProps(state) {
    return {
        userReducer: state.userReducer,
        doctorReducer: state.doctorReducer
    };
}
Autocomplete = connect(mapStateToProps)(Autocomplete);

export default Autocomplete;

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        backgroundColor: Colors.WHITE_COLOR,
        width: DEVICE.DEVICE_WIDTH,
        shadowColor: "#cccccc",
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: PD.PADDING_4,
        shadowOpacity: 0.5,
        borderRadius: PD.PADDING_4,
        zIndex: 9999999,
        height: DEVICE.DEVICE_HEIGHT
    },
    searchContainer: {
        // justifyContent: "center",
        // alignItems: "center",
        alignSelf: "center",
        backgroundColor: Colors.WHITE_COLOR,
        width: DEVICE.DEVICE_WIDTH * 0.9,
        borderRadius: PD.PADDING_4,
        flex: 1,
        marginTop: PD.PADDING_2
    },
    btnItemUnSelected: {
        backgroundColor: "transparent",
        width: "90%",
        height: 45,
        borderColor: Colors.Victoria,
        borderWidth: 1
    },
    btnItemSelected: {
        backgroundColor: Colors.Victoria
    },
    tagContent: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "90%",
        flexWrap: "wrap",
        height: "auto",
        maxHeight: DEVICE.DEVICE_HEIGHT * 0.15,
        paddingHorizontal: PD.PADDING_3,
        backgroundColor: Colors.WHITE_COLOR,
        paddingVertical: PD.PADDING_3,
        alignSelf: "center",
        borderRadius: PD.PADDING_4
    },
    tagWrap: {
        backgroundColor: Colors.Victoria,
        width: "44%",
        marginBottom: PD.PADDING_2,
        marginHorizontal: "3%",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: PD.PADDING_4,
        paddingVertical: PD.PADDING_1,
        paddingHorizontal: PD.PADDING_1,
        flexDirection: "row"
    },
    textTagWrap: {
        flex: 8,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center"
    },
    textTag: {
        color: Colors.WHITE_COLOR,
        fontSize: responsiveFontSize(2),
        textAlign: "center"
    },
    closeIcon: {
        color: Colors.WHITE_COLOR,
        fontSize: responsiveFontSize(3),
        flex: 2
    },
    icon: {
        color: Colors.Victoria,
        fontSize: responsiveFontSize(4)
    },
    inputWrap: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: PD.PADDING_5,
        paddingHorizontal: PD.PADDING_2,
        borderBottomWidth: 1,
        borderColor: Colors.Athens_Gray
        // height: 45
    }
});
