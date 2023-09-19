import Emoji from '@/components/Emoji'
import { Metadata } from 'next'
import Carburants from './Carburants'
import { Header, P } from './UI'

const title = 'Comprendre le prix du carburant en France'
const description =
	"Comprendre comment le prix de l'essence et du gazole à la pompe est calculé. Prix du pétrole brut (Brent), taxes (TVA, TICPE), marges de raffinage et distribution."

const image =
	'https://futur.eco' +
	`/api/og-image?title=${'Comprendre le prix à la pompe'}&emojis=⛽️`

export const metadata: Metadata = {
	title,
	description,
	openGraph: {
		images: [image],
	},
}

export default function Page() {
	return (
		<main>
			<Header>
				<Emoji e="⛽️" />
				<h1 css="">Prix à la pompe 2022</h1>
			</Header>
			<Carburants />
			<P>
				Comprendre le calcul <Emoji e="⬇️" />
			</P>
			<P>
				Détail du calcul à venir. En attendant,{' '}
				<a href="https://github.com/laem/futureco/blob/master/app/carburants/prix-a-la-pompe/rules.yaml">
					le calcul est disponible ici
				</a>
				.
			</P>
		</main>
	)
}
