import RuleInput from 'Components/conversation/RuleInput'
import Engine from 'publicodes'
import { createContext, useContext, useState } from 'react'
import { Link, Navigate, Route, Routes, useParams } from 'react-router-dom'
import Emoji from '../../../components/Emoji'
import TopBar from '../../../components/TopBar'
import Meta from '../../../components/utils/Meta'
import Documentation from '../pages/Documentation'
import Lab from './Lab'
import TicketSystem from './TicketSystem'

const description = `

			Découvrez une estimation de l'empreinte climat en fonction de votre
			billet.
`

const req = require.context('./', true, /\.(yaml)$/)
const rules = req.keys().reduce((memo, key) => {
	const jsonRuleSet = req(key).default || {}
	const splitName = key.replace('./', '').split('>.yaml')
	const prefixedRuleSet =
		splitName.length > 1
			? Object.fromEntries(
					Object.entries(jsonRuleSet).map(([k, v]) => [
						k === 'index' ? splitName[0] : splitName[0] + ' . ' + k,
						v,
					])
			  )
			: jsonRuleSet
	return { ...memo, ...prefixedRuleSet }
}, {})

const engine = new Engine(rules)
const SituationContext = createContext({})

export default ({}) => {
	const [situation, setSituation] = useState({})
	const params = useParams()['*']
	if (!params) return <Navigate to="/ferry/empreinte-par-km" replace />

	return (
		<div className="ui__ container">
			<Meta
				title="Calculateur d'empreinte carbone du ferry"
				description={description}
				image="https://futur.eco/images/ferry.png"
			/>
			<TopBar />
			<Link
				to="/ferry"
				css={`
					display: flex;
					align-items: center;
					justify-content: space-evenly;
					> span {
						margin-right: 1rem;
					}
					img {
						font-size: 200%;
						background: white;
					}
					h1 {
						margin-top: 1rem;
					}
					text-decoration: none;
					margin-bottom: 1rem;
				`}
			>
				<Emoji e="⛴️" />
				<h1 css="">Le ferry, c'est écolo ?</h1>
			</Link>
			<Routes>
				<Route path="surface-mega-express-four" element={<Lab />} />
				<Route
					path="*"
					element={
						<SituationContext.Provider value={[situation, setSituation]}>
							<Main />
							<h2 css=" text-align: center; margin-top: 3rem">
								Comprendre le calcul <Emoji e="⬇️" />
							</h2>
							<Documentation
								documentationPath="/ferry"
								engine={engine}
								embedded
							/>

							<h2>Paramètres de simulation </h2>
							<details>
								<summary>Détails de la simulation</summary>
								<ul>
									{Object.entries(situation).map(([k, v]) => (
										<li>{`${k} : ${v?.nodeValue || v}`}</li>
									))}
								</ul>
							</details>
							<details>
								<summary>Modèle de volume du bateau type</summary>

								<Lab setData={setSituation} />
							</details>
						</SituationContext.Provider>
					}
				/>
			</Routes>
		</div>
	)
}
const Main = ({}) => (
	<div className="ui__ container">
		<p>{description}</p>
		<div
			css={`
				background: #7e151b;
				color: white;
				font-size: bold;
				margin: 1rem auto;
				max-width: 30rem;
				padding: 0.4rem 1rem;
				text-align: center;
				border-radius: 1rem;
			`}
		>
			Attention, ce calcul n'est pas encore validé pour une version 1. Merci de
			ne pas partager. Quelques semaines encore à attendre :){' '}
		</div>
		<Questions />
	</div>
)

