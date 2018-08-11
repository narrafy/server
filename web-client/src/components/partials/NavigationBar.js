import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Switch, Link, Redirect} from 'react-router-dom'
import Home from '../home/index'
import Stats from '../analytics/index'
import About from '../about/index'

class NavigationBar extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <nav className="navbar fixed-top navbar-toggleable-md navbar-light bg-faded">
                        <div className="container">
                            <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse"
                                    data-target="#collapsingNavbar2">
                                <span className="navbar-toggler-icon my-toggler"></span>
                            </button>
                            <a className="navbar-brand" href="/">
                                <img src="img/logo.svg" alt="logo" className="logo hidemobile" />
                                <img src="img/logo.svg" alt="logo" className="logo hidemobile" />
                            </a>

                            <div className="collapse navbar-collapse" id="collapsingNavbar2">
                                <ul className="navbar-nav mr-auto ">

                                </ul>
                                <ul className="navbar-nav my-2 my-lg-0 social">
                                    <li className="nav-item active">
                                        <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
                                    </li>

                                    <li className="nav-item">
                                        <a className="nav-link" target="_blank"
                                              href="https://arxiv.org/abs/1712.03080">Research</a>
                                    </li>

                                    <li className="nav-item">
                                        <Link className="nav-link" to="/stats">Stats</Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link className="nav-link" to="/about">About</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                    <Route exact path="/" component={Home}/>
                    <Route path="/stats" component={Stats}/>
                    <Route path="/about" component={About}/>
                    <Redirect to="/" />
                </Switch>
            </Router>
        );
    }
}

export default NavigationBar;
