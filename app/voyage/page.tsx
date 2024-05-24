// Server components here
import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface'
import { Props } from 'next/script'
import Container from './Container'
import { stepOsmRequest } from './stepOsmRequest'

export async function generateMetadata(
	{ params, searchParams }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	console.log('will METADATA')
	const allez = searchParams.allez.split('->')

	if (!allez.length) return null
	const vers = allez[allez.length - 1]
	const step = await stepOsmRequest(vers)
	if (!step) return null

	const title = step.name || step.osmFeature?.name,
		description = 'blabla',
		image = `https://cavedupalais.shop/cdn/shop/files/grande-chartreuse-verte-55-35cl_460x@2x.jpg?v=1683104268`

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
		<main id="voyage" style={{ height: '100%' }}>
			<Container searchParams={searchParams} />
		</main>
	)
}

export default Page
