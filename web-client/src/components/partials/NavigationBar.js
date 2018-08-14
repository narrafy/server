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
import {SocialIcon} from 'react-social-icons'
import {facebookUrl, mediumUrl, twitterUrl} from "../../config";

class NavigationBar extends Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {

        return (
            <Navbar className="navbar-light bg-primary" color="light" light expand="md">
                        <NavbarBrand href="/"><img src="img/logo.svg" alt="logo" className="logo" /></NavbarBrand>
                        <NavbarToggler className="second-color glyphicon-align-center" onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto justify-content-center" navbar>
                                <NavItem>
                                    <NavLink tag={Link} to="/">Home</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink target="_blank"  rel="noopener noreferrer" href="https://arxiv.org/abs/1712.03080">Research</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} to="/stats">Stats</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} to="/about">About</NavLink>
                                </NavItem>
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
                        </Collapse>
            </Navbar>
        );
    }
}

export default NavigationBar;