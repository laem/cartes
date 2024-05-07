import Stop from './stop/Stop'
import useTransportStopData from './useTransportStopData'

export default function StopByName({ stopName, data }) {
	const stops = data
		.map(
			([
				agencyId,
				{
					geojson: { features },
				},
			]) =>
				features.filter(
					(feature) =>
						feature.geometry.type === 'Point' &&
						feature.properties.name === stopName
				)
		)
		.flat()

	return stops.map((feature) => (
		<StopById key={feature.properties.id} id={feature.properties.id} />
	))
}

const StopById = ({ id }) => {
	const data = useTransportStopData(null, id)

	console.log('olive stopbyid data', data)

	return <Stop data={data} />
}
