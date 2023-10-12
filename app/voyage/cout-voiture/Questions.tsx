'use client'
import DetailedBarChartIcon from '@/components/DetailsBarChartIcon'
import Simulation from '@/components/Simulation'
import SimulationResults from '@/components/SimulationResults'
import StackedBarChart from '@/components/StackedBarChart'
import { Card } from '@/components/UI'
import { useNextQuestions } from '@/components/utils/useNextQuestion'
import { answeredQuestionsSelector } from '@/selectors/simulationSelectors'
import { formatValue } from 'publicodes'
import { useSelector } from 'react-redux'
import { EndingCongratulations } from '@/app/simulateur/[...dottedName]/SimulateurContent'

export default function Questions({
	rules,
	objective,
	engine,
	evaluation,
	searchParams,
}) {
	const nextQuestions = useNextQuestions(engine),
		answeredQuestions = useSelector(answeredQuestionsSelector)
	const rule = rules[objective]

	const ResultsBlock = () => (
		<div css="padding: 1.6rem; font-size: 140%">
			<strong>
				{formatValue(evaluation, {
					displayedUnit: '€ / personne',
					precision: 0,
				})}
			</strong>
		</div>
	)
	return (
		<ul>
			<div
				css={`
					margin: 2rem 0.4rem 1rem;
					opacity: ${(answeredQuestions.length + 2) /
					(answeredQuestions.length + nextQuestions.length)};
					summary {
						list-style-type: none;
						cursor: pointer;
					}
				`}
			>
				<SimulationResults
					{...{ ...rule, ...evaluation, engine, rules, ResultsBlock }}
				/>

				<details>
					<summary>
						<DetailedBarChartIcon />
					</summary>
					<StackedBarChart
						engine={engine}
						data={[
							{
								dottedName: 'voiture . coût instantané au km',
								title: 'Coût instantané',
								color: '#6a89cc',
							},
							{
								dottedName: 'voiture . coût de possession au km',
								title: 'Coût de possession',
								color: '#f8c291',
							},
							{
								dottedName: 'voiture . coûts divers au km',
								title: 'Coûts divers',
								color: '#cf6a87',
							},
						]}
					/>
				</details>
			</div>
			<Simulation
				searchParams={searchParams}
				rules={rules}
				engine={engine}
				noFeedback
				customEnd={<EndingCongratulations />}
				explanations={null}
			/>
		</ul>
	)
}
