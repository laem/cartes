import Emoji from '@/components/Emoji'
import { Metadata } from 'next'
import Link from 'next/link'
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
				<h1 css="">Prix du carburant à la pompe en 2023</h1>
			</Header>
			<Carburants />
			<P>
				Comprendre le calcul <Emoji e="⬇️" />
			</P>
			<P>
				Le calcul est entièrement disponible sur la{' '}
				<Link href="/documentation/carburants/prix-à-la-pompe">
					documentation intéractive
				</Link>
				.
			</P>
			<P>
				Vous pouvez aussi consulter{' '}
				<a href="https://github.com/laem/futureco/blob/master/app/carburants/prix-a-la-pompe/rules.yaml">
					le code source complet du modèle de calcul
				</a>
				.
			</P>
		</main>
	)
}
