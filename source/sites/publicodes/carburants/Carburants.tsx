import Engine from 'publicodes'
import { Documentation } from 'publicodes-react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Redirect, Route, Switch } from 'react-router'
import RuleInput from 'Components/conversation/RuleInput'
import Emoji from '../../../components/Emoji'
import { DocumentationStyle } from '../pages/Documentation'
import fetchBrentPrice from './fetchBrentPrice'
import Meta from '../../../components/utils/Meta'
import StackedBarChart from '../../../components/StackedBarChart'

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
			<Meta
				title="Comprendre le prix à la pompe"
				description="Comprendre comment le prix de l'essence et du gazole à la pompe est calculé."
			/>
			<Main />
			<DocumentationStyle>
				<div css="height: 10vh; text-align: center">
					Comprendre le calcul <Emoji e="⬇️" />
				</div>
				<h2>Explications</h2>
				<Documentation engine={engine} documentationPath={'/carburants'} />
			</DocumentationStyle>
		</SituationContext.Provider>
	)
}
const Main = ({}) => (
	<main
		className="ui__ container"
		css={`
			height: 90vh;
		`}
	>
		<p
			css={`
				display: flex;
				align-items: center;
				justify-content: space-evenly;
				img {
					font-size: 400%;
				}
				h1 {
					margin-top: 1rem;
					max-width: 80%;
				}
			`}
		>
			<Emoji e="⛽️" />
			<h1 css="">Prix à la pompe 2022</h1>
		</p>

		<Questions />
	</main>
)

const Questions = ({}) => {
	const questions = ['type']
	const [situation, setSituation] = useContext(SituationContext)
	engine.setSituation(situation) // I don't understand why putting this in a useeffect produces a loop when the input components, due to Input's debounce function I guess.
	const onChange = (dottedName) => (value) => {
			console.log(value, situation, dottedName)
			const newSituation = (situation) => ({
				...situation,
				[dottedName]: value,
			})
			setSituation((situation) => newSituation(situation))
		},
		onSubmit = () => null
	const evaluation = engine.evaluate('prix à la pompe')
	const [brentPrice, setBrentPrice] = useState(null)
	useEffect(() => fetchBrentPrice().then((res) => setBrentPrice(res)), [])

	if (!evaluation.nodeValue) return <p>Problème de calcul.</p>

	const min = 0,
		max = 400,
		brentName = 'baril de brent . dollars',
		brentValue =
			situation[brentName] ||
			brentPrice?.[1] ||
			engine.evaluate(brentName).nodeValue

	return (
		<div
			css={`
				display: flex;
				flex-direction: column;
				align-items: center;
				flex-wrap: wrap;
				> div {
					margin-top: 1rem;
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
				{questions.map((dottedName) => {
					const { question, icônes } = engine.getRule(dottedName).rawNode
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
			<div
				css={`
					border: 2px solid var(--color);
					padding: 0.2rem 0.6rem;
					border-radius: 0.4rem;
					input {
						width: 12rem;
						margin: 0 auto;
					}
					label {
						display: block;
						text-align: center;
					}
				`}
			>
				<label for="slider">
					Faites{' '}
					<strong css="color: var(--lightColor); font-weight: normal">
						varier
					</strong>{' '}
					le baril de Brent en $.
				</label>
				<div
					css={`
						display: flex;
						align-items: center;
						span {
							margin: 0 0.3rem;
						}
						position: relative;
						padding-top: 1.3rem;
					`}
				>
					<span>{min}</span>
					<input
						type="range"
						id="slider"
						name="slider"
						min={min}
						max={max}
						value={brentValue}
						onChange={(e) => onChange(brentName)(e.target.value)}
						step="5"
						css={`
							background: var(--darkerColor);
							appearance: none;
							height: 0.6rem;

							border-radius: 0.2rem;

							::-webkit-slider-thumb {
								-webkit-appearance: none; /* Override default look */
								appearance: none;
								${sliderHandleStyle}
							}

							::-moz-range-thumb {
								${sliderHandleStyle}
								content: ${brentValue}
							}
						`}
					/>
					<span>{max} $</span>
					<span
						css={`
							position: absolute;
							top: 0;
							left: ${(brentValue / max) * 11 + 1}rem;
						`}
					>
						{Math.round(brentValue)} $
					</span>
				</div>
				<p>
					Par défaut : prix du baril{' '}
					{!brentPrice
						? 'en février 2022 '
						: 'le ' +
						  brentPrice[0].toLocaleString('fr-FR', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
						  })}{' '}
				</p>
			</div>
			<div>
				<div className="ui__ card box">
					<h2 css="margin: .4rem; font-size: 125%">{evaluation.title}</h2>
					<strong css="font-size: 150%">
						{evaluation.nodeValue.toLocaleString('fr-FR', {
							maximumFractionDigits: 2,
						})}{' '}
						€ / litre
					</strong>
				</div>

				<details css="text-align: center; color: grey; display: none">
					<summary>
						<small>Ma situation</small>
					</summary>

					<ul>
						{Object.entries(situation).map(([k, v]) => (
							<li>{`${k} : ${v?.nodeValue || v}`}</li>
						))}
					</ul>
				</details>
			</div>
			<StackedBarChart
				engine={engine}
				data={[
					{
						dottedName: 'taxes',
						title: 'Taxes 🇫🇷',
						color: '#6a89cc',
					},
					{
						dottedName: 'pétrole brut',
						title: 'Pétrole brut',
						color: '#cf6a87',
					},
					{
						dottedName: 'raffinage et distribution',
						title: 'Raffinage et distribution',
						color: '#f8c291',
					},
				]}
			/>
		</div>
	)
}

const sliderHandleStyle = `


border: none;
border-radius: 2rem;
  width: 25px; /* Set a specific slider handle width */
  height: 25px; /* Slider handle height */
  background: var(--color); /* Green background */
  cursor: pointer; /* Cursor on hover */
`
