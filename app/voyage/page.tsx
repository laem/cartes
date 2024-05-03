import { Metadata } from 'next'
import dynamic from 'next/dynamic'
const Map = dynamic(() => import('./Map'), {
	ssr: false,
})

const title = `Voyagez, autrement.`
const description1 =
	"Comment voyager sans voiture ? Comment gérer les derniers kilomètres après l'arrivée à la gare ? Comment se déplacer pendant le weekend ? Où louer une voiture ou un vélo ? On vous guide, pour que le voyage sans voiture personnelle soit un plaisir."

export const objectives = ['voyage . trajet voiture . coût trajet par personne']

export async function generateMetadata(
	{ params, searchParams }: Props,
	parent?: ResolvingMetadata
): Promise<Metadata> {
	const image = `/voyagevoyage.png`
	return {
		title,
		description: description1,
		openGraph: {
			images: [image],
			type: 'article',
			publishedTime: '2023-11-01T00:00:00.000Z',
		},
	}
}

const Page = ({ searchParams }) => (
	<main id="voyage" style={{ height: '100%' }}>
		<Map searchParams={searchParams} />
	</main>
)

export default Page
