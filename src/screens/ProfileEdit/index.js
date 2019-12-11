import React from "react";
import { View, KeyboardAvoidingView, ScrollView, Keyboard, TouchableOpacity, FlatList } from "react-native";
import { connect } from "react-redux";
import { AppImage, AppText, Button, HeaderTransparent, Input, AppSpinner } from "components";
import styles from "./styles";
import { PD, DEVICE, USER_TYPE } from "helper/Consts";
import { Icon, Tabs, Tab, Col, Row } from "native-base";
import I18n from "helper/locales";
import ImagePicker from "react-native-image-picker";
import ImageResizer from "react-native-image-resizer";
import _ from "lodash";
import { Colors, Const, ServiceHandle } from "helper";
import { alertActions, userActions } from "actions";
import uuid from "uuid";
import { loginSuccess } from "actions/loginActions";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import AutocompleteTags from "./AutocompleteTags";
import { FONT_SF } from "assets";
import { numberToCurrency, currencyToNumber } from "helper/convertLang";
const DEFAULT_AVATAR = "https://i.imgur.com/Htnp2Ra.png";
class ProfileEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            imgUrl: "",
            newPass: "",
            oldPass: "",
            confirmNewPass: "",
            spinner: false,
            errorText: "",
            modalTag: false,
            selectedItem: [],
            keyboardHeight: 0,
            price: 0,
            focus: false,
            priceShow: 0
        };
    }

    componentDidMount() {
        const { userReducer, dispatch } = this.props;
        dispatch(userActions.requestTag());
        const { data } = userReducer;
        let tagDataUser = data.tag_user;
        console.log("datasdasdadad", tagDataUser);

        let mainArray = [];
        let indx = 0;
        for (const i in tagDataUser) {
            mainArray.push({ tag_id: tagDataUser[i].tag_id });
            indx++;
        }
        if (indx == mainArray.length) {
            this.setState({ selectedItem: mainArray });
        }
        this.setState({
            lastName: data.last_name,
            firstName: data.first_name,
            imgUrl: data.img_url ? data.img_url : DEFAULT_AVATAR,
            price: data.price,
            priceShow: numberToCurrency(data.price)
            // oldPass: userReducer.password
        });
        // KEYBOARD SHOW EVENT
        this.keyboardWillShowListener = Keyboard.addListener("keyboardDidShow", e => {
            this.setState({ keyboardHeight: e.endCoordinates.height - 60 });
        });

        // KEYBOARD HIDE EVENT
        this.keyboardWillShowListener = Keyboard.addListener("keyboardDidHide", e => {
            this.setState({ keyboardHeight: 0 });
        });
    }

    _setTextFunc(e, title) {
        switch (title) {
            case I18n.t("profileEdit.firstName"):
                return this.setState({ firstName: e });
            case I18n.t("profileEdit.lastName"):
                return this.setState({ lastName: e });
            case I18n.t("profileEdit.newPassword"):
                return this.setState({ newPass: e, errorText: "" });
            case I18n.t("profileEdit.newPasswordConfirm"):
                return this.setState({ confirmNewPass: e, errorText: "" });
            case I18n.t("profileEdit.oldPassword"):
                return this.setState({ oldPass: e, errorText: "" });
            case I18n.t("profileEdit.price"):
                let firstIsZero = e.split("")[0] == 0 || e.split("")[0] == "0";
                let removeZero = e.substring(1, e.length);
                let saveNumber = firstIsZero ? removeZero : e;
                return this.setState({ price: saveNumber, priceShow: numberToCurrency(saveNumber) });
        }
    }

    _checkChangePass() {
        const { newPass, confirmNewPass } = this.state;
        if (newPass.trim() && confirmNewPass.trim()) {
            return false;
        } else {
            return true;
        }
    }

    _checkErrorPassword() {
        const { newPass, confirmNewPass } = this.state;
        let errorText = "";
        if (newPass.length < 8) {
            errorText = I18n.t("profileEdit.error8");
        } else if (newPass != confirmNewPass) {
            errorText = I18n.t("profileEdit.errorSame");
        }
        return errorText;
    }

    async _saveChangePass() {
        const { dispatch } = this.props;
        const { newPass, oldPass } = this.state;
        const params = { new_password: newPass, old_password: oldPass };
        const errorText = await this._checkErrorPassword();
        if (errorText) {
            this.setState({ errorText });
        } else {
            this.setState({ errorText: "" });
            this.setState({ spinner: true });
            const result = await userActions.updateUserPassword(params);
            this.setState({ spinner: false }, () => {
                if (result.error) {
                    setTimeout(() => {
                        const paramsAlert = {
                            content: I18n.t("profileEdit.updatePassFailed"),
                            title: I18n.t("Alert.notice"),
                            type: Const.ALERT_TYPE.ERROR
                        };
                        dispatch(alertActions.openAlert(paramsAlert));
                    }, 500);
                } else {
                    this.setState({ newPass: "", confirmNewPass: "", oldPas: "" });
                    setTimeout(() => {
                        const paramsAlert = {
                            content: I18n.t("profileEdit.updatePassSuccess"),
                            title: I18n.t("Alert.notice"),
                            type: Const.ALERT_TYPE.SUCCESS
                        };
                        dispatch(alertActions.openAlert(paramsAlert));
                    }, 500);
                }
            });
        }
    }

    _checkChanged() {
        const { userReducer } = this.props;
        const { data } = userReducer;
        const { last_name, first_name, img_url, type } = data;
        const isCustomer = type == USER_TYPE.CUSTOMER;
        const { firstName, lastName, imgUrl, priceShow } = this.state;
        const changed =
            firstName != first_name ||
            last_name != lastName ||
            img_url != imgUrl ||
            priceShow != numberToCurrency(data.price);
        const notEmptyExpert = firstName && lastName && imgUrl && priceShow.toString();
        const notEmptyCustomer = firstName && lastName && imgUrl;
        const notEmpty = (isCustomer && notEmptyCustomer) || notEmptyExpert;
        if (changed && notEmpty) {
            return false;
        } else {
            return true;
        }
    }

    _saveChange() {
        const { userReducer, dispatch } = this.props;
        const { firstName, lastName, imgUrl, selectedItem, price } = this.state;
        console.log("selectedItem", selectedItem);
        let listTag = [];
        selectedItem.map(n => listTag.push(_.pick(n, ["tag_id"])));
        this.setState({ spinner: true }, async () => {
            let param = {};
            if (userReducer.data.type == USER_TYPE.CUSTOMER) {
                param = {
                    id: userReducer.data.id,
                    body: {
                        first_name: firstName.trim(),
                        last_name: lastName.trim(),
                        img_url: imgUrl.trim(),
                        tag_user: listTag
                    }
                };
            } else {
                param = {
                    id: userReducer.data.id,
                    body: {
                        first_name: firstName.trim(),
                        last_name: lastName.trim(),
                        img_url: imgUrl.trim(),
                        tag_user: listTag,
                        price
                    }
                };
            }
            console.log("param", param);

            const result = await userActions.updateUserProfile(param);
            this.setState({ spinner: false }, () => {
                if (result.error) {
                    setTimeout(() => {
                        const paramsAlert = {
                            content: I18n.t("profileEdit.updateFailed"),
                            title: I18n.t("Alert.notice"),
                            type: Const.ALERT_TYPE.ERROR
                        };
                        dispatch(alertActions.openAlert(paramsAlert));
                    }, 100);
                } else {
                    const { response } = result;
                    dispatch(loginSuccess(response));
                    setTimeout(() => {
                        const paramsAlert = {
                            content: I18n.t("profileEdit.updateSuccess"),
                            title: I18n.t("Alert.notice"),
                            type: Const.ALERT_TYPE.SUCCESS
                        };
                        dispatch(alertActions.openAlert(paramsAlert));
                    }, 100);
                }
            });
        });
    }

    async _resizeImage(imageData) {
        const size = 800;
        let width = 0;
        let height = 0;
        if (imageData.width / imageData.height > 1) {
            width = size;
            height = (size * imageData.height) / imageData.width;
        } else {
            height = size;
            width = (size * imageData.width) / imageData.height;
        }
        const response = await ImageResizer.createResizedImage(imageData.uri, width, height, "PNG", 100);
        return response;
    }

    _changeAvatar() {
        const { dispatch, userReducer } = this.props;
        const { data } = userReducer;
        const { img_url } = data;
        const options = {
            base64: true,
            title: I18n.t("profileEdit.changeAvatarTitle"),
            takePhotoButtonTitle: I18n.t("profileEdit.takePhoto"),
            chooseFromLibraryButtonTitle: I18n.t("profileEdit.library"),
            cancelButtonTitle: I18n.t("profileEdit.close"),
            mediaType: "photo",
            storageOptions: {
                skipBackup: true,
                path: "images"
            }
        };
        ImagePicker.showImagePicker(options, async response => {
            if (response.didCancel) {
            } else if (response.error) {
                setTimeout(() => {
                    const paramsAlert = {
                        content: I18n.t("Alert.uploadimageError"),
                        title: I18n.t("Alert.notice"),
                        type: Const.ALERT_TYPE.ERROR
                    };
                    dispatch(alertActions.openAlert(paramsAlert));
                }, 100);
            } else {
                this.setState({ imgUrl: "" });
                const source = await this._resizeImage(response);
                let _id = uuid.v4();
                const fileUP = { uri: source.uri, type: "image/png", name: _id };
                const dataResult = await ServiceHandle.uploadImage(fileUP);
                if (dataResult.error) {
                    this.setState({ imgUrl: img_url });
                    setTimeout(() => {
                        const paramsAlert = {
                            content: I18n.t("Alert.uploadimageError"),
                            title: I18n.t("Alert.notice"),
                            type: Const.ALERT_TYPE.ERROR
                        };
                        dispatch(alertActions.openAlert(paramsAlert));
                    }, 100);
                } else {
                    this.setState({ imgUrl: dataResult.response.data.link });
                }
            }
        });
    }

    _changeTag() {
        this.setState({ modalTag: true });
    }

    _changeTagClose() {
        this.setState({ modalTag: false });
    }

    _onComplete(data) {
        this.setState({ selectedItem: data }, () => {
            this._changeTagClose();
            this._saveChange();
        });
    }

    renderTextField(title, placeholder, value) {
        const isPrice = title === I18n.t("profileEdit.price");
        return (
            <View style={{ width: "100%", paddingTop: PD.PADDING_2 }}>
                <AppText text={title} style={styles.titleField} />
                <View style={{ height: 45, width: "100%" }}>
                    <Input
                        leftIconName={isPrice ? "credit-card" : "account-outline"}
                        placeholder={placeholder}
                        value={value.toString()}
                        containerStyles={{ width: "100%" }}
                        inputStyle={{ textAlign: "left" }}
                        onChangeText={e => this._setTextFunc(e, title)}
                        maxLength={30}
                        autoCorrect={false}
                        keyboardType={isPrice ? "decimal-pad" : "default"}
                        onFocus={() => isPrice && this.setState({ focus: true })}
                        onBlur={() => isPrice && this.setState({ focus: false })}
                    />
                </View>
            </View>
        );
    }

    renderTag() {
        const { dispatch, userReducer } = this.props;
        const { data } = userReducer;
        const { tag_user } = data;
        if (data.type == USER_TYPE.CUSTOMER) {
            return null;
        }

        return (
            <View style={{ width: "100%", paddingTop: PD.PADDING_2 }}>
                <AppText text={I18n.t("profileEdit.tag")} style={styles.titleField} />
                <Button
                    onPress={() => this._changeTag()}
                    style={styles.tagContent}
                    centerContent={
                        tag_user.length == 0 ? (
                            <AppText
                                text={I18n.t("profileEdit.emptyTag")}
                                style={{ color: Colors.Victoria, fontSize: responsiveFontSize(2) }}
                            />
                        ) : (
                            tag_user.map((item, index) => {
                                return (
                                    <View key={index} style={styles.tagWrap}>
                                        <AppText
                                            text={item.tag_name}
                                            style={{ color: Colors.WHITE_COLOR, fontSize: responsiveFontSize(2) }}
                                        />
                                    </View>
                                );
                            })
                        )
                    }
                />
            </View>
        );
    }

    renderBasicTab() {
        const { firstName, lastName, keyboardHeight, price, focus, priceShow } = this.state;
        const disabled = this._checkChanged();

        return (
            <View behavior="padding" enabled style={styles.containerFirstTab}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: keyboardHeight }}
                >
                    {this.renderTextField(
                        I18n.t("profileEdit.firstName"),
                        I18n.t("profileEdit.placeHolderFirstName"),
                        firstName
                    )}
                    {this.renderTextField(
                        I18n.t("profileEdit.lastName"),
                        I18n.t("profileEdit.placeHolderLastName"),
                        lastName
                    )}
                    {this.renderTag()}
                    {this.renderTextField(
                        I18n.t("profileEdit.price"),
                        I18n.t("profileEdit.placeHolderPrice"),
                        focus ? price : priceShow
                    )}
                    <View style={{ height: 40 }} />
                    <Button
                        disabled={disabled}
                        title={I18n.t("profileEdit.saveChange")}
                        onPress={() => this._saveChange()}
                        style={[disabled ? { backgroundColor: Colors.Dusty_Gray } : {}, styles.btnStyle]}
                    />
                </ScrollView>
            </View>
        );
    }

    renderPassWordField(title, placeholder, value) {
        return (
            <View style={{ width: "100%", paddingTop: PD.PADDING_2 }}>
                <AppText text={title} style={styles.titleField} />
                <View style={{ height: 45, width: "100%" }}>
                    <Input
                        leftIconName="key"
                        placeholder={placeholder}
                        placeholderTextColor={Colors.GRAY_TEXT_COLOR}
                        value={value}
                        containerStyles={{ width: "100%" }}
                        inputStyle={{ textAlign: "left" }}
                        onChangeText={e => this._setTextFunc(e, title)}
                        secureTextEntry={true}
                        // clearButton
                    />
                </View>
            </View>
        );
    }

    renderPassWordTab() {
        const { newPass, confirmNewPass, errorText, oldPass } = this.state;
        const disabled = this._checkChangePass();
        return (
            <View behavior="padding" enabled style={styles.containerFirstTab}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {this.renderPassWordField(
                        I18n.t("profileEdit.oldPassword"),
                        I18n.t("profileEdit.placeHolderOldPassword"),
                        oldPass,
                        true
                    )}
                    {this.renderPassWordField(
                        I18n.t("profileEdit.newPassword"),
                        I18n.t("profileEdit.placeHolderNewPassword"),
                        newPass,
                        true
                    )}
                    {this.renderPassWordField(
                        I18n.t("profileEdit.newPasswordConfirm"),
                        I18n.t("profileEdit.placeHolderNewPassword"),
                        confirmNewPass,
                        true
                    )}
                    <View style={{ height: 40, width: DEVICE.DEVICE_WIDTH, justifyContent: "center" }}>
                        <AppText
                            text={errorText}
                            style={{ color: Colors.Alizarin_Crimson, fontSize: responsiveFontSize(2) }}
                        />
                    </View>
                    <Button
                        disabled={disabled}
                        title={I18n.t("profileEdit.saveChangePass")}
                        onPress={() => this._saveChangePass()}
                        style={[disabled ? { backgroundColor: Colors.Dusty_Gray } : {}, styles.btnStyle]}
                    />
                </ScrollView>
            </View>
        );
    }

    render() {
        const { navigation } = this.props;
        const { imgUrl, spinner, modalTag, selectedItem, focus } = this.state;
        return (
            <View style={styles.containerStyle}>
                <HeaderTransparent title={I18n.t("profileEdit.title")} navigation={navigation} absolute />
                <TouchableOpacity style={{ backgroundColor: Colors.Deluge }} onPress={() => this._changeAvatar()}>
                    <AppImage source={{ uri: imgUrl }} style={styles.imageHeader} resizeMode="cover" />
                </TouchableOpacity>
                <KeyboardAvoidingView behavior="padding" enabled style={styles.content}>
                    <View style={{ flex: 1, paddingBottom: PD.PADDING_1 }}>
                        <Tabs
                            tabContainerStyle={{ backgroundColor: Colors.Athens_Gray }}
                            style={{ backgroundColor: Colors.Athens_Gray }}
                            tabBarUnderlineStyle={{ backgroundColor: Colors.Victoria }}
                        >
                            <Tab
                                activeTabStyle={{ backgroundColor: Colors.Athens_Gray }}
                                activeTextStyle={{ color: Colors.Victoria, fontFamily: FONT_SF.MEDIUM }}
                                textStyle={{ fontFamily: FONT_SF.MEDIUM }}
                                tabStyle={{ backgroundColor: Colors.Athens_Gray }}
                                heading={I18n.t("profileEdit.basic")}
                            >
                                {this.renderBasicTab()}
                            </Tab>
                            <Tab
                                activeTabStyle={{ backgroundColor: Colors.Athens_Gray }}
                                tabStyle={{ backgroundColor: Colors.Athens_Gray }}
                                activeTextStyle={{ color: Colors.Victoria, fontFamily: FONT_SF.MEDIUM }}
                                textStyle={{ fontFamily: FONT_SF.MEDIUM }}
                                heading={I18n.t("profileEdit.password")}
                            >
                                <View style={{ backgroundColor: Colors.Athens_Gray, flex: 1 }}>
                                    {this.renderPassWordTab()}
                                </View>
                            </Tab>
                        </Tabs>
                    </View>
                </KeyboardAvoidingView>
                <AppSpinner show={spinner} />
                <AutocompleteTags
                    profile
                    show={modalTag}
                    // show={true}
                    onClose={() => this._changeTagClose()}
                    onComplete={selectedItem => this._onComplete(selectedItem)}
                />
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        userReducer: state.userReducer
    };
}
ProfileEdit = connect(mapStateToProps)(ProfileEdit);

export default ProfileEdit;
