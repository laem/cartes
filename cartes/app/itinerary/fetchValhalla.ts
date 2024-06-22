import prixAutoroutes from 'Components/prixAutoroutes'

export default async function (
	points,
	itineraryDistance,
	profile,
	minDistance
) {
	if (itineraryDistance < minDistance) return null

	const params = {
		costing: 'auto',
		exclude_polygons: [],
		locations: points.map(
			({
				geometry: {
					coordinates: [lon, lat],
				},
			}) => ({ lon, lat, type: 'break' })
		),
		directions_options: { units: 'kilometers' },
		id: 'valhalla_directions',
	}

	const url = `https://valhalla1.openstreetmap.de/route?json=${JSON.stringify(
		params
	)}`

	const res = await fetch(url)
	const json = await res.json()

	const distance = Math.round(json.trip.summary.length)

	const trip = json.trip

	const manoeuvers = json.trip.legs[0].maneuvers,
		paidHighwaySegments = manoeuvers.filter(
			(segment) => segment.highway && segment.toll
		),
		paidDistance = paidHighwaySegments.reduce(
			(memo, next) => next.length + memo,
			0
		),
		highwayLengthMap = paidHighwaySegments.map(({ street_names, length }) => [
			street_names.join(' + '),
			length + ' km',
		])

	const testNames = 'A 8, A 89, A 7N, A 784N, A 74N'
	const removeSpace = (name) => name.replace(/A\s/g, 'A')
	const regex = /A\d+N?/g

	const prices = paidHighwaySegments.map((segment) => {
			const results = segment.street_names.filter((street) =>
				removeSpace(street).match(regex)
			)
			if (results.length > 1) {
				console.warn('Multiple autoroutes found in this segment', segment)
			}
			if (results.length === 0) return 0
			// Sometimes some segments have multiple highway names. We don't really what that means or to which distance they apply, so we average their price
			/*  0: "A 71"
    						1: "A 89"
							2: "E 11"
							3: "E 70"
							4: "L'Arverne"
						*/
			const segmentPrices = results.map((result) => {
				const segmentPrice = prixAutoroutes[removeSpace(result)]

				if (segmentPrice == null) {
					console.warn('Segment not found in the price table', result, segment)
					return 0
				}
				return segmentPrice
			})
			const segmentPrice =
				segmentPrices.reduce((memo, next) => memo + next, 0) /
				segmentPrices.length
			return segmentPrice * segment.length
		}),
		rawPrice = prices.reduce((memo, next) => memo + next, 0),
		price = rawPrice.toFixed(1)

	console.log("Prix de l'autoroute", price, 'pour km ', paidDistance)

	return { ...json, distance, price, paidDistance }
}
