import { setSimulationConfig } from 'Actions/actions'
import Route404 from 'Components/Route404'
import React, { useContext, useEffect } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'
import scenarios from '../scenarios.yaml'
import Simulateur from '../Simulateur'
import { StoreContext } from '../StoreContext'
import Activités from './Activités'
import Ajout from './Ajout'
import LimitReached from './Limit'
import Splash from './Splash'
export default () => {
	const {
		state: { items, scenario, situation: daySituation },
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
			  })

	const dispatchGlobal = useDispatch(),
		analysis = useSelector(analysisWithDefaultsSelector),
		situation = useSelector(state => state.simulation?.situation)

	useEffect(() => {
		dispatch({ type: 'AMEND_DAY_SITUATION', situation })
		dispatchGlobal(
			setSimulationConfig(
				{ objectifs: items },
				{ ...daySituation, ...situation }
			)
		)
	}, [items])

	const targets = analysis?.targets
	const footprint = targets?.reduce((memo, item) => memo + item.nodeValue, 0),
		limitReached = footprint > (quota * 1000) / 365
	console.log('ana', analysis)
	return (
		<section>
			{limitReached ? (
				<LimitReached setNextLimit={setNextLimit} scenarioData={scenarioData} />
			) : (
				<Switch>
					<Route exact path={path} component={Splash} />
					<Route path={path + '/thermomètre'}>
						<Activités items={items} quota={quota} analysis={analysis} />
					</Route>
					<Route path={path + '/ajouter'}>
						<Ajout
							items={items}
							click={item => {
								dispatch({ type: 'SET_ITEMS', items: [...items, item] })
							}}
						/>
					</Route>
					<Route path={path + '/simulateur/:name+'}>
						<Simulateur redirection="/journée/thermomètre" />
					</Route>
					<Route component={Route404} />
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
