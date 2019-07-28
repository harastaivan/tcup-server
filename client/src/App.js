import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container } from 'reactstrap';

import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import AppNavbar from './components/AppNavbar';
import Home from './components/Home';
import News from './components/News';
import Registration from './components/Registration';
import Login from './components/Login';
import Statuses from './components/Statuses';
import StartingList from './components/StartingList';
import Documents from './components/Documents';
import Contacts from './components/Contacts';
import SendIgc from './components/SendIgc';
import Signup from './components/Signup';
import Footer from './components/Footer';

import { loadUser } from './actions/auth';
import { Provider } from 'react-redux';
import store from './store';
import Logout from './components/Logout';
import Results from './components/Results';

class App extends Component {
	componentDidMount() {
		store.dispatch(loadUser());
	}
	render() {
		return (
			<Provider store={store}>
				<Router>
					<div className="App">
						<AppNavbar />
						<Container className="mt-4 min-vh-100">
							<Switch>
								<Route path="/" component={Home} exact />
								<Route path="/news" component={News} />
								<Route path="/registration" component={Registration} />
								<Route path="/login" component={Login} />
								<Route path="/signup" component={Signup} />
								<Route path="/logout" component={Logout} />
								<Route path="/statuses" component={Statuses} />
								<Route path="/starting-list" component={StartingList} />
								<Route path="/results" component={Results} />
								<Route path="/documents" component={Documents} />
								<Route path="/contacts" component={Contacts} />
								<Route path="/igc" component={SendIgc} />
							</Switch>
						</Container>
						<Footer />
					</div>
				</Router>
			</Provider>
		);
	}
}

export default App;
