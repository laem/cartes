import { setSimulationConfig } from 'Actions/actions'
import { extractCategories } from 'Components/publicodesUtils'
import { buildEndURL } from 'Components/SessionBar'
import Simulation from 'Components/Simulation'
import SimulationResults from 'Components/SimulationResults'
import TopBar from 'Components/TopBar'
import { useEngine } from 'Components/utils/EngineContext'
import { Markdown } from 'Components/utils/markdown'
import { TrackerContext } from 'Components/utils/withTracker'
import { utils } from 'publicodes'
import { compose, isEmpty, symmetricDifference } from 'ramda'
import React, { useContext, useEffect } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import tinygradient from 'tinygradient'
import {
	deletePreviousSimulation,
	resetSimulation,
} from '../../actions/actions'
import { useSafePreviousSimulation } from '../../components/SessionBar'
import Meta from '../../components/utils/Meta'
import { useNextQuestions } from '../../components/utils/useNextQuestion'
import FuturecoMonochrome from 'Components/FuturecoMonochrome'
import {
	answeredQuestionsSelector,
	situationSelector,
} from '../../selectors/simulationSelectors'
import { capitalizeFirst } from './chart/Bar'
import { Almost, Done, Half, NotBad, QuiteGood } from './Congratulations'

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

	return colors[Math.round(cursor)]
}

export default ({}) => {
	const dispatch = useDispatch()
	const urlParams = useParams()
	const rawObjective = urlParams['*'],
		decoded = utils.decodeRuleName(rawObjective),
		config = {
			objectifs: [decoded],
			questions: {
				'non prioritaires':
					decoded === 'transport . avion . impact'
						? ['transport . avion . forçage radiatif']
						: null,
			},
		},
		configSet = useSelector((state) => state.simulation?.config)
	const wrongConfig = !eqValues(config.objectifs, configSet?.objectifs || [])
	const url = useLocation().pathname
	useEffect(
		() =>
			wrongConfig ? dispatch(setSimulationConfig(config, url)) : () => null,
		[]
	)

	if (!configSet || wrongConfig) return null

	return <Simulateur objective={decoded} />
}

const Simulateur = ({ objective }) => {
	const rules = useSelector((state) => state.rules),
		rule = rules[objective],
		engine = useEngine(),
		situation = useSelector(situationSelector),
		evaluation = engine.evaluate(objective),
		dispatch = useDispatch(),
		categories = objective === 'bilan' && extractCategories(rules, engine)
	const tutorials = useSelector((state) => state.tutorials)

	useEffect(() => {
		const handleKeyDown = (e) => {
			return null
			if (!(e.ctrlKey && e.key === 'c')) return
			dispatch(resetSimulation())
			dispatch(deletePreviousSimulation())
			e.preventDefault()
			return false
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [])
	useSafePreviousSimulation()

	const nextQuestions = useNextQuestions(),
		answeredQuestions = useSelector(answeredQuestionsSelector)
	const messages = useSelector((state) => state.simulation?.messages)

	const isMainSimulation = objective === 'bilan'

	const gameOver = evaluation.nodeValue > limit
	const answeredRatio =
		answeredQuestions.length / (answeredQuestions.length + nextQuestions.length)

	const doomColor = getBackgroundColor(evaluation.nodeValue).toHexString()

	if (isMainSimulation) {
		if (answeredRatio >= 0.1 && !messages['notBad'])
			return <NotBad answeredRatio={answeredRatio} />
		if (answeredRatio >= 0.3 && !messages['quiteGood'])
			return <QuiteGood answeredRatio={answeredRatio} />
		if (answeredRatio >= 0.5 && !messages['half'])
			return <Half answeredRatio={answeredRatio} />
		if (answeredRatio >= 0.75 && !messages['almost'])
			return <Almost answeredRatio={answeredRatio} />
		if (!nextQuestions.length) return <Done />
	}
	return (
		<div className="ui__ container">
			{isMainSimulation && (
				<Link to="/">
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
				</Link>
			)}
			{!isMainSimulation && <TopBar />}
			<div
				css={`
					height: 90%;
					${isMainSimulation &&
					`
					border: 1.4rem solid ${doomColor};
					`}
				`}
			>
				<Meta
					title={rule.titre}
					description={rule.exposé?.description || rule.description}
					image={`/.netlify/functions/ending-screenshot?pageToScreenshot=${window.location}`} // we could simply render SVG emojis, but SVG images don't work in og tags, we'll have to convert them
				/>

				{!isMainSimulation && (
					<SimulationResults {...{ ...rule, ...evaluation }} />
				)}

				{isMainSimulation && gameOver ? (
					<Navigate to="/fin" />
				) : (
					<Simulation
						noFeedback
						orderByCategories={categories}
						customEnd={
							objective === 'bilan' ? (
								<RedirectionToEndPage {...{ rules, engine }} />
							) : rule.description ? (
								<CustomDescription rule={rule} />
							) : (
								<EndingCongratulations />
							)
						}
						explanations={null}
					/>
				)}
			</div>
		</div>
	)
}

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

	return <Navigate to={buildEndURL(rules, engine)} />
}

const EndingCongratulations = () => (
	<h3>{emoji('🌟')} Vous avez complété cette simulation</h3>
)

const ADEMELogoURL =
	'https://www.ademe.fr/sites/default/files/logoademe2020_rvb.png'

const CustomDescription = ({ rule }) => {
	const ref = rule.références,
		baseCarbone = ref?.find((el) => el.includes('bilans-ges.ademe.fr'))
	return (
		<div css="margin: 1rem 0">
			{baseCarbone && (
				<div css="img {vertical-align: middle}">
					Une donnée{' '}
					<img css="height: 2rem; margin-right: .2rem" src={ADEMELogoURL} />
					<a href="https://bilans-ges.ademe.fr"> base carbone ADEME</a>
				</div>
			)}
			<Markdown>{capitalizeFirst(rule.description)}</Markdown>
		</div>
	)
}
