import maplibregl from 'maplibre-gl'
import { Protocol } from 'pmtiles'
import { useEffect, useMemo, useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import { styles } from '../styles/styles'
import useGeolocation from './useGeolocation'

import { useParams } from 'next/navigation'
import useHash from './useHash'
/*
 *
 * {"city":"Rennes","country":"FR","flag":"🇫🇷","countryRegion":"BRE","region":"cdg1","latitude":"48.11","longitude":"-1.6744"}
 *
 * */

const defaultCenter =
	// Saint Malo
	// [-1.9890417068124002, 48.66284934737089]
	// Rennes [-1.678, 48.11]
	[2.025, 46.857]
export const defaultZoom = 5.52
const defaultHash = `#${defaultZoom}/${defaultCenter[1]}/${defaultCenter[0]}`,
	defaultArrayHash = defaultHash.slice(1).split('/')

export default function useAddMap(
	styleUrl,
	setZoom,
	setBbox,
	mapContainerRef,
	setGeolocation
) {
	const [map, setMap] = useState(null)
	const [geolocate, setGeolocate] = useState(null)
	const isMobile = useMediaQuery('(max-width: 800px)')
	const [hash, setHash] = useState(defaultArrayHash)
	// This could probably be done with a Next Middleware, to avoid a second
	// request, but I could not make it work in 5 minutes
	const geolocation = useGeolocation({
		latitude: defaultCenter[1],
		longitude: defaultCenter[0],
	})
	//	console.log('geolocation', geolocation)
	const { latitude, longitude } = geolocation

	const ipGeolocationCenter = [longitude, latitude]

	useEffect(() => {
		if (!map) return

		map.flyTo({
			center: ipGeolocationCenter,
		})
	}, [ipGeolocationCenter, map])

	useEffect(() => {
		let protocol = new Protocol()
		maplibregl.addProtocol('pmtiles', protocol.tile)
		return () => {
			maplibregl.removeProtocol('pmtiles')
		}
	}, [])

	useEffect(() => {
		if (!mapContainerRef.current) return undefined

		const newMap = new maplibregl.Map({
			container: mapContainerRef.current,
			style: styleUrl,
			center: defaultCenter,
			zoom: defaultZoom,
			hash: true,
			attributionControl: false,
		})
		newMap.addControl(
			new maplibregl.NavigationControl({
				visualizePitch: true,
				showZoom: true,
				showCompass: true,
			}),
			'top-right'
		)

		const geolocate = new maplibregl.GeolocateControl({
			positionOptions: {
				enableHighAccuracy: true,
			},
			trackUserLocation: true,
		})

		setGeolocate(geolocate)

		newMap.addControl(geolocate)

		geolocate.on('geolocate', function (e) {
			console.log('bleu ', e.coords)
			setGeolocation(e.coords)
		})

		newMap.on('load', () => {
			console.log('maplibre instance loaded with id ', newMap._mapId)
			setMap(newMap)

			setZoom(Math.round(newMap.getZoom()))
			setBbox(newMap.getBounds().toArray())
		})

		newMap.on('moveend', (e) => {
			setBbox(newMap.getBounds().toArray())
			setHash([
				newMap.getZoom(),
				...newMap.getCenter().toArray().map(roundTo(4)).reverse(),
			])
		})

		return () => {
			setMap(null)
			newMap?.remove()
		}
	}, [setMap, setZoom, setBbox, mapContainerRef, setGeolocate, setHash]) // styleUrl not listed on purpose

	const triggerGeolocation = useMemo(
		() => (geolocate ? () => geolocate.trigger() : () => 'Not ready'),
		[geolocate]
	)

	console.log('hash', hash)
	useEffect(() => {
		if (!map || !isMobile) return

		if (arrayEquals(hash.map(roundTo(2)), defaultArrayHash.map(roundTo(2))))
			return

		triggerGeolocation()
		const timer = setTimeout(() => {
			triggerGeolocation()
		}, 2000)
		return () => clearTimeout(timer)
	}, [map, isMobile, triggerGeolocation, hash.join('/')])

	useEffect(() => {
		if (!map) return
		const style = Object.values(styles).find((style) => style.url === styleUrl)
		const attribution = new maplibregl.AttributionControl({
			customAttribution: style.attribution,
		})
		map.addControl(attribution)

		return () => {
			try {
				map.removeControl(attribution)
			} catch (e) {
				console.log('Error remove attribution', e)
			}
		}
	}, [map, styleUrl])

	return [map, triggerGeolocation]
}

const roundTo = (precision) => (num) => {
	const multiplesOfTen = [...new Array(precision)].reduce(
		(memo, next) => memo * 10,
		1
	)

	return Math.round(num * multiplesOfTen) / multiplesOfTen
}

function arrayEquals(a, b) {
	console.log('hash comp', a, b)
	return (
		Array.isArray(a) &&
		Array.isArray(b) &&
		a.length === b.length &&
		a.every((val, index) => val === b[index])
	)
}
