import React from 'react'
import emoji from 'react-easy-emoji'
export default () => (
	<section
		css={`
			height: 100vh;
			width: 100vw;
			display: flex;
			justify-content: center;
			flex-wrap: wrap;
			flex-direction: column;
			text-align: center;
		`}>
		<Activités />
	</section>
)

const Splash = () => (
	<div
		css={`
			width: 90vw;
			margin-left: 5vw;
		`}>
		<h1>Qu'avez-vous fait aujourd'hui ?</h1>
		<button className="ui__ button">J'ai pris un petit-déjeuner</button>
	</div>
)

const items = ['🥐', '', '🚶‍♀️🚲🚌🚃🚗', '', '🍽', '', '', '🚶‍♀️🚲🚃🚌🚗', '', '🍽']
const halfColors = ['#e8817f', '#c3727c', '#8d5273', '#5a336e', '#311f62'],
	colors = [...halfColors.reverse(), ...halfColors]
const Activités = () => (
	<ul
		css={`
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			height: 100vh;
			margin: 0;
			padding: 0;
			> li {
				line-height: 3rem;
				padding-left: 1rem;
				width: 100%;
				list-style-type: none;
			}
			img {
				font-size: 180%;
			}
		`}>
		{items.map((icon, i) => (
			<li
				css={`
					line-height: initial;
					background: ${icon ? colors[i] : 'white'};
					height: ${Math.max(
						8,
						(Math.random() + 0.5) * (100 / items.length)
					)}vh;
					display: flex;
					flex-direction: column;
					justify-content: center;
				`}>
				<div>{emoji(icon)}</div>
			</li>
		))}
	</ul>
)

const PetitDéjeuner = () => (
	<li>
		<div>Mon petit-déjeuner</div>
		<input placeholder="Qu'avez-vous mangé ?" />
		<ul>
			{[
				'bol de céréales',
				'tartines beurre ou confiture',
				'croissant 🥐 ou pain au chocolat',
				'café',
				'thé'
			].map(nom => (
				<li>
					{emoji(nom)}
					<img
						width="20px"
						src="https://icon-library.net/images/co2-icon/co2-icon-9.jpg"
					/>
				</li>
			))}
		</ul>
	</li>
)
