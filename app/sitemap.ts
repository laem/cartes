import type { MetadataRoute } from 'next'
import { allArticles } from '@/.contentlayer/generated'
import { getRecentInterestingNodes } from '@/components/watchOsmPlaces.ts'
import { gtfsServerUrl } from './serverUrls'
import { getLastEdit } from './blog/utils'

export const domain = 'https://cartes.app'

const basePaths = [
	'',
	'/blog',
	'/elections-legislatives-2024',
	'/presentation',
	'/presentation/state-of-the-map-2024',
	'/itineraire',
	'/transport-en-commun',
]

const generateAgencies = async () => {
	try {
		const request = await fetch(gtfsServerUrl + '/agencies')
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
	const isVercel = process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL
	let newNodes = []
	if (isVercel) {
		newNodes = await getRecentInterestingNodes()
	}

	const blogEntries = await Promise.all(
		allArticles.map(async ({ url, date, _raw: { flattenedPath } }) => {
			const lastEdit = await getLastEdit(flattenedPath)

			return {
				url: escapeXml(domain + url),
				lastModified: new Date(lastEdit),
			}
		})
	)
	const agencies = await generateAgencies()
	const entries = [
		...[...basePaths, ...agencies].map((path) => ({
			url: escapeXml(domain + path),
		})),
		...blogEntries,
		...newNodes,
	]
	return entries
}

export function escapeXml(unsafe) {
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
