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
import { stringToColour, getRandomInt, generateRoomName } from './utils'
import Checkbox from '../../../components/ui/Checkbox'
import ShareButton from '../../../components/ShareButton'

export default () => {
	const [elements, setElements] = useState([])
	const [users, setUsers] = useState([])
	const [newRoom, setNewRoom] = useState(generateRoomName())
	const { room } = useParams()
	const [username, setUsername] = usePersistingState(
		'pseudo',
		fruits[getRandomInt(fruits.length)]
	)

	const dispatch = useDispatch()

	const conference = useSelector((state) => state.conference)

	useEffect(() => {
		if (!conference) {
			const ydoc = new Y.Doc()
			const provider = new WebrtcProvider(room, ydoc, {})
			dispatch({ type: 'SET_CONFERENCE', room, ydoc, provider })
		} else {
			console.log('yo')
			const { room } = conference

			const ydoc = conference.ydoc,
				provider = conference.provider

			const awareness = provider.awareness

			setUsers(Array.from(awareness.getStates().values()))

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
				color: stringToColour(username), // should be a hex color
			})
			const simulations = conference.ydoc.get('simulations', Y.Map)
			setElements(simulations.toJSON())
			simulations.observe((event) => {
				console.log('did observe from Conf', event)
				setElements(simulations.toJSON())
			})
		}
	}, [room, conference])

	return (
		<div>
			<h1>
				{emoji('🏟️ ')} Conférence
				<span
					css={`
						margin-left: 1rem;
						background: var(--color);
						color: var(--textColor);
						padding: 0.1rem 0.4rem;
						border-radius: 0.6rem;
					`}
				>
					beta
				</span>
			</h1>
			<Stats {...{ elements, users, username }} />

			{room && (
				<div>
					<UserBlock {...{ users, username, room }} />
				</div>
			)}
			<Instructions {...{ room, newRoom, setNewRoom }} />
			<h2>Et mes données ?</h2>
			<p>
				{emoji('🕵 ')}En participant, vous acceptez de partager vos résultats
				agrégés de simulation avec les autres participants de la conférence : le
				total et les catégories (transport, logement, etc.). En revanche, nos
				serveurs ne les stockent pas : cela fonctionne en P2P (pair à pair).
			</p>
			<p>
				Seul le nom de la salle de conférence sera indexé dans{' '}
				<a href="https://nosgestesclimat.fr/vie-privée">
					les statistiques d'utilisation
				</a>{' '}
				de Nos Gestes Climat.{' '}
			</p>
		</div>
	)
}

const NamingBlock = ({ newRoom, setNewRoom }) => (
	<>
		<label>
			<form>
				<input
					value={newRoom}
					className="ui__"
					onChange={(e) => setNewRoom(e.target.value)}
					css="width: 90% !important"
				/>{' '}
			</form>
		</label>

		<button
			onClick={() => setNewRoom(generateRoomName())}
			className="ui__ dashed-button"
		>
			{emoji('🔃')} Générer un autre nom
		</button>

		{newRoom && newRoom.length < 10 && (
			<p>
				⚠️ Votre nom de salle est court, vous risquez de vous retrouver avec des
				inconnus...
			</p>
		)}
	</>
)

const UserBlock = ({ users, username, room }) => (
	<div>
		<h2 css="display: inline-block ;margin-right: 1rem">
			{emoji('👤 ')}
			Qui est connecté ?
		</h2>
		<span css="color: #78b159; font-weight: bold">
			{emoji('🟢')} {users.length} participant{plural(users)}
		</span>
		<UserList users={users} username={username} />
	</div>
)

const InstructionBlock = ({ title, index, children }) => (
	<div
		className="ui__ card"
		css={`
			display: flex;
			justify-content: start;
			align-items: center;
			margin: 1rem;
			padding-bottom: 0.6rem;
			@media (max-width: 800px) {
				flex-direction: column;
			}
		`}
	>
		<div
			css={`
				font-size: 300%;
				padding: 1rem;
				background: var(--lighterColor);
				border-radius: 5rem;
				margin: 0 1rem;
			`}
		>
			{index}
		</div>
		<div>
			<h3>{title}</h3>
			{children}
		</div>
	</div>
)
const Instructions = ({ room, newRoom, setNewRoom }) => (
	<div>
		<p>Faites le test à plusieurs ! </p>
		<h2>Comment ça marche ?</h2>
		<InstructionBlock
			index="1"
			title={
				<span>
					{emoji('💡 ')} Choisissez un nom de salle pour la lancer ou rejoindre
				</span>
			}
		>
			{!room && <NamingBlock {...{ newRoom, setNewRoom }} />}
		</InstructionBlock>
		<InstructionBlock
			index="2"
			title={
				<span>
					{emoji('🔗 ')} Partagez{' '}
					{room ? <a href={'/conférence/' + room}>ce lien</a> : 'le lien '}
					avec vos amis, collègues, etc.
				</span>
			}
		>
			<ShareButton
				text="Faites un test d'empreinte climat avec moi"
				url={
					'https://' + window.location.hostname + '/conférence/' + newRoom ||
					room
				}
				title={'Nos Gestes Climat Conférence'}
			/>
		</InstructionBlock>
		<InstructionBlock
			index="3"
			title={<span>{emoji('👆 ')} Faites tous et toutes votre simulation</span>}
		>
			Au moment convenu, ouvrez ce lien tous en même temps et commencez&nbsp;
			<Link to={'/simulateur/bilan'}>
				<button className="ui__ link-button">votre simulation</button>
			</Link>
			.
		</InstructionBlock>
		<InstructionBlock
			index="4"
			title={
				<span>
					{emoji('🧮 ')}Visualisez ensemble les résultats de votre groupe
				</span>
			}
		>
			Les résultats pour chaque catégorie (alimentation, transport, logement
			...) s'affichent progressivement et en temps réel pour l'ensemble du
			groupe.
		</InstructionBlock>
		{newRoom !== '' && (
			<InstructionBlock index="5" title="Prêt à démarrer ?">
				<p>
					<Link to={'/conférence/' + newRoom}>
						<button type="submit" className="ui__ button small plain">
							C'est parti !{' '}
						</button>
					</Link>
				</p>
			</InstructionBlock>
		)}
	</div>
)

const plural = (list) => (list.length > 1 ? 's' : '')
