import { motion } from 'framer-motion'
import { utils } from 'publicodes'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { setActionChoice } from '../../actions/actions'
import { correctValue } from '../../components/publicodesUtils'
import Stamp from '../../components/Stamp'
import { useEngine } from '../../components/utils/EngineContext'
import { getNextQuestions } from '../../components/utils/useNextQuestion'
import {
	answeredQuestionsSelector,
	situationSelector,
} from '../../selectors/simulationSelectors'
import { humanWeight } from './HumanWeight'
const { encodeRuleName, decodeRuleName } = utils

export const disabledAction = (flatRule, nodeValue) =>
	flatRule.formule == null ? false : nodeValue === 0 || nodeValue === false

export const supersededAction = (dottedName, rules, actionChoices) => {
	return (
		Object.entries(rules).find(([key, r]) => {
			const supersedes = r?.action?.dépasse
			return supersedes && supersedes.includes(dottedName) && actionChoices[key]
		}) != null
	)
}
const disabledStyle = `
img {
filter: grayscale(1);
}
color: var(--grayColor);
h2 {
color: var(--grayColor);
}
opacity: 0.8;
`
export const ActionListCard = ({
	evaluation,
	total,
	rule,
	focusAction,
	focused,
}) => {
	const dispatch = useDispatch()
	const rules = useSelector((state) => state.rules),
		{ nodeValue, dottedName, title, unit } = evaluation,
		{ icônes: icons } = rule
	const actionChoices = useSelector((state) => state.actionChoices),
		situation = useSelector(situationSelector),
		answeredQuestions = useSelector(answeredQuestionsSelector)

	const flatRule = rules[dottedName],
		noFormula = flatRule.formule == null,
		disabled = disabledAction(flatRule, nodeValue)

	const remainingQuestions = getNextQuestions(
			[evaluation.missingVariables],
			{},
			answeredQuestions,
			situation
		),
		hasRemainingQuestions = remainingQuestions.length > 0

	return (
		<div
			className="ui__ interactive card light-border"
			css={`
				${disabled ? disabledStyle : ''}
				${focused && `border: 4px solid var(--color) !important;`}
				${actionChoices[evaluation.dottedName] &&
				`border: 4px solid #77b255 !important;`}
				width: 100%;
				display: flex;
				flex-direction: column;
				justify-content: start;
				height: 100%;
				${hasRemainingQuestions && `background: #eee !important; `}
			`}
		>
			<Link
				css={`
					display: block;
					margin-top: 0.6rem;
					h2 {
						margin-left: 0.6rem;
						display: inline;
						font-size: 110%;
						font-weight: 500;
					}
					text-decoration: none;
					height: 5.5rem;
				`}
				to={'/actions/' + encodeRuleName(dottedName)}
			>
				{icons && (
					<span
						css={`
							font-size: 150%;
						`}
					>
						{emoji(icons)}
					</span>
				)}
				<h2>{title}</h2>
			</Link>

			<div
				css={`
					position: relative;
				`}
			>
				<div
					css={hasRemainingQuestions ? `filter: blur(1px) grayscale(1)` : ''}
				>
					<ActionValue {...{ dottedName, total, disabled, noFormula }} />
				</div>
				{hasRemainingQuestions && (
					<Stamp onClick={() => focusAction(dottedName)} clickable>
						{remainingQuestions.length} question
						{remainingQuestions.length > 1 && 's'}
					</Stamp>
				)}
			</div>
			<div
				css={`
					display: flex;
					justify-content: space-evenly;
					button img {
						font-size: 200%;
					}
					margin-bottom: 1rem;
					margin-top: auto;
				`}
			>
				<button
					css={`
						${hasRemainingQuestions && 'filter: grayscale(1)'}
					`}
					onClick={(e) => {
						if (hasRemainingQuestions) {
							focusAction(dottedName)
							return null
						}

						dispatch(
							setActionChoice(
								dottedName,
								actionChoices[dottedName] === true ? null : true
							)
						)
						e.stopPropagation()
						e.preventDefault()
					}}
				>
					{emoji('✅')}
				</button>
				<button
					onClick={(e) => {
						dispatch(
							setActionChoice(
								dottedName,

								actionChoices[dottedName] === false ? null : false
							)
						)
						e.stopPropagation()
						e.preventDefault()
					}}
				>
					{emoji('❌')}
				</button>
			</div>
		</div>
	)
}

export const ActionGameCard = ({ evaluation, total, rule, effort }) => {
	const rules = useSelector((state) => state.rules),
		{ nodeValue, dottedName, title, unit } = evaluation,
		{ icônes: icons } = rule

	const flatRule = rules[dottedName],
		noFormula = flatRule.formule == null,
		disabled = disabledAction(flatRule, nodeValue)

	return (
		<Link
			css={`
				${disabled ? disabledStyle : ''}
				text-decoration: none;
				width: 100%;
			`}
			to={'/actions/' + encodeRuleName(dottedName)}
		>
			<div css={``}>
				<h2>{title}</h2>
				<div css={``}>
					{icons && (
						<div
							css={`
								font-size: 250%;
							`}
						>
							{emoji(icons)}
						</div>
					)}
					<ActionValue {...{ dottedName, total, disabled, noFormula }} />
				</div>
			</div>
		</Link>
	)
}
const ActionValue = ({ total, disabled, noFormula, dottedName }) => {
	const engine = useEngine(),
		situation = useSelector(situationSelector),
		evaluation = engine.evaluate(dottedName),
		rawValue = evaluation.nodeValue
	const correctedValue = correctValue({
		nodeValue: rawValue,
		unit: evaluation.unit,
	})
	const [value, unit] = humanWeight(correctedValue),
		relativeValue = Math.round(100 * (correctedValue / total))

	return (
		<div
			css={`
				margin-top: 1.6rem;
				font-size: 100%;
				strong {
					background: var(--lightColor);
					border-radius: 0.3rem;
					color: var(--textColor);
					padding: 0.1rem 0.4rem;
					font-weight: bold;
				}
			`}
		>
			{noFormula ? (
				'Non chiffré'
			) : disabled ? (
				'Non applicable'
			) : (
				<div>
					<strong>
						-&nbsp;{value} {unit}
					</strong>{' '}
					{total && <span>&nbsp;{relativeValue}%</span>}
				</div>
			)}
		</div>
	)
}
