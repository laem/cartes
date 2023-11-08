'use client'
import css from '@/components/css/convertToJs'
import DetailedBarChartIcon from '@/components/DetailsBarChartIcon'
import Emoji from '@/components/Emoji'
import GraphicDetails from '@/components/GraphicDetails'
import Simulation from '@/components/Simulation'
import SimulationResults from '@/components/SimulationResults'
import StackedBarChart from '@/components/StackedBarChart'
import { LightButton } from '@/components/UI'
import {
	getFoldedSteps,
	getSituation,
} from '@/components/utils/simulationUtils'
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

	const validatedSituation = getSituation(searchParams, rules)
	const userSituation = useSelector(situationSelector(objectives[0]))
	const situation = { ...validatedSituation, ...userSituation }

	const voyageurs = searchParams['voyage.trajet.voyageurs']
	const ResultsBlock = () => (
		<div css="padding: .4rem; font-size: 140%">
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
				style={css(`
					top: -8rem;
					position: sticky;
					z-index: 10;
				`)}
			>
				<SimulationResults
					{...{
						opacity,
						hideResults: answeredQuestions.length === 0,
						rule,
						evaluation,
						engine,
						rules,
						ResultsBlock,
						objectives,
						searchParams,
						image:
							'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Vue_sud-ouest_de_la_place_du_parlement_de_Bretagne,_Rennes,_France.jpg/400px-Vue%20sud-ouest%20de%20la%20place%20du%20parlement%20de%20Bretagne%2C%20Rennes%2C%20France.jpg',
					}}
				/>
			</div>

			<div
				style={{
					opacity,
					display: answeredQuestions.length ? 'block' : 'none',
				}}
			>
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
