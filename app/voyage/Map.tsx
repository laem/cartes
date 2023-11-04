'use client'
import React, { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import PlaceSearch from './PlaceSearch'

const center = [-1.9890417068124002, 48.66284934737089]
export default function Map() {
	if (process.env.NEXT_PUBLIC_MAPTILER == null) {
		throw new Error('You have to configure env REACT_APP_API_KEY, see README')
	}

	const mapContainerRef = useRef()

	useEffect(() => {
		const map = new maplibregl.Map({
			container: mapContainerRef.current,
			style: `https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER}`,
			center: center,
			zoom: 14,
		})

		map.addControl(new maplibregl.NavigationControl(), 'top-right')

		new maplibregl.Marker({ color: '#FF0000' }).setLngLat(center).addTo(map)

		return () => {
			map.remove()
		}
	}, [])

	return (
		<div
			css={`
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				> div:last-child {
					position: absolute;
					width: 100%;
					height: 100%;
				}
				> a {
					position: absolute;
					left: 10px;
					bottom: 10px;
					z-index: 999;
				}
			`}
		>
			<div
				css={`
					position: absolute;
					top: 6vh;
					left: 4vw;
					z-index: 10;
					h1 {
						color: var(--darkerColor);
					}
				`}
			>
				<h1>Où allez-vous ?</h1>
				<PlaceSearch />
			</div>
			<a href="https://www.maptiler.com">
				<img
					src="https://api.maptiler.com/resources/logo.svg"
					alt="MapTiler logo"
				/>
			</a>
			<div ref={mapContainerRef} />
		</div>
	)
}
