import RuleInput from 'Components/conversation/RuleInput'
import Engine from 'publicodes'
import { createContext, useContext, useState } from 'react'
import Emoji from '../../../components/Emoji'
import TopBar from '../../../components/TopBar'
import Meta from '../../../components/utils/Meta'
import Documentation from '../pages/Documentation'
import Lab from './Lab'
import { Link, Navigate, Route, Routes, useParams } from 'react-router-dom'
import TicketSystem from './TicketSystem'

const description = `

			Alternative à l'avion, le ferry complète train pour traverser les mers.
			Découvrez une estimation de son empreinte climat, en fonction de votre
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
		<div className="ui__ container" css={``}>
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
							<div css=" text-align: center; margin-top: 3rem">
								Comprendre le calcul <Emoji e="⬇️" />
							</div>
							<h2>Explications</h2>
							<Documentation
								documentationPath="/ferry"
								engine={engine}
								embedded
							/>
							<h2>Modèle de surface du bateau</h2>
							<details>
								<summary>Investiguer le modèle</summary>

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
		},
		onSubmit = () => null

	const evaluation = engine.evaluate('empreinte par km')
	if (!evaluation.nodeValue) return null

	return (
		<div
			css={`
				@media (min-width: 800px) {
					display: flex;
					align-items: center;
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
					{questions.map((name) => {
						const dottedName = name,
							{ question, icônes } = engine.getRule(dottedName).rawNode
						return (
							<div
								css={`
									display: flex;
									justify-content: start;
									align-items: center;
									img {
										font-size: 300%;
										margin-right: 1rem;
									}
									@media (max-width: 800px) {
										img {
											font-size: 200%;
											margin-right: 0.4rem;
										}
									}
									p {
										max-width: 20rem;
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
											onSubmit,
											noSuggestions: false,
										}}
									/>
								</label>
							</div>
						)
					})}
				</div>
			</TicketSystem>

			<div>
				<h2>Le bateau</h2>

				<label>
					<select name="bateau">
						<option value="mega4">Mega Expres Four</option>
					</select>
					<div>
						Un seul <em>bateau type</em> est pour l'instant modélisé.
					</div>
				</label>
				<div
					css={`
						border-radius: 1rem;
						border: 2px solid var(--color);
						h2 {
							padding-left: 1rem;
							color: var(--color);
							font-weight: bold;
						}
					`}
				>
					<h2>Votre empreinte</h2>
					<div className="ui__ card box">
						<h3 css="margin: .4rem; ">{evaluation.title}</h3>
						<strong>
							{' '}
							{evaluation.nodeValue.toLocaleString('fr-FR')} kgCO2e
						</strong>
					</div>
					<div
						className="ui__ card box"
						css={`
							max-width: 18rem;
							padding: 0 0rem 0 2rem;
						`}
					>
						<Emoji e="🗺️" /> Soit environ :{' '}
						<ul>
							<li>
								{Math.round(evaluation.nodeValue * 350)} kg pour
								Marseille-Ajaccio{' '}
							</li>
							<li>
								{Math.round(evaluation.nodeValue * 150)} kg pour
								Cherbourg-Portsmouth
							</li>
						</ul>
					</div>
				</div>

				<details css="text-align: center">
					<summary>Ma situation</summary>

					<ul>
						{Object.entries(situation).map(([k, v]) => (
							<li>{`${k} : ${v?.nodeValue || v}`}</li>
						))}
					</ul>
				</details>
			</div>
		</div>
	)
}
