import { motion } from 'framer-motion'
import { utils } from 'publicodes'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { correctValue } from '../../components/publicodesUtils'
import { humanWeight } from './HumanWeight'
const { encodeRuleName, decodeRuleName } = utils

export const disabledAction = (flatRule, nodeValue) =>
	flatRule.formule == null ? false : nodeValue === 0 || nodeValue === false

export default ({ evaluation, total, rule, effort }) => {
	const rules = useSelector((state) => state.rules),
		{ nodeValue, dottedName, title, unit } = evaluation,
		{ icônes: icons } = rule

	const flatRule = rules[dottedName],
		noFormula = flatRule.formule == null,
		disabled = disabledAction(flatRule, nodeValue)

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
					<ActionValue {...{ total, nodeValue, unit, disabled, noFormula }} />
				</div>
			</div>
		</Link>
	)
}
const ActionValue = ({
	total,
	nodeValue: rawValue,
	unit: rawUnit,
	disabled,
	noFormula,
}) => {
	const correctedValue = correctValue({ nodeValue: rawValue, unit: rawUnit })
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
				'🤷'
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
