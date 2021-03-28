import { setSimulationConfig } from 'Actions/actions'
import PeriodSwitch from 'Components/PeriodSwitch'
import SessionBar, { buildEndURL } from 'Components/SessionBar'
import ShareButton from 'Components/ShareButton'
import Simulation from 'Components/Simulation'
import { Markdown } from 'Components/utils/markdown'
import { TrackerContext } from 'Components/utils/withTracker'
import { utils } from 'publicodes'

import tinygradient from 'tinygradient'
import { compose, isEmpty, symmetricDifference } from 'ramda'
import React, { useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router'
import CarbonImpact from './CarbonImpact'
import Chart, { extractCategories } from './chart/index.js'
import { objectifsSelector } from 'Selectors/simulationSelectors'
import { useEngine } from 'Components/utils/EngineContext'
import emoji from 'react-easy-emoji'
import { situationSelector } from '../../selectors/simulationSelectors'
import GameOver from './GameOver'
import FuturecoMonochrome from '../../images/FuturecoMonochrome'

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
		<div
			css={`
				height: 100%;
				border: 1.4rem solid ${doomColor};
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
					<SessionBar evaluation={evaluation} />
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
			<ShareButton
				text="Mesure ton impact sur le simulateur Ecolab climat !"
				url={'https://' + window.location.hostname + props.match.url}
				title={rule.title}
			/>
			<div css="display: flex; justify-content: center">
				<FuturecoMonochrome color={doomColor} />
			</div>
		</div>
	)
}

let PeriodBlock = () => (
	<div css="display: flex; justify-content: center">
		<PeriodSwitch />
	</div>
)

const RedirectionToEndPage = ({ url, score }) => {
	const tracker = useContext(TrackerContext)

	useEffect(() => {
		tracker.push(['trackEvent', 'NGC', 'A terminé la simulation', null, score])
	}, [tracker])

	return <Redirect to={url} />
}

export default Simulateur

const EndingCongratulations = () => (
	<h3>{emoji('🌟')} Vous avez complété cette simulation</h3>
)
