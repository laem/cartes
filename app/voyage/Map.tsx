'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import PlaceSearch from './PlaceSearch'
import getCityData, { toThumb } from 'Components/wikidata'
import Image from 'next/image'
import destinationPoint from '@/public/destination-point.svg'
import {
	CityImage,
	Destination,
	ImageWithNameWrapper,
	ImageWrapper,
} from '@/components/conversation/VoyageUI'
import { motion } from 'framer-motion'
import { garesProches, sortGares } from './gares'
import css from '@/components/css/convertToJs'

const defaultCenter =
	// Saint Malo [-1.9890417068124002, 48.66284934737089]
	[-1.6776317608896583, 48.10983044383964]
export default function Map() {
	const [state, setState] = useState({
		depuis: { inputValue: '', choice: false },
		vers: { inputValue: '', choice: false },
		validated: false,
	})
	const [wikidata, setWikidata] = useState(null)
	const versImageURL = wikidata?.pic && toThumb(wikidata?.pic.value)
	useEffect(() => {
		if (!state.vers.choice) return undefined

		getCityData(state.vers.choice.item.ville).then((json) =>
			setWikidata(json?.results?.bindings[0])
		)
	}, [state.vers])

	const onInputChange = (whichInput) => (e) => {
		let v = e.target.value
		setState({
			...state,
			[whichInput]: { ...state[whichInput], inputValue: v },
			validated: false,
		})
		if (v.length > 2) {
			fetch(`https://photon.komoot.io/api/?q=${v}&limit=6&layer=city&lang=fr`)
				.then((res) => res.json())
				.then((json) => {
					setState((state) => ({
						...state,
						[whichInput]: {
							...state[whichInput],
							results: json.features.map((f) => ({
								item: {
									longitude: f.geometry.coordinates[0],
									latitude: f.geometry.coordinates[1],
									nom: f.properties.name,
									ville: f.properties.cities || f.properties.name,
									pays: f.properties.country,
								},
							})),
						},
					}))
				})
		}
	}

	if (process.env.NEXT_PUBLIC_MAPTILER == null) {
		throw new Error('You have to configure env REACT_APP_API_KEY, see README')
	}

	const mapContainerRef = useRef()

	const center = useMemo(
		() =>
			state.vers.choice && [
				state.vers.choice.item.longitude,
				state.vers.choice.item.latitude,
			],
		[state.vers.choice]
	)

	const [gares, setGares] = useState(null)
	const [map, setMap] = useState(null)
	const [clickedGare, clickGare] = useState(null)
	useEffect(() => {
		async function fetchGares() {
			const res = await fetch('/gares.json')
			const json = await res.json()
			setGares(json)
		}
		fetchGares()
	}, [setGares])
	useEffect(() => {
		const newMap = new maplibregl.Map({
			container: mapContainerRef.current,
			style: `https://api.maptiler.com/maps/2f80a9c4-e0dd-437d-ae35-2b6c212f830b/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER}`,
			center: defaultCenter,
			zoom: 8,
		})
		setMap(newMap)

		newMap.addControl(new maplibregl.NavigationControl(), 'top-right')

		//new maplibregl.Marker({ color: '#FF0000' }).setLngLat(defaultCenter).addTo(newMap)

		return () => {
			newMap.remove()
		}
	}, [setMap])

	useEffect(() => {
		if (!map || !center) return
		map.flyTo({
			center,
			zoom: 10,
			pitch: 50, // pitch in degrees
			bearing: 20, // bearing in degrees
		})
		new maplibregl.Marker({ color: 'var(--darkerColor)' })
			.setLngLat(center)
			.addTo(map)
	}, [center, map])

	const lesGaresProches =
		center && gares && sortGares(gares, center).slice(0, 30)
	console.log({ lesGaresProches, clickedGare })

	useEffect(() => {
		if (!lesGaresProches) return
		lesGaresProches.map((gare) => {
			const el = document.createElement('div')
			const root = createRoot(el)
			const size = { 1: '25px', 2: '35px', 3: '45px' }[gare.niveau]
			flushSync(() => {
				root.render(
					<div
						style={css`
							display: flex;
							flex-direction: column;
							align-items: center;
							cursor: help;
						`}
					>
						<img
							src="/gare.svg"
							style={{ width: size, height: size }}
							alt="Icône d'une gare"
						/>
					</div>
				)
			})

			el.addEventListener('click', () => {
				clickGare(gare.uic === clickedGare?.uic ? null : gare)
			})

			new maplibregl.Marker({ element: el })
				.setLngLat(gare.coordonnées)
				.addTo(map)
		})
	}, [lesGaresProches, map])

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
					top: 2vh;
					left: 4vw;
					z-index: 10;
					h1 {
						color: var(--darkerColor);
						border-bottom: 6px solid var(--color);
						display: inline-block;
						padding: 0;
						line-height: 1.6rem;
					}
				`}
			>
				<h1>Où allez-vous ?</h1>
				<PlaceSearch {...{ onInputChange, state, setState }} />
				<ImageWithNameWrapper>
					{versImageURL && (
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{}}
							key={versImageURL}
							exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
						>
							<Destination>
								<Image src={destinationPoint} alt="Vers" />
								<h2>{state.vers.choice.item.nom}</h2>
							</Destination>
							<CityImage
								src={versImageURL}
								alt={`Une photo emblématique de la destination, ${state.vers.choice?.item?.nom}`}
							/>
						</motion.div>
					)}
				</ImageWithNameWrapper>
				{clickedGare && (
					<div
						css={`
							position: fixed;
							right: 1rem;
							top: 50%;
							transform: translateY(-50%);
							display: flex;
							flex-direction: column;
							align-items: center;

							iframe {
								width: 20rem;
								height: 30rem;
								max-width: 90vw;
								border: 6px solid var(--color);
							}
							h2 {
								margin-bottom: 0rem;
								font-size: 120%;
								background: var(--color);
								width: 100%;
								text-align: center;
								padding: 0.2rem 0;
								max-width: 20rem;
							}
						`}
					>
						<h2>Gare de {clickedGare.nom}</h2>
						<iframe
							src={`https://tableau-sncf.vercel.app/station/stop_area:SNCF:${clickedGare.uic.slice(
								2
							)}`}
							css={``}
						/>
					</div>
				)}
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
