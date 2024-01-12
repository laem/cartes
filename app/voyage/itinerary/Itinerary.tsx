import BikeRouteRésumé from '../BikeRouteRésumé'

export default function Itinerary({
	itinerary,
	bikeRouteProfile,
	setBikeRouteProfile,
}) {
	if (!itinerary.routes) return

	const transit = itinerary.routes.transit

	console.log('transit', transit)

	return (
		<section>
			{(itinerary.routes.cycling || itinerary.routes.walking) && (
				<BikeRouteRésumé
					{...{
						cycling: itinerary.routes.cycling,
						walking: itinerary.routes.walking,
						data: itinerary.routes,
						bikeRouteProfile,
						setBikeRouteProfile,
					}}
				/>
			)}
			<div>TeC</div>
		</section>
	)
}
