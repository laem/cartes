import React, { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { animated, useSpring } from 'react-spring'

export default function Activité({ item: { targets }, quota, i, animate }) {
	const item = targets[0]
	const weight = item.formule.nodeValue,
		icônes = item.icônes || ''
	const [open, toggle] = useState(false)
	const height = (weight / ((quota * 1000) / 365)) * 100,
		style = useSpring({ height: (!animate ? 100 : open ? 100 : 0) + '%' })

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
				border-bottom: 1px solid #fff;
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
							font-size: 200% !important;
						}
					`}
				>
					<span
						css={`
							img {
								padding: 0.2rem;
								background: white;
								border-radius: 1rem;
							}
						`}
					>
						{emoji(icônes)}
					</span>
					<small>{Math.round(height) + '%'}</small>
				</div>
			</animated.div>
		</li>
	)
}
