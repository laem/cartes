import { useEffect, useState } from 'react'
import { osmRequest } from '../osmRequest'
import { categoryIconUrl } from '../QuickFeatureSearch'
import useDrawQuickSearchFeatures from './useDrawQuickSearchFeatures'

export default function useDrawSearchResults(map, state) {
	// Photon search results are not full OSM objectfs, lacking tags, so lacking
	// opening times for instance
	const [features, setFeatures] = useState([])
	const { results } = state.vers
	useEffect(() => {
		if (!map) return

		if (!results) return

		const doFetch = async () => {
			const newFeatures = await Promise.all(
				results.map(async (result) => {
					const { osm_id: id, osm_type, latitude, longitude } = result.item
					const featureType = { W: 'way', R: 'relation', N: 'node' }[osm_type]
					const elements = await osmRequest(featureType, id, false)
					if (!elements) return
					const element = elements[0]
					// osmRequest lacks lat lon
					const geoElement = { ...element, lat: latitude, lon: longitude }
					return geoElement
				})
			)
			setFeatures(newFeatures)
		}
		doFetch()
		return () => {
			setFeatures([])

			console.log('cerisier reset features')
		}
	}, [map, setFeatures, results])

	useDrawQuickSearchFeatures(map, features, false, category)
	console.log('olivier osm features', features)
}

const category = {
	name: 'search',
	icon: 'tree',
}
