'use client'
import { useEngine2 } from '@/providers/EngineWrapper'
import { answeredQuestionsSelector } from '@/selectors/simulationSelectors'
import {
	Almost,
	Done,
	Half,
	NotBad,
	QuiteGood,
} from 'Components/Congratulations'
import CustomSimulateurEnding from 'Components/CustomSimulateurEnding'
import Emoji from 'Components/Emoji'
import Lab from 'Components/ferry/Lab'
import FuturecoMonochrome from 'Components/FuturecoMonochrome'
import Simulation from 'Components/Simulation'
import SimulationResults from 'Components/SimulationResults'
import { getBackgroundColor, limit } from 'Components/testColors'
import { extractCategories } from 'Components/utils/publicodesUtils'
import { useNextQuestions } from 'Components/utils/useNextQuestion'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { utils } from 'publicodes'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const SimulateurContent = ({ objective, rules }) => {
	console.log('OBJ', objective)
	const rule = rules[objective]

	const engine = useEngine2(rules)
	const evaluation = engine.evaluate(objective),
		dispatch = useDispatch(),
		categories = objective === 'bilan' && extractCategories(rules, engine)

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

	const nextQuestions = useNextQuestions(engine),
		answeredQuestions = useSelector(answeredQuestionsSelector)

	const messages = useSelector((state) => state.simulation?.messages)

	const isMainSimulation = objective === 'bilan'

	const gameOver = evaluation.nodeValue > limit
	const answeredRatio =
		answeredQuestions.length / (answeredQuestions.length + nextQuestions.length)

	const doomColor =
		evaluation.nodeValue &&
		getBackgroundColor(evaluation.nodeValue).toHexString()

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
				<Link href="/">
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
				{!isMainSimulation && (
					<SimulationResults {...{ ...rule, ...evaluation, engine, rules }} />
				)}

				{isMainSimulation && gameOver ? (
					<Navigate to="/fin" />
				) : (
					<Simulation
						rules={rules}
						engine={engine}
						noFeedback
						orderByCategories={categories}
						customEnd={
							rule.description ? (
								<CustomSimulateurEnding
									rule={rule}
									dottedName={objective}
									engine={engine}
								/>
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
				<Link href={'/documentation/' + utils.encodeRuleName(objective)}>
					<Emoji e="⚙️" /> Comprendre le calcul
				</Link>
			</div>
		</div>
	)
}

//TODO add metadata https://nextjs.org/docs/app/building-your-application/optimizing/metadata
//
export default SimulateurContent

export const EndingCongratulations = () => (
	<h3>
		<Emoji e="🌟" /> Vous avez complété cette simulation
	</h3>
)

const Navigate = ({ to }) => {
	const router = useRouter()

	useEffect(() => {
		router.push(to)
	}, [to])

	return null
}
