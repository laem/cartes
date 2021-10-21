import Engine from 'publicodes'
import { Documentation } from 'publicodes-react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Redirect, Route, Switch } from 'react-router'
import RuleInput from '../../components/conversation/RuleInput'
import rules from './ferry.yaml'

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
				`}
				className="ui__ container"
			>
				<Documentation engine={engine} documentationPath={''} />
			</div>
		</SituationContext.Provider>
	)
}
const Main = ({}) => (
	<div className="ui__ container">
		<h1>Le ferry, c'est écolo ?</h1>
		<p>
			Le ferry est une alternative sérieuse à l'avion moyen courrier, en
			complément du train de jour ou de nuit pour traverser les mers.
		</p>
		<p>
			Découvrez ici une estimation de l'empreinte climat d'un voyage en ferry,
			en fonction de choix simples que vous faites en achetant le billet et à
			bord.
		</p>
		<Questions />
	</div>
)

const Questions = ({}) => {
	const questions = ['groupe', 'voiture', 'services accessoires']
	const [situation, setSituation] = useContext(SituationContext)
	engine.setSituation(situation)
	const onChange = (dottedName) => (raw) => {
			console.log('RAW', raw)
			const value = raw.valeur || raw
			const newSituation = {
				...situation,
				[dottedName]: value,
			}
			setSituation(newSituation)

			engine.setSituation(newSituation)
		},
		onSubmit = () => null
	const evaluation = engine.evaluate('ferry . charge par personne')
	console.log('SITU', situation)
	console.log('ferry . groupe', engine.evaluate('ferry . groupe'))

	return (
		<div>
			<details>
				<summary>Ma situation</summary>

				<ul>
					{Object.entries(situation).map(
						([k, v]) =>
							console.log(v) || <li>{`${k} : ${v?.nodeValue || v}`}</li>
					)}
				</ul>
			</details>
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
						question = engine.getRule(dottedName).rawNode.question
					return (
						<div>
							<label>{question}</label>
							<RuleInput
								{...{
									engine,
									dottedName,
									onChange: onChange(dottedName),
									onSubmit,
									noSuggestions: true,
								}}
							/>
						</div>
					)
				})}
			</div>
			<h2>Mon résultat</h2>
			<p>
				C'est la part de poids qui vous est attribuée en fonction de vos choix.
			</p>
			<div>{Math.round(evaluation.nodeValue)} kg</div>
		</div>
	)
}
