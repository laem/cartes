import React from 'react'
//This component is unfortunately repeated in index.html, where we can't yet use a component :-(

export default () => (
	<span css="margin-top: .6rem;font-weight: 400;color: black; position: relative; ">
		<span css="position: absolute; top: -.95rem; left: 0rem; font-size: 60%;">
			nos
		</span>
		<span css="color: var(--color); font-weight: bold; text-transform: uppercase; font-size: 75%">
			ges
		</span>
		tes
		<span css="position: absolute; top: 1.2rem; left: 2.3rem; font-size: 60%; ">
			climat
		</span>
	</span>
)

export const InlineLogo = () => (
	<span
		css={`
			display: flex;
			align-items: center;
			font-weight: 400;
			color: black;
			position: relative;
		`}
	>
		<span css=" font-size: 70%; align-self: center">nos</span>
		<span css="margin: 0 .25rem">
			<span css="color: var(--color); font-weight: bold; text-transform: uppercase; font-size: 75%">
				ges
			</span>
			tes
		</span>
		<span css="font-size: 70%; align-self: center">climat</span>
	</span>
)
