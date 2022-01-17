import Engine from 'publicodes'
import { Documentation } from 'publicodes-react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Redirect, Route, Switch } from 'react-router'
import RuleInput from 'Components/conversation/RuleInput'
import Emoji from '../../../components/Emoji'

const req = require.context('./', true, /\.(yaml)$/)
const rules = req.keys().reduce((memo, key) => {
	const jsonRuleSet = req(key) || {}
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

console.log(rules)

const engine = new Engine(rules)
const SituationContext = createContext({})
export default ({}) => {
	const [situation, setSituation] = useState({})
	return (
		<SituationContext.Provider value={[situation, setSituation]}>
			<Main />
			<br />
			<br />
			<br />
			<div
				css={`
					small {
						background: none !important;
					}

					div[name='somme'] > div > div:nth-child(2n) {
						background: var(--darkerColor);
					}
				`}
				className="ui__ container"
			>
				<h2>Explications</h2>
				<Documentation engine={engine} documentationPath={''} />
			</div>
		</SituationContext.Provider>
	)
}
const Main = ({}) => (
	<div className="ui__ container">
		<p
			css={`
				display: flex;
				align-items: center;
				justify-content: space-evenly;
				img {
					font-size: 200%;
					background: white;
				}
				h1 {
					margin-top: 1rem;
					max-width: 60%;
				}
			`}
		>
			<Emoji e="⛴️" />
			<h1 css="">Le ferry, c'est écolo ?</h1>
		</p>
		<p>
			Alternative sérieuse à l'avion moyen courrier très polluant, le ferry
			complète train de jour ou de nuit pour traverser les mers.
		</p>
		<p>
			Découvrez ici une estimation de l'empreinte climat d'un voyage en ferry,
			en fonction de choix simples que vous faites en achetant le billet puis à
			bord.
		</p>
		<Questions />
	</div>
)

const Questions = ({}) => {
	const questions = ['groupe', 'voiture', 'consommation de services', 'cabine']
	const [situation, setSituation] = useContext(SituationContext)
	engine.setSituation(situation)
	const onChange = (dottedName) => (raw) => {
			const value = raw.valeur || raw
			const newSituation = {
				...situation,
				[dottedName]: value,
			}
			setSituation(newSituation)

			engine.setSituation(newSituation)
		},
		onSubmit = () => null
	const evaluation = engine.evaluate('ferry . empreinte par km')

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
				`}
			>
				{questions.map((name) => {
					const dottedName = 'ferry . ' + name,
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
