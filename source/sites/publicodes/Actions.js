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
import ActionVignette, { disabledAction } from './ActionVignette'
import { extractCategories } from 'Components/publicodesUtils'
import ListeActionPlus from './ListeActionPlus'
import ModeChoice from './ModeChoice'
import CategoryFilters from './CategoryFilters'
import { correctValue } from '../../components/publicodesUtils'
import { sessionBarMargin } from '../../components/SessionBar'
import Meta from '../../components/utils/Meta'

const { encodeRuleName, decodeRuleName } = utils

const gradient = tinygradient(['#0000ff', '#ff0000']),
	colors = gradient.rgb(20)

export default ({}) => {
	return (
		<>
			<Meta
				title="Passer à l'action"
				title="Découvrez les gestes qui vous permettent de réduire votre empreinte climat"
			/>
			<Switch>
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

const ActionList = animated(({}) => {
	const location = useLocation()
	let { category } = useParams()

	const rules = useSelector((state) => state.rules)
	const flatActions = rules['actions']

	const [radical, setRadical] = useState(true)

	const simulation = useSelector((state) => state.simulation)

	// Add the actions rules to the simulation, keeping the user's situation
	const config = {
		...(simulation?.config || {}),
		objectifs: ['bilan', ...flatActions.formule.somme],
	}

	const objectifs = useSelector(objectifsSelector)

	const engine = useContext(EngineContext)

	const targets = objectifs.map((o) => engine.evaluate(o))

	const stateConfig = useSelector(configSelector),
		configSet = stateConfig && Object.keys(stateConfig).length
	const answeredQuestions = useSelector(answeredQuestionsSelector)
	const mode = useSelector((state) => state.actionMode)

	const dispatch = useDispatch()
	useEffect(() => dispatch(setSimulationConfig(config)), [location.pathname])
	if (!configSet) return <div>Config not set</div>

	const [bilans, actions] = partition((t) => t.dottedName === 'bilan', targets)

	const filterByCategory = (actions) =>
		actions.filter((action) =>
			category ? splitName(action.dottedName)[0] === category : true
		)

	const effortScale = { modéré: 2, conséquent: 3, faible: 1, undefined: 0 }
	const sortedActionsByMode =
			mode === 'guidé'
				? sortBy((a) => effortScale[rules[a.dottedName].effort])(
						actions.filter((a) => rules[a.dottedName].effort != null)
				  )
				: sortBy((a) => (radical ? -1 : 1) * correctValue(a))(actions),
		sortedActions = sortBy((action) => {
			const flatRule = rules[action.dottedName]
			return disabledAction(flatRule, action.nodeValue)
		}, sortedActionsByMode)

	const finalActions = filterByCategory(sortedActions)

	const categories = extractCategories(rules, engine)
	const countByCategory = actions.reduce((memo, next) => {
		const category = splitName(next.dottedName)[0]

		return { ...memo, [category]: (memo[category] || 0) + 1 }
	}, {})

	return (
		<div
			css={`
				padding: 0 0.3rem 1rem;
				max-width: 600px;
				margin: 1rem auto;

				${sessionBarMargin}
			`}
		>
			<SessionBar />
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
