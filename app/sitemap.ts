import type { MetadataRoute } from 'next'
import { getAllPostIds } from '@/app/blog/getPosts'

const domain = 'https://cartes.app'

const basePaths = [
	'',
	'/blog',
	'/elections-legislatives-2024',
	'/presentation',
	'/presentation/state-of-the-map-2024',
]

const gtfsUrl = 'https://motis.cartes.app/gtfs'

const generateAgencies = async () => {
	try {
		const request = await fetch(gtfsUrl + '/agencies')
		const json = await request.json()

		return json.agencies.map(
			({ agency_id }) => `/?transports=oui&agence=${agency_id}`
		)
	} catch (e) {
		console.error('Error generating agency sitemap')
		console.error(e)
	}
}

export default async function sitemap(): MetadataRoute.Sitemap {
	const blogEntries = getAllPostIds().map(({ params: { id } }) => '/blog/' + id)
	const agencies = await generateAgencies()
	const entries = [...basePaths, ...blogEntries, ...agencies].map((path) => ({
		url: escapeXml(domain + path),
		lastModified: new Date(),
		changeFrequency: 'weekly',
	}))
	console.log('Sitemap', entries)
	return entries
}

function escapeXml(unsafe) {
	return unsafe.replace(/[<>&'"]/g, function (c) {
		switch (c) {
			case '<':
				return '&lt;'
			case '>':
				return '&gt;'
			case '&':
				return '&amp;'
			case "'":
				return '&apos;'
			case '"':
				return '&quot;'
		}
	})
}
