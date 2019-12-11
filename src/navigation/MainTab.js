import React from "react";
// import { Tabbar } from "components/index";
import {
    createStackNavigator,
    createAppContainer,
    createSwitchNavigator,
    createDrawerNavigator,
    createBottomTabNavigator,
    MaterialTopTabBar,
    createMaterialTopTabNavigator
} from "react-navigation";
import {
    Element,
    MeetingAgenda,
    Profile,
    ProfileEdit,
    ProfileSetting,
    SearchDoctor,
    Notification,
    Adivisory,
    DetailEvent,
    NewEvent,
    Counselor,
    News,
    DetailNews,
    Chat,
    SampleQuestion,
    ListChat,
    NewSampleQuestion,
    History,
    ForwardMessage
} from "screens";
import { HeaderApp } from "components";

const UserProfileStack = createStackNavigator(
    {
        Profile,
        ProfileEdit,
        ProfileSetting,
        SampleQuestion
        // History
    },
    {
        initialRouteName: "Profile",
        headerMode: "none"
    }
);

UserProfileStack.navigationOptions = ({ navigation }) => {
    const currentScreenPath = navigation.router.getPathAndParamsForState(navigation.state).path;
    const showTabBar =
        currentScreenPath === "Profile" ||
        currentScreenPath === "ProfileEdit" ||
        currentScreenPath === "ProfileSetting" ||
        currentScreenPath === "SampleQuestion";

    return {
        tabBarVisible: !showTabBar
    };
};

const MeetingAgendaStack = createStackNavigator(
    {
        MeetingAgenda,
        DetailEvent
    },
    {
        initialRouteName: "MeetingAgenda",
        headerMode: "none"
    }
);

MeetingAgendaStack.navigationOptions = ({ navigation }) => {
    const currentScreenPath = navigation.router.getPathAndParamsForState(navigation.state).path;
    const showTabBar = currentScreenPath === "DetailEvent";
    return {
        tabBarVisible: !showTabBar
    };
};

const NotificationStack = createStackNavigator(
    {
        Notification,
        Chat,
        DetailEvent,
        NewEvent,
        Counselor,
        SampleQuestion,
        NewSampleQuestion,
        History
    },
    {
        initialRouteName: "Notification",
        headerMode: "none"
    }
);

NotificationStack.navigationOptions = ({ navigation }) => {
    const currentScreenPath = navigation.router.getPathAndParamsForState(navigation.state).path;
    const showTabBar =
        currentScreenPath === "DetailEvent" ||
        currentScreenPath === "Counselor" ||
        currentScreenPath === "NewEvent" ||
        currentScreenPath === "NewSampleQuestion" ||
        currentScreenPath === "SampleQuestion" ||
        currentScreenPath === "Chat";
    return {
        tabBarVisible: !showTabBar
    };
};

const ChatStack = createStackNavigator(
    {
        ListChat,
        Chat,
        SampleQuestion,
        NewSampleQuestion,
        ForwardMessage
    },
    {
        initialRouteName: "ListChat",
        headerMode: "none"
    }
);

ChatStack.navigationOptions = ({ navigation }) => {
    const currentScreenPath = navigation.router.getPathAndParamsForState(navigation.state).path;
    const showTabBar =
        currentScreenPath === "DetailEvent" ||
        currentScreenPath === "Chat" ||
        currentScreenPath === "SampleQuestion" ||
        currentScreenPath === "ForwardMessage" ||
        currentScreenPath === "NewSampleQuestion";
    return {
        tabBarVisible: !showTabBar
    };
};

const SearchDoctorStack = createStackNavigator(
    {
        SearchDoctor,
        Counselor,
        NewEvent,
        Chat
    },
    {
        initialRouteName: "SearchDoctor",
        headerMode: "none"
    }
);

SearchDoctorStack.navigationOptions = ({ navigation }) => {
    const currentScreenPath = navigation.router.getPathAndParamsForState(navigation.state).path;
    const showTabBar =
        currentScreenPath === "Counselor" || currentScreenPath === "NewEvent" || currentScreenPath === "Chat";
    return {
        tabBarVisible: !showTabBar
    };
};

//News
const NewsStack = createStackNavigator(
    {
        News,
        DetailNews,
        History
    },
    {
        initialRouteName: "News",
        headerMode: "none"
    }
);

NewsStack.navigationOptions = ({ navigation }) => {
    const currentScreenPath = navigation.router.getPathAndParamsForState(navigation.state).path;
    const showTabBar = currentScreenPath === "DetailNews" || currentScreenPath === "History";
    return {
        tabBarVisible: !showTabBar
    };
};

const EventUncomfirmation = createStackNavigator(
    {
        Adivisory,
        DetailEvent,
        NewEvent
    },
    {
        initialRouteName: "Adivisory",
        headerMode: "none"
    }
);
EventUncomfirmation.navigationOptions = ({ navigation }) => {
    const currentScreenPath = navigation.router.getPathAndParamsForState(navigation.state).path;
    const showTabBar = currentScreenPath === "DetailEvent" || currentScreenPath === "NewEvent";
    return {
        tabBarVisible: !showTabBar
    };
};

const HistoryStack = createStackNavigator(
    {
        History,
        DetailEvent
    },
    {
        initialRouteName: "History",
        headerMode: "none"
    }
);

HistoryStack.navigationOptions = ({ navigation }) => {
    const currentScreenPath = navigation.router.getPathAndParamsForState(navigation.state).path;
    const showTabBar = currentScreenPath === "DetailEvent";
    return {
        tabBarVisible: !showTabBar
    };
};

const MainTab = createMaterialTopTabNavigator(
    {
        NotificationStack,
        UserProfileStack,
        EventUncomfirmation,
        ChatStack,
        MeetingAgendaStack,
        SearchDoctorStack,
        NewsStack,
        HistoryStack,
        Element
    },
    {
        animationEnabled: false,
        swipeEnabled: false,
        tabBarPosition: "top",
        initialRouteName: "NotificationStack",
        lazy: true,
        tabBarComponent: HeaderApp
    }
);

export default createAppContainer(MainTab);
