import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	CardText,
	Button,
	Spinner
} from 'reactstrap';
import Moment from 'react-moment';
import 'moment/locale/cs';

import { getNews, deleteNews, setNewsLoading } from '../actions/news';
import AddNews from './AddNews';

class News extends Component {
	static propTypes = {
		news: PropTypes.object.isRequired,
		getNews: PropTypes.func.isRequired,
		isAuthenticated: PropTypes.bool,
		deleteNews: PropTypes.func.isRequired
	};

	onDeleteClick = id => {
		this.props.deleteNews(id);
	};

	componentDidMount() {
		this.props.setNewsLoading();
		this.props.getNews();
	}

	render() {
		const { news, loading } = this.props.news;
		const spinner = (
			<Spinner type='grow' color='secondary' className='m-3' />
		);
		return (
			<div>
				<h1>Novinky</h1>
				<AddNews />
				{loading ? spinner : null}
				{news.map(one => (
					<Card className='mt-4' key={one._id}>
						<CardHeader>
							<h3>
								{one.title}
								{this.props.isAuthenticated ? (
									<Button
										className='remove-btn float-right'
										color='danger'
										size='sm'
										onClick={this.onDeleteClick.bind(
											this,
											one._id
										)}
									>
										Smazat novinku
									</Button>
								) : null}
							</h3>
						</CardHeader>
						<CardBody>
							{one.body.split('\n').map((line, i) => {
								return <CardText key={i}>{line}</CardText>;
							})}
						</CardBody>
						<CardFooter>
							<strong>{`${one.author.name} ${
								one.author.surname
							} `}</strong>
							<Moment
								format={'dddd D. M. YYYY HH:mm'}
								locale='cs'
								className='float-right'
							>
								{one.updatedAt}
							</Moment>
						</CardFooter>
					</Card>
				))}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	news: state.news,
	isAuthenticated: state.auth.isAuthenticated
});

export default connect(
	mapStateToProps,
	{ getNews, deleteNews, setNewsLoading }
)(News);
