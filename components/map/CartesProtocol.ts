import sphericalMercator from '@mapbox/sphericalmercator'
import { RequestParameters } from 'maplibre-gl'
import { PMTiles } from 'pmtiles'

import { pmtilesServerUrl } from '@/app/serverUrls'
import { bboxPolygon } from '@turf/bbox-polygon'
import { booleanContains } from '@turf/boolean-contains'

//hexagone-plus.august was our first attempt, too heavy
// hexagone-plus.2 is a lighter set of tiles with combined linestrings
const pmtilesUrl1 = pmtilesServerUrl + '/hexagone-plus.pmtiles'
const pmtilesUrl2 = pmtilesServerUrl + '/planet.pmtiles'
// https://panoramax.openstreetmap.fr/pmtiles/planet.pmtiles

const bboxHexagonePlus = [-11.26, 40.5, 11.26, 60.33]

const hexagonePlusPolygon = bboxPolygon(bboxHexagonePlus)

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
		// I don't know why there's an itinal type==='json' call
		// we server the global map for this call
		console.log('params', params)
		if (params.type === 'json') {
			const pmtilesUrl = pmtilesUrl2
			let instance = this.tiles.get(pmtilesUrl)
			if (!instance) {
				instance = new PMTiles(pmtilesUrl)
				this.tiles.set(pmtilesUrl, instance)
			}

			const h = await instance.getHeader()

			return {
				data: {
					tiles: [`${params.url}/{z}/{x}/{y}`],
					minzoom: h.minZoom,
					maxzoom: h.maxZoom,
					bounds: [h.minLon, h.minLat, h.maxLon, h.maxLat],
				},
			}
		}
		console.log('boup3')
		const re = new RegExp(/cartes:\/\/(.+)\/(\d+)\/(\d+)\/(\d+)/)
		const result = params.url.match(re)
		if (!result) {
			throw new Error('Invalid PMTiles protocol URL')
		}
		const z = result[2]
		const x = result[3]
		const y = result[4]

		const bbox = new sphericalMercator().bbox(x, y, z)

		console.log('boup tile', x, y, z, params)

		const tilePolygon = bboxPolygon(bbox)
		const isInHexagon = booleanContains(hexagonePlusPolygon, tilePolygon)
		console.log('boupmoi is in', isInHexagon, hexagonePlusPolygon, tilePolygon)

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
