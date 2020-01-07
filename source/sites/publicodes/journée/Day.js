import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Route, Switch } from 'react-router-dom'
import { StoreContext } from '../StoreContext'
import Activités from './Activités'
import LimitReached from './Limit'
import { Search } from './Search'
import Splash from './Splash'

export default () => {
	let {
		state: { items, scenario },
		dispatch
	} = useContext(StoreContext)
	const setNextLimit = () =>
		scenario.quota === 500
			? dispatch({
					type: 'SET_SCENARIO',
					scenario: { quota: 1000, warming: '2' }
			  })
			: dispatch({
					type: 'SET_SCENARIO',
					scenario: { quota: 2000, warming: '3' }
			  })

	const footprint = items.reduce((memo, [, , weight]) => memo + weight, 0),
		limitReached = footprint > scenario.quota / 365
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
			`}
		>
			{limitReached ? (
				<LimitReached setNextLimit={setNextLimit} scenario={scenario} />
			) : (
				<Switch>
					<Route exact path="/" component={Splash} />
					<Route path="/thermomètre">
						<Activités items={items} quota={scenario.quota} />
					</Route>
					<Route path="/ajouter">
						<Search
							items={items}
							click={item => {
								dispatch({ type: 'SET_ITEMS', items: [...items, item] })
							}}
						/>
					</Route>
					<Route path="/limite" component={LimitReached} />
				</Switch>
			)}
		</section>
	)
}

// Ancien code, peut-être à réutiliser
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
