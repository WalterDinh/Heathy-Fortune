import React, { Component } from "react";
import firebase from "firebase";
import { Platform } from "react-native";
import uuid from "uuid";
import { CHAT_TYPE, DIMENSION, DEVICE } from "helper/Consts";
import I18n from "helper/locales";
const moment = require("moment");
const _ = require("lodash");
const AVATAR =
    "https://firebasestorage.googleapis.com/v0/b/yo-learner-test.appspot.com/o/yo-learn-avatar%2Fdefault_avatar.png?alt=media&token=fa92022d-e2ae-421d-a23f-04eef8f5a1df";

class ChatFn extends Component {
    initialFirebase(path) {
        firebase
            .database()
            .ref("/yo-learner-test")
            .on("child_added", childSnapshot => {
                const message = childSnapshot.toJSON();
                return message;
            });
    }

    convertMessage(text, user, index) {
        let _id = uuid.v4();
        let utcMoment = moment.utc();
        let createdAt = utcMoment.valueOf();

        return [
            {
                index: index + 1,
                type: CHAT_TYPE.TEXT,
                _id,
                user,
                text: text.trim(),
                image: null,
                file: null,
                createdAt
            }
        ];
    }

    convertMessageReply(messageReplied, text, user, index) {
        let _id = uuid.v4();
        let utcMoment = moment.utc();
        let createdAt = utcMoment.valueOf();
        messageReplied.messageReplied && (messageReplied.messageReplied = null);
        messageReplied.type == CHAT_TYPE.REPLY && (messageReplied.type = CHAT_TYPE.TEXT);

        return [
            {
                index: index + 1,
                type: CHAT_TYPE.REPLY,
                _id,
                user,
                text: text.trim(),
                image: null,
                file: null,
                createdAt,
                messageReplied
            }
        ];
    }

    convertMessImage(url, data, user, index, id) {
        let _id = id ? id : uuid.v4();
        let utcMoment = moment.utc();
        let createdAt = utcMoment.valueOf();
        return [
            {
                index: index + 1,
                type: CHAT_TYPE.IMAGE,
                _id,
                user,
                text: "",
                file: null,
                image: {
                    uri: url,
                    height: data.height ? data.height : DIMENSION.CHAT_BUBBLE_WIDTH * 0.9,
                    width: data.width ? data.width : DEVICE.DEVICE_HEIGHT * 0.3
                },
                location: null,
                createdAt
            }
        ];
    }

    convertMessImages(images, user, index, id) {
        let _id = id ? id : uuid.v4();
        let utcMoment = moment.utc();
        let createdAt = utcMoment.valueOf();
        return [
            {
                index: index + 1,
                type: CHAT_TYPE.IMAGES,
                _id,
                user,
                text: "",
                file: null,
                images,
                location: null,
                createdAt
            }
        ];
    }

    convertFileMessage(url, data, user, index, id) {
        let _id = id ? id : uuid.v4();
        let utcMoment = moment.utc();
        let createdAt = utcMoment.valueOf();
        return [
            {
                index: index + 1,
                type: CHAT_TYPE.FILE,
                _id,
                user,
                text: "",
                image: "",
                file: {
                    uri: url,
                    fileName: data.fileName
                },
                location: null,
                createdAt
            }
        ];
    }

    covertMessLocation(location, user, index) {
        let _id = uuid.v4();
        let utcMoment = moment.utc();
        let createdAt = utcMoment.valueOf();
        return [
            {
                index: index + 1,
                type: CHAT_TYPE.LOCATION,
                _id,
                user,
                text: "",
                image: "",
                file: null,
                location,
                createdAt
            }
        ];
    }

    convertCardContact(cardContact, user, index) {
        let _id = uuid.v4();
        let utcMoment = moment.utc();
        let createdAt = utcMoment.valueOf();
        console.log("cardContact", cardContact);

        return [
            {
                index: index + 1,
                type: CHAT_TYPE.CONTACT,
                _id,
                user,
                text: null,
                image: null,
                file: null,
                cardContact: cardContact.teacher,
                createdAt
            }
        ];
    }

    convertSystemMessage(text, user, index) {
        let _id = uuid.v4();
        let utcMoment = moment.utc();
        let createdAt = utcMoment.valueOf();

        return [
            {
                index: index + 1,
                type: CHAT_TYPE.CHANGE_NAME,
                _id,
                user,
                text,
                image: null,
                file: null,
                createdAt,
                system: true
            }
        ];
    }

    convertSystemAddMember(text, user, index, member) {
        let _id = uuid.v4();
        let utcMoment = moment.utc();
        let createdAt = utcMoment.valueOf();

        return [
            {
                index: index + 1,
                type: CHAT_TYPE.ADD_MEMBER,
                _id,
                user,
                text,
                image: null,
                file: null,
                createdAt,
                system: true,
                member
            }
        ];
    }

