import { useEffect } from 'react'

export default function useItineraryFromUrl(allez, setItineraryMode, map) {
	useEffect(() => {
		if (!map || allez == null) return

		setItineraryMode(true)
	}, [allez, setItineraryMode, map])
}
