import BikeRouteRésumé from '../BikeRouteRésumé'
import Transit from './Transit'

export default function Itinerary({
	itinerary,
	bikeRouteProfile,
	setBikeRouteProfile,
}) {
	if (!itinerary.routes) return

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
			<Transit data={itinerary.routes.transit} />
		</section>
	)
}
