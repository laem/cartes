import { Metadata } from 'next'
import Voyage from './Voyage'
import voitures from '@/public/voitures.svg'
import Image from 'next/image'
import { Header } from './UI'

const title = 'Quel est le vrai coût de la bagnole ?'
const description =
	"Le coût d'un trajet en voiture ne se résume pas au carburant et aux péages d'autoroute. Qui alors paie l'achat, l'entretien, le parking, l'assurance ? On fait le point en quelques clics."

export const metadata: Metadata = {
	title,
	description,
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
				<p>{description}</p>
			</div>
		</Header>
		<Voyage />
	</main>
)
