import { useEffect, useState } from 'react'
import getCityData from '@/components/wikidata'

export default function useWikidata(state) {
	const [wikidata, setWikidata] = useState(null)
	useEffect(() => {
		if (!state.vers.choice) return undefined

		getCityData(state.vers.choice.item.ville).then((json) =>
			setWikidata(json?.results?.bindings[0])
		)
	}, [state.vers])
	return wikidata
}
