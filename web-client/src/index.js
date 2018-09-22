import React from "react"
import ReactDOM from "react-dom"
import {Provider} from 'react-redux'

import configureStore from './store/configureStore'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import App from "./App.js";
import { BrowserRouter as Router, Route } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker'
import Home from './scenes/home'
import NavigationBar from './components/partials/NavigationBar'
import Footer from './components/partials/Footer'
import asyncScene from './components/partials/AsyncComponent'
import { PrivateRoute } from './components/partials/PrivateRoute'
import { history } from './utils/history'

const AsyncAbout = asyncScene(() => import("./scenes/about"))
const AsyncPrivacy = asyncScene(() => import("./scenes/privacy"))
const AsyncLogin = asyncScene(() => import("./scenes/login"))
const AsyncRegister = asyncScene(() => import("./scenes/register"))
const AsyncDashboard = asyncScene(() => import("./scenes/dashboard"))
const AsyncAnalytics = asyncScene(() => import("./scenes/analytics"))
const store = configureStore()


ReactDOM.render(
    (<Provider store = {store}>
            <Router history={history} >
                <div>
                    <NavigationBar/>
                    <App />
                    <Route exact path="/" component={Home}  />
                    <Route path="/about" component={AsyncAbout} />
                    <Route path="/privacy-policy" component={AsyncPrivacy} />
                    <Route path="/register" component={AsyncRegister} />
                    <Route path="/login" component={AsyncLogin} />
                    <Route path="/stats" component={AsyncAnalytics} />                    
                    <PrivateRoute path="/analytics" component={AsyncAnalytics} />                    
                    <PrivateRoute path="/dashboard" component={AsyncDashboard} />
                    <Footer/>
                </div>
            </Router>
        </Provider>
        ),
document.getElementById("app"));
registerServiceWorker();