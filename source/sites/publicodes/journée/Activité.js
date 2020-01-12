import React, { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { animated, useSpring } from 'react-spring'

const halfColors = ['#e8817f', '#c3727c', '#8d5273', '#5a336e', '#311f62'],
	colors = [...halfColors.reverse(), ...halfColors]

export default function Activité({ item, quota, i, animate }) {
	const weight = item.formule.nodeValue,
		icônes = item.icônes || ''
	const [open, toggle] = useState(false)
	const height = (weight / ((quota * 1000) / 365)) * 100
	const style = useSpring({ height: (!animate ? 100 : open ? 100 : 0) + '%' })

	useEffect(() => {
		toggle(true)
	}, [])

	return (
		<li
			css={`
				line-height: initial;
				height: ${height}vh;
				justify-content: center;
				position: relative;
			`}
		>
			<animated.div
				css={`
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					background: ${icônes ? colors[i] : 'white'};
					display: flex;
					align-items: center;
					justify-content: center;
					small {
						margin-left: 0.6rem;
						color: white;
					}
				`}
				style={style}
			>
				{emoji(icônes)}
				<small>{Math.round(height) + '%'}</small>
			</animated.div>
		</li>
	)
}
