import { default as tilebelt } from '@mapbox/tilebelt'
import { RequestParameters } from 'maplibre-gl'
import { PMTiles } from 'pmtiles'

import hexagoneGeojson from '@/components/map/hexagone.json'
import { booleanPointInPolygon } from '@turf/boolean-point-in-polygon'

const pmtilesUrl2 = 'https://panoramax.openstreetmap.fr/pmtiles/planet.pmtiles'
const pmtilesUrl1 = 'https://motis.cartes.app/gtfs/france.pmtiles'

export class Protocol {
	tiles: Map<string, PMTiles>

	constructor() {
		this.tiles = new Map<string, PMTiles>()
	}

	add(p: PMTiles) {
		this.tiles.set(p.source.getKey(), p)
	}

	get(url: string) {
		return this.tiles.get(url)
	}

	tilev4 = async (
		params: RequestParameters,
		abortController: AbortController
	) => {
		if (params.type === 'json') {
			const pmtilesUrl = Math.random() > 0.5 ? pmtilesUrl1 : pmtilesUrl2
			let instance = this.tiles.get(pmtilesUrl)
			if (!instance) {
				instance = new PMTiles(pmtilesUrl)
				this.tiles.set(pmtilesUrl, instance)
			}

			const h = await instance.getHeader()

			console.log('boup2')
			return {
				data: {
					tiles: [`${params.url}/{z}/{x}/{y}`],
					minzoom: h.minZoom,
					maxzoom: h.maxZoom,
					bounds: [h.minLon, h.minLat, h.maxLon, h.maxLat],
				},
			}
		}
		const re = new RegExp(/cartes:\/\/(.+)\/(\d+)\/(\d+)\/(\d+)/)
		const result = params.url.match(re)
		console.log('boup3', result)
		if (!result) {
			throw new Error('Invalid PMTiles protocol URL')
		}
		const z = result[2]
		const x = result[3]
		const y = result[4]

		const tile = [x, y, z]
		const bbox = tilebelt.tileToBBOX(tile)
		const tilePoint = {
			type: 'Feature',
			properties: {},
			geometry: { type: 'Point', coordinates: [bbox[0], bbox[3]] },
		} //TODO don't understand why this kind of bbox [ -6.943359375, -89.99999972676652, 1550.654296875, 43.38908193911751 ]
		console.log('boup tile', tile, params.url)
		console.log('boup lat lon', bbox)

		const isInHexagon = booleanPointInPolygon(tilePoint, hexagoneGeojson)

		const pmtilesUrl = isInHexagon ? pmtilesUrl1 : pmtilesUrl2

		let instance = this.tiles.get(pmtilesUrl)
		if (!instance) {
			instance = new PMTiles(pmtilesUrl)
			this.tiles.set(pmtilesUrl, instance)
		}
		const header = await instance.getHeader()

		const resp = await instance?.getZxy(+z, +x, +y, abortController.signal)
		if (resp) {
			return {
				data: new Uint8Array(resp.data),
				cacheControl: resp.cacheControl,
				expires: resp.expires,
			}
		}
		if (header.tileType === TileType.Mvt) {
			return { data: new Uint8Array() }
		}
		return { data: null }
	}

	tile = v3compat(this.tilev4)
}

const v3compat =
	(v4: AddProtocolAction): V3OrV4Protocol =>
	(requestParameters, arg2) => {
		if (arg2 instanceof AbortController) {
			// biome-ignore lint: overloading return type not handled by compiler
			return v4(requestParameters, arg2) as any
		}
		const abortController = new AbortController()
		v4(requestParameters, abortController)
			.then(
				(result) => {
					return arg2(
						undefined,
						result.data,
						result.cacheControl || '',
						result.expires || ''
					)
				},
				(err) => {
					return arg2(err)
				}
			)
			.catch((e) => {
				return arg2(e)
			})
		return { cancel: () => abortController.abort() }
	}
