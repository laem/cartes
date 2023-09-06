import { Metadata } from 'next'
import Voyage from './Voyage'
import voitures from '@/public/voitures.svg'
import Image from 'next/image'
import { Header } from './UI'
import Emoji from '@/components/Emoji'

const title = 'Quel est le vrai coût de la bagnole ?'
const description1 =
		"Le coût d'un trajet en voiture est souvent réduit à celui du carburant et des péages d'autoroute. Mais qui alors paie l'achat, l'entretien, le parking, l'assurance ?",
	description2 =
		"On fait le point en quelques clics avec le simulateur de référence du coût d'un trajet en voiture."

export const metadata: Metadata = {
	title,
	description: description1 + ' ' + description2,
	openGraph: { images: ['https://futur.eco/voitures.png'] },
}

export default () => (
	<main>
		<Header>
			<Image
				src={voitures}
				alt="Illustration de plusieurs formes d'automobiles, de la citadine au camping car"
				width="100"
				height="140"
			/>
			<div>
				<h1>{title}</h1>
				<p>{description1}</p>
				<p>
					{' '}
					<Emoji e="🔻" /> {description2}
				</p>
			</div>
		</Header>
		<Voyage />
	</main>
)
