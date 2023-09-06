'use client'
import CountriesGraph from '@/components/CountriesGraph'
import { Card } from '@/components/UI'
import RuleInput from 'Components/conversation/RuleInput'
import Emoji from 'Components/Emoji'
import StackedBarChart from 'Components/StackedBarChart'
import { useContext, useEffect, useState } from 'react'
import fetchBrentPrice from './fetchBrentPrices'
import { SituationContext } from './Voyage'

export default function Questions({ engine, target }) {
	const questions = ['trajet . voyageurs']
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
	const evaluation = engine.evaluate(target)

	if (!evaluation.nodeValue) return <p>Problème de calcul.</p>

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
							key={dottedName}
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
				<Card>
					<h2 css="margin: .4rem; font-size: 125%">{evaluation.title}</h2>
					<strong css="font-size: 150%">
						{evaluation.nodeValue.toLocaleString('fr-FR', {
							maximumFractionDigits: 2,
						})}{' '}
						€
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
		</div>
	)
}
