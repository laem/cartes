'use client'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import {
	GeoJSON,
	MapContainer,
	Marker,
	Polyline,
	Popup,
	TileLayer,
	useMap,
} from 'react-leaflet'

const center = [47.033, 2.395]

const MapBoxToken =
	'pk.eyJ1Ijoia29udCIsImEiOiJjbGY0NWlldmUwejR6M3hyMG43YmtkOXk0In0.08u_tkAXPHwikUvd2pGUtw'

const Map = ({ geoJSON, origin, destination }) => {
	const points = geoJSON && geoJSON.features[0].geometry.coordinates,
		geoCenter = points && points[0].slice().reverse()
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
				center={geoCenter || center}
				zoom={4.5}
				zoomSnap={0.3}
				zoomControl={false}
			>
				{points && (
					<MapZoomer points={points.map((el) => el.slice().reverse())} />
				)}
				<TileLayer
					url={`https://api.mapbox.com/styles/v1/kont/clf45ojd3003301ln8rp5fomd/tiles/{z}/{x}/{y}?access_token=${MapBoxToken}`}
				/>

				{origin && <Marker position={origin}></Marker>}
				{destination && <Marker position={destination}></Marker>}
				{geoJSON && (
					<GeoJSON data={geoJSON} color={'var(--color)'} weight={6} />
				)}
			</MapContainer>
		</div>
	)
}

export default Map

function MapZoomer({ points }) {
	const map = useMap()
	useEffect(() => {
		var bounds = new L.LatLngBounds(points)
		map.fitBounds(bounds, { padding: [30, 30] })
	}, [points])
}
