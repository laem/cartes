'use client'
import IntermediateMessage from '@/components/bilan/IntermediateMessage'
import { useEngine2 } from '@/providers/EngineWrapper'
import CustomSimulateurEnding from 'Components/CustomSimulateurEnding'
import Emoji from 'Components/Emoji'
import Lab from 'Components/ferry/Lab'
import FuturecoMonochrome from 'Components/FuturecoMonochrome'
import Simulation from 'Components/Simulation'
import SimulationResults from 'Components/SimulationResults'
import { getBackgroundColor, limit } from 'Components/testColors'
import { extractCategories } from 'Components/utils/publicodesUtils'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { utils } from 'publicodes'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const SimulateurContent = ({ objectives, rules, config, searchParams }) => {
	const objective = objectives[0]
	const rule = rules[objective]

	const engine = useEngine2(rules)
	const isMainSimulation = objective === 'bilan'
	const evaluation = engine.evaluate(objective),
		dispatch = useDispatch(),
		categories = isMainSimulation && extractCategories(rules, engine)

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

	const gameOver = evaluation.nodeValue > limit

	const doomColor =
		evaluation.nodeValue &&
		getBackgroundColor(evaluation.nodeValue).toHexString()

	if (isMainSimulation) {
		return <IntermediateMessage engine={engine} />
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
					<SimulationResults
						{...{
							...rule,
							...evaluation,
							engine,
							rules,
							searchParams,
							objectives,
						}}
					/>
				)}

				{isMainSimulation && gameOver ? (
					<Navigate to="/fin" />
				) : (
					<Simulation
						{...{
							rules,
							engine,
							noFeedback: true,
							orderByCategories: categories,
							objectives,
							searchParams,
							customEnd: rule.description ? (
								<CustomSimulateurEnding
									rule={rule}
									dottedName={objectives}
									engine={engine}
								/>
							) : (
								<EndingCongratulations />
							),
							explanation: null,
						}}
					/>
				)}
			</div>
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
