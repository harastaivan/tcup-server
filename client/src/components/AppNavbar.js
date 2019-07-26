import React, { Component, Fragment } from 'react';
import { NavLink as Link } from 'react-router-dom';
import { Button, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

export default class AppNavbar extends Component {
	state = {
		open: false
	};

	toggle = () => {
		this.setState({
			open: !this.state.open
		});
	};

	render() {
		return (
			<Fragment>
				<Navbar color="dark" dark expand="sm">
					<NavbarBrand>
						<NavLink tag={Link} to="/">
							tcup 2019
						</NavLink>
					</NavbarBrand>
					<NavbarToggler onClick={this.toggle} />
					<Collapse isOpen={this.state.open} navbar>
						<Nav className="ml-auto" navbar>
							<NavItem>
								<NavLink tag={Link} to="/news" activeClassName="active">
									Novinky
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink tag={Link} to="/statuses" activeClassName="active">
									Statusy soutěžících
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink tag={Link} to="/starting-list" activeClassName="active">
									Startovní listina
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink tag={Link} to="/results" activeClassName="active">
									Úlohy a výsledky
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink tag={Link} to="/registration" activeClassName="active">
									Přihláška
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink tag={Link} to="/documents" activeClassName="active">
									Dokumenty
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink tag={Link} to="/igc" activeClassName="active">
									Odeslat IGC
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink tag={Link} to="/contacts" activeClassName="active">
									Kontakty
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink tag={Link} to="/login" activeClassName="active">
									Přihlásit se
								</NavLink>
							</NavItem>
						</Nav>
					</Collapse>
				</Navbar>
			</Fragment>
		);
	}
}
