import React, { useState } from 'react'
import emoji from 'react-easy-emoji'
import Activités from './Activités'
import LimitReached from './Limit'
import { Search } from './Search'
import Splash from './Splash'

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
			`}
		>
			<Content />
		</section>
	)
}

const Content = () => {
	const [scenario, setScenario] = useState({ quota: 500, warming: '1.5' })
	const [searching, setSearching] = useState(false)
	const [items, setItems] = useState([])

	const setNextLimit = () =>
		scenario.quota === 500
			? setScenario({ quota: 1000, warming: '2' })
			: setScenario({ quota: 2000, warming: '3' })

	const footprint = items.reduce((memo, [, , weight]) => memo + weight, 0),
		limitReached = footprint > scenario.quota / 365

	return (
		<>
			{searching && (
				<Search
					items={items}
					click={item => {
						setSearching(false)
						setItems([...items, item])
					}}
				/>
			)}

			{limitReached && (
				<LimitReached setNextLimit={setNextLimit} scenario={scenario} />
			)}
			{items.length > 0 && (
				<Activités
					display={!limitReached && !searching}
					items={items}
					setSearching={setSearching}
					quota={scenario.quota}
				/>
			)}
			{!items.length && !searching && !limitReached && (
				<Splash action={() => setSearching(true)} />
			)}
		</>
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
