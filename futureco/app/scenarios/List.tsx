'use client'
import { LightButton } from 'Components/UI'
import Emoji, { emoji } from 'Components/Emoji'
import { useDispatch, useSelector } from 'react-redux'
import scenarios from './scenarios.yaml'

export default function ScenariosList() {
	const dispatch = useDispatch()
	const scenario = useSelector((state) => state.scenario)

	return (
		<ul
			css={`
				list-style-type: none;
				display: flex;
				flex-wrap: nowrap;
				overflow-x: auto;
				-webkit-overflow-scrolling: touch; /* [4] */
				-ms-overflow-style: -ms-autohiding-scrollbar; /* [5] */
				width: 100%;
			`}
		>
			{Object.entries(scenarios).map(([nom, s]) => (
				<li
					key={nom}
					className="ui__ card"
					css={`
						flex: 0 0 auto;
						width: 16vw;
						min-width: 16em;
						margin: 1em;
						border: 1px solid #eee;

						position: relative;
						padding-bottom: 6rem !important;

						h2 {
							margin-top: 0;
							font-size: 120%;
						}
						p {
							font-style: italic;
							font-size: 90%;
							line-height: 1.5rem;
						}

						${scenario === nom
							? `
								border: 4px solid var(--color)
								
							`
							: 'border: 4px solid white'}
					`}
				>
					<h2>
						<span>
							<Emoji e={s.icône} />
						</span>
						&nbsp;
						{s.titre}
					</h2>
					<p>{s['sous-titre']}</p>
					<div title="Réchauffement à la fin du siècle">
						<strong>
							{emoji('🌡️ ')} {s.réchauffement}
						</strong>
					</div>
					<div>
						{emoji('💰 ')}
						{s['crédit carbone par personne']}&nbsp;t de CO₂ / tête / an
					</div>
					<div css="margin-top: 1em; ">
						<p>{s.description}</p>
					</div>
					<div
						css={`
							position: absolute;
							bottom: 1rem;
							left: 50%;
							transform: translateX(-50%);
							img {
								font-size: 200%;
							}
						`}
					>
						{scenario === nom ? (
							<div>{emoji('✅')}</div>
						) : (
							<LightButton
								onClick={() => {
									dispatch({ type: 'SET_SCENARIO', scenario: nom })
									setTimeout(() => window.history.go(-1), 1000)
								}}
							>
								Sélectionner
							</LightButton>
						)}
					</div>
				</li>
			))}
		</ul>
	)
}
