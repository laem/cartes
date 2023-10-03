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
		map.fitBounds(bounds, { padding: [30, 30] })
	}, [points])
}

const MapBoxToken =
	'pk.eyJ1Ijoia29udCIsImEiOiJjbGY0NWlldmUwejR6M3hyMG43YmtkOXk0In0.08u_tkAXPHwikUvd2pGUtw'

const MapWrapper = ({ geoJSON }) => {
	const points = geoJSON.features[0].geometry.coordinates,
		geoCenter = points[0].slice().reverse()
	return (
		<div
			css={`
				> div {
					height: 15rem;
					width: 15rem;
					border: 6px solid var(--darkColor);
				}
			`}
		>
			<MapContainer
				center={geoCenter}
				zoom={18}
				zoomSnap={0.3}
				zoomControl={false}
			>
				<MapZoomer points={points.map((el) => el.slice().reverse())} />
				<TileLayer
					url={`https://api.mapbox.com/styles/v1/kont/clf45ojd3003301ln8rp5fomd/tiles/{z}/{x}/{y}?access_token=${MapBoxToken}`}
				/>

				<Polyline color={'red'} opacity={0.7} weight={20} positions={points}>
					<Popup>Polygon</Popup>
				</Polyline>
				<GeoJSON data={geoJSON} color={'var(--color)'} weight={6} />
			</MapContainer>
		</div>
	)
}

export default MapWrapper
