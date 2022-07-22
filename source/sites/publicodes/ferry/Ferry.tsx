import RuleInput from 'Components/conversation/RuleInput'
import Engine from 'publicodes'
import { createContext, useContext, useState } from 'react'
import Emoji from '../../../components/Emoji'
import TopBar from '../../../components/TopBar'
import Meta from '../../../components/utils/Meta'
import Documentation from '../pages/Documentation'
import Lab from './Lab'

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

	return (
		<div className="ui__ container" css={``}>
			<Meta
				title="Calculateur d'empreinte carbone du ferry"
				description={description}
				image="https://futur.eco/images/ferry.png"
			/>
			<TopBar />
			<SituationContext.Provider value={[situation, setSituation]}>
				<Main />
				<div css=" text-align: center; margin-top: 3rem">
					Comprendre le calcul <Emoji e="⬇️" />
				</div>
				<details>
					<summary>Modèle bateau</summary>

					<Lab setData={setSituation} />
				</details>
				<h2>Explications</h2>
				<Documentation documentationPath="/ferry" engine={engine} embedded />
			</SituationContext.Provider>
		</div>
	)
}
const Main = ({}) => (
	<div className="ui__ container">
		<p
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
			`}
		>
			<Emoji e="⛴️" />
			<h1 css="">Le ferry, c'est écolo ?</h1>
		</p>
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
			<div
				css={`
					margin: 1rem 0;
					.step.input {
						max-width: 12rem;
					}
					.step label {
						padding: 0.2rem 0.6rem 0.2rem 0.4rem;
					}
				`}
			>
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
			<div>
				<div className="ui__ card box">
					<h2 css="margin: .4rem; font-size: 125%">{evaluation.title}</h2>
					<strong>
						{' '}
						{evaluation.nodeValue.toLocaleString('fr-FR')} kgCO2e
					</strong>
				</div>
				<p
					css={`
						max-width: 18rem;
						padding: 0 0rem 0 2rem;
					`}
				>
					<Emoji e="🗺️" /> Soit environ :{' '}
					<ul>
						<li>
							{Math.round(evaluation.nodeValue * 350)} kg pour Marseille-Ajaccio{' '}
						</li>
						<li>
							{Math.round(evaluation.nodeValue * 150)} kg pour
							Cherbourg-Portsmouth
						</li>
					</ul>
				</p>

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
