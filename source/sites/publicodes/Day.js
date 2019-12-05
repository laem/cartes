import React, { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'

export default () => {
	return (
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
			<Content />
		</section>
	)
}

const firstTarget = 500 / 365

const Content = () => {
	const [scenario, setScenario] = useState({ quota: 500, warming: '1.5' })
	const [searching, setSearching] = useState(false)
	const [items, setItems] = useState([])

	const setNextLimit = () => scenario.quota === 500 ? setScenario({ quota: 1000, warming: '2' }) : setScenario({ quota: 2000, warming: '3' })


	const footprint = items.reduce((memo, [, , weight]) => memo + weight, 0),
		limitReached = footprint > scenario.quota / 365

	if (searching) return <Search items={items} click={(item) => {
		setSearching(false)
		setItems([...items, item])
	}} />
	if (limitReached) return <LimitReached setNextLimit={setNextLimit} scenario={scenario} />
	if (items.length) return <Activités items={items} setSearching={setSearching} quota={scenario.quota} />
	return <Splash action={() => setSearching(true)} />

}

const suggestions = [
	['J\'ai petit-déjeuné', '🥐☕', 0.5]
	, ['Je me suis déplacé', '💼🚶🏿‍♀️', 0.8, true],
	['J\'ai déjeuné à midi', '🍽️', 0.8]
]
const Search = ({ click, items }) => (
	<>
		<h1>Qu'as-tu fait de la journée ? </h1>
		<ul css="li { margin: 1rem 2rem; list-style-type: none;} button { width: 80%}; img {font-size: 150%} ">
			{suggestions.filter(([t, , , repeats]) => repeats || !items.find(([it]) => t === it)).map(item => {
				let [text, icons] = item
				return (
					<li key={text}>
						<button className="ui__ card" onClick={() => click(item)}>{emoji(icons)} {text}
						</button></li>)
			})}</ul>
	</>)

const blackScreenStyle = `
		background: black;
		width: 100vw;
		height: 100vh;
		color: white;
		button, h1 {
			color: white;
		}
		display: flex; flex-direction: column; justify-content: center;
		padding: 2rem;
`


const LimitReached = ({ setNextLimit, scenario: { quota, warming } }) => {
	useEffect(() => {
		window.navigator.vibrate(200)
	}
		, [])
	return (
		<div css={blackScreenStyle}> {warming === '3' ? <h1>Game over {emoji('😵')}, comme on dit.</h1> : <>
			<h1> + {warming}° dépassé {emoji('🌡️🥵')}</h1>
			<p>La taille de votre écran est finie, tout comme les limites de notre planète bleue {emoji('🌍')}.</p>
			<p>Vous avez dépassé le quota qui permet de limiter le réchauffement à +{warming}°.</p>

			<button className="ui__ button plain" onClick={setNextLimit}>Continuer ma journée</button>
		</>}

		</div>
	)
}

const Splash = ({ action }) => {
	const date = new Date(),
		today = date.toLocaleDateString('fr', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
	return (

		<div
			css={`
			small {font-size: 100%}
			em {
				background: #78e08f;
				font-style: normal;
				padding: 0 .2rem;
			}
			`}>
			<small>{today}</small>
			<h1>As-tu été <em>écolo</em> aujourd'hui ?</h1>
			<button className="ui__ button plain" onClick={action}>Commencer</button>
		</div>
	)
}

const halfColors = ['#e8817f', '#c3727c', '#8d5273', '#5a336e', '#311f62'],
	colors = [...halfColors.reverse(), ...halfColors]


const Activités = ({ items, setSearching, quota }) => (
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
		{items.map(([text, icon, weight], i) => (
			<li
				css={`
					line-height: initial;
					background: ${icon ? colors[i] : 'white'};
					height: ${(weight / (quota / 365)) * 100}vh;
					display: flex;
					flex-direction: column;
					justify-content: center;
				`}>
				<div>{emoji(icon)}</div>
			</li>
		))}
		<button className="ui__ card"
			onClick={setSearching}
			css={`
		font-size: 300%;
		position: absolute; 
		bottom: 1rem;
		right: 1rem;
		padding: 0;
		border-radius: 10rem !important;
		width: 7rem;
		height: 7rem;
		background: var(--colour);
		color: var(--textColour);
		display: flex;
		align-items: center;
		justify-content: center;
		`}>+</button>
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
