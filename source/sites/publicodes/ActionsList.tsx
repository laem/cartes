import { Link } from 'react-router-dom'
import { extractCategories, splitName } from 'Components/publicodesUtils'
import { EngineContext } from 'Components/utils/EngineContext'
import { utils } from 'publicodes'
import { sortBy } from '../../utils'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router'
import {
	correctValue,
	extractCategoriesNamespaces,
} from '../../components/publicodesUtils'
import SessionBar, { sessionBarMargin } from '../../components/SessionBar'
import ActionStack from './ActionStack'
import ActionVignette, { disabledAction } from './ActionVignette'
import CategoryFilters from './CategoryFilters'
import { partition } from 'ramda'

const { encodeRuleName, decodeRuleName } = utils

export default ({ display }) => {
	const location = useLocation()
	let { category } = useParams()

	const rules = useSelector((state) => state.rules)
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

	const sortedActionsByImpact = sortBy(
			(a) => (radical ? 1 : -1) * correctValue(a)
		)(actions),
		interestingActions = sortedActionsByImpact.filter((action) => {
			const flatRule = rules[action.dottedName]
			return !disabledAction(flatRule, action.nodeValue)
		})

	const finalActions = filterByCategory(interestingActions)

	const categories = extractCategoriesNamespaces(rules, engine)
	const countByCategory = actions.reduce((memo, next) => {
		const category = splitName(next.dottedName)[0]

		return { ...memo, [category]: (memo[category] || 0) + 1 }
	}, {})
	console.log('FA', finalActions)

	return (
		<div
			css={`
				padding: 0 0.3rem 1rem;
				${display !== 'list' && `max-width: 600px;`}
				margin: 1rem auto;

				${sessionBarMargin}
			`}
		>
			<SessionBar />
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
				to="/actions/liste"
				css="margin: 0 auto; text-align: center; display: block; margin: .4rem"
			>
				<button className="ui__ button">Vue liste</button>
			</Link>

			<CategoryFilters
				categories={categories}
				selected={category}
				countByCategory={countByCategory}
			/>
		</div>
	)
}

const AllActions = ({ actions, bilans, rules }) => {
	const engine = useContext(EngineContext)
	const missingVariables = actions.map(
			(action) => engine.evaluate(action.dottedName).missingVariables ?? {}
		),
		scores = missingVariables
			.map((part) => Object.entries(part))
			.flat()
			.reduce(
				(scores, [dottedName, score]) => ({
					...scores,
					[dottedName]: (scores[dottedName] ?? 0) + score,
				}),
				{}
			)

	return (
		<div>
			<p>{actions.length} actions disponibles. </p>
			<details>
				<summary>{missingVariables.length} questions restantes.</summary>

				<ul>
					{sortBy(([, score]) => score)(Object.entries(scores))
						.reverse()
						.map(([dottedName, score]) => (
							<li>
								{dottedName} {score}
							</li>
						))}
				</ul>
			</details>
			<ul
				css={`
					display: flex;
					justify-content: center;
					align-items: center;
					flex-wrap: wrap;
					list-style-type: none;
					li {
						width: 12rem;
						height: 16rem;
						margin: 0.4rem;
					}
				`}
			>
				{actions.map((evaluation) => (
					<li className="ui__ card">
						<ActionVignette
							key={evaluation.dottedName}
							rule={rules[evaluation.dottedName]}
							evaluation={evaluation}
							total={bilans.length ? bilans[0].nodeValue : null}
						/>
					</li>
				))}{' '}
			</ul>
		</div>
	)
}
