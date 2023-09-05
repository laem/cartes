'use client'
import CountriesGraph from '@/components/CountriesGraph'
import { Card } from '@/components/UI'
import RuleInput from 'Components/conversation/RuleInput'
import Emoji from 'Components/Emoji'
import StackedBarChart from 'Components/StackedBarChart'
import Engine from 'publicodes'
import { createContext, useContext, useEffect, useState } from 'react'
import fetchBrentPrice from './fetchBrentPrices'
import rules from './rules.yaml'

const engine = new Engine(rules)
const SituationContext = createContext({})

export default function Carburants({}) {
	const [situation, setSituation] = useState({})
	return (
		<main>
			<SituationContext.Provider value={[situation, setSituation]}>
				<Main />

				<div css=" text-align: center; margin-top: 3rem">
					Comprendre le calcul <Emoji e="⬇️" />
				</div>
				<p>
					Détail du calcul à venir. En attendant,{' '}
					<a href="https://github.com/laem/futureco/blob/master/app/carburants/prix-a-la-pompe/rules.yaml">
						le calcul est disponible ici en
					</a>
					.
				</p>
			</SituationContext.Provider>
		</main>
	)
}
const Main = ({}) => (
	<main>
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
	const brentName = 'baril de brent . dollars'
	useEffect(() => {
		fetchBrentPrice().then((res) => {
			setBrentPrice(res)

			onChange(brentName)(res[1])
		})
	}, [])

	if (!evaluation.nodeValue) return <p>Problème de calcul.</p>

	const min = 0,
		max = 400,
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
				<Card>
					<h2 css="margin: .4rem; font-size: 125%">{evaluation.title}</h2>
					<strong css="font-size: 150%">
						{evaluation.nodeValue.toLocaleString('fr-FR', {
							maximumFractionDigits: 2,
						})}{' '}
						€ / litre
					</strong>
				</Card>

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
						dottedName: 'raffinage et distribution',
						title: 'Raffinage et distribution',
						color: '#f8c291',
					},
					{
						dottedName: 'pétrole brut',
						title: 'Pétrole brut',
						color: '#cf6a87',
					},
				]}
			/>
			<CountriesGraph />
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
