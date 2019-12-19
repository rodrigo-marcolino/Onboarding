import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './Home';
import Customer from './Customer';
import Product from './Product';
import Store from './Store';
import Sales from './Sales';
import { Divider } from 'semantic-ui-react';

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const Main = () => (
    <main className="bodyContainer">
        <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/customer' component={Customer} />
            <Route path='/product' component={Product} />
            <Route path='/store' component={Store} />
            <Route path='/sales' component={Sales} />
        </Switch>
        <Divider />
    </main>
)

export default Main;