import React, { Component, Fragment } from 'react';
import { NavLink as Link } from 'react-router-dom';
import {
	Badge,
	Collapse,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	NavLink,
	UncontrolledDropdown
} from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class AppNavbar extends Component {
	state = {
		open: false
	};

	static propTypes = {
		auth: PropTypes.object.isRequired
	};

	toggle = () => {
		this.setState({
			open: !this.state.open
		});
	};

	render() {
		const { isAuthenticated, user } = this.props.auth;

		const authLinks = (
			<Fragment>
				<NavItem>
					<span className="navbar-text mr-3">
						<strong>{user ? `${user.name} ${user.surname}` : ''}</strong>
						{user && user.admin ? (
							<Badge color="danger" className="ml-2">
								Admin
							</Badge>
						) : (
							''
						)}
					</span>
				</NavItem>
				<NavItem>
					<NavLink tag={Link} to="/logout" activeClassName="active">
						Odhlásit se
					</NavLink>
				</NavItem>
			</Fragment>
		);

		const guestLinks = (
			<Fragment>
				<NavItem>
					<NavLink tag={Link} to="/login" activeClassName="active">
						Přihlásit se
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink tag={Link} to="/signup" activeClassName="active">
						Registrace
					</NavLink>
				</NavItem>
			</Fragment>
		);
		return (
			<Fragment>
				<Navbar color="dark" dark expand="lg">
					<NavbarBrand tag={Link} to="/">
						{process.env.REACT_APP_TITLE}
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
							<NavItem />
							<NavItem>
								<NavLink tag={Link} to="/igc" activeClassName="active">
									Odeslat IGC
								</NavLink>
							</NavItem>
							<UncontrolledDropdown nav inNavbar className="bg-dark mr-4">
								<DropdownToggle nav caret>
									Další
								</DropdownToggle>
								<DropdownMenu right className="bg-dark">
									<DropdownItem className="bg-dark">
										<NavLink tag={Link} to="/documents" activeClassName="active">
											Dokumenty
										</NavLink>
									</DropdownItem>
									<DropdownItem className="bg-dark">
										<NavItem>
											<NavLink tag={Link} to="/contacts" activeClassName="active">
												Kontakty
											</NavLink>
										</NavItem>
									</DropdownItem>
								</DropdownMenu>
							</UncontrolledDropdown>
							{isAuthenticated ? authLinks : guestLinks}
						</Nav>
					</Collapse>
				</Navbar>
			</Fragment>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		auth: state.auth
	};
};

export default connect(mapStateToProps, null)(AppNavbar);
