import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import emoji from 'react-easy-emoji'
export default () => {
	const [elements, setElements] = useState([])
	const [newRoom, setNewRoom] = useState(null)
	const { room } = useParams()

	useEffect(() => {
		if (!room) return null
		const ydoc = new Y.Doc()
		const id = ydoc.clientID

		console.log(id)
		// clients connected to the same room-name share document updates
		const provider = new WebrtcProvider(room, ydoc, {})
		const yarray = ydoc.get('simulations', Y.Array)
		yarray.observe((event) => {
			setElements(yarray.toJSON())
		})
	}, [])
	return (
		<div>
			<h1>🏟️ Conférence</h1>
			<p>Vie privée blabla</p>
			{room && (
				<div>
					<p>
						Partagez <a href={'/conférence/' + room}>ce lien</a> avec vos amis,
						collègues, etc.
					</p>
					<p css="color: #78b159; font-weight: bold">
						{emoji('🟢')} {Math.round(Math.random() * 10)} clients connectés
					</p>
				</div>
			)}
			{!room && (
				<label>
					<p>Choisissez un nom de salle</p>
					<input
						placeholder="chaton-hurlant-29"
						value={newRoom}
						onChange={(e) => setNewRoom(e.target.value)}
					/>
					{newRoom && (
						<Link to={'/conférence/' + newRoom}>
							<button>C'est parti ! </button>
						</Link>
					)}
				</label>
			)}
			<br />
			<br />
			<br />
			<br />
			<button onClick={() => yarray.insert(0, [Math.random()])}>allez</button>
			<ul>
				{elements.map((el) => (
					<li key={el}>{el}</li>
				))}
			</ul>
		</div>
	)
}
