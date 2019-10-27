import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import store from './store';
import './css/reset.css';

// HEADER
import Header from "./components/Header/Header";

// PAGES
import Home from "./pages/Home";
import Products from "./pages/Products";

const Page404 = () => (
    <Redirect to='/' />
);

const routing = (
    <Provider store={store}>
        <Header />

        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/products" component={Products} />
                <Route component={Page404} />
            </Switch>
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(routing, document.getElementById('app'));