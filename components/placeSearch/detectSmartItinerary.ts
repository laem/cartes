import { buildPhotonItem } from '../fetchPhoton'

const regexp = /^de\s(.+)\sà(.+)$/

function fetchPhotonRaw(v, localSearch, zoom) {
	return fetch(
		`https://photon.komoot.io/api/?q=${encodeURIComponent(v)}&limit=30&lang=fr${
			localSearch ? `&lat=${localSearch[0]}&lon=${localSearch[1]}` : ''
		}${zoom ? `&zoom=${Math.round(zoom)}` : ''}`
	).then((res) => res.json())
}

//TODO doesn't work below, fix it
const fetchPhotonDebounced = debounce(fetchPhotonRaw, 2000)

function debounce(inner, ms = 0) {
	let timer = null
	let resolves = []

	return function (...args) {
		// Run the function after a certain amount of time
		clearTimeout(timer)
		timer = setTimeout(() => {
			// Get the result of the inner function, then apply it to the resolve function of
			// each promise that has been created since the last time the inner function was run
			let result = inner(...args)
			resolves.forEach((r) => r(result))
			resolves = []
		}, ms)

		return new Promise((r) => resolves.push(r))
	}
}

export default function detectSmartItinerary(input, localSearch, zoom, then) {
	if (!input) return
	const detected = input.match(regexp)
	if (!detected) return
	const [, from, to] = detected

	const promises = Promise.all(
		[from, to].map((pointInput) =>
			fetchPhotonDebounced(pointInput, localSearch, zoom)
		)
	)

	promises.then((res) =>
		then(
			res.map((featureCollection) =>
				buildPhotonItem(featureCollection.features[0])
			)
		)
	)
}
