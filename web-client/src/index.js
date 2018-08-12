import React from "react"
import ReactDOM from "react-dom"
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import App from "./App.js";
import { BrowserRouter, Route } from 'react-router-dom'
import {Container} from 'reactstrap'
import Home from './components/home'
import About from './components/about'

ReactDOM.render(
    (<BrowserRouter>
        <Container>
            <App />
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />
        </Container>
    </BrowserRouter>),
document.getElementById("app"));