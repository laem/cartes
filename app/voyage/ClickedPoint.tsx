import { buildLocationText } from '@/components/conversation/GeoInputOptions'
import Address from '@/components/voyage/Address'

export default function ClickedPoint({ clickedPoint: { lat, lon, data } }) {
	console.log('jaune data', data)
	const LatLong = () => (
		<div>
			{lat} {lon}
		</div>
	)

	if (!data) return <LatLong />
	const feature = data.features[0],
		item = feature?.properties
	const isAddress = item.street

	if (isAddress) return <Address tags={item} noPrefix={true} />
	const locationText = buildLocationText(data)
	return (
		<div>
			<LatLong />
			{data && <div>{locationText}</div>}
		</div>
	)
}
