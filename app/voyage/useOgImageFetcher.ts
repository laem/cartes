import { useState, useEffect } from 'react'

export default function useOgImageFetcher(url) {
	const [ogImages, setOGImages] = useState({})

	useEffect(() => {
		if (!url) return
		const fetchOgImage = async () => {
			try {
				// Fetch HTML content of the given webpage
				const response = await fetch(
					'/voyage/getOgImage?url=' + encodeURIComponent(url)
				)
				const { ogImageContent = null } = await response.json()
				console.log('OOOO', ogImageContent)

				const fullImage = ogImageContent?.match(/https?:\/\//g)
					? ogImageContent
					: ogImageContent.startsWith('/')
					? url + ogImageContent
					: null

				console.log(ogImageContent, fullImage)

				// Update the state with the found og:image content
				setOGImages((ogImages) => ({ ...ogImages, [url]: fullImage }))
			} catch (error) {
				console.error('Error fetching OG image :', error)
			}
		}

		// Call the fetchOGImage function when the component mounts
		fetchOgImage()
	}, [url, setOGImages])

	return ogImages
}