    convertSystemLeaveRoom(text, user, index) {
        let _id = uuid.v4();
        let utcMoment = moment.utc();
        let createdAt = utcMoment.valueOf();

        return [
            {
                index: index + 1,
                type: CHAT_TYPE.LEAVE_ROOM,
                _id,
                user,
                text,
                image: null,
                file: null,
                createdAt,
                system: true
            }
        ];
    }

    calculatorHW(message) {
        // const { message } = this.props;
        const { image } = message;
        const { height, width } = image;
        const W = DIMENSION.CHAT_BUBBLE_WIDTH * 0.9;
        const H = DEVICE.DEVICE_HEIGHT * 0.3;
        let rotation = height / width;

        if (H / rotation > W) {
            return {
                width: W,
                height: W * rotation
            };
        } else {
            return {
                height: H,
                width: H / rotation
            };
        }
    }

    objToArrayWithoutLast(obj) {
        let array = [];
        Object.keys(obj).forEach(key => {
            array.push(obj[key]);
        });
        array.splice(-1);

        return array.reverse();
    }

    checkMessage(array, arrayMess) {
        let result = array;
        for (let i in array) {
            let array_id = array[i]._id;
            for (let j in arrayMess) {
                let arrayMess_id = arrayMess[j]._id;
                if (array_id == arrayMess_id) {
                    result.splice(i, 1);
                }
            }
        }
        return result;
    }

    converUser(userReducer) {
        let id = userReducer.id;
        // const { user } = userReducer;
        const { first_name, last_name } = userReducer;
        let name = `${first_name} ${last_name}`;
        return {
            _id: id,
            id,
            name,
            avatar: _.isEmpty(userReducer.avatar) ? AVATAR : userReducer.avatar
        };

        // TEST
        // return {
        //     _id: 1,
        //     id: 1,
        //     name: "test",
        //     avatar: AVATAR
        // };
    }

    convertDeleteMessage(message) {
        let deleteMess = { ...message };
        deleteMess.text = "";
        deleteMess.image = "";
        deleteMess.location = "";
        deleteMess.file = "";
        deleteMess.cardContact = "";
        deleteMess.type = CHAT_TYPE.DELETE_MESSAGE;
        return deleteMess;
    }

    convertDeleteMyMessage(message) {
        let deleteMyMessage = { ...message };
        deleteMyMessage.deleteId = message.user.id;
        return deleteMyMessage;
    }

    convertEditedMessage(message, newText) {
        let editedMessage = { ...message };
        editedMessage.text = newText;
        editedMessage.type = CHAT_TYPE.EDITED_MESSAGE;
        return editedMessage;
    }

    convertEditedMessageReply(message, newText) {
        let editedMessage = { ...message };
        editedMessage.text = newText;
        editedMessage.edit = true;
        editedMessage.forward = false;
        return editedMessage;
    }

    convertForwardMessage(message, user, lastMessageIndex) {
        let _id = uuid.v4();
        let utcMoment = moment.utc();
        let createdAt = utcMoment.valueOf();
        let forwardMessage = { ...message };
        forwardMessage.createdAt = createdAt;
        forwardMessage._id = _id;
        forwardMessage.user = user;
        forwardMessage.index = lastMessageIndex + 1;
        forwardMessage.forward = true;
        forwardMessage.edit = false;
        return forwardMessage;
    }

    // PARAM LAST MESSAGE
    lastMessParam(message, roomId, user, index) {
        console.log("messssssss", message);

        let type = message.type;
        let last_message_time = moment(message.createdAt)
            // .utc()
            .format("YYYY-MM-DDTHH:mm:ss.SSSSSS");

        let last_message = "";
        switch (type) {
            case CHAT_TYPE.TEXT:
                last_message = message.text;
                break;
            case CHAT_TYPE.EDITED_MESSAGE:
                last_message = message.text;
                break;
            case CHAT_TYPE.IMAGE:
                last_message = message.image.uri;
                break;
            case CHAT_TYPE.IMAGES:
                last_message = I18n.t("chat.imagesType");
                break;
            case CHAT_TYPE.FILE:
                last_message = message.file.uri;
                break;
            case CHAT_TYPE.LOCATION:
                last_message = I18n.t("chat.locationType");
                break;
            case CHAT_TYPE.CONTACT:
                last_message = I18n.t("chat.contactType");
                break;
            case CHAT_TYPE.REPLY:
                message = I18n.t("chat.replyType");
                break;
            default:
                break;
        }

        let lastMessage = {
            id: roomId,
            body: {
                last_message_type: type,
                last_message_user_id: user.id,
                // fake last number message
                last_message_index: index,
                last_message_time,
                last_message
            }
        };

        let lastSeenMessage = {
            id: roomId,
            body: {
                // fake last number message
                last_message_seen_index: index,
                last_message_seen_time: last_message_time
            }
        };

        return { lastMessage, lastSeenMessage };
    }

    memberInRoom() {
        return [{}];
    }
}
const chatFn = new ChatFn();
export default chatFn;
