import * as React from "react";
import * as ReactNative from "react-native";

type RnViewStyleProp = ReactNative.StyleProp<ReactNative.ViewStyle>;
type RnImageStyleProp = ReactNative.StyleProp<ReactNative.ImageStyle>;
type RnTextStyleProp = ReactNative.StyleProp<ReactNative.TextStyle>;
type RnImageSourceProp = ReactNative.StyleProp<ReactNative.ImageSourcePropType>;

declare class Button extends React.Component<ButtonComponentProps, any> {}
export interface ButtonComponentProps {
    style?: RnViewStyleProp;
    title?: String;
    tStyle?: RnTextStyleProp;
    transparent?: Boolean;
    textContent?: Boolean;
    centerContent?: any;
    onPress: () => void;
}

declare class AppImage extends React.Component<AppImageProps, any> {}
export interface AppImageProps {
    style?: RnImageStyleProp;
    source?: RnImageSourceProp;
    local?: Boolean;
    imageStyle?: Object;
    resizeMode?: "contain" | "cover" | "stretch" | "center";
}

declare class AppText extends React.Component<AppTextProps, any> {}
export interface AppTextProps {
    style?: RnTextStyleProp;
    text?: String;
    numberOfLines?: Number;
    onPress: () => void;
    canPress?: Boolean;
}

declare class ButtonCircle extends React.Component<ButtonCircleProps, any> {}
export interface ButtonCircleProps {
    onPress: () => void;
    style?: RnViewStyleProp;
    isSelected?: Boolean;
    iconName: string;
    iconType?:
        | "AntDesign"
        | "Entypo"
        | "EvilIcons"
        | "Feather"
        | "FontAwesome"
        | "FontAwesome5"
        | "Foundation"
        | "Ionicons"
        | "MaterialCommunityIcons"
        | "MaterialIcons"
        | "Octicons"
        | "SimpleLineIcons"
        | "Zocial";
    iconStyle?: any;
    title?: String;
    titleStyle?: RnTextStyleProp;
}

declare class HeaderApp extends React.Component<HeaderAppProps, any> {}
export interface HeaderAppProps {
    colorBackground?: String;
    title?: String;
    avatar?: String;
    isBack?: Boolean;
    onPressBack: () => void;
}

declare class AppImageCircle extends React.Component<AppImageCircleProps, any> {}
export interface HeaderAppProps {
    styleImage?: RnImageStyleProp;
    source?: RnImageSourceProp;
    checked?: Boolean;
    resizeMode?: "contain" | "cover" | "stretch" | "center";
    image?: Boolean;
    iconName?: String;
    iconType?:
        | "AntDesign"
        | "Entypo"
        | "EvilIcons"
        | "Feather"
        | "FontAwesome"
        | "FontAwesome5"
        | "Foundation"
        | "Ionicons"
        | "MaterialCommunityIcons"
        | "MaterialIcons"
        | "Octicons"
        | "SimpleLineIcons"
        | "Zocial";
    outterCStyle?: RnViewStyleProp;
    middleCStyle?: RnViewStyleProp;
    innerCStyle?: RnViewStyleProp;
}

declare class ScheduleCard extends React.Component<ScheduleCardProps, any> {}

export interface ScheduleCardProps {
    userName?: String;
    avatar?: RnImageSourceProp;
    title?: String;
    time?: String;
}

declare class HeaderTransparent extends React.Component<HeaderTransparentProps, any> {}
export interface HeaderTransparentProps {
    title?: String;
    navigation?: any;
    containerStyle?: RnViewStyleProp;
    onPressBack: () => void;
    iconStyle?: RnTextStyleProp;
    titleStyle?: RnTextStyleProp;
}

declare class AppSlider extends React.Component<AppSliderProps, any> {}
export interface AppSliderProps {
    value?: String;
    disabled?: Boolean;
    onSlidingComplete: () => void;
    // iconStyle?: RnTextStyleProp;
    // titleStyle?: RnTextStyleProp;
}

declare class Input extends React.Component<InputComponentProps, any> {}
export interface InputComponentProps {
    containerStyles?: RnViewStyleProp;
    nameValue?: String;
    leftIcon?: Boolean;
    lSource?: String;
    lStyle?: RnImageStyleProp;
    rStyle?: RnImageStyleProp;
    rSource?: String;
    clearButton?: Boolean;
    type?: "EMAIL" | "PASSWORD" | "PHONE_NUMBER" | "PHONE_EMAIL";
    inputStyle?: RnViewStyleProp;
    placeholder?: String;
    lBlurSource?: any;
    value?: String | Number;
    transparent?: Boolean;
    placeholderTextColor?: String;
    leftIconName?: String;
}

declare class AppSpinner extends React.Component<AppSpinnerProps, any> {}
export interface AppSpinnerProps {
    show?: Boolean;
}
declare class AppModal extends React.Component<AppModalProps, any> {}
export interface AppModalProps {
    visible?: Boolean;
    onPress: () => void;
}
declare class ItemBorder extends React.Component<ItemBorderProps, any> {}
export interface ItemBorderProps {
    onPress: (item) => void;
    data?: Array;
    refreshing?: Boolean;
    onRefresh: () => void;
}

declare class AppContainer extends React.Component<AppContainerProps, any> {}
export interface AppContainerProps {
    style?: RnViewStyleProp;
}
