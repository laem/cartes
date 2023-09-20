// https://codepen.io/cssjockey/pen/bGbmop
// https://shhdharmen.github.io/keyboard-css/#states
// https://codepen.io/vladracoare/pen/jOPmMap

'use client'
import Link from 'next/link'
import useSound from 'use-sound'
import data from './data.yaml'

import { utils } from 'publicodes'
const { encodeRuleName } = utils

const undefinedIsZero = (figure) => (figure == null ? 0 : figure)

const Grid = ({ state, setState }) => (
	<ul
		id="shareImage"
		css={`
			display: flex;
			align-items: center;
			justify-content: center;
			flex-wrap: wrap;
			touch-action: manipulation;
			margin-top: 2rem;
		`}
	>
		{data
			.sort((a, b) => undefinedIsZero(b.formule) - undefinedIsZero(a.formule))
			.map((el) => (
				<Card {...{ data: el, state, setState }} />
			))}
	</ul>
)

export default Grid

const Card = ({ data: { titre, icônes, formule, notes }, state, setState }) => {
	const [playActive] = useSound('/national/sounds/pop-down.mp3', {
		volume: 0.25,
	})
	const [playOn] = useSound('/national/sounds/pop-up-on.mp3', { volume: 0.25 })
	const [playOff] = useSound('/national/sounds/pop-up-off.mp3', {
		volume: 0.25,
	})

	const isChecked = state[titre]
	return (
		<li
			css={`
				margin: 1.4rem;
				list-style-type: none;
				display: flex;
				flex-direction: column;
				justify-content: center;
			`}
			key={titre}
		>
			<button
				onClick={() => {
					formule != null && playOn()

					formule != null && setState({ ...state, [titre]: !state[titre] })
				}}
				onMouseDown={() => formule != null && playActive()}
				onMouseUp={() => {
					isChecked ? playOff() : playOn()
				}}
				css={`
					${!formule && `opacity: 0.5`};
					-webkit-tap-highlight-color: transparent;

					font-size: 120%;
					color: #666666;
					position: relative;

					padding: 0;
					width: 13rem;
					height: 13rem;

					background: #f4f5f6;
					border: 4px solid #888888;
					${state[titre] &&
					`border: 6px solid var(--color); 
				background: var(--lightestColor);`}
					outline: none;
					border-radius: 40px;
					box-shadow: -6px -20px 35px #ffffff20, -6px -10px 15px #ffffff20,
						-20px 0px 30px #ffffff20, 6px 20px 25px rgba(0, 0, 0, 0.2);
					transition: 0.13s ease-in-out;
					cursor: pointer;
					&:active {
						box-shadow: none;
						.button__content {
							box-shadow: none;
							.button__text,
							.button__icon {
								transform: translate3d(0px, 0px, 0px);
							}
						}
					}
					.button__content {
						position: relative;

						padding: 1.1rem 0.8rem;
						width: 100%;
						height: 100%;

						box-shadow: inset 0px -8px 0px #dddddd, 0px -8px 0px #f4f5f6;
						border-radius: 40px;
						transition: 0.13s ease-in-out;

						z-index: 1;
					}
					.button__icon {
						position: relative;
						font-size: 150%;

						transform: translate3d(0px, -4px, 0px);
						text-align: left;
						width: 6rem;
						height: 1.6rem;
						transition: 0.13s ease-in-out;
						letter-spacing: 0.6rem;
						svg {
							width: 32px;
							height: 32px;
							fill: #aaaaaa;
						}
					}
					.button__text {
						position: relative;

						transform: translate3d(0px, -4px, 0px);
						margin: 1rem 0 0.4rem;
						align-self: end;

						text-align: center;
						font-size: 100%;
						background-color: #4f4f4f;
						color: transparent;
						text-shadow: 2px 2px 3px rgba(255, 255, 255, 0.5);
						-webkit-background-clip: text;
						-moz-background-clip: text;
						background-clip: text;
						transition: 0.13s ease-in-out;
					}
					.button__figure {
						font-weight: bold;
						margin: 0.6rem 0;
						display: ${state[titre] ? 'block' : 'none'};
						background: linear-gradient(var(--color1), var(--color2));
						width: 7rem;
						padding: 0.1rem 0.4rem;
						color: white;
						margin: 0 auto;
						border-radius: 0.4rem;
					}
				`}
			>
				<div className="button__content">
					<div className="button__icon">{icônes}</div>

					<p className="button__text">{titre}</p>
					<div className="button__figure">- {formule} %</div>
				</div>
			</button>

			<Link
				href={`/national/action/${encodeRuleName(titre.toLowerCase())}`}
				css={`
					text-decoration: none;
					visibility: ${(formule || notes) != null ? 'visible' : 'hidden'};
					text-align: center;
					color: var(--color);
				`}
			>
				Explications
			</Link>
		</li>
	)
}
