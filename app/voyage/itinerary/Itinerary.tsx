import BikeRouteRésumé from '../BikeRouteRésumé'
import Transit from './Transit'

export default function Itinerary({
	itinerary,
	bikeRouteProfile,
	setBikeRouteProfile,
}) {
	if (!itinerary.itineraryMode) return null
	if (itinerary.itineraryMode && !itinerary.routes)
		return (
			<p
				css={`
					margin: 1rem 0;
					text-align: center;
				`}
			>
				Cliquez sur la carte pour construire votre itinéraire.
			</p>
		)

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
			<Transit
				data={{
					...itinerary.routes.transit,
					date: itinerary.date,
					setDate: itinerary.setDate,
					setSelectedConnection: itinerary.setSelectedConnection,
				}}
			/>
		</section>
	)
}
