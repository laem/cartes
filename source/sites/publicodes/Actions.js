import { setSimulationConfig } from 'Actions/actions'
import { splitName } from 'Components/publicodesUtils'
import SessionBar from 'Components/SessionBar'
import { EngineContext } from 'Components/utils/EngineContext'
import { utils } from 'publicodes'
import { partition, sortBy, union } from 'ramda'
import React, { useContext, useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useLocation, useParams } from 'react-router'
import { Link, Route, Switch } from 'react-router-dom'
import { animated } from 'react-spring'
import { objectifsSelector } from 'Selectors/simulationSelectors'
import tinygradient from 'tinygradient'
import { setActionMode } from '../../actions/actions'
import IllustratedButton from 'Components/IllustratedButton'
import {
	answeredQuestionsSelector,
	configSelector,
} from '../../selectors/simulationSelectors'
import Action from './Action'
import ActionPlus from './ActionPlus'
import ActionVignette from './ActionVignette'
import { extractCategories } from './chart'
import ListeActionPlus from './ListeActionPlus'
import ModeChoice from './ModeChoice'
import CategoryFilters from './CategoryFilters'

const { encodeRuleName, decodeRuleName } = utils

const gradient = tinygradient(['#0000ff', '#ff0000']),
	colors = gradient.rgb(20)

export default ({}) => {
	return (
		<>
			<Switch>
				<Route path="/actions/mode">
					<ModeChoice />
				</Route>
				<Route exact path="/actions/plus">
					<ListeActionPlus />
				</Route>
				<Route exact path="/actions/catégorie/:category">
					<ActionList />
				</Route>
				<Route path="/actions/plus/:encodedName+">
					<ActionPlus />
				</Route>
				<Route path="/actions/:encodedName+">
					<Action />
				</Route>

				<Route path="/actions">
					<ActionList />
				</Route>
			</Switch>
		</>
	)
}

// Publicodes's % unit is strangely handlded
// the nodeValue is * 100 to account for the unit
// hence we divide it by 100 and drop the unit
export const correctValue = (evaluated) => {
	const { nodeValue, unit } = evaluated

	const result = unit?.numerators.includes('%') ? nodeValue / 100 : nodeValue
	return result
}

const ActionList = animated(({}) => {
	const location = useLocation()
	let { category } = useParams()

	const rules = useSelector((state) => state.rules)
	const flatActions = rules['actions']

	const [radical, setRadical] = useState(false)

	const simulation = useSelector((state) => state.simulation)

	// Add the actions rules to the simulation, keeping the user's situation
	const config = !simulation
		? { objectifs: ['bilan', ...flatActions.formule.somme] }
		: {
				...simulation.config,
				objectifs: union(
					simulation.config.objectifs,
					flatActions.formule.somme
				),
		  }

	const objectifs = useSelector(objectifsSelector)

	const engine = useContext(EngineContext)

	const targets = objectifs.map((o) => engine.evaluate(o))

	const configSet = useSelector(configSelector)
	const answeredQuestions = useSelector(answeredQuestionsSelector)
	const mode = useSelector((state) => state.actionMode)

	if (!mode) return <Redirect to="/actions/mode" />

	const dispatch = useDispatch()
	useEffect(() => dispatch(setSimulationConfig(config)), [location.pathname])
	if (!configSet) return <div>Config not set</div>

	const [bilans, actions] = partition((t) => t.dottedName === 'bilan', targets)

	console.log(
		'ACTIONS',
		Object.entries(rules).filter(([dottedName]) =>
			actions.find((action) => action.dottedName === dottedName)
		)
	)

	const filterByCategory = (actions) =>
		actions.filter((action) =>
			category ? splitName(action.dottedName)[0] === category : true
		)

	const effortScale = { modéré: 2, conséquent: 3, faible: 1, undefined: 0 }
	const sortedActions =
		mode === 'guidé'
			? sortBy((a) => effortScale[rules[a.dottedName].effort])(
					actions.filter((a) => rules[a.dottedName].effort != null)
			  )
			: sortBy((a) => (radical ? -1 : 1) * correctValue(a))(actions)

	const finalActions = filterByCategory(sortedActions)

	const categories = extractCategories(rules, engine)
	const countByCategory = actions.reduce((memo, next) => {
		const category = splitName(next.dottedName)[0]

		return { ...memo, [category]: (memo[category] || 0) + 1 }
	}, {})

	return (
		<div css="padding: 0 .3rem 1rem; max-width: 600px; margin: 1rem auto;">
			{!answeredQuestions.length && (
				<p css="line-height: 1.4rem; text-align: center">
					{emoji('🧮')}&nbsp; Pour personnaliser ces propositions
				</p>
			)}
			<SessionBar />
			<h1 css="margin: 1rem 0 .6rem;font-size: 160%">
				Comment réduire mon empreinte ?
			</h1>
			<Link
				to="/actions/mode"
				css="margin-bottom: .8rem; display: inline-block"
			>
				Mode {mode}
			</Link>
			<CategoryFilters
				categories={categories}
				selected={category}
				countByCategory={countByCategory}
			/>
			{mode === 'autonome' && (
				<button onClick={() => setRadical(!radical)}>
					Trié par :{' '}
					{radical ? (
						<span>le plus d'impact {emoji('📉')}</span>
					) : (
						<span>le moins d'impact{emoji('📈')}</span>
					)}
				</button>
			)}
			{finalActions.map((evaluation) => (
				<ActionVignette
					key={evaluation.dottedName}
					rule={rules[evaluation.dottedName]}
					evaluation={evaluation}
					total={bilans.length ? bilans[0].nodeValue : null}
					effort={
						mode === 'guidé' && effortScale[rules[evaluation.dottedName].effort]
					}
				/>
			))}
			<div css="font-size: 100%; text-align: center">
				<em>en CO₂e / an et proportion de votre total</em>
			</div>
			<IllustratedButton to={'/actions/plus'} icon="📚">
				<div>
					<div>Comprendre les actions</div>
					<p>
						<small>
							Au-delà d'un simple chiffre, découvrez les enjeux qui se cachent
							derrière chaque action.
						</small>
					</p>
				</div>
			</IllustratedButton>
		</div>
	)
})
