import React, {Component} from 'react'
import { Link } from "react-router-dom"
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Container
} from 'reactstrap'

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
                <Container fluid={true}>
                    <Navbar color="light" light expand="md">
                        <NavbarBrand href="/"><img src="img/logo.svg" alt="logo" className="logo hidemobile" /></NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <NavLink tag={Link} to="/">Home</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href="https://arxiv.org/abs/1712.03080">Research</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} to="/stats">Stats</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} to="/about">About</NavLink>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </Navbar>
                </Container>
        );
    }
}

export default NavigationBar;
