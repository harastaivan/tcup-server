import React, { Component } from 'react';
import { Alert, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../actions/auth';
import { clearErrors } from '../actions/error';

class Login extends Component {
	state = {
		modal: false,
		email: '',
		password: '',
		msg: null
	};

	static propTypes = {
		isAuthenticated: PropTypes.bool,
		error: PropTypes.object.isRequired,
		login: PropTypes.func.isRequired,
		clearErrors: PropTypes.func.isRequired
	};

	onChange = e => {
		this.setState({
			[e.target.name]: e.target.value
		});
	};

	onSubmit = e => {
		e.preventDefault();
		const { email, password } = this.state;
		const user = { email, password };
		this.props.login(user);
		this.setState({
			password: ''
		});
	};

	componentDidUpdate(previousProps) {
		const { error, isAuthenticated } = this.props;
		if (error !== previousProps.error) {
			// Check for register error
			if (error.id === 'LOGIN_FAIL') {
				this.setState({ msg: error.msg.msg });
			} else {
				this.setState({ msg: null });
			}
		}
		if (isAuthenticated) {
			this.props.clearErrors();
			this.props.history.push('/');
		}
	}

	render() {
		return (
			<div>
				{this.state.msg ? (
					<Alert color='danger'>{this.state.msg}</Alert>
				) : null}
				<h1>Přihlásit se</h1>
				<Form onSubmit={this.onSubmit}>
					<FormGroup>
						<Label for='email'>Email</Label>
						<Input
							type='email'
							name='email'
							id='email'
							placeholder='Email'
							value={this.state.email}
							onChange={this.onChange}
						/>
					</FormGroup>
					<FormGroup>
						<Label for='Password'>Heslo</Label>
						<Input
							type='password'
							name='password'
							id='Password'
							placeholder='Heslo'
							value={this.state.password}
							onChange={this.onChange}
						/>
					</FormGroup>
					<Button
						color='dark'
						style={{ marginTop: '2rem' }}
						block
						disabled={!this.state.email || !this.state.password}
					>
						Přihlásit se
					</Button>
				</Form>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated,
	error: state.error
});

export default connect(
	mapStateToProps,
	{ login, clearErrors }
)(Login);
