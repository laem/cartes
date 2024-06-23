// Server components here
import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface'
import { Props } from 'next/script'
import Container from './Container'
import { stepOsmRequest } from './stepOsmRequest'
import getName from './osm/getName'
import fetchOgImage from '@/components/fetchOgImage'
import getUrl from './osm/getUrl'
import { gtfsServerUrl } from './serverUrls'
import { decodeTransportsData } from './transport/decodeTransportsData'
import {
	getLinesSortedByFrequency,
	getTransitFilter,
	transitFilters,
} from './transport/TransitFilter'

export async function generateMetadata(
	{ params, searchParams }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	if (searchParams.style === 'elections')
		return {
			title:
				'Cartes des circonscriptions et des candidat(e)s aux législatives 2024',
			description:
				'Quelle est ma circonscription ? Qui sont mes candidats et candidates ? Trouvez en un clic votre circonscription et la liste des candidats pour le vote des législatives 2024 le 30 juin 2024',
			openGraph: {
				images: ['/circonscriptions-candidats.png'],
			},
		}
	if (searchParams.transports === 'oui' && searchParams.agence != null) {
		const url = `${gtfsServerUrl}/agencyArea/${searchParams.agence}`

		const request = await fetch(url)
		const json = await request.json()
		const [
			,
			{
				agency: { agency_name },
				features,
			},
		] = decodeTransportsData([searchParams.agence, json])

		const lines = features.filter(
			(feature) =>
				feature && feature.geometry?.type === 'LineString' && feature.properties
		)
		const heavyFilter = getTransitFilter((key) =>
				['tram', 'métro'].includes(key)
			).filter,
			hasHeavy = lines.filter((feature) => heavyFilter(feature)).length > 0

		const transportType = hasHeavy ? `transport (bus, tram, métro)` : 'bus'
		const mainLines = getLinesSortedByFrequency(lines).slice(0, 10),
			mainLinesNames = mainLines.map(
				({ properties }) => properties.route_short_name
			)
		return {
			title: `Plan du réseau de ${transportType} ${agency_name}`,
			description: `Plan complet des lignes de transport en commun du réseau de ${transportType} ${agency_name} : lignes ${mainLinesNames.join(
				', '
			)}`,
		}
	}

	const allez = searchParams.allez?.split('->')

	if (!allez?.length) return null
	const vers = allez[allez.length - 1]
	const step = await stepOsmRequest(vers)

	if (!step) return null

	const tags = step.osmFeature?.tags || {}
	console.log('TAGS', tags)
	const title = step.name || getName(tags),
		description = tags.description

	const image = tags.image || (await fetchOgImage(getUrl(tags)))

	const metadata = {
		title: title,
		description,
		openGraph: {
			images: [image],
		},
	}
	console.log('METADATA', metadata)
	return metadata
}
const Page = ({ searchParams }) => {
	return (
		<main
			style={{
				height: '100%',
				background: '#dfecbe',
				minHeight: '100vh',
			}}
		>
			<Container searchParams={searchParams} />
		</main>
	)
}

export default Page
