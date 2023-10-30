'use client'
import css from '@/components/css/convertToJs'
import DetailedBarChartIcon from '@/components/DetailsBarChartIcon'
import Emoji from '@/components/Emoji'
import GraphicDetails from '@/components/GraphicDetails'
import Simulation from '@/components/Simulation'
import SimulationResults from '@/components/SimulationResults'
import StackedBarChart from '@/components/StackedBarChart'
import { LightButton } from '@/components/UI'
import { getFoldedSteps } from '@/components/utils/simulationUtils'
import { useNextQuestions } from '@/components/utils/useNextQuestion'
import { situationSelector } from '@/selectors/simulationSelectors'
import { formatValue } from 'publicodes'
import { useSelector } from 'react-redux'
import CalculSummary from './CalculSummary'

export default function Questions({
	rules,
	objectives,
	engine,
	evaluation,
	searchParams,
}) {
	const nextQuestions = useNextQuestions(objectives, engine, searchParams),
		answeredQuestions = getFoldedSteps(searchParams, rules)
	const rule = rules[objectives[0]]
	//just to update the engine object
	const situation = useSelector(situationSelector(objectives[0]))

	const voyageurs = searchParams['voyage.trajet.voyageurs']
	const ResultsBlock = () => (
		<div css="padding: 1.6rem; font-size: 140%">
			<strong>
				{formatValue(evaluation, {
					displayedUnit: voyageurs && voyageurs > 1 ? '€ / personne' : '€',
					precision: 0,
				})}
			</strong>
		</div>
	)

	const opacity =
		(answeredQuestions.length + 2) /
		(answeredQuestions.length + nextQuestions.length)
	return (
		<>
			<div
				style={css`
					opacity: ${opacity};
					top: -8rem;
					position: sticky;
					z-index: 10;
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
			</div>

			<div style={{ opacity }}>
				<GraphicDetails>
					<summary>
						<StackedBarChart
							engine={engine}
							percentageFirst={false}
							situation={situation}
							precision={0.1}
							largerFirst={true}
							verticalBars={true}
							data={[
								{
									dottedName: 'voyage . trajet voiture . coût instantané',
									title: 'Instantané ⛽️',
									color: 'rgb(163, 146, 199)',
								},
								{
									dottedName: 'voyage . trajet voiture . coût de possession',
									title: 'Possession 🚗',
									color: '#f8c291',
								},
								{
									dottedName: 'voyage . trajet voiture . coûts divers',
									title: 'Divers ◽️',
									color: '#cf6a87',
								},
							]}
						/>
					</summary>
					<CalculSummary engine={engine} horizontal={true} />
				</GraphicDetails>
			</div>
			<Simulation
				{...{
					searchParams,
					rules,
					engine,
					objectives,
				}}
			/>
		</>
	)
}
