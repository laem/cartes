import AvionExplanation from '../AvionExplanation'
import Emoji from '../Emoji'

const ShareButton = dynamic(() => import('Components/ShareButton'), {
	ssr: false,
})

import { title } from '../utils/publicodesUtils'
import dynamic from 'next/dynamic'
import { ogImageURL } from '@/app/voyage/cout-voiture/ogImageUrl'
import Image from 'next/image'

const SimulationEnding = ({
	rule,
	engine,
	objectives,
	query,
	searchParams,
}) => {
	const avion = objectives[0] === 'transport . avion . impact'
	const coutVoitureDottedName =
		'voyage . trajet voiture . coût trajet par personne'
	const coutVoiture = objectives[0] === coutVoitureDottedName
	return (
		<div style={{ textAlign: 'center' }}>
			<>
				{Object.keys(query).length > 0 && (
					<>
						<Emoji e={'🌟'} customSizeEm={3.5} />
						<p>Vous avez terminé votre simulation. Partagez-là !</p>
					</>
				)}
				{coutVoiture && (
					<Image
						src={ogImageURL(
							coutVoitureDottedName,
							rule.rawNode.icônes,
							searchParams
						)}
						width="300"
						height="200"
					/>
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
