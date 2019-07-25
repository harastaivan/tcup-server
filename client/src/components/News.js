import React, { Component } from 'react';

export default class News extends Component {
	news = [
		{
			heading: 'Přílety',
			author: 'Martina',
			date: '17. 07. 2019, 18:03',
			body: `BL, JL, LJ, NB, KB, OZ, MM, TT, SK, ŠNeK, PJ, EY, NB, CL, SR,SJ, CL, GO, T1 

MC - pole u Úněšova 

LS - Bezvěrov 

SD na poli v kruhu 

P2 v Líních 

IYD na poli s MF a MC 

PB pole 

75 Plasy`
		}
	];

	render() {
		return (
			<div>
				<h1>Novinky</h1>
			</div>
		);
	}
}
