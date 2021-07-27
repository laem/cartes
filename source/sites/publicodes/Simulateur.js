import { setSimulationConfig } from 'Actions/actions'
import PeriodSwitch from 'Components/PeriodSwitch'
import { extractCategories } from 'Components/publicodesUtils'
import SessionBar, { buildEndURL } from 'Components/SessionBar'
import Simulation from 'Components/Simulation'
import { useEngine } from 'Components/utils/EngineContext'
import { Markdown } from 'Components/utils/markdown'
import { TrackerContext } from 'Components/utils/withTracker'
import { utils } from 'publicodes'
import { compose, isEmpty, symmetricDifference } from 'ramda'
import React, { useContext, useEffect } from 'react'
import emoji from 'react-easy-emoji'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router'
import tinygradient from 'tinygradient'
import { sessionBarMargin } from '../../components/SessionBar'
import FuturecoMonochrome from '../../images/FuturecoMonochrome'
import { situationSelector } from '../../selectors/simulationSelectors'

const eqValues = compose(isEmpty, symmetricDifference)
export const colorScale = [
	'#16a085',
	'#78e08f',
	'#e1d738',
	'#f6b93b',
	'#b71540',
]
const gradient = tinygradient(colorScale),
	colors = gradient.rgb(21),
	incompressible = 1112,
	durable = 2000,
	limit = durable + incompressible

const getBackgroundColor = (score) => {
	const cursor =
		score < incompressible
			? 0
			: score > limit
			? 19
			: ((score - incompressible) / durable) * 20

	console.log(score, cursor)

	return colors[Math.round(cursor)]
}

const Simulateur = (props) => {
	const objectif = props.match.params.name,
		decoded = utils.decodeRuleName(objectif),
		rules = useSelector((state) => state.rules),
		rule = rules[decoded],
		engine = useEngine(),
		situation = useSelector(situationSelector),
		evaluation = engine.evaluate(decoded),
		dispatch = useDispatch(),
		config = {
			objectifs: [decoded],
			narrow: decoded !== 'bilan',
		},
		configSet = useSelector((state) => state.simulation?.config),
		categories = decoded === 'bilan' && extractCategories(rules, engine)

	useEffect(
		() =>
			!eqValues(config.objectifs, configSet?.objectifs || [])
				? dispatch(setSimulationConfig(config))
				: () => null,
		[]
	)

	if (!configSet) return null

	const gameOver = evaluation.nodeValue > limit
	const doomColor = getBackgroundColor(evaluation.nodeValue).toHexString()
	console.log('DOOM', doomColor)

	return (
		<>
			<div
				css={`
					display: flex;
					justify-content: center;
					height: 10%;
					svg {
						height: 4rem;
					}
				`}
			>
				<FuturecoMonochrome color={doomColor} />
			</div>
			<div
				css={`
					height: 90%;
					border: 1.4rem solid ${doomColor};
					${false && sessionBarMargin}
				`}
			>
				<Helmet>
					<title>{rule.title}</title>
					{rule.description && (
						<meta name="description" content={rule.description} />
					)}
				</Helmet>

				{!gameOver ? (
					<>
						{false && <SessionBar evaluation={evaluation} />}
						<Simulation
							noFeedback
							orderByCategories={categories}
							customEnd={
								decoded === 'bilan' ? (
									<RedirectionToEndPage
										score={rule.nodeValue}
										url={buildEndURL(rules, engine)}
									/>
								) : rule.description ? (
									<Markdown source={rule.description} />
								) : (
									<EndingCongratulations />
								)
							}
							targets={<>{rule.period === 'flexible' && <PeriodBlock />}</>}
							explanations={null}
						/>
					</>
				) : (
					<Redirect to="/fin" />
				)}
			</div>
		</>
	)
}

let PeriodBlock = () => (
	<div css="display: flex; justify-content: center">
		<PeriodSwitch />
	</div>
)

const RedirectionToEndPage = ({ rules, engine }) => {
	// Necessary to call 'buildEndURL' with the latest situation
	const situation = useSelector(situationSelector)
	const tracker = useContext(TrackerContext)

	useEffect(() => {
		tracker.push([
			'trackEvent',
			'NGC',
			'A terminé la simulation',
			null,
			rules['bilan'].nodeValue,
		])
	}, [tracker])

	return <Redirect to={buildEndURL(rules, engine)} />
}

export default Simulateur

const EndingCongratulations = () => (
	<h3>{emoji('🌟')} Vous avez complété cette simulation</h3>
)
