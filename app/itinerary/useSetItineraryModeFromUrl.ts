import { useEffect } from 'react'

export default function useItineraryFromUrl(allez, setIsItineraryMode) {
	useEffect(() => {
		if (allez.length < 2) return

		setIsItineraryMode(true)
	}, [allez, setIsItineraryMode])
}
