import React, { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { animated, useSpring } from 'react-spring'

export default function Activité({
	item: { targets },
	quota,
	quota0,
	i,
	animate,
	color,
	blockWidth,
}) {
	const [focused, focus] = useState(false)
	const item = targets[0]
	const weight = item.formule.nodeValue,
		icônes = item.icônes || ''
	const [open, toggle] = useState(false)
	const dayQuota = (quota0 * 1000) / 365
	const width = 20 * (weight / dayQuota) * 100,
		style = useSpring({
			from: {
				border: !animate || open ? '0px solid #fbcfa1' : '6px solid #fbcfa1',
				opacity: 0,
			},
			to: {
				border: '0px solid #fbcfa170',
				opacity: !animate ? 1 : open ? 1 : 0,
			},
		}),
		share = (weight / ((quota * 1000) / 365)) * 100

	const numberOfBlocks = Math.round(width / blockWidth) || 1

	useEffect(() => {
		toggle(true)
	}, [])

	return [...Array(numberOfBlocks).keys()].map((i) => (
		<animated.li
			key={i}
			css={`
				background: ${color};
				line-height: initial;
				height: 5vh;
				width: ${blockWidth}vw;
				justify-content: center;
				position: relative;
			`}
			style={style}
		>
			<div
				css={`
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					height: 100%;
					small {
						margin-left: 0.6rem;
						color: white;
					}
				`}
			>
				<div
					css={`
						${i && 'display: none;'}
						img {
							vertical-align: middle !important;
							font-size: 200% !important;
						}
						cursor: pointer;
					`}
					onClick={() => focus(!focused)}
				>
					{focused ? (
						<small>{Math.round(share) + '%'} de ta journée</small>
					) : (
						i < icônes.length && (
							<span
								css={`
									img {
										padding: 0.2rem;
										background: white;
										border-radius: 1rem;
									}
								`}
							>
								{emoji(icônes)[i]}
							</span>
						)
					)}
				</div>
			</div>
		</animated.li>
	))
}
