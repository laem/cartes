import categories from '@/app/categories.yaml'
import turfDistance from '@turf/distance'
import useOverpassRequest from '@/app/effects/useOverpassRequest'
import { roundToTens, roundToThousands, sortBy } from './utils/utils'
import { humanDuration } from '@/app/itinerary/transit/utils'
import { computeHumanDistance } from '@/app/RouteRésumé'

export default function SimilarNodes({ node }) {
	const { tags } = node

	const category = categories.find(({ query: queryRaw }) => {
		const query = Array.isArray(queryRaw) ? queryRaw : [queryRaw]
		return Object.entries(tags).find(([k, v]) =>
			query.find(
				(expression) => expression.includes(k) && expression.includes(v)
			)
		)
	})

	// This is very scientific haha
	const latDifferenceOfRennes = 0.07,
		lonDifferenceOfRennes = 0.15,
		latDiff = latDifferenceOfRennes / 2,
		lonDiff = lonDifferenceOfRennes / 2
	// 48.07729814876498,-1.7461581764997334,48.148123804291316,-1.5894174840209132
	const { lat, lon } = node
	const bbox = [
		lat - latDiff / 2,
		lon - lonDiff / 2,
		lat + latDiff / 2,
		lon + lonDiff / 2,
	]
	const [features] = useOverpassRequest(bbox, category)

	const reference = [lon, lat]
	const featuresWithDistance =
		features &&
		features
			.filter((feature) => feature.id !== node.id && feature.tags.name)
			.map((feature) => {
				const { lon: lon2, lat: lat2 } = feature
				return { ...feature, distance: turfDistance([lon2, lat2], reference) }
			})

	const closestFeatures =
		features && sortBy(({ distance }) => distance)(featuresWithDistance)
	console.log('node', closestFeatures)
	/*
	 * Trouver la catégorie du lieu
	 * lancer une requête Overpass pour les éléments similaires autour
	 * afficher les plus proches surtout pour le SEO dans un premier temps, puis graphiquement
	 * comme des cartes sur google dans un second temps
	 * mettre un lien vers la recherche category=
	 * ajouter une liste de résultats à la recherche par catégorie
	 *
	 * */

	return (
		<ul
			css={`
				margin-top: 1rem;
				margin-left: 1rem;
			`}
		>
			{' '}
			{closestFeatures &&
				closestFeatures.map((f) => {
					const humanDistance = computeHumanDistance(f.distance * 1000)
					return (
						<li key={f.id}>
							{f.tags.name} à {humanDistance[0]} {humanDistance[1]}
						</li>
					)
				})}
		</ul>
	)
}
