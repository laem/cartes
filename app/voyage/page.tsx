// Server components here
import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface'
import { Props } from 'next/script'
import Container from './Container'
import { stepOsmRequest } from './stepOsmRequest'
import getName from './osm/getName'
import fetchOgImage from '@/components/fetchOgImage'
import getUrl from './osm/getUrl'

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

	console.log('will METADATA')
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
