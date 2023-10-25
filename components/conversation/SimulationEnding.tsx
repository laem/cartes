import AvionExplanation from '../AvionExplanation'
import Emoji from '../Emoji'

const ShareButton = dynamic(() => import('Components/ShareButton'), {
	ssr: false,
})

import { title } from '../utils/publicodesUtils'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'

const SimulationEnding = ({ rule, engine, objectives }) => {
	const avion = objectives[0] === 'transport . avion . impact'
	return (
		<div style={{ textAlign: 'center' }}>
			<>
				<h3>
					<Emoji e={'🌟'} /> Vous avez complété cette simulation
				</h3>
				{!avion && (
					<p>
						Vous avez maintenant accès à l'estimation la plus précise possible.
					</p>
				)}
				<ShareButton {...{ text: title(rule) }} />
				{avion && <AvionExplanation engine={engine} />}{' '}
			</>
		</div>
	)
}

export default SimulationEnding
