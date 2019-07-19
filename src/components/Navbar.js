import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {
	render() {
		return (
			<nav className="navbar" role="navigation" aria-label="main navigation">
				<div className="navbar-brand">
					<a className="navbar-item" href="http://localhost:3000">
						TCUP 2019
					</a>

					<a
						role="button"
						className="navbar-burger burger"
						aria-label="menu"
						aria-expanded="false"
						data-target="navbarBasicExample"
					>
						<span aria-hidden="true" />
						<span aria-hidden="true" />
						<span aria-hidden="true" />
					</a>
				</div>

				<div className="navbar-menu">
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
						<Link to="/registration" className="navbar-item has-text-success">
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
