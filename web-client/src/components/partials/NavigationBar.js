import React, {Component} from 'react'
import {connect} from 'react-redux'
import { Link } from "react-router-dom"
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink} from 'reactstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import {SocialIcon} from 'react-social-icons'
import logo from '../../assets/img/logo.svg'
import {facebookUrl, mediumUrl, twitterUrl} from "../../config"
import {withRouter} from 'react-router'
import {logout} from '../../actions/authentication'
import { toggleNavbar } from '../../actions/visitor'

const items = [
    {
        title: "",
        url: "",
        rel: ""
    },
    {
        title: "",
        url: "",
        rel: ""
    },
    {
        title: "",
        url: "",
        rel: ""
    }
]

class NavigationBar extends Component {

    constructor(props) {
        
        super(props)
        this.state = {
            isOpen: false
        }
        this.toggle = this.toggle.bind(this);
        this.handleLogout = this.handleLogout.bind(this)
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        })
        this.props.dispatch(toggleNavbar())
    }

    handleLogout(){
        const {dispatch, history} = this.props
        dispatch(logout(history))
    }

    render() {
        const { user, isOpen } = this.props
        return (
            <Navbar className="navbar-light bg-primary" color="light" light expand="md">
                        <NavbarBrand href="/"><img src={logo} alt="logo" className="logo" /></NavbarBrand>
                        <NavbarToggler className="second-color glyphicon-align-center" onClick={this.toggle} />
                        <Collapse isOpen={isOpen} navbar>
                            <Nav className="float-left" navbar>
                                <NavItem>
                                    {!user && <NavLink tag={Link} to="/">Home</NavLink> } 
                                </NavItem>
                                <NavItem>
                                    {!user && <NavLink tag={Link} to="/about">About</NavLink> }
                                </NavItem>
                                <NavItem>
                                    {!user && <a className="nav-link" href="/about#contact">Contact</a> }
                                </NavItem>
                                <NavItem>
                                    {!user && <NavLink target="_blank"  rel="noopener noreferrer" href="https://medium.com/@narrafy">Blog</NavLink> }
                                </NavItem>
                            </Nav>
                        </Collapse>
                {user? (
                    
                    <Nav className={"float-right"}>

                        <NavItem>
                            <NavLink tag={Link} className={"secondary-color"} to="/dashboard">Dashboard</NavLink>
                        </NavItem>

                        <NavItem>
                            <NavLink tag={Link} className={"secondary-color"} to="/analytics">Analytics</NavLink>
                        </NavItem>
                        
                        <NavItem>
                            <NavLink tag={Link} className={"secondary-color"} to="/profile"> <FontAwesomeIcon icon={faUser} /></NavLink>
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
                        <NavItem>
                                <NavLink tag={Link} className={"cta-link"} to="/register">Register</NavLink>
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
                )}
            </Navbar>
        );
    }
}

const mapStateToProps = state => {
    const {user} = state.auth
    return {
        user
    }
}

export default withRouter(connect(mapStateToProps)(NavigationBar));
