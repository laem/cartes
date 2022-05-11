import { utils } from 'publicodes'
import React from 'react'
import { Link } from 'react-router-dom'
import tinygradient from 'tinygradient'
import { findContrastedTextColor } from '../../components/utils/colors'

export const colorScale = ['#e1d738', '#f6b93b', '#ff0000', '#000000']
const gradient = tinygradient(colorScale),
	colors = gradient.rgb(10)

const { encodeRuleName } = utils
export default ({
	budget,
	nodeValue,
	exampleName,
	factor,
	closestPeriodLabel,
	closestPeriod,
}) => {
	const percent = Math.round((nodeValue / budget) * 100),
		color = colors[Math.round(percent / 10)] || colors[9]
	const threshold = percent > 140,
		multiplicator = (percent / 100).toLocaleString('fr-FR', {
			maximumFractionDigits: 1,
		})
	return (
		<Link
			css="text-decoration: none; color: inherit"
			to="/crédit-climat-personnel"
		>
			<div
				css={`
					min-width: 8rem;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: ${exampleName ? '140%' : '220%'};
					background: ${color};
					height: 2.6rem;
					color: ${findContrastedTextColor(color.toHex())};
					padding-top: 0.3rem;
					small {
						font-size: 60%;
						max-width: 45%;
						white-space: normal;
						line-height: 0.85rem;
						margin-left: 0.4rem;
					}
					--shadow-color: 210deg 75% 31%;
					box-shadow: 0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.36),
						0.8px 1.6px 2px -0.8px hsl(var(--shadow-color) / 0.36),
						2.1px 4.1px 5.2px -1.7px hsl(var(--shadow-color) / 0.36),
						5px 10px 12.6px -2.5px hsl(var(--shadow-color) / 0.36);
				`}
			>
				<div
					css={`
						font-weight: bold;
					`}
				>
					{threshold ? `${multiplicator} x` : `${percent} %`}
				</div>
				<small>{threshold ? 'le' : 'du'} budget annuel</small>
			</div>
		</Link>
	)
}
