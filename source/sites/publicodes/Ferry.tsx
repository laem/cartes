import Engine from 'publicodes'
import { Documentation } from 'publicodes-react'
import { useEffect, useMemo, useState } from 'react'
import { Redirect, Route, Switch } from 'react-router'
import RuleInput from '../../components/conversation/RuleInput'
import rules from './ferry.yaml'

const engine = new Engine(rules)
export default ({}) => (
	<>
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
		>
			<Documentation engine={engine} documentationPath={''} />
		</div>
	</>
)
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
	const evaluation = engine.evaluate('ferry . charge par personne')
	const [situation, setSituation] = useState({}),
		onChange = (dottedName) => (value) => {
			console.log('onchange', value)
			setSituation({
				...situation,
				[dottedName]: value?.nodeValue || value?.valeur || value,
			})

			engine.setSituation(situation)
		},
		onSubmit = () => null

	return (
		<div>
			<ul>
				{Object.entries(situation).map(
					([k, v]) => console.log(v) || <li>{`${k} : ${v?.nodeValue || v}`}</li>
				)}
			</ul>
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
							<label>
								{question}
								<RuleInput
									{...{
										engine,
										dottedName,
										onChange: onChange(dottedName),
										onSubmit,
										noSuggestions: true,
									}}
								/>
							</label>
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
