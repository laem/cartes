import React from 'react'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'

export const humanWeight = (v) => {
	const [raw, unit] =
		v === 0
			? [v, '']
			: v < 1
			? [v * 1000, 'g']
			: v < 1000
			? [v, 'kg']
			: [v / 1000, v > 2000 ? 'tonnes' : 'tonne']
	return [raw, unit]
}
export default ({ nodeValue }) => {
	return <HumanWeight nodeValue={nodeValue} />
}

export const humanValueAndUnit = (possiblyNegativeValue) => {
	let v = Math.abs(possiblyNegativeValue),
		[raw, unit] = humanWeight(v),
		value = raw.toFixed(1) * (possiblyNegativeValue < 0 ? -1 : 1)
	return { value, unit }
}

export const HumanWeight = ({ nodeValue }) => {
	const { value, unit } = humanValueAndUnit(nodeValue)
	return (
		<span>
			<div>
				<strong
					css={`
						font-size: 160%;
						font-weight: 600;
					`}
				>
					{value}&nbsp;{unit}
				</strong>{' '}
			</div>
			<UnitSuffix />
		</span>
	)
}

export const UnitSuffix = () => (
	<div className="unitSuffix">
		de <strong>CO₂</strong>e / an
	</div>
)
