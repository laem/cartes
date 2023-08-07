'use client'

import { setSimulationConfig } from '@/app/actions'
import Emoji from '@/app/components/Emoji'
import { questionEcoDimensions } from '@/app/components/questionEcoDimensions'
import { getBackgroundColor } from '@/app/components/testColors'
import {
	Almost,
	Done,
	Half,
	NotBad,
	QuiteGood,
} from 'Components/Congratulations'
import Lab from 'Components/ferry/Lab'
import FuturecoMonochrome from 'Components/FuturecoMonochrome'
import Simulation from 'Components/Simulation'
import SimulationResults from 'Components/SimulationResults'
import { useEngine } from 'Components/utils/EngineContext'
import {
	buildEndURL,
	extractCategories,
	parentName,
} from 'Components/utils/publicodesUtils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { capitalise0, utils } from 'publicodes'
import { compose, isEmpty, symmetricDifference } from 'ramda'
import { useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Meta from '../../components/utils/Meta'
import { useNextQuestions } from '../../components/utils/useNextQuestion'
import {
	answeredQuestionsSelector,
	situationSelector,
} from '../../selectors/simulationSelectors'
import CustomSimulateurEnding from './CustomSimulateurEnding'

const eqValues = compose(isEmpty, symmetricDifference)

const Simulateur = ({ params: { dottedName } }) => {
	const dispatch = useDispatch()
	const pathname = usePathname()

	const rawObjective = dottedName.join('/'),
		decoded = utils.decodeRuleName(rawObjective)

	const rules = useSelector((state) => state.rules),
		decodedRule = rules[decoded],
		objectifs =
			decodedRule.exposé?.type === 'question éco'
				? questionEcoDimensions.map(
						(dimension) => parentName(decoded) + ' . ' + dimension
				  )
				: [decoded]

	const config = {
			objectifs,
			questions: {
				'non prioritaires':
					decoded === 'transport . avion . impact'
						? ['transport . avion . forçage radiatif']
						: null,
				prioritaires:
					decoded === 'transport . ferry . empreinte du voyage'
						? ['transport . ferry . distance aller . orthodromique']
						: null,
			},
		},
		configSet = useSelector((state) => state.simulation?.config)
	const wrongConfig = !eqValues(config.objectifs, configSet?.objectifs || [])
	useEffect(
		() =>
			wrongConfig
				? dispatch(setSimulationConfig(config, pathname))
				: () => null,
		[]
	)

	if (!configSet || wrongConfig) return null

	return <SimulateurContent objective={decoded} />
}

const SimulateurContent = ({ objective }) => {
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

	const nextQuestions = useNextQuestions(),
		answeredQuestions = useSelector(answeredQuestionsSelector)
	const messages = useSelector((state) => state.simulation?.messages)

	const isMainSimulation = objective === 'bilan'

	const gameOver = evaluation.nodeValue > limit
	const answeredRatio =
		answeredQuestions.length / (answeredQuestions.length + nextQuestions.length)

	const doomColor =
		evaluation.nodeValue &&
		getBackgroundColor(evaluation.nodeValue).toHexString()

	console.log(
		'EVAL',
		engine.evaluate('bilan').nodeValue,
		categories.map((cat) => Math.round(cat.nodeValue) + ' ' + cat.dottedName)
	)

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
			{isMainSimulation && false && (
				<div
					css={`
						padding: 0.6rem 1rem;
						margin: 2rem auto;
						max-width: 30rem;
						border: 10px solid red;
					`}
				>
					<p>⚠️ Ce calculateur n'est pas encore prêt ni publié.</p>
					<p>
						L'idée est là, mais l'expérience utilisateur n'est pas testée
						encore.
					</p>
				</div>
			)}
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
					title={rule.exposé?.titre || rule.titre}
					description={rule.exposé?.description || rule.description}
					image={
						rule.exposé?.image ||
						'https://futur.eco' +
							`/api/og-image?title=${rule.exposé?.titre || rule.titre}&emojis=${
								rule.icônes
							}`
					} // we could simply render SVG emojis, but SVG images don't work in og tags, we'll have to convert them
				/>

				{!isMainSimulation && (
					<SimulationResults {...{ ...rule, ...evaluation }} />
				)}

				{isMainSimulation && gameOver ? (
					<Navigate to="/fin" />
				) : (
					<Simulation
						noFeedback
						orderByCategories={categories.reverse()}
						customEnd={
							rule.description ? (
								<CustomSimulateurEnding rule={rule} dottedName={objective} />
							) : (
								<EndingCongratulations />
							)
						}
						explanations={null}
					/>
				)}
			</div>
			{objective === 'transport . ferry . empreinte du voyage' && (
				<details
					css={`
						visibility: hidden;
					`}
				>
					<summary>Modèle de volume du bateau type</summary>

					<Lab />
				</details>
			)}
			<div
				css={`
					margin-top: 2rem;
					text-align: center;
					a {
						display: flex;
						align-items: center;
						justify-content: center;
						text-decoration: none;
						color: var(--lighterColor);
						opacity: 0.5;
						font-size: 90%;
						text-transform: uppercase;
					}
				`}
			>
				<Link to={'/documentation/' + utils.encodeRuleName(objective)}>
					<Emoji ee="⚙️" /> Comprendre le calcul
				</Link>
			</div>
		</div>
	)
}

const EndingCongratulations = () => (
	<h3>
		<Emoji e="🌟" /> Vous avez complété cette simulation
	</h3>
)

export default Simulateur
