'use client'
import Simulation from '@/components/Simulation'
import SimulationResults from '@/components/SimulationResults'
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
					opacity: ${answeredQuestions.length /
					(answeredQuestions.length + nextQuestions.length)};
				`}
			>
				<SimulationResults
					{...{ ...rule, ...evaluation, engine, rules, ResultsBlock }}
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
