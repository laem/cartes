'use client'
import { utils } from 'publicodes'
import React from 'react'

import styled from 'styled-components'
import tinygradient from 'tinygradient'
import { findContrastedTextColor } from 'Components/utils/colors'
import Link from 'next/link'

export const colorScale = ['#e1d738', '#f6b93b', '#ff0000', '#000000']
const gradient = tinygradient(colorScale),
	colors = gradient.rgb(10)

const { encodeRuleName } = utils

const BudgetBar = ({
	budget,
	nodeValue,
	exampleName,
	factor,
	closestPeriodLabel,
	closestPeriod,
	noExample,
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
			href="/credit-climat-personnel"
		>
			<BudgetBarStyle $largeText={!exampleName} color={color.toHex()}>
				<div
					css={`
						font-weight: bold;
					`}
				>
					{threshold ? `${multiplicator} x` : `${percent} %`}
				</div>
				<small>{threshold ? 'le' : 'du'} budget annuel</small>
			</BudgetBarStyle>
		</Link>
	)
}

export default BudgetBar

export const BudgetBarStyle = styled.div`
	min-width: 8rem;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: ${({ $largeText }) => (!$largeText ? '140%' : '220%')};
	background: ${(props) => '#' + props.color};
	height: 2.6rem;
	color: ${(props) => findContrastedTextColor(props.color)};
	${(props) =>
		props.$largeText
			? `
					padding: 2rem 0 1.8rem
					`
			: `padding-top: 0.3rem`};
	small {
		font-size: 60%;
		max-width: 45%;
		white-space: normal;
		line-height: 1rem;
		margin-left: 0.4rem;
	}
	--shadow-color: 210deg 75% 31%;
	box-shadow: 0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.36),
		0.8px 1.6px 2px -0.8px hsl(var(--shadow-color) / 0.36),
		2.1px 4.1px 5.2px -1.7px hsl(var(--shadow-color) / 0.36),
		5px 10px 12.6px -2.5px hsl(var(--shadow-color) / 0.36);
`
