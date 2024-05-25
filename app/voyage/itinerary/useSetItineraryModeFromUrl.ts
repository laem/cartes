import { useEffect } from 'react'

export default function useItineraryFromUrl(allez, setItineraryMode) {
	useEffect(() => {
		if (allez.length < 2) return

		setItineraryMode(true)
	}, [allez, setItineraryMode])
}
