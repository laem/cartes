'use client'
import { EndingCongratulations } from '@/app/simulateur/[...dottedName]/SimulateurContent'
import DetailedBarChartIcon from '@/components/DetailsBarChartIcon'
import Simulation from '@/components/Simulation'
import SimulationResults from '@/components/SimulationResults'
import StackedBarChart from '@/components/StackedBarChart'
import { getFoldedSteps } from '@/components/utils/simulationUtils'
import { useNextQuestions } from '@/components/utils/useNextQuestion'
import { formatValue } from 'publicodes'
import CalculSummary from './CalculSummary'

export default function Questions({
	rules,
	objectives,
	engine,
	evaluation,
	searchParams,
}) {
	console.log('OYOIAZDNOAIZND', 'rerender Questions')
	const nextQuestions = useNextQuestions(objectives, engine, searchParams),
		answeredQuestions = getFoldedSteps(searchParams, rules)
	const rule = rules[objectives[0]]

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
					{...{
						rule,
						evaluation,
						engine,
						rules,
						ResultsBlock,
						objectives,
						searchParams,
					}}
				/>

				<details open={answeredQuestions.length > 1}>
					<summary>
						<DetailedBarChartIcon />
					</summary>
					<StackedBarChart
						engine={engine}
						percentageFirst={false}
						precision={0.1}
						data={[
							{
								dottedName: 'trajet voiture . coût instantané',
								title: 'Coût instantané',
								color: '#6a89cc',
							},
							{
								dottedName: 'trajet voiture . coût de possession',
								title: 'Coût de possession',
								color: '#f8c291',
							},
							{
								dottedName: 'trajet voiture . coûts divers',
								title: 'Coûts divers',
								color: '#cf6a87',
							},
						]}
					/>
					<CalculSummary engine={engine} horizontal={true} />
				</details>
			</div>
			<Simulation
				{...{
					searchParams,
					rules,
					engine,
					customEnd: <EndingCongratulations />,
					objectives,
				}}
			/>
		</ul>
	)
}
