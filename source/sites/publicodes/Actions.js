import { setSimulationConfig } from 'Actions/actions'
import SessionBar from 'Components/SessionBar'
import { EngineContext } from 'Components/utils/EngineContext'
import { motion } from 'framer-motion'
import { utils } from 'publicodes'
import { partition, sortBy, union } from 'ramda'
import React, { useContext, useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router'
import { Link, Route, Switch } from 'react-router-dom'
import { animated } from 'react-spring'
import { objectifsSelector } from 'Selectors/simulationSelectors'
import tinygradient from 'tinygradient'
import {
	answeredQuestionsSelector,
	configSelector,
} from '../../selectors/simulationSelectors'
import Action from './Action'
import ActionPlus from './ActionPlus'
import { extractCategories } from './chart'
import { humanValueAndUnit } from './HumanWeight'
import ListeActionPlus from './ListeActionPlus'

const { encodeRuleName, decodeRuleName } = utils

import { splitName } from 'Components/publicodesUtils'

const gradient = tinygradient(['#0000ff', '#ff0000']),
	colors = gradient.rgb(20)

export default ({}) => {
	return (
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
	)
	if (action) {
		const actionDottedName = decodeRuleName(action)
		return <Action />
	}
}

const IllustratedButton = ({ children, to, icon }) => (
	<Link
		to={to}
		className="ui__ button plain"
		css={`
			margin: 0.6rem 0;
			width: 100%;
			text-transform: none !important;
			img {
				font-size: 200%;
			}
			a {
				color: var(--textColor);
				text-decoration: none;
			}
		`}
	>
		<div
			css={`
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100%;
				> div {
					margin-left: 1.6rem;
					text-align: left;
					small {
						color: var(--textColor);
					}
				}
			`}
		>
			{emoji(icon)}

			{children}
		</div>
	</Link>
)

const ModeChoice = ({}) => (
	<div
		css={`
			> div {
				margin: 4rem 1rem;
			}
		`}
	>
		<div>
			<h1>Passer à l'action</h1>
			<p>Votre mission : réduire votre empreinte.</p>
			<p>Comment voulez-vous procéder ?</p>
		</div>
		<div>
			<IllustratedButton icon="🐣">
				<div>
					<div>Guidé</div>
					<p>
						<small>On vous propose une sélection graduelle de gestes.</small>
					</p>
				</div>
			</IllustratedButton>
			<IllustratedButton icon="🐓">
				<div>
					<div>Autonome</div>
					<p>
						<small>A vous de choisir vos gestes à la carte.</small>
					</p>
				</div>
			</IllustratedButton>
		</div>
	</div>
)

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

	const dispatch = useDispatch()
	useEffect(() => dispatch(setSimulationConfig(config)), [location.pathname])
	if (!configSet) return <div>Config not set</div>

	const [bilans, actions] = partition((t) => t.dottedName === 'bilan', targets)

	const sortedActions = sortBy((a) => (radical ? -1 : 1) * correctValue(a))(
		actions
	).filter((action) =>
		category ? splitName(action.dottedName)[0] === category : true
	)
	const categories = extractCategories(rules, engine)
	const countByCategory = actions.reduce((memo, next) => {
		const category = splitName(next.dottedName)[0]

		return { ...memo, [category]: (memo[category] || 0) + 1 }
	}, {})

	return (
		<div css="padding: 0 .3rem 1rem; max-width: 600px; margin: 1rem auto;">
			<SessionBar />
			{!answeredQuestions.length && (
				<p css="line-height: 1.4rem; text-align: center">
					{emoji('🧮')}&nbsp; Pour personnaliser ces propositions
				</p>
			)}
			<h1 css="margin: 1rem 0 .6rem;font-size: 160%">
				Comment réduire mon empreinte ?
			</h1>
			<CategoryFilter
				categories={categories}
				selected={category}
				countByCategory={countByCategory}
			/>
			<button onClick={() => setRadical(!radical)}>Mode radical 🥊</button>
			{sortedActions.map((evaluation) => (
				<MiniAction
					key={evaluation.dottedName}
					rule={rules[evaluation.dottedName]}
					evaluation={evaluation}
					total={bilans.length ? bilans[0].nodeValue : null}
				/>
			))}
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

const MiniAction = ({ evaluation, total, rule }) => {
	const { nodeValue, dottedName, title, unit } = evaluation
	const { icônes: icons } = rule

	const disabled = nodeValue === 0 || nodeValue === false

	return (
		<Link
			css={`
				${disabled
					? `
					img {
					filter: grayscale(1);
					}
					color: var(--grayColor);
					h2 {
					  color: var(--grayColor);
					}
					opacity: 0.8;`
					: ''}
				text-decoration: none;
				width: 100%;
			`}
			to={'/actions/' + encodeRuleName(dottedName)}
		>
			<motion.div
				animate={{ scale: [0.85, 1] }}
				transition={{ duration: 0.2, ease: 'easeIn' }}
				className="ui__ card"
				css={`
					margin: 1rem auto;
					border-radius: 0.6rem;
					padding: 0.6rem;
					display: flex;
					justify-content: start;
					align-items: center;

					text-align: center;
					font-size: 100%;
					h2 {
						font-size: 130%;
						font-weight: normal;
						margin: 1rem 0;
						text-align: left;
					}
					> h2 > span > img {
						margin-right: 0.4rem !important;
					}
				`}
			>
				{icons && (
					<div
						css={`
							font-size: 250%;
							width: 5rem;
							margin-right: 1rem;
							img {
								margin-top: 0.8rem !important;
							}
						`}
					>
						{emoji(icons)}
					</div>
				)}
				<div
					css={`
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						align-items: flex-start;
					`}
				>
					<h2>{title}</h2>
					{nodeValue != null && <ActionValue {...{ total, nodeValue, unit }} />}
				</div>
			</motion.div>
		</Link>
	)
}

const ActionValue = ({ total, nodeValue: rawValue, unit: rawUnit }) => {
	const correctedValue = correctValue({ nodeValue: rawValue, unit: rawUnit })
	const { unit, value } = humanValueAndUnit(correctedValue),
		displayRelative = total

	return (
		<div
			css={`
				> span {
					border-radius: 0.3rem;
					padding: 0.1rem 0.3rem;
				}
				strong {
					font-weight: bold;
				}
				font-size: 120%;
				display: flex;
			`}
		>
			<span
				css={`
					border: 1px solid var(--color);
					background: var(--lighterColor);
					min-width: 8rem;
					margin-right: 0.3rem;
				`}
			>
				{-value} {unit}
				{displayRelative && (
					<div>
						<strong>{Math.round(100 * (value / total))}%</strong>
					</div>
				)}
			</span>
			<span css="font-size: 80%">
				<div>de CO₂e / an</div>
				{displayRelative && <div>de votre total</div>}
			</span>
		</div>
	)
}

const CategoryFilter = ({ categories, selected, countByCategory }) => {
	console.log(categories)
	return (
		<ul
			css={`
				display: flex;
				flex-wrap: wrap;
				list-style-type: none;
				justify-content: center;
				li {
					padding: 0.1rem 0.4rem;
					margin: 0.1rem 0.2rem;
					border-radius: 0.2rem;
				}
				li button {
					color: white;
					font-weight: bold;
				}
			`}
		>
			{categories.map((category) => (
				<li
					css={`
						background: ${category.color};
						${selected === category.dottedName
							? 'border: 3px solid var(--color)'
							: ''}
					`}
				>
					<Link to={'/actions/catégorie/' + category.dottedName}>
						<button>
							{category.dottedName} ({countByCategory[category.dottedName] || 0}
							)
						</button>
					</Link>
				</li>
			))}
		</ul>
	)
}
