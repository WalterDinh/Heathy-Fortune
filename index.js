import { AppRegistry } from "react-native";
import App from "./src/App";
import { name as appName, displayName } from "./app.json";
import firebase from "firebase";
import * as RNFirebase from "react-native-firebase";
import bgMessaging from "./src/bgMessaging"; // <-- Import the file you just created
import codePush from "react-native-code-push";

global.APP_NAME = displayName;
firebase.initializeApp({
    apiKey: "AIzaSyB_uiABFMoa30XO_hvnIiOLsFJbFzDD5ck",
    authDomain: "expert-bb88c.firebaseapp.com",
    databaseURL: "https://expert-bb88c.firebaseio.com",
    projectId: "expert-bb88c",
    storageBucket: "",
    messagingSenderId: "1058017876410",
    appId: "1:1058017876410:web:20c32a559c12e74d50e583",
    measurementId: "G-YBEXD40B03"
});
AppRegistry.registerHeadlessTask("RNFirebaseBackgroundMessage", () => bgMessaging);
AppRegistry.registerComponent(appName, () => codePush(App));
