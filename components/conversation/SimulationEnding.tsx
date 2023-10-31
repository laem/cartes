import AvionExplanation from '../AvionExplanation'
import Emoji from '../Emoji'

const ShareButton = dynamic(() => import('Components/ShareButton'), {
	ssr: false,
})

import { title } from '../utils/publicodesUtils'
import dynamic from 'next/dynamic'

const SimulationEnding = ({ rule, engine, objectives, query }) => {
	const avion = objectives[0] === 'transport . avion . impact'
	return (
		<div style={{ textAlign: 'center' }}>
			<>
				{Object.keys(query).length > 0 && (
					<>
						<Emoji e={'🌟'} customSizeEm={3.5} />
						<p>Vous avez terminé votre simulation. Partagez-là !</p>
					</>
				)}
				<ShareButton {...{ text: title(rule) }} />
				{avion && (
					<AvionExplanation
						engine={engine}
						description={rule.rawNode.description}
					/>
				)}
			</>
		</div>
	)
}

export default SimulationEnding
