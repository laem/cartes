import React, { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { animated, useSpring } from 'react-spring'

export default function Activité({ item: { targets }, quota, i, animate }) {
	const item = targets[0]
	const weight = item.formule.nodeValue,
		icônes = item.icônes || ''
	const [open, toggle] = useState(false)
	const rawHeight = (weight / ((quota * 1000) / 365)) * 100,
		height = item.dottedName.includes('téléphone')
			? rawHeight / (365 * 2)
			: rawHeight
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
				border-bottom: 1px solid #fff4;
			`}
		>
			<animated.div
				css={`
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
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
				<div
					css={`
						img {
							vertical-align: middle !important;
							z-index: 1;
						}
					`}
				>
					{emoji(icônes)}
					<small>{Math.round(height) + '%'}</small>
				</div>
			</animated.div>
		</li>
	)
}
