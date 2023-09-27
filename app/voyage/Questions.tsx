'use client'
import Simulation from '@/components/Simulation'
import SimulationResults from '@/components/SimulationResults'
import StackedBarChart from '@/components/StackedBarChart'
import { useNextQuestions } from '@/components/utils/useNextQuestion'
import { answeredQuestionsSelector } from '@/selectors/simulationSelectors'
import { formatValue } from 'publicodes'
import { useSelector } from 'react-redux'
import { EndingCongratulations } from '../simulateur/[...dottedName]/SimulateurContent'

export default function Questions({
	rules,
	objective,
	engine,
	config,
	evaluation,
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
					margin: 2rem 0.4rem;
					opacity: ${(answeredQuestions.length + 2) /
					(answeredQuestions.length + nextQuestions.length)};
				`}
			>
				<SimulationResults
					{...{ ...rule, ...evaluation, engine, rules, ResultsBlock }}
				/>

				<StackedBarChart
					engine={engine}
					data={[
						{
							dottedName: 'voiture . coût instantané au km',
							color: '#6a89cc',
						},
						{
							dottedName: 'voiture . coût de possession au km',
							color: '#f8c291',
						},
						{
							dottedName: 'voiture . coûts divers au km',
							color: '#cf6a87',
						},
					]}
				/>
			</div>
			<Simulation
				rules={rules}
				engine={engine}
				noFeedback
				customEnd={<EndingCongratulations />}
				explanations={null}
			/>
		</ul>
	)
}
