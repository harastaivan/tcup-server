import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import 'bulma';
import './App.css';

import Navbar from './components/Navbar';
import Home from './components/Home';
import News from './components/News';
import Registration from './components/Registration';
import Login from './components/Login';
import Statuses from './components/Statuses';
import StartingList from './components/StartingList';
import Documents from './components/Documents';
import Contacts from './components/Contacts';
import SendIgc from './components/SendIgc';

function App() {
	return (
		<Router>
			<div className="App">
				<Navbar />
				<Switch>
					<Route path="/" component={Home} exact />
					<Route path="/news" component={News} />
					<Route path="/registration" component={Registration} />
					<Route path="/login" component={Login} />
					<Route path="/statuses" component={Statuses} />
					<Route path="/starting-list" component={StartingList} />
					<Route path="/documents" component={Documents} />
					<Route path="/contacts" component={Contacts} />
					<Route path="/igc" component={SendIgc} />
				</Switch>
			</div>
		</Router>
	);
}

export default App;
