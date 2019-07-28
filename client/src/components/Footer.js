import React, { Component } from 'react';

export default class Footer extends Component {
	render() {
		return (
			<footer className="mt-4 py-4 text-center text-small">
				<p>
					© tcup 2019 <b>verze {process.env.REACT_APP_VERSION}</b>
				</p>
				<p>
					by{' '}
					<a target="_blank" rel="noopener noreferrer" href="https://github.com/harastaivan">
						@harastaivan
					</a>
				</p>
			</footer>
		);
	}
}
