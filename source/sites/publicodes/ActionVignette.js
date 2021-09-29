import { motion } from 'framer-motion'
import { utils } from 'publicodes'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { setActionChoice } from '../../actions/actions'
import { correctValue } from '../../components/publicodesUtils'
import { useEngine } from '../../components/utils/EngineContext'
import { situationSelector } from '../../selectors/simulationSelectors'
import { humanWeight } from './HumanWeight'
const { encodeRuleName, decodeRuleName } = utils

export const disabledAction = (flatRule, nodeValue) =>
	flatRule.formule == null ? false : nodeValue === 0 || nodeValue === false

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
export const ActionListCard = ({ evaluation, total, rule, effort }) => {
	const dispatch = useDispatch()
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
				h2 {
					font-size: 110%;
					font-weight: 500;
				}
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				height: 100%;
			`}
			to={'/actions/' + encodeRuleName(dottedName)}
		>
			<h2>{title}</h2>
			{icons && (
				<div
					css={`
						font-size: 150%;
					`}
				>
					{emoji(icons)}
				</div>
			)}
			<ActionValue {...{ dottedName, total, disabled, noFormula }} />
			<div
				css={`
					display: flex;
					justify-content: space-evenly;
					button img {
						font-size: 200%;
					}
				`}
			>
				<button
					onClick={(e) => {
						dispatch(setActionChoice(dottedName, true))
						e.stopPropagation()
						e.preventDefault()
					}}
				>
					{emoji('✅')}
				</button>
				<button
					onClick={(e) => {
						dispatch(setActionChoice(dottedName, false))
						e.stopPropagation()
						e.preventDefault()
					}}
				>
					{emoji('❌')}
				</button>
			</div>
		</Link>
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
				font-size: 120%;
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
