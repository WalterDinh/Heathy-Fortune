import React from "react";
import { View, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { Calendar, CalendarList, Agenda, LocaleConfig, AgendaThemeStyle, CalendarTheme } from "react-native-calendars";
import { Colors, GlobalStyles } from "helper";
import styles from "./styles";
import moment from "moment";
import { AppText, AppModal, AppImage } from "components";
import { DEVICE, DIMENSION, PD } from "helper/Consts";
import I18n from "helper/locales";
import uuid from "uuid";
import _ from "lodash";
import { getMettingAgendaRequest } from "actions/meetingAgendaActions";
import { numberToCurrency } from "helper/convertLang";
import AppContainer from "components/AppContainer";
import { GET_METTING_AGENDA_SUCCESS } from "actions/types";

const AVATAR_SIZE_WRAP = DEVICE.DEVICE_WIDTH * 0.11;
const AVATAR_SIZE = AVATAR_SIZE_WRAP - 4;
class MeetingAgenda extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: {},
            markedDates: {},
            nowDate: {}
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.agenda.setScrollPadPosition(0, true);
            this.agenda.enableCalendarScrolling();
        }, 1000);
    }

    componentDidUpdate(prevProps) {
        const { meetingAgendaReducer } = this.props;
        if (meetingAgendaReducer !== prevProps.meetingAgendaReducer) {
            // meetingAgendaReducer.type == GET_METTING_AGENDA_SUCCESS
            this.setState({ loading: false });
            console.log("meetingAgendaReducer", meetingAgendaReducer);
            this._loadItems(this.state.nowDate);
        }
    }

    renderDay(day, item) {
        return (
            <View style={{ width: DEVICE.DEVICE_WIDTH * 0.2, marginTop: PD.PADDING_3 }}>
                <AppText style={styles.dayText} text={day ? `${day.day}` : ""} />
                <AppText style={styles.monthText} text={day ? moment(day.dateString).format("MMM") : ""} />
            </View>
        );
    }

    renderAvatar(member) {
        return (
            <View style={{ height: AVATAR_SIZE_WRAP }}>
                {member.map((item, index) => {
                    return (
                        <View
                            style={[
                                styles.avatarWrap,
                                {
                                    backgroundColor: Colors.WHITE_COLOR,
                                    left: index < 1 ? 0 : AVATAR_SIZE_WRAP / 3,
                                    zIndex: index
                                }
                            ]}
                        >
                            <AppImage resizeMode="cover" source={{ uri: item.img_url }} style={styles.avatar} />
                        </View>
                    );
                })}
            </View>
        );
    }

    _showDetail(data) {
        const { navigation } = this.props;
        const { nowDate } = this.state;
        navigation.navigate("DetailEvent", { item: data, time: nowDate });
    }

    renderItem(item) {
        const { appointment_time, member, price, title, appointment_end_time } = item;
        let startDate = appointment_time ? moment(appointment_time).format("HH:mm") : "";
        let endDate = appointment_end_time ? ` - ${moment(appointment_end_time).format("HH:mm")}` : "";
        return (
            <TouchableOpacity onPress={() => this._showDetail(item)}>
                <View style={[styles.item]}>
                    <AppText text={`${I18n.t("meetingAgenda.from")}${startDate}${endDate}`} style={styles.timeText} />
                    <AppText text={title} style={styles.titleText} />
                    {this.renderAvatar(member)}
                    <AppText
                        text={`${I18n.t("meetingAgenda.price")}${numberToCurrency(price)}${I18n.t("currency")}`}
                        style={styles.emptyText}
                    />
                </View>
            </TouchableOpacity>
        );
    }

    renderEmptyDate() {
        return (
            <View style={[styles.item]}>
                <AppText text={I18n.t("meetingAgenda.emptyEvent")} style={styles.emptyText} />
            </View>
        );
    }

    render() {
        const today = moment().format("YYYY-MM-DD");
        const { loading, items, markedDates } = this.state;
        console.log(markedDates, items);

        return (
            <AppContainer style={{ backgroundColor: Colors.Bleached_Cedar }}>
                <Agenda
                    ref={ref => (this.agenda = ref)}
                    selected={today}
                    items={items}
                    loadItemsForMonth={day => this._loadData(day, false)}
                    renderItem={this.renderItem.bind(this)}
                    renderEmptyDate={this.renderEmptyDate.bind(this)}
                    rowHasChanged={this.rowHasChanged.bind(this)}
                    monthFormat={"MMMM yyyy"}
                    renderDay={(day, item) => this.renderDay(day, item)}
                    style={{ backgroundColor: Colors.Victoria, flex: 1 }}
                    onRefresh={() => this._onRefresh()}
                    refreshing={loading}
                    markedDates={markedDates}
                    markingType="multi-dot"
                    firstDay={1}
                    theme={GlobalStyles.agendaDark}
                    hideKnob={false}
                />
            </AppContainer>
        );
    }

    _onRefresh() {
        let { nowDate } = this.state;
        this.setState({ loading: true }, () => {
            // const dateString = moment().format("YYYY-MM-DD");
            // const day = moment().format("DD");
            // const month = moment().format("MM");
            // const year = moment().format("YYYY");
            // const timestamp = moment().unix();
            // const date = {
            //     dateString,
            //     day,
            //     month,
            //     year,
            //     timestamp
            // };
            this._loadData(nowDate, true);
        });
    }

    _loadData(date, refresh) {
        const { day, month, year, dateString } = date;
        this.setState({ nowDate: date }, () => {
            var endOfMonth = moment(dateString)
                .endOf("month")
                .format("DD");
            const { dispatch } = this.props;
            const param = {
                start_date: `${year}-${month}-01`,
                end_date: `${year}-${month}-${endOfMonth}`,
                refresh
            };
            dispatch(getMettingAgendaRequest(param));
        });
    }

    _loadItems(day) {
        const { meetingAgendaReducer } = this.props;
        let { items, markedDates } = this.state;
        const data = meetingAgendaReducer.data;
        console.log("dataasdada", data);

        // markedDates = [];
        setTimeout(async () => {
            const dayOfMonth = 31;
            const firstDayOfMonth = day.day - 1;
            for (let i = -firstDayOfMonth; i < dayOfMonth - firstDayOfMonth; i++) {
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = this.timeToString(time);
                if (!items[strTime]) {
                    items[strTime] = [];
                    markedDates[strTime] = {};
                    markedDates[strTime].dots = [];
                    for (const i in data) {
                        let el = data[i];
                        if (!_.isEmpty(el.appointment_time)) {
                            const appointment_time = el.appointment_time.substr(0, 10);
                            if (appointment_time == strTime) {
                                const status = el.status;
                                items[strTime].push(el);
                                const WAIT = { key: uuid.v4(), color: "yellow" };
                                const CONFIRMED = { key: uuid.v4(), color: "blue" };
                                const DONE = { key: uuid.v4(), color: "green" };
                                const CANCEL = { key: uuid.v4(), color: "red" };
                                switch (status) {
                                    case 0:
                                        markedDates[strTime].dots.push(WAIT);
                                        break;
                                    case 1:
                                        markedDates[strTime].dots.push(CONFIRMED);
                                        break;
                                    case 2:
                                        markedDates[strTime].dots.push(DONE);
                                        break;
                                    case 3:
                                        markedDates[strTime].dots.push(CANCEL);
                                        break;
                                }
                            }
                        }
                    }
                }
            }
            const newItems = {};
            Object.keys(items).forEach(key => {
                newItems[key] = items[key];
            });
            const newMarker = {};
            Object.keys(markedDates).forEach(key => {
                newMarker[key] = markedDates[key];
            });
            this.setState({ items: newItems, markedDates: newMarker });
        }, 1000);
    }

    _processArray(data) {
        const today = moment().format("YYYY-MM-DD");
        const returnObj = this.state.items;
        returnObj[today] = [];
        let index = 0;
        for (const i in data) {
            let el = data[i];
            if (!_.isEmpty(el.appointment_time)) {
                let appointment_time = el.appointment_time.substr(0, 10);
                if (_.isUndefined(returnObj[appointment_time])) {
                    returnObj[appointment_time] = [data[i]];
                } else {
                    returnObj[appointment_time] = _.concat(returnObj[appointment_time], [data[i]]);
                }
            }
            index++;
        }
        if (index == data.length) {
            return returnObj;
        }
    }

    rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
    }

    timeToString(time) {
        const date = new Date(time);
        return date.toISOString().split("T")[0];
    }
}

function mapStateToProps(state) {
    return {
        eventReducer: state.eventReducer,
        meetingAgendaReducer: state.meetingAgendaReducer
    };
}
MeetingAgenda = connect(mapStateToProps)(MeetingAgenda);

export default MeetingAgenda;
