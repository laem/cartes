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
import { extractCategories } from 'Components/publicodesUtils'

import { objectifsSelector } from 'Selectors/simulationSelectors'
import { useEngine } from 'Components/utils/EngineContext'
import emoji from 'react-easy-emoji'
import { situationSelector } from '../../selectors/simulationSelectors'
import BandeauContribuer from './BandeauContribuer'
import { sessionBarMargin } from '../../components/SessionBar'
import { FullName, splitName } from '../../components/publicodesUtils'
import Title from 'Components/Title'

const eqValues = compose(isEmpty, symmetricDifference)

const Simulateur = (props) => {
	const objectif = props.match.params.name,
		decoded = utils.decodeRuleName(objectif),
		rules = useSelector((state) => state.rules),
		rule = rules[decoded],
		engine = useEngine(),
		evaluation = engine.evaluate(decoded),
		dispatch = useDispatch(),
		config = {
			objectifs: [decoded],
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

	const isMainSimulation = decoded === 'bilan'
	if (!configSet) return null

	return (
		<div>
			<Helmet>
				<title>{rule.title}</title>
				{rule.description && (
					<meta name="description" content={evaluation.title} />
				)}
			</Helmet>
			<Title>Le test</Title>
			<CarbonImpact />
			{!isMainSimulation && (
				<h1>
					{evaluation.rawNode.title || (
						<FullName dottedName={evaluation.dottedName} />
					)}
				</h1>
			)}
			<Simulation
				noFeedback
				orderByCategories={categories}
				customEnd={
					isMainSimulation ? (
						<RedirectionToEndPage {...{ rules, engine }} />
					) : rule.description ? (
						<Markdown source={rule.description} />
					) : (
						<EndingCongratulations />
					)
				}
				targets={<>{rule.period === 'flexible' && <PeriodBlock />}</>}
				explanations={
					<>
						<Chart />
					</>
				}
			/>
			<ShareButton
				text="Mesure ton impact sur le simulateur Ecolab climat !"
				url={'https://' + window.location.hostname + props.match.url}
				title={rule.title}
			/>
			<BandeauContribuer />
		</div>
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
