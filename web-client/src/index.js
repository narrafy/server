import React from "react"
import ReactDOM from "react-dom"
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import App from "./App.js";
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Home from './components/home'
import About from './components/about'
import NavigationBar from './components/partials/NavigationBar'

ReactDOM.render(
    (<Router>
        <div>
            <NavigationBar/>
            <App />
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />
        </div>
    </Router>),
document.getElementById("app"));