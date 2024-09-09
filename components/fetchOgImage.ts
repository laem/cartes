import { getFetchUrlBase } from '@/app/serverUrls'

export default async (url) => {
	if (!url) return null
	try {
		// Fetch HTML content of the given webpage
		const urlBase = getFetchUrlBase()

		const response = await fetch(
			urlBase + '/getOgImage?url=' + encodeURIComponent(url)
		)
		const { ogImageContent = null } = await response.json()
		console.log('OOOO', ogImageContent)

		if (ogImageContent == null) return null
		const fullImage = ogImageContent?.match(/https?:\/\//g)
			? ogImageContent
			: ogImageContent.startsWith('/')
			? url + ogImageContent
			: null

		console.log(ogImageContent, fullImage)

		return fullImage
	} catch (error) {
		console.error('Error fetching OG image :', error)
	}
}
