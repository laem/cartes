import { JSDOM } from 'jsdom'

export async function GET(request) {
	const requestUrl = new URL(request.url),
		url = requestUrl.searchParams.get('url')
	const response = await fetch(decodeURIComponent(url))
	const html = await response.text()

	// Create a DOM element to parse the HTML
	const doc = new JSDOM(html).window.document

	// Find the og:image meta tag's content using querySelector
	const ogImageTag = doc.querySelector('meta[property="og:image"]')
	const ogImageContent = ogImageTag && ogImageTag.getAttribute('content')

	console.log(ogImageContent)

	if (ogImageContent) return Response.json({ ogImageContent })

	const firstImage = doc.querySelector('img')
	if (firstImage)
		return Response.json({ ogImageContent: firstImage.getAttribute('src') })
	return Response.json({ ogImageContent: null })
}
