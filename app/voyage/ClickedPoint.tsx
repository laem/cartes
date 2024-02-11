import { buildLocationText } from '@/components/conversation/GeoInputOptions'
import Address from '@/components/voyage/Address'

export default function ClickedPoint({ clickedPoint: { lat, lon, data } }) {
	const locationText = buildLocationText(data)
	console.log('jaune data', data)

	const feature = data.features[0],
		item = feature?.properties
	const isAddress = item.street

	if (isAddress) return <Address tags={item} noPrefix={true} />
	return (
		<div>
			{lat} {lon}
			{data && <div>{locationText}</div>}
		</div>
	)
}
