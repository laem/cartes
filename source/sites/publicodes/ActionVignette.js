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

					text-align: center;
					font-size: 100%;
					h2 {
						font-size: 130%;
						font-weight: normal;
						margin: 0.5rem 0;
						text-align: left;
					}
					> h2 > span > img {
						margin-right: 0.4rem !important;
					}
				`}
			>
				<h2>{title}</h2>
				<div
					css={`
						display: flex;
						justify-content: start;
						align-items: center;
					`}
				>
					{icons && (
						<div
							css={`
								font-size: 200%;
								width: 5rem;
								margin-right: 1rem;
								img {
									margin-top: 0.4rem !important;
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
							width: 75%;
							max-width: 16rem;
						`}
					>
						{effort && (
							<div
								css={`
									display: flex;
									justify-content: space-start;
									width: 100%;
									div:first-child {
										width: 6rem;
									}
								`}
							>
								<div>Difficulté&nbsp;</div>
								<span>{[...new Array(effort)].map((i) => emoji('💪'))}</span>
							</div>
						)}
						{nodeValue != null && (
							<ActionValue {...{ total, nodeValue, unit }} />
						)}
					</div>
				</div>
			</motion.div>
		</Link>
	)
}
const ActionValue = ({ total, nodeValue: rawValue, unit: rawUnit }) => {
	const correctedValue = correctValue({ nodeValue: rawValue, unit: rawUnit })
	const { unit, value } = humanValueAndUnit(correctedValue),
		relativeValue = Math.round(100 * (correctedValue / total))

	return (
		<div
			css={`
				strong {
					background: var(--lightColor);
					border-radius: 0.3rem;
					color: var(--textColor);
					padding: 0.1rem 0.4rem;
					font-weight: normal;
				}
				display: flex;
				justify-content: space-start;
				width: 100%;
				div:first-child {
					width: 6rem;
				}
			`}
		>
			<div>Impact&nbsp;</div>
			<div>
				<strong>
					-&nbsp;{value} {unit}
				</strong>{' '}
				&nbsp;({relativeValue}&nbsp;%)
			</div>
		</div>
	)
}
