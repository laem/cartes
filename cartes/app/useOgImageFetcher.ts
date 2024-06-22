import fetchOgImage from 'Components/fetchOgImage'
import { useState, useEffect } from 'react'

export default function useOgImageFetcher(url) {
	const [ogImages, setOGImages] = useState({})

	useEffect(() => {
		if (!url) return

		const asyncFetch = async () => {
			const fullImage = await fetchOgImage(url)

			// Update the state with the found og:image content
			setOGImages((ogImages) => ({ ...ogImages, [url]: fullImage }))
		}
		asyncFetch()
	}, [url, setOGImages])

	return ogImages
}
