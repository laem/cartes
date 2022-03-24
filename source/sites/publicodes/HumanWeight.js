import React from 'react'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'

export const humanWeight = (possiblyNegativeValue, concise = false) => {
	const v = Math.abs(possiblyNegativeValue)
	const [raw, unit] =
		v === 0
			? [v, '']
			: v < 1
			? [v * 1000, 'g']
			: v < 1000
			? [v, 'kg']
			: [v / 1000, concise ? 't' : v > 2000 ? 'tonnes' : 'tonne']

	const signedValue = raw * (possiblyNegativeValue < 0 ? -1 : 1),
		value =
			raw < 10
				? signedValue.toLocaleString('fr-FR', { maximumSignificantDigits: 2 })
				: Math.round(signedValue).toLocaleString('fr-FR')

	return [value, unit]
}
export default ({ nodeValue, overrideValue }) => {
	const [value, unit] = humanWeight(nodeValue)
	return (
		<span
			css={`
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
				align-items: baseline;
			`}
		>
			<strong
				classname="humanvalue"
				css={`
					font-size: 160%;
					font-weight: 600;
				`}
			>
				{value}&nbsp;{unit}
			</strong>{' '}
			{overrideValue && <OverrideBlock value={nodeValue - overrideValue} />}
			<span css="margin: 0 .6rem">
				<UnitSuffix />
			</span>
		</span>
	)
}

const OverrideBlock = ({ value: rawValue }) => {
	const [value, unit] = humanWeight(rawValue)
	return (
		<span>
			<span css="font-size: 180%; margin: 0 1rem">{emoji('➡️ ')}</span>
			<strong
				classname="humanvalue"
				css={`
					font-size: 160%;
					font-weight: 600;
				`}
			>
				{value}&nbsp;{unit}
			</strong>
		</span>
	)
}

export const UnitSuffix = () => (
	<span className="unitSuffix">
		de <strong>CO₂</strong>e / an
	</span>
)
