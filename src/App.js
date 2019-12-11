import React, { Component } from "react";
import { Provider, connect } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import configureStore from "../store/configureStore";
import MainApp from "./Main";

const { persistor, store } = configureStore();
// persistor.purge();

console.disableYellowBox = true;

export default class App extends Component {
    componentWillMount() {}
    render() {
        return (
            <Provider store={store}>
                <PersistGate persistor={persistor}>
                    <MainApp />
                </PersistGate>
            </Provider>
        );
    }
}
