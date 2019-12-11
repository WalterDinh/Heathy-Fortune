import React from "react";
import { Tabbar } from "components/index";
import {
    createStackNavigator,
    createAppContainer,
    createSwitchNavigator,
    createDrawerNavigator,
    createBottomTabNavigator
} from "react-navigation";
import {
    Login,
    Element,
    Chat,
    StartLogin,
    Splash,
    Call,
    IncomingCall,
    VideoCall,
    LoadingScreen,
    Start,
    Telephone,
    Notification,
    Information,
    Adivisory,
    SearchDoctor,
    Password,
    Succsess,
    DetailEvent,
    News,
    CheckNumber,
    NewPassword,
    SampleQuestion,
    ListChat
} from "screens/index";
import { FindAccount, AccountVerify, ConfirmationCode, ConfirmationSuccess } from "screens/ResetPassword";
import MainTab from "./MainTab";
const LoginStack = createStackNavigator(
    {
        StartLogin,
        Login,
        FindAccount,
        AccountVerify,
        SearchDoctor,
        ListChat,
        Adivisory,
        ConfirmationCode,
        ConfirmationSuccess,
        CheckNumber,
        NewPassword,
        Telephone,
        Information,
        Password,
        Succsess
    },
    {
        initialRouteName: "StartLogin",
        headerMode: "none"
    }
);

const Switch = createSwitchNavigator(
    {
        Splash,
        LoginStack,
        MainTabContainer: MainTab,
        Element,
        DetailEvent,
        Notification,
        CheckNumber
    },
    {
        initialRouteName: "Splash",
        headerMode: "none"
    }
);

const AppStack = createStackNavigator(
    {
        Call,
        Switch,
        VideoCall,
        // LoginStack,
        IncomingCall
    },
    {
        initialRouteName: "Switch",
        mode: "modal",
        headerMode: "none"
    }
);

export default createAppContainer(AppStack);
