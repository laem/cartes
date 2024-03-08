import { debounce, omit } from '../utils/utils'

function fetchPhoton(v, setState, whichInput, local, zoom) {
	return fetch(
		`https://photon.komoot.io/api/?q=${encodeURIComponent(v)}&limit=30&lang=fr${
			local ? `&lat=${local[0]}&lon=${local[1]}` : ''
		}${zoom ? `&zoom=${zoom}` : ''}`
	)
		.then((res) => res.json())
		.then((json) => {
			setState((state) => {
				if (v !== state[whichInput].inputValue) return state
				else
					return {
						...state,
						[whichInput]: {
							...state[whichInput],
							results: json.features.map((f) => (
								 buildPhotonItem(f),
							)),
						},
					}
			})
		})
}

export const buildPhotonItem = (f) => ({
	...omit(['osm_id', 'osm_type'],f.properties),
	osmId: f.properties.osm_id,
	featureType:
		f.properties.osm_type &&
		{ R: 'relation', N: 'node', W: 'way' }[f.properties.osm_type],
	longitude: f.geometry.coordinates[0],
	latitude: f.geometry.coordinates[1],
	//région fr : f.properties.state,
	//département fr: f.properties.county,
})

const debounced = debounce(100, fetchPhoton)

export const extractOsmFeature = (choice) => {
	if (!choice) return [null, null]

	return [choice.featureType, choice.osmId]
}

export default debounced
