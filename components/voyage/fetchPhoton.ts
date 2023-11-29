import { debounce } from '../utils/utils'

function fetchPhoton(v, setState, whichInput, local) {
	return fetch(
		`https://photon.komoot.io/api/?q=${v}&limit=6&lang=fr${
			local ? `&lat=${local[0]}&lon=${local[1]}` : ''
		}`
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
							results: json.features.map((f) => ({
								item: {
									longitude: f.geometry.coordinates[0],
									latitude: f.geometry.coordinates[1],
									nom: f.properties.name,
									ville: f.properties.cities || f.properties.name,
									pays: f.properties.country,
									région: f.properties.state,
									département: f.properties.county,
								},
							})),
						},
					}
			})
		})
}

const debounced = debounce(100, fetchPhoton)

export default debounced
