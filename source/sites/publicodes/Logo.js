import React from 'react'
import emoji from 'react-easy-emoji'
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

export const InlineLogo = () => {
	const integratorLogo =
		new URLSearchParams(document.location.search).get('integratorLogo') ||
		'https://ngc.time-planet.com/images/logo_time.svg'
	const integratorName =
		new URLSearchParams(document.location.search).get('integratorName') ||
		'Time for the Planet'

	return (
		<div
			css={`
				display: flex;
				justify-content: space-between;
				align-items: center;
				@media (max-width: 800px) {
					flex-direction: column;
					justify-content: center;
					align-items: center;
				}
				> span {
					color: black;
				}
			`}
		>
			<span
				css={`
					display: flex;
					justify-content: center;
					align-items: center;
				`}
			>
				{integratorLogo && <img src={integratorLogo} width="40px" css={``} />}
				<span css="font-size: 70%">{integratorName}</span>
			</span>
			<span css="margin: 0 .6rem; font-size: 80%">{emoji('x')}</span>
			<NosGestesClimatInline />
		</div>
	)
}

const NosGestesClimatInline = () => (
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
