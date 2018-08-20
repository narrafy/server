import React from "react"
import ReactDOM from "react-dom"
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import App from "./App.js";
import { BrowserRouter as Router, Route } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker';
import Home from './components/home'
import About from './components/about'
import NavigationBar from './components/partials/NavigationBar'
import Footer from './components/partials/Footer'
import Privacy from './components/partials/Privacy'
import Login from './components/login/index'
import Register from './components/register'
import Dashboard from './components/dashboard'

ReactDOM.render(
    (<Router>
        <div>
            <NavigationBar/>
            <App />
            <Route exact path="/" component={Home}  />
            <Route path="/about" component={About} />
            <Route path="/privacy-policy" component={Privacy} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/logout" component={Home} />
            <Footer/>
        </div>
    </Router>),
document.getElementById("app"));
registerServiceWorker();