import React from "react";
import { View, ScrollView } from "react-native";
import { connect } from "react-redux";
import { HeaderApp } from "components";
import styles from "./styles";
import { PD } from "helper/Consts";
import I18n from "helper/locales";
import _ from "lodash";
import { newsActions } from "actions";
import { Container } from "components";
import HTMLView from "react-native-htmlview";

const DEFAULT_AVATAR = "https://znews-photo.zadn.vn/Uploaded/mdf_kxrxdf/2019_07_01/13_Ha_Giang.jpg";

class DetailNews extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            detailNews: {}
        };
    }

    componentDidMount() {
        const { navigation, newsReducer, dispatch } = this.props;
        const item = navigation.getParam("item");
        console.log("item", item);
        dispatch(newsActions.getDetailNewsRequest(item.id));
        this.setState({ detailNews: item });
    }

    renderCard(data) {
        console.log("lasjdkasjd ashjd ", data.description);

        return (
            <ScrollView style={{ flex: 1, paddingTop: PD.PADDING_2, paddingHorizontal: PD.PADDING_1 }}>
                <HTMLView value={data ? data.description : ""} stylesheet={styles.renderHtml} />
            </ScrollView>
        );
    }
    render() {
        const { navigation } = this.props;
        const { detailNews } = this.state;
        console.log("detailNewsdetailNewsdetailNews", detailNews);
        return (
            <View style={styles.containerStyle}>
                <HeaderApp isBack title={detailNews == null ? "Title" : detailNews.title} navigation={navigation} />
                <Container>{this.renderCard(detailNews)}</Container>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        newsReducer: state.newsReducer
    };
}
DetailNews = connect(mapStateToProps)(DetailNews);

export default DetailNews;
