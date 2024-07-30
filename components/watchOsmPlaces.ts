import { domain, escapeXml } from '@/app/sitemap'
import { encodePlace } from '@/app/utils'

const firstDayOfCurrentMonth = () => {
	const d = new Date()
	d.setDate(1)

	const addTrailingZero = (num) => (('' + num).length === 2 ? '' : '0') + num
	const month = addTrailingZero(d.getMonth() + 1)
	const day = addTrailingZero(d.getDay())

	return [d.getFullYear(), month, day].join('-')
}

const overpassRequest = `

[out:json]
[timeout:30]
;
node
  (47.54594463736,-3.8615661010451,48.380881862859,-2.7931456908889)
  (newer:"${firstDayOfCurrentMonth()}T00:00:00Z")
  (if:version("")==1)
  ->.all;
(
  node.all
    ["shop"]
    ["name"];
  node.all
    ["amenity"]
    ["name"];
);
out meta;

`

//TODO j'ai une erreur sur cette requête, alors j'utilise la fonction d'export
//de l'UI d'overpass en attendant qui formatte correctement

const url0 = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
	overpassRequest
)}`

const url = `https://overpass-api.de/api/interpreter?data=[out%3Ajson][timeout%3A60]%3B%0A%0A+%0Anode(46.53619267489865%2C-5.321763787258927%2C49.85923471774692%2C0.4460584783660738)(newer%3A"2024-07-12T00%3A00%3A00Z")%0A++++(if%3Aversion()+%3D%3D+1)->.all%3B%0A(%0A+node.all[shop][name]%3B%0A++node.all[amenity][name]%3B%0A)%3B%0Aout+meta%3B&target=mapql`

// TODO étendre le périmètre de recherche avec https://dev.overpass-api.de/overpass-doc/en/full_data/area.html
// pas réussi en premier essai

export const getRecentInterestingNodes = async () => {
	console.log(url)
	const request = await fetch(url)
	const json = await request.json()

	const nodes = json.elements
	console.log('OVERPASS', nodes)
	const entries = nodes.map((node) => {
		const typePart = encodePlace(node.type, node.id)
		return {
			url: escapeXml(
				domain +
					`/?allez=${encodeURIComponent(node.tags.name)}|${typePart}|${
						node.lon
					}|${node.lat}`
			),
			lastModified: node.timestamp && new Date(node.timestamp),
		}
	})
	return entries
}
