import React, {Component} from 'react'
import { Link } from "react-router-dom"
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import {SocialIcon} from 'react-social-icons'
import logo from '../../assets/img/logo.svg'
import {facebookUrl, mediumUrl, twitterUrl} from "../../config"
import Auth from '../../scenes/login/services/Auth'
import {withRouter} from 'react-router'

class NavigationBar extends Component {

    constructor(props) {
        super(props);
        this.auth = new Auth();
        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false,
        };
        this.handleLogout = this.handleLogout.bind(this)
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    handleLogout(){
        this.auth.logout()
        this.props.history.replace('/login');
    }

    render() {
        const profile = this.auth.getProfile()
        return (
            <Navbar className="navbar-light bg-primary" color="light" light expand="md">
                        <NavbarBrand href="/"><img src={logo} alt="logo" className="logo" /></NavbarBrand>
                        <NavbarToggler className="second-color glyphicon-align-center" onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="float-left" navbar>
                                <NavItem>
                                    <NavLink tag={Link} to="/">Home</NavLink>
                                </NavItem>
                                <NavItem>
                                    {!profile && <NavLink target="_blank"  rel="noopener noreferrer" href="https://medium.com/narrafy-labs">Labs</NavLink> }
                                </NavItem>
                                <NavItem>
                                    {!profile && <NavLink tag={Link} to="/about">About</NavLink> }
                                </NavItem>
                                <NavItem>
                                    {!profile && <a className="nav-link" href="/about#contact">Contact</a> }
                                </NavItem>
                            </Nav>
                        </Collapse>

                {profile? (
                    <Nav className={"float-right"}>

                        <NavItem>
                            <NavLink tag={Link} to="/dashboard">Dashboard</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} to="/analytics">Analytics</NavLink>
                        </NavItem>

                        <NavItem>
                            <NavLink tag={Link} to="/profile"> <FontAwesomeIcon icon={faUser} /></NavLink>
                        </NavItem>

                        <NavItem>
                            <button type="button" className="cta-link" onClick={this.handleLogout.bind(this)}>Logout</button>
                        </NavItem>
                    </Nav>
                ):(
                    <Nav className={"float-right"}>
                        <NavItem>
                            <NavLink tag={Link} to="/login">Login</NavLink>
                        </NavItem>

                        {/*
                            Multi
                            line
                            comment
                            <NavItem>
                                <NavLink tag={Link} className={"cta-link"} to="/register">Register</NavLink>
                            </NavItem>

                        */}

                        <NavItem className="nav-social-media-icon">
                            <SocialIcon url={facebookUrl} color="#7A5B6B" style={{height:30, width:30}} />
                        </NavItem>
                        <NavItem className="nav-social-media-icon">
                            <SocialIcon url={twitterUrl} color="#7A5B6B" style={{height:30, width:30}} />
                        </NavItem>
                        <NavItem className="nav-social-media-icon">
                            <SocialIcon url={mediumUrl} color="#7A5B6B" style={{height:30, width:30}} />
                        </NavItem>
                    </Nav>
                )}

            </Navbar>
        );
    }
}

export default withRouter(NavigationBar);
