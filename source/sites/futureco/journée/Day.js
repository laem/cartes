import Route404 from 'Components/Route404'
import { analyse } from 'Engine/traverse'
import React, { useContext, useEffect, useMemo } from 'react'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { parsedRulesSelector } from 'Selectors/analyseSelectors'
import scenarios from '../scenarios.yaml'
import Simulateur from '../Simulateur'
import { StoreContext } from '../StoreContext'
import Activités from './Activités'
import Ajout from './Ajout'
import LimitReached from './Limit'
import Splash from './Splash'
export default () => {
	const {
		state: { items, scenario },
		dispatch
	} = useContext(StoreContext)
	const { path, url } = useRouteMatch(),
		scenarioData = scenarios[scenario],
		{ 'crédit carbone par personne': quota } = scenarioData

	const setNextLimit = () =>
			quota === 0.5
				? dispatch({
						type: 'SET_SCENARIO',
						scenario: 'B'
				  })
				: dispatch({
						type: 'SET_SCENARIO',
						scenario: 'A'
				  }),
		parsedRules = useSelector(parsedRulesSelector)

	const analysis = useMemo(
		() =>
			items.map(item =>
				analyse(
					parsedRules,
					item.dottedName
				)(dottedName => item.situation[dottedName])
			),
		[items, parsedRules]
	)

	console.log('ana in Day.js', analysis)

	const footprint = analysis.reduce(
			(memo, item) => memo + item.targets[0].nodeValue,
			0
		),
		limitReached = footprint > (quota * 1000) / 365
	console.log(JSON.stringify(items))

	// Easily load examples for development
	useEffect(() => {
		window.addEventListener('keydown', downHandler(dispatch))
		return () => {
			window.removeEventListener('keydown', downHandler(dispatch))
		}
	}, [dispatch])
	return (
		<div>
			{limitReached ? (
				<LimitReached setNextLimit={setNextLimit} scenarioData={scenarioData} />
			) : (
				<Switch>
					<Route exact path={path} component={Splash} />
					<Route path={path + '/thermomètre'}>
						<Activités items={items} quota={quota} analysis={analysis} />
					</Route>
					<Route path={path + '/ajouter'}>
						<Ajout items={items} />
					</Route>
					<Route path={path + '/simulateur/:name+'}>
						<Simulateur
							onEnd={(dottedName, situation) =>
								dispatch({
									type: 'SET_ITEMS',
									items: [...items, { dottedName, situation }]
								})
							}
						/>
					</Route>
					<Route component={Route404} />
				</Switch>
			)}
		</div>
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

const downHandler = dispatch => ({ key }) => {
	if (key === 'e') {
		dispatch({
			type: 'SET_ITEMS',
			items: [
				{
					dottedName: 'nourriture . Tasse de café',
					situation: {}
				},
				{
					dottedName: "transport . impact à l'usage",
					situation: {
						'transport . mode': 'tram',
						'transport . distance parcourue': 100
					}
				},
				{
					dottedName: 'nourriture . Viennoiserie brioche - type brioche',
					situation: {}
				},
				{
					dottedName: 'nourriture . Tasse de café',
					situation: {}
				},
				{
					dottedName: 'douche . impact par douche',
					situation: {
						'chauffage . type': 'électricité',
						'douche . pomme de douche économe': 'non',
						'douche . durée de la douche': 10
					}
				},
				{
					dottedName: 'numérique . téléphone journée',
					situation: {}
				}
			]
		})
	}
}
