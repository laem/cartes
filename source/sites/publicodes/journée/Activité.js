import React, { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { animated, useSpring } from 'react-spring'

const halfColors = ['#e8817f', '#c3727c', '#8d5273', '#5a336e', '#311f62'],
	colors = [...halfColors.reverse(), ...halfColors]

export default function Activité({ weight, quota, icon, i }) {
	const [open, toggle] = useState(false)
	const height = (weight / (quota / 365)) * 100
	const style = useSpring({ height: (open ? 100 : 0) + '%' })

	useEffect(() => {
		toggle(!open)
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
					background: ${icon ? colors[i] : 'white'};
					display: flex;
					align-items: center;
					justify-content: center;
				`}
				style={style}
			>
				{emoji(icon)}
			</animated.div>
		</li>
	)
}
