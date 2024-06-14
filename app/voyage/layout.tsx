import css from '@/components/css/convertToJs'
import { ThemeColorsProvider } from '@/components/utils/colors'
import { Metadata } from 'next'
import StyledComponentsRegistry from '../../lib/registry'
import '../globals.css'

const title = `Cartes`
const description1 =
	'Des cartes libres et gratuites sur le Web pour trouver un commerce, un lieu, visiter une ville, calculer un trajet à pieds, en vélo, en transport en commun, en train.'

//old description to be rewritter when we really cover train+vélo
//"Comment voyager sans voiture ? Comment gérer les derniers kilomètres après l'arrivée à la gare ? Comment se déplacer pendant le weekend ? Où louer une voiture ou un vélo ? On vous guide, pour que le voyage sans voiture personnelle soit un plaisir."

export async function generateMetadata(
	{ params, searchParams }: Props,
	parent?: ResolvingMetadata
): Promise<Metadata> {
	const image = `/voyagevoyage.png`
	return {
		title,
		description: description1,
		metadataBase: new URL('https://cartes.app'),
		openGraph: {
			images: [image],
			type: 'article',
			publishedTime: '2024-05-10T00:00:00.000Z',
		},
	}
}
export default function ({ children }) {
	return (
		<html lang="fr">
			<head>
				<link
					rel="search"
					type="application/opensearchdescription+xml"
					title="Cartes"
					href="https://cartes.app/cartes-search.xml"
				/>
			</head>
			<body>
				<StyledComponentsRegistry>
					<ThemeColorsProvider>{children}</ThemeColorsProvider>
				</StyledComponentsRegistry>
			</body>
		</html>
	)
}
