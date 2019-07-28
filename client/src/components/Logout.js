import React, { Component, Fragment } from 'react';
import { logout } from '../actions/auth';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Logout extends Component {
	static propTypes = {
		logout: PropTypes.func.isRequired
	};

	logout = () => {
		this.props.logout();
		this.props.history.push('/');
	};

	componentWillMount() {
		this.logout();
	}

	render() {
		return <Fragment />;
	}
}

export default connect(null, { logout })(Logout);
