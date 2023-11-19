import { useState, useEffect } from 'react'

export default function useOgImageFetcher(url) {
	const [ogImage, setOGImage] = useState(null)

	useEffect(() => {
		if (!url) return
		const fetchOGImage = async () => {
			try {
				// Fetch HTML content of the given webpage
				const response = await fetch(
					'/voyage/getOgImage?url=' + encodeURIComponent(url)
				)
				const { ogImageContent = null } = await response.json()

				// Update the state with the found og:image content
				setOGImage(ogImageContent)
			} catch (error) {
				console.error('Error fetching OG image :', error)
			}
		}

		// Call the fetchOGImage function when the component mounts
		fetchOGImage()
	}, [url])

	return ogImage
}
