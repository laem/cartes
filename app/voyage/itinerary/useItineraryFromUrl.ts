import { useEffect } from 'react'

export default function useItineraryFromUrl(
	searchParams,
	setItineraryMode,
	map
) {
	useEffect(() => {
		if (!map || searchParams.allez == null) return

		setItineraryMode(true)
	}, [searchParams, setItineraryMode, map])
}
