import { correctValue } from 'Components/publicodesUtils'
import { useEngine } from 'Components/utils/EngineContext'
import { usePersistingState } from 'Components/utils/persistState'
import { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { situationSelector } from 'Selectors/simulationSelectors'
import { WebrtcProvider } from 'y-webrtc'
import * as Y from 'yjs'
import { useSimulationProgress } from '../../../components/utils/useNextQuestion'
import { extractCategories } from '../chart'
import { computeHumanMean } from './Stats'

export default () => {
	const conference = useSelector((state) => state.conference)

	const { room, ydoc, provider } = conference

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

	const simulations = ydoc.get('simulations', Y.Map)

	const awareness = provider.awareness

	useEffect(() => {
		console.log('useeffect with ?', conference)
		if (!conference) {
			const ydoc = new Y.Doc()
			const provider = new WebrtcProvider(room, ydoc, {})
			dispatch({ type: 'SET_CONFERENCE', room, ydoc, provider })
		} else {
			awareness.on('change', (changes) => {
				// Whenever somebody updates their awareness information,
				// we log all awareness information from all users.
				setUsers(Array.from(awareness.getStates().values()))
			})
			simulations.observe((event) => {
				setElements(simulations.toJSON())
				console.log('SIMULATIONS', simulations.toJSON())
			})
		}
	}, [room, conference])

	useEffect(() => {
		if (!conference) return null

		const simulations = ydoc.get('simulations', Y.Map)

		simulations.set(username, { bilan: nodeValue, progress, byCategory })
	}, [situation])

	if (!conference) return <Link to="/conférence">Lancer une conférence</Link>

	const simulationArray = elements && Object.values(elements),
		result = computeHumanMean(simulationArray.map((el) => el.bilan))

	return (
		<Link to={'/conférence/' + room} css="text-decoration: none;">
			<div
				css={`
					background: linear-gradient(
						90deg,
						white -10%,
						var(--color) 10%,
						#b71540 90%,
						white 110%
					);
					color: white;
					padding: 0.3rem 1rem;
					display: flex;
					justify-content: space-evenly;
					align-items: center;
					> span {
						display: flex;
						align-items: center;
					}
					img {
						font-size: 150%;
						margin-right: 0.4rem !important;
					}
				`}
			>
				<span>
					{emoji('🏟️')} {room}
				</span>
				<span>
					{emoji('🧮')} {result}
				</span>
				<span>
					{emoji('👥')}{' '}
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
