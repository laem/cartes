import { setSimulationConfig } from 'Actions/actions'
import PeriodSwitch from 'Components/PeriodSwitch'
import SessionBar, { buildEndURL } from 'Components/SessionBar'
import ShareButton from 'Components/ShareButton'
import Simulation from 'Components/Simulation'
import { Markdown } from 'Components/utils/markdown'
import { TrackerContext } from 'Components/utils/withTracker'
import { utils } from 'publicodes'

import { compose, isEmpty, symmetricDifference } from 'ramda'
import React, { useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router'
import CarbonImpact from './CarbonImpact'
import Chart from './chart/index.js'
import { objectifsSelector } from 'Selectors/simulationSelectors'
import { useEvaluation } from 'Components/utils/EngineContext'

const eqValues = compose(isEmpty, symmetricDifference)

const Simulateur = (props) => {
	const objectif = props.match.params.name,
		decoded = utils.decodeRuleName(objectif),
		rules = useSelector((state) => state.rules),
		rule = rules[decoded],
		objectifs = useSelector(objectifsSelector),
		analysis = useEvaluation(objectifs),
		dispatch = useDispatch(),
		config = {
			objectifs: [decoded],
		},
		configSet = useSelector((state) => state.simulation?.config)
	useEffect(
		() =>
			!eqValues(config.objectifs, configSet?.objectifs || [])
				? dispatch(setSimulationConfig(config))
				: () => null,
		[]
	)

	if (!configSet) return null

	return (
		<div css="margin-bottom: 1em">
			<Helmet>
				<title>{rule.title}</title>
				{rule.description && (
					<meta name="description" content={rule.description} />
				)}
			</Helmet>
			<SessionBar />
			<Simulation
				noFeedback
				teaseCategories
				noProgressMessage
				customEnd={
					rule.dottedName === 'bilan' ? (
						<RedirectionToEndPage
							score={rule.nodeValue}
							url={buildEndURL(analysis)}
						/>
					) : rule.description ? (
						<Markdown source={rule.description} />
					) : (
						<EndingCongratulations />
					)
				}
				targets={<>{rule.period === 'flexible' && <PeriodBlock />}</>}
				explanations={
					<>
						<CarbonImpact />
						<Chart />
					</>
				}
			/>
			<ShareButton
				text="Mesure ton impact sur le simulateur Ecolab climat !"
				url={'https://' + window.location.hostname + props.match.url}
				title={rule.title}
			/>
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
	<h3>
		{emoji('🌟')}{' '}
		<T k="simulation-end.title">Vous avez complété cette simulation</T>{' '}
	</h3>
)
