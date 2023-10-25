import AvionExplanation from '../AvionExplanation'
import Emoji from '../Emoji'

import ShareButton from 'Components/ShareButton'
import { title } from '../utils/publicodesUtils'
import { Suspense } from 'react'

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
				<Suspense fallback={<span>Chargement du bouton de partage...</span>}>
					<ShareButton {...{ text: title(rule) }} />
				</Suspense>
				{avion && <AvionExplanation engine={engine} />}{' '}
			</>
		</div>
	)
}

export default SimulationEnding
