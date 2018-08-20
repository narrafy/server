import React from "react"
import ReactDOM from "react-dom"
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import App from "./App.js";
import { BrowserRouter as Router, Route } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker';
import Home from './components/home'
import NavigationBar from './components/partials/NavigationBar'
import Footer from './components/partials/Footer'
import asyncComponent from './components/partials/AsyncComponent'

const AsyncAbout = asyncComponent(() => import("./components/about"));
const AsyncPrivacy = asyncComponent(() => import("./components/partials/Privacy"));
const AsyncLogin = asyncComponent(() => import("./components/login"));
const AsyncRegister = asyncComponent(() => import("./components/register"));
const AsyncDashboard = asyncComponent(() => import("./components/dashboard"));

ReactDOM.render(
    (<Router>
        <div>
            <NavigationBar/>
            <App />
            <Route exact path="/" component={Home}  />
            <Route path="/about" component={AsyncAbout} />
            <Route path="/privacy-policy" component={AsyncPrivacy} />
            <Route path="/register" component={AsyncRegister} />
            <Route path="/login" component={AsyncLogin} />
            <Route path="/dashboard" component={AsyncDashboard} />
            <Footer/>
        </div>
    </Router>),
document.getElementById("app"));
registerServiceWorker();