import { splitName } from 'Components/publicodesUtils'
import { EngineContext } from 'Components/utils/EngineContext'
import { utils } from 'publicodes'
import { partition } from 'ramda'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import Overlay from '../../components/Overlay'
import {
	correctValue,
	extractCategoriesNamespaces,
} from '../../components/publicodesUtils'
import {
	answeredQuestionsSelector,
	situationSelector,
} from '../../selectors/simulationSelectors'
import { sortBy } from '../../utils'
import ActionStack from './ActionStack'
import CategoryFilters from './CategoryFilters'
import { PersonaGrid } from './Personas'
import {
	ActionGameCard,
	ActionListCard,
	disabledAction,
	supersededAction,
} from './ActionVignette'
import AllActions from './AllActions'

const { encodeRuleName, decodeRuleName } = utils

export default ({ display }) => {
	const location = useLocation()
	let { category } = useParams()

	const rules = useSelector((state) => state.rules)
	const situation = useSelector(situationSelector),
		answeredQuestions = useSelector(answeredQuestionsSelector)
	const flatActions = rules['actions']

	const radical = true

	const simulation = useSelector((state) => state.simulation)

	const objectifs = ['bilan', ...flatActions.formule.somme]

	const engine = useContext(EngineContext)

	const targets = objectifs.map((o) => engine.evaluate(o))

	const dispatch = useDispatch()

	const [bilans, actions] = partition((t) => t.dottedName === 'bilan', targets)

	const filterByCategory = (actions) =>
		actions.filter((action) =>
			category ? splitName(action.dottedName)[0] === category : true
		)

	const actionChoices = useSelector((state) => state.actionChoices)

	const sortedActionsByImpact = sortBy(
			(a) => (radical ? 1 : -1) * correctValue(a)
		)(actions),
		interestingActions = sortedActionsByImpact.filter((action) => {
			const flatRule = rules[action.dottedName]
			return (
				!disabledAction(flatRule, action.nodeValue) &&
				!supersededAction(action.dottedName, rules, actionChoices)
			)
		})

	const finalActions = filterByCategory(interestingActions)

	const categories = extractCategoriesNamespaces(rules, engine)
	const countByCategory = actions.reduce((memo, next) => {
		const category = splitName(next.dottedName)[0]

		return { ...memo, [category]: (memo[category] || 0) + 1 }
	}, {})

	const simulationWellStarted = answeredQuestions.length > 50

	if (!simulationWellStarted) {
		return (
			<Overlay onClose={() => null}>
				<div>
					<h1>Simulation manquante</h1>
					<p>
						{emoji('⏳️ ')}Vous n'avez pas encore fait le test. Le parcours de
						passage à l'action ne sera pas du tout personnalisé.
					</p>
					<div css="margin: 1rem 0 .6rem;">
						<Link to="/simulateur/bilan" className="ui__ plain button">
							Faire le test
						</Link>
					</div>
					<p>
						{emoji('💡 ')}
						Vous pouvez aussi voir le parcours action comme si vous étiez l'un
						de ces personas :
					</p>
					<PersonaGrid additionnalOnClick={() => null} />
				</div>
			</Overlay>
		)
	}

	return (
		<div
			css={`
				padding: 0 0 1rem;
				${display !== 'list' && `max-width: 600px;`}
				margin: 1rem auto;
			`}
		>
			{display === 'list' ? (
				<AllActions {...{ actions: finalActions.reverse(), bilans, rules }} />
			) : finalActions.length ? (
				<ActionStack
					key={category}
					actions={finalActions}
					onVote={(item, vote) => console.log(item.props, vote)}
					total={bilans.length ? bilans[0].nodeValue : null}
				></ActionStack>
			) : (
				<p>{emoji('🤷')} Plus d'actions dans cette catégorie</p>
			)}
			<Link
				to={display === 'list' ? '/actions' : '/actions/liste'}
				css=" text-align: center; display: block; margin: 1rem"
			>
				<button className="ui__ button">
					{display === 'list' ? 'Vue jeu de cartes (en dev)' : 'Vue liste'}
				</button>
			</Link>

			<CategoryFilters
				categories={categories}
				selected={category}
				countByCategory={countByCategory}
			/>
		</div>
	)
}
