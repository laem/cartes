import { correctValue } from 'Components/publicodesUtils'
import { useEngine } from 'Components/utils/EngineContext'
import { usePersistingState } from 'Components/utils/persistState'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { situationSelector } from 'Selectors/simulationSelectors'
import * as Y from 'yjs'
import { useSimulationProgress } from '../../../components/utils/useNextQuestion'
import { extractCategories } from '../chart'
import { computeHumanMean } from './Stats'

export default () => {
	const conference = useSelector((state) => state.conference)
	const [users, setUsers] = useState([])

	const situation = useSelector(situationSelector),
		engine = useEngine(),
		evaluation = engine.evaluate('bilan'),
		{ nodeValue: rawNodeValue, dottedName, unit, rawNode } = evaluation
	const rules = useSelector((state) => state.rules)

	const progress = useSimulationProgress()

	const byCategory = extractCategories(rules, engine)

	const nodeValue = correctValue({ nodeValue: rawNodeValue, unit })
	const [username, setUsername] = usePersistingState('pseudo')

	const [elements, setElements] = useState([])
	const dispatch = useDispatch()

	useEffect(() => {
		console.log('useeffect with ?', conference)
		if (!conference) {
			dispatch({ type: 'SET_CONFERENCE', room })
			return null
		}
		const simulations = conference.ydoc.get('simulations', Y.Map)

		conference.provider.awareness.on('change', (changes) => {
			// Whenever somebody updates their awareness information,
			// we log all awareness information from all users.
			setUsers(Array.from(awareness.getStates().values()))
		})
		simulations.observe((event) => {
			setElements(simulations.toJSON())
			console.log('SIMULATIONS', simulations.toJSON())
		})
	}, [conference])

	useEffect(() => {
		if (!conference) return null

		const simulations = conference.ydoc.get('simulations', Y.Map)

		simulations.set(username, { bilan: nodeValue, progress, byCategory })
	}, [situation])

	if (!conference) return <Link to="/conférence">Lancer une conférence</Link>
	const { provider, ydoc, room } = conference
	const awareness = provider.awareness

	const simulationArray = elements && Object.values(elements),
		result = computeHumanMean(simulationArray.map((el) => el.bilan))

	return (
		<Link to={'/conférence/' + room} css="text-decoration: none;">
			<div
				css={`
					background: #b71540;
					color: white;
					padding: 0.1rem 1rem;
					display: flex;
					justify-content: space-evenly;
					align-items: center;
				`}
			>
				<span>🏟️ {room}</span>
				<span>🧮 {result}</span>
				<span>
					👥{' '}
					<span
						css={`
							background: #78b159;
							width: 1.5rem;
							height: 1.5rem;
							border-radius: 2rem;
							display: inline-block;
							line-height: 1.5rem;
							text-align: center;
						`}
					>
						{users.length}
					</span>
				</span>
			</div>
		</Link>
	)
}
