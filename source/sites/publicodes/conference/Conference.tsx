import { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { WebrtcProvider } from 'y-webrtc'
import * as Y from 'yjs'
import { usePersistingState } from 'Components/utils/persistState'
import fruits from './fruits.json'
import UserList from './UserList'
import { mean } from 'ramda'
import Stats from './Stats'

const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max))
const getRandomColor = () =>
	'#' + Math.floor(Math.random() * 16777215).toString(16)

export default () => {
	const [elements, setElements] = useState([])
	const [users, setUsers] = useState([])
	const [newRoom, setNewRoom] = useState(null)
	const { room } = useParams()
	const [username, setUsername] = usePersistingState(
		'pseudo',
		fruits[getRandomInt(fruits.length)]
	)

	const dispatch = useDispatch()

	const conference = useSelector((state) => state.conference)

	useEffect(() => {
		console.log('will dispatch')
		dispatch({ type: 'SET_CONFERENCE', room })
	}, [room])

	useEffect(() => {
		if (!conference) return null
		const { provider, ydoc, room } = conference

		const awareness = provider.awareness

		// You can observe when a any user updated their awareness information
		awareness.on('change', (changes) => {
			// Whenever somebody updates their awareness information,
			// we log all awareness information from all users.
			setUsers(Array.from(awareness.getStates().values()))
		})

		awareness.setLocalState({
			// Define a print name that should be displayed
			name: username,
			// Define a color that should be associated to the user:
			color: getRandomColor(), // should be a hex color
		})
		const simulations = ydoc.get('simulations', Y.Map)
		simulations.observe((event) => {
			setElements(simulations.toJSON())
		})
	}, [conference])

	return (
		<div>
			<h1>{emoji('🏟️ ')} Conférence</h1>
			<Stats {...{ elements, users, username }} />

			{room && <Instructions {...{ users, username }} />}
			{!room && (
				<label>
					<p>Choisissez un nom de salle</p>
					<input
						placeholder="chaton-hurlant-29"
						value={newRoom}
						onChange={(e) => setNewRoom(e.target.value)}
					/>{' '}
					{newRoom && (
						<Link to={'/conférence/' + newRoom}>
							<button className="ui__ button small">C'est parti ! </button>
						</Link>
					)}
				</label>
			)}
			<h2>Et mes données ?</h2>
			<p>
				{emoji('🕵 ')}En participant, vous acceptez de partager vos résultats
				agrégés de simulation avec les autres participants de la conférence : le
				total et les catégories (transport, logement, etc.). En revanche, nos
				serveurs ne les stockent pas.
			</p>
		</div>
	)
}

const Instructions = ({ users, username, room }) => (
	<div>
		<h2>Comment ça marche ?</h2>
		<p>
			1) {emoji('🔗 ')} Partagez <a href={'/conférence/' + room}>ce lien</a>{' '}
			avec vos amis, collègues, etc.
		</p>
		2) {emoji('👆 ')}Faites tous et toutes
		<Link to={'/simulateur/bilan'}>
			<button className="ui__ button small " css="margin-left: .6rem">
				votre simulation
			</button>
		</Link>
		<p>3) Visualisez ensemble les résultats sur cette page</p>
		<h2>Qui est déjà là ?</h2>
		<p css="color: #78b159; font-weight: bold">
			{emoji('🟢')} {users.length} collègue connecté
			{users.length > 1 ? 's' : ''}
		</p>
		<UserList users={users} username={username} />
	</div>
)
