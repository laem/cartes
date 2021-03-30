import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { correctValue } from '../../components/publicodesUtils'
import { useEngine } from '../../components/utils/EngineContext'
import { situationSelector } from '../../selectors/simulationSelectors'
import * as Y from 'yjs'
import { usePersistingState } from '../../components/utils/persistState'

export default () => {
	const conference = useSelector((state) => state.conference)
	const [users, setUsers] = useState([])

	const situation = useSelector(situationSelector),
		engine = useEngine(),
		evaluation = engine.evaluate('bilan'),
		{ nodeValue: rawNodeValue, dottedName, unit, rawNode } = evaluation

	const nodeValue = correctValue({ nodeValue: rawNodeValue, unit })
	const [username, setUsername] = usePersistingState('pseudo')

	const [elements, setElements] = useState([])

	useEffect(() => {
		if (!conference) return null
		const simulations = conference.ydoc.get('simulations', Y.Map)

		simulations.set(username, nodeValue)
		console.log('SET', username, nodeValue)
	}, [situation])

	useEffect(() => {
		if (!conference) return null

		conference.provider.awareness.on('change', (changes) => {
			// Whenever somebody updates their awareness information,
			// we log all awareness information from all users.
			setUsers(Array.from(awareness.getStates().values()))
		})
		const simulations = conference.ydoc.get('simulations')
		simulations.observe((event) => {
			setElements(simulations.toJSON())
			console.log(simulations.toJSON())
		})
	}, [])

	if (!conference) return <Link to="/conférence">Lancer une conférence</Link>
	const { provider, ydoc, room } = conference
	const awareness = provider.awareness

	const simulations = conference.ydoc.get('simulations')

	const simulationArray = elements && Object.values(elements),
		rawResult =
			simulationArray &&
			simulationArray
				.filter((el) => el !== null)
				.reduce((memo, next) => memo + next, 0) / simulationArray.length,
		result = Math.round(rawResult / 100) / 10 + ' tonnes'

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
