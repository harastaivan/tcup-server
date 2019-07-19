import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {
	state = {
		open: false
	};

	onClick = () => {
		this.setState({
			open: !this.state.open
		});
	};

	render() {
		return (
			<nav className="navbar" role="navigation" aria-label="main navigation">
				<div className="navbar-brand">
					<a className="navbar-item" href="http://localhost:3000">
						TCUP 2019
					</a>

					<a
						role="button"
						className={'navbar-burger burger' + (this.state.open ? ' is-active' : '')}
						aria-label="menu"
						aria-expanded="false"
						data-target="mainNavbar"
						onClick={this.onClick}
					>
						<span aria-hidden="true" />
						<span aria-hidden="true" />
						<span aria-hidden="true" />
					</a>
				</div>

				<div id="mainNavbar" className={'navbar-menu' + (this.state.open ? ' is-active' : '')}>
					<div className="navbar-start">
						<Link to="/" className="navbar-item">
							Domů
						</Link>

						<Link to="/news" className="navbar-item">
							Novinky
						</Link>
						<Link to="/statuses" className="navbar-item">
							Statusy soutěžících
						</Link>
						<a
							href="https://www.soaringspot.com/cs/touzim-cup-2019-touzim1-2019/results"
							className="navbar-item"
						>
							Úlohy a výsledky
						</a>
						<Link to="/starting-list" className="navbar-item">
							Startovní listina
						</Link>
						<Link to="/registration" className="navbar-item">
							Přihláška
						</Link>

						<div className="navbar-item has-dropdown is-hoverable">
							<Link to="/" className="navbar-link">
								Další
							</Link>

							<div className="navbar-dropdown">
								<Link to="/documents" className="navbar-item">
									Dokumenty
								</Link>
								<Link to="/contacts" className="navbar-item">
									Kontakty
								</Link>
							</div>
						</div>
					</div>

					<div className="navbar-end">
						<div className="navbar-item">
							<div className="buttons">
								<Link to="/igc" className="button is-primary">
									<strong>Odeslat IGC</strong>
								</Link>
								<Link to="/login" className="button is-light">
									Přihlásit se
								</Link>
							</div>
						</div>
					</div>
				</div>
			</nav>
		);
	}
}
