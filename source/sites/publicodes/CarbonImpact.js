import { utils } from 'publicodes'
import React from 'react'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
	objectifsSelector,
	situationSelector,
} from '../../selectors/simulationSelectors'
import HumanWeight from './HumanWeight'
import { useEngine } from 'Components/utils/EngineContext'
import { correctValue, splitName } from '../../components/publicodesUtils'
import { lightenColor } from '../../components/utils/colors'
import Progress from 'Components/ui/Progress'
import { useSimulationProgress } from 'Components/utils/useNextQuestion'
import { buildEndURL } from '../../components/SessionBar'
import { disabledAction, supersededAction } from './ActionVignette'

export default ({ actionMode = false }) => {
	const objectif = actionMode ? 'bilan' : useSelector(objectifsSelector)[0],
		// needed for this component to refresh on situation change :
		situation = useSelector(situationSelector),
		engine = useEngine(),
		rules = useSelector((state) => state.rules),
		evaluation = engine.evaluate(objectif),
		{ nodeValue: rawNodeValue, dottedName, unit, rawNode } = evaluation
	const persona = useSelector((state) => state.simulation?.persona)
	const actionChoices = useSelector((state) => state.actionChoices),
		actionsChosen = Object.values(actionChoices).filter((a) => a === true)
			.length

	const nodeValue = correctValue({ nodeValue: rawNodeValue, unit })

	const category = rules[splitName(dottedName)[0]],
		color = category && category.couleur

	const progress = useSimulationProgress()

	const endURL = buildEndURL(rules, engine)
	return (
		<div
			css={`
				@media (max-width: 800px) {
					margin: 0;
					position: fixed;
					bottom: 4rem;
					left: 0;
					z-index: 10;
					width: 100%;
				}
				background: rgba(0, 0, 0, 0)
					linear-gradient(
						60deg,
						${color ? color : 'var(--color)'} 0%,
						${color ? lightenColor(color, -20) : 'var(--lightColor)'} 100%
					)
					repeat scroll 0% 0%;
				color: var(--textColor);
				a {
					color: inherit;
				}
				text-align: center;
				box-shadow: 2px 2px 10px #bbb;

				.unitSuffix {
					font-size: 90%;
				}
			`}
		>
			<Link
				to={endURL}
				css=":hover {opacity: 1 !important}; text-decoration: none"
			>
				<div
					css={`
						display: flex;
						justify-content: space-evenly;
						align-items: center;
						> div {
							display: flex;
							justify-content: center;
							align-items: center;
						}
						padding: 0.4rem;
					`}
				>
					<div
						css={`
							display: flex;
							justify-content: space-evenly;
							flex-direction: column;
							width: 80%;
						`}
					>
						{persona && (
							<em>
								{emoji('👤')} {persona}
							</em>
						)}
						<div>
							{!actionMode ? (
								<HumanWeight
									nodeValue={nodeValue}
									overrideValue={actionMode && actionTotal !== 0 && actionTotal}
								/>
							) : (
								<DiffHumanWeight
									{...{ nodeValue, engine, rules, actionChoices }}
								/>
							)}
						</div>
					</div>
					{!actionMode && <DocumentationLink dottedName={dottedName} />}
					{actionMode && <ActionCount count={actionsChosen} />}
				</div>
				{progress < 1 && (
					<Progress progress={progress} style={!progress ? 'height: 0' : ''} />
				)}
			</Link>
		</div>
	)
}

const ActionCount = ({ count }) => (
	<Link to="/actions/liste" css="text-decoration: none">
		<div
			css={`
				border-radius: 0.3rem;
				background: #77b255;
				width: 2rem;
				height: 3rem;
				font-weight: bold;
				display: flex;
				flex-direction: column;
				justify-content: center;
				line-height: 1.1rem;
			`}
		>
			<div>{count}</div>
			<div>&#10004;</div>
		</div>
	</Link>
)

const DiffHumanWeight = ({ nodeValue, engine, rules, actionChoices }) => {
	// Here we compute the sum of all the actions the user has chosen
	// we could also use publicode's 'actions' variable sum,
	// but each action would need to have a "chosen" question,
	// and disactivation rules

	const actions = rules['actions'].formule.somme.map((dottedName) =>
			engine.evaluate(dottedName)
		),
		actionTotal = actions.reduce((memo, action) => {
			const correctedValue = correctValue({
				nodeValue: action.nodeValue,
				unit: action.unit,
			})
			if (
				actionChoices[action.dottedName] &&
				!supersededAction(action.dottedName, rules, actionChoices) &&
				!disabledAction(rules[action.dottedName], action.nodeValue)
			) {
				return memo + correctedValue || 0
			} else return memo
		}, 0)

	console.log(actions, actionTotal)

	return (
		<HumanWeight
			nodeValue={nodeValue}
			overrideValue={actionTotal !== 0 && actionTotal}
		/>
	)
}

const DocumentationLink = ({ dottedName }) => (
	<div>
		<Link to={'/documentation/' + utils.encodeRuleName(dottedName)}>
			<span css="font-size: 140%" alt="Comprendre le calcul">
				{emoji('❔ ')}
			</span>
			<small
				css={`
					color: var(--textColor);
					@media (max-width: 800px) {
						display: none;
					}
				`}
			>
				Comprendre le calcul
			</small>
		</Link>
	</div>
)
