import { distance, point } from '@turf/turf'
export const sortGares = (gares, destination) =>
	gares
		/*
		.filter((gare) => {
			return toOrFrom === 'to'
				? gare.distance > +itinerary.minBikeKm &&
						gare.distance < +itinerary.maxBikeKm
				: true
		})
		*/
		.filter((gare) => gareDistance(gare, destination) < 100)
		.sort(
			(g1, g2) => gareDistance(g1, destination) - gareDistance(g2, destination)
		)

const gareDistance = (station, destination) => {
	const [lat, lon] = station.coordonnées

	const A = point([Number(destination[0]), Number(destination[1])])
	const B = point([lon, lat])
	return distance(A, B)
}
