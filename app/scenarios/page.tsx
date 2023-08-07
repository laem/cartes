'use client'
import Emoji, { emoji } from 'Components/Emoji'
import Link from 'next/link'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import scenarios from './scenarios.yaml'

export default () => {
	const dispatch = useDispatch()
	const scenario = useSelector((state) => state.scenario)
	return (
		<section id="scenarios" className="ui__ container">
			<h1>Votre scénario climat</h1>
			<h2 css="display: inline-block;background: var(--color); padding: .1rem .4rem; margin-right: .4rem;  color: white; margin-top: 1rem">
				Quel futur souhaitez vous ?
			</h2>
			<p>
				L'évolution du climat, et donc notre futur, est directement lié à la
				somme de toutes nos émissions de carbone individuelles de consommation.
			</p>
			<p>
				Par défaut, le crédit carbone <strong>est fixé à 2 tonnes</strong>, car
				c'est l'objectif le plus connu du grand public aujourd'hui. Mais libre à
				vous de choisir votre objectif parmi ces trois scénarios. &nbsp;
				{emoji('👇')}
			</p>
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

							button {
								visibility: hidden;
							}
							:hover button {
								visibility: visible;
							}

							${scenario === nom
								? `
								border: 4px solid var(--color)
								
							`
								: 'border: 4px solid white'}
						`}
					>
						<h2>
							<span>{emoji(s.icône)}</span>&nbsp;
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
								<button
									className="ui__ button"
									onClick={() => {
										dispatch({ type: 'SET_SCENARIO', scenario: nom })
										setTimeout(() => window.history.go(-1), 1000)
									}}
								>
									Sélectionner
								</button>
							)}
						</div>
					</li>
				))}
			</ul>
			<div
				css={`
					display: none;
					margin: 0.6em auto;
					@media (max-width: 600px) {
						display: block;
						text-align: center;
					}
					font-size: 200%;
					filter: invert(1);
				`}
			>
				<Emoji extra="E105" alt="glisser horizontalement" black />
			</div>
			<p>
				Les conséquences de ces scénarios sont bien évidemment très compliquées
				à prévoir : ces descriptions sont indicatives et évolueront notamment
				lors du prochain rapport du{' '}
				<a href="https://fr.wikipedia.org/wiki/Groupe_d%27experts_intergouvernemental_sur_l%27%C3%A9volution_du_climat">
					GIEC
				</a>
				.
			</p>
			<p>
				Si vous êtes à l'aise en anglais, l'article{' '}
				<a href="http://nymag.com/intelligencer/2017/07/climate-change-earth-too-hot-for-humans.html">
					The Uninhabitable Earth
				</a>{' '}
				et le livre associé décrivent de façon très convainquante le pire des
				scénarios, et{' '}
				<a href="https://climatefeedback.org/evaluation/scientists-explain-what-new-york-magazine-article-on-the-uninhabitable-earth-gets-wrong-david-wallace-wells/">
					cet autre article
				</a>{' '}
				l remet en perspective de façon scientifiquement plus rigoureuse.
			</p>
		</section>
	)
}
