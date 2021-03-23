import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { useEffect, useState } from 'react'

const ydoc = new Y.Doc()
// clients connected to the same room-name share document updates
const provider = new WebrtcProvider('bamboche', ydoc, {})
const yarray = ydoc.get('simulations', Y.Array)

export default () => {
	const [elements, setElements] = useState([])

	useEffect(() => {
		yarray.observe((event) => {
			setElements(yarray.toJSON())
		})
	}, [])
	return (
		<div>
			Conférence
			<button onClick={() => yarray.insert(0, [Math.random()])}>allez</button>
			<ul>
				{elements.map((el) => (
					<li key={el}>{el}</li>
				))}
			</ul>
		</div>
	)
}