const Questions = ({}) => {
	const questions = ['groupe', 'voiture', 'consommation de services', 'cabine']
	const [situation, setSituation] = useContext(SituationContext)
	engine.setSituation(situation) // I don't understand why putting this in a useeffect produces a loop when the input components, due to Input's debounce function I guess.
	const onChange = (dottedName) => (raw) => {
		console.log(raw, situation, dottedName)
		const value = raw.valeur || raw
		const newSituation = (situation) => ({
			...situation,
			[dottedName]: value,
		})
		setSituation((situation) => newSituation(situation))
	}

	const evaluation = engine.evaluate('empreinte par km')
	if (!evaluation.nodeValue) return null

	return (
		<div
			css={`
				@media (min-width: 800px) {
					display: flex;
					align-items: center;
				}
				h2 {
					margin-top: 0;
				}
			`}
		>
			<TicketSystem>
				<div
					css={`
						.step.input {
							max-width: 12rem;
						}
						.step label {
							padding: 0.2rem 0.6rem 0.2rem 0.4rem;
						}
						border-radius: 1rem;
						padding: 1rem 2rem;
						@media (max-width: 800px) {
							margin: 0;
							padding: 1rem;
						}
					`}
				>
					<h2>Votre billet</h2>
					{questions.map((name) => (
						<Question {...{ key: name, name, engine, onChange }} />
					))}
					<Question {...{ name: 'distance aller', engine, onChange }} />
					<Question {...{ name: 'durée du voyage', engine, onChange }} />
				</div>
			</TicketSystem>

			<div>
				<div
					css={`
						border-radius: 1rem;
						border: 2px solid var(--color);
						padding: 0.6rem;
						h2 {
							padding-left: 1rem;
							color: var(--color);
							font-weight: bold;
						}
					`}
				>
					<h2>Votre empreinte</h2>
					<div className="ui__ card box">
						<strong>
							{(evaluation.nodeValue * 1000).toLocaleString('fr-FR', {
								maximumSignificantDigits: 2,
							})}{' '}
							g CO₂e / km
						</strong>
						<p css="font-style: italic; font-size: 80%; margin: 0">
							par personne 👤
						</p>
					</div>
					<div
						className="ui__ card box"
						css={`
							max-width: 18rem;
							padding: 0 0rem 0 2rem;
							ul {
								padding: 0;
								list-style-type: none;
								img {
									font-size: 115%;
									margin-right: 1rem;
								}
								li {
									display: flex;
									align-items: center;
									justify-content: space-between;
								}
							}
						`}
					>
						<ul>
							{[
								{
									distance: 130 * 2,
									label: 'Cherbourg↔Poole',
									emoji: '🇬🇧',
								},
								{
									distance: 350 * 2,
									label: 'Marseille↔Ajaccio',
									emoji: '🏝️',
								},
								{ distance: 800 * 2, label: 'Marseille↔Alger', emoji: '🇩🇿' },
							].map(({ distance, label, emoji }) => (
								<li>
									<Emoji e={emoji} />
									<div>
										{label}
										<div>
											<strong>
												{(evaluation.nodeValue * distance).toLocaleString(
													'fr-FR',
													{ maximumSignificantDigits: 2 }
												)}{' '}
												kg CO₂e
											</strong>
										</div>{' '}
									</div>
								</li>
							))}
						</ul>
						<p css="font-style: italic; font-size: 80%; margin: 0">
							(aller retour)
						</p>
					</div>

					<div className="ui__ card box">
						<Link to="/simulateur/transport/avion/impact">
							Et l'avion <Emoji e="✈️" />?
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

const Question = ({ name: dottedName, onChange }) => {
	const { question, icônes } = engine.getRule(dottedName).rawNode
	return (
		<div
			css={`
				display: flex;
				justify-content: start;
				align-items: center;
				img {
					font-size: 240%;
					margin-right: 1rem;
				}
				@media (max-width: 800px) {
					img {
						font-size: 180%;
						margin-right: 0.4rem;
					}
				}
			`}
		>
			{icônes && <Emoji e={icônes} />}
			<label>
				<p>{question}</p>
				<RuleInput
					{...{
						engine,
						dottedName,
						onChange: onChange(dottedName),
						onSubmit: () => null,
						noSuggestions: false,
					}}
				/>
			</label>
		</div>
	)
}
