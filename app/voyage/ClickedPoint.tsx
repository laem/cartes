import { buildLocationText } from '@/components/conversation/GeoInputOptions'
import Address from '@/components/voyage/Address'
import computeDistance from '@turf/distance'

export default function ClickedPoint({
	clickedPoint: { latitude, longitude, data },
	origin,
}) {
	console.log('jaune data', data)
	const LatLong = () => (
		<div>
			{latitude} {longitude}
		</div>
	)

	console.log('origin', origin)
	if (!data)
		return (
			<div>
				<Distance origin={origin} destination={{ longitude, latitude }} />
				<LatLong />
			</div>
		)
	const feature = data.features[0],
		item = feature?.properties
	const isAddress = item.street

	if (isAddress)
		return (
			<div>
				<Distance origin={origin} destination={{ longitude, latitude }} />
				<Address tags={item} noPrefix={true} />
			</div>
		)

	const locationText = buildLocationText(data)
	return (
		<div>
			<Distance origin={origin} destination={{ longitude, latitude }} />
			<LatLong />
			{data && <div>{locationText}</div>}
		</div>
	)
}

const Distance = ({ destination, origin }) => {
	if (!origin) return null

	const distance = computeDistance(
		{
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [destination.longitude, destination.latitude],
			},
			properties: {},
		},
		{
			properties: {},
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [origin.longitude, origin.latitude],
			},
		}
	)
	const humanDistance =
		distance < 1
			? `${Math.round(distance * 1000)} m`
			: distance < 10
			? `${Math.round(distance * 10) / 10} km`
			: `${Math.round(distance)} km`
	return <div>{humanDistance}</div>
}
