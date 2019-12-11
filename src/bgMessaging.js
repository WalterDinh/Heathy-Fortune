import firebase from "react-native-firebase";

export default async message => {
    // handle your message
    const notification = new firebase.notifications.Notification()
        .setNotificationId("1")
        .setTitle("message.data.title")
        .setBody("sage.data.body")
        .android.setChannelId("general")
        .android.setSmallIcon("ic_launcher")
        .android.setPriority(firebase.notifications.Android.Priority.Max)
        .setSound("default");

    await firebase.notifications().displayNotification(notification);
    console.log("___________________", { message });
    return Promise.resolve();
};
