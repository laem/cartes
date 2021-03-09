import { utils } from 'publicodes'
import { Link } from 'react-router-dom'
const { encodeRuleName, decodeRuleName } = utils
import { motion } from 'framer-motion'
import Emoji from '../../components/utils/Emoji'
import emoji from 'react-easy-emoji'
import { correctValue } from './Actions'
import { humanValueAndUnit } from './HumanWeight'

export default ({ evaluation, total, rule, effort }) => {
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
					<div>
						Difficulté&nbsp;
						{effort && (
							<span>{[...new Array(effort)].map((i) => emoji('💪'))}</span>
						)}
					</div>
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
