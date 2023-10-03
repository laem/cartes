'use client'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import {
	GeoJSON,
	MapContainer,
	Polyline,
	Popup,
	TileLayer,
	useMap,
} from 'react-leaflet'

const center = [52.2302, 21.01258]

const points = [
	[52.2308124251888, 21.011003851890568],
	[52.2302604393307, 21.01121842861176],
	[52.2297445891999, 21.011282801628116],
	[52.22953759032849, 21.011492013931278],
	[52.22954416173605, 21.01194798946381],
	[52.22967558968336, 21.012285947799686],
	[52.2300008721797, 21.012935042381287],
	[52.230306438414374, 21.014378070831302],
]

function MapZoomer({ points }) {
	const map = useMap()
	useEffect(() => {
		var bounds = new L.LatLngBounds(points)
		map.fitBounds(bounds, { padding: [20, 20] })
	}, [points])
}

const MapWrapper = ({ geoJSON }) => {
	console.log(geoJSON)
	const points = geoJSON.features[0].geometry.coordinates,
		geoCenter = points[0].slice().reverse()
	console.log('P', points)
	return (
		<div
			css={`
				> div {
					height: 30rem;
					width: 90vw;
				}
			`}
		>
			<MapContainer center={geoCenter} zoom={18} scrollWheelZoom={false}>
				<MapZoomer points={points.map((el) => el.slice().reverse())} />
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				<Polyline color={'red'} opacity={0.7} weight={20} positions={points}>
					<Popup>Polygon</Popup>
				</Polyline>
				<GeoJSON data={geoJSON} />
			</MapContainer>
		</div>
	)
}

export default MapWrapper
