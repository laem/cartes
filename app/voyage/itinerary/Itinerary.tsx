import BikeRouteRésumé from '../BikeRouteRésumé'

export default function Itinerary({
	itinerary,
	bikeRouteProfile,
	setBikeRouteProfile,
}) {
	if (
		!(
			itinerary?.routes &&
			(itinerary.routes.cycling || itinerary.routes.walking)
		)
	)
		return null

	return (
		<BikeRouteRésumé
			{...{
				cycling: itinerary.routes.cycling,
				walking: itinerary.routes.walking,
				data: itinerary.routes,
				bikeRouteProfile,
				setBikeRouteProfile,
			}}
		/>
	)
}
