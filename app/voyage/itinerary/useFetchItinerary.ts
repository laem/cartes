import { computeMotisTrip } from '@/app/voyage/itinerary/transit/motisRequest'
import distance from '@turf/distance'
import { useEffect, useState } from 'react'
import { decodeDate, initialDate } from './DateSelector'
import { useMemoPointsFromState } from './useDrawItinerary'

export default function useFetchItinerary(
	searchParams,
	state,
	bikeRouteProfile,
	mode
) {
	const [routes, setRoutes] = useState(null)
	const date = decodeDate(searchParams.date) || initialDate()
	const mode =

	const updateRoute = (key, value) =>
		setRoutes((routes) => ({ ...(routes || {}), [key]: value }))

	const points = useMemoPointsFromState(state)

	/* Routing requests are made here */
	useEffect(() => {
		if (state.filter(Boolean).length < 2) {
			setRoutes(null)
			return
		}

		async function fetchBrouterRoute(
			points,
			itineraryDistance,
			profile,
			maxDistance
		) {
			if (itineraryDistance > maxDistance) return null

			const lonLats = points
				.map(
					({
						geometry: {
							coordinates: [lon, lat],
						},
					}) => `${lon},${lat}`
				)
				.join('|')
			const url = `https://brouter.osc-fr1.scalingo.io/brouter?lonlats=${lonLats}&profile=${profile}&alternativeidx=0&format=geojson`
			const res = await fetch(url)
			const json = await res.json()
			if (!json.features) return
			return json
		}

		//TODO fails is 3rd point is closer to 1st than 2nd, use reduce that sums
		const itineraryDistance = distance(points[0], points.slice(-1)[0])

		const fetchRoutes = async () => {
			updateRoute('cycling', 'loading')
			const cycling = await fetchBrouterRoute(
				points,
				itineraryDistance,
				bikeRouteProfile,
				35 // ~ 25 km/h (ebike) x 1:30 hours
			)
			updateRoute('cycling', cycling)

			updateRoute('walking', 'loading')
			const walking = await fetchBrouterRoute(
				points,
				itineraryDistance,
				'hiking-mountain',
				mode === 'walking' ? Infinity : 4 // ~ 3 km/h donc 4 km = 1h20 minutes, au-dessus ça me semble peu pertinent de proposer la marche par défaut
			)
			updateRoute('walking', walking)
		}
		fetchRoutes()
	}, [points, setRoutes, bikeRouteProfile, mode])

	useEffect(() => {
		if (points.length < 2) {
			setRoutes(null)
			return
		}

		async function fetchTrainRoute(multiplePoints, itineraryDistance, date) {
			const minTransitDistance = 0.5 // please walk or bike
			if (itineraryDistance < minTransitDistance) return null
			const points =
				multiplePoints.length > 2
					? [multiplePoints[0], multiplePoints.slice(-1)[0]]
					: multiplePoints
			const lonLats = points.map(
				({
					geometry: {
						coordinates: [lng, lat],
					},
				}) => ({ lat, lng })
			)

			const json = await computeMotisTrip(lonLats[0], lonLats[1], date)

			if (json.state === 'error') return json

			if (!json?.content) return null
			/*
			return sections.map((el) => ({
				type: 'Feature',
				properties: el.geojson.properties[0],
				geometry: { coordinates: el.geojson.coordinates, type: 'LineString' },
			}))
			*/
			return json.content
		}
		//TODO fails is 3rd point is closer to 1st than 2nd, use reduce that sums
		const itineraryDistance = distance(points[0], points.slice(-1)[0])

		updateRoute('transit', { state: 'loading' })
		fetchTrainRoute(points, itineraryDistance, date).then((transit) =>
			setRoutes((routes) => ({ ...routes, transit }))
		)
	}, [points, setRoutes, date])

	const resetItinerary = () => setSearchParams({ allez: undefined })
	return [resetItinerary, routes, date]
}
