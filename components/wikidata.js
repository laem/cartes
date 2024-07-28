const endpointUrl = 'https://query.wikidata.org/sparql'
const getQuery = (name, onlyCities) => `#defaultView:ImageGrid
SELECT distinct ?item ?itemLabel ?itemDescription ?pic ?coordinates ${
	onlyCities ? `?population ?area ` : ''
}WHERE{
  ?item ?label "${name}"@fr;
   wdt:P18 ?pic;
	 wdt:P625 ?coordinates;
   ${
			onlyCities
				? `
   wdt:P1082 ?population;
   wdt:P2046 ?area`
				: ``
		}.
  ?article schema:about ?item .
  ?article schema:inLanguage "fr" .
  ?article schema:isPartOf <https://fr.wikipedia.org/>.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr". }
}
 `

export default (name, onlyCities = true) => {
	const queryCity = name

	const query = getQuery(queryCity, onlyCities)

	console.log('query data3', query)

	const fullUrl = endpointUrl + '?query=' + encodeURIComponent(query)
	const headers = { Accept: 'application/sparql-results+json' }

	return fetch(fullUrl, { headers }).then((body) => body.json())
}

export const extractFileName = (url) => {
	// http://commons.wikimedia.org/wiki/Special:FilePath/Saint-Martin%20090.JPG
	const paths = url.includes('FilePath/')
		? url.split('FilePath/')
		: url.includes('File:')
		? url.split('File:')
		: url.split('Fichier:')
	//TODO probably won't work for other languages
	// try a regexp with /Special:xxx/THIS ?
	const fileName = paths[1]
	return decodeURIComponent(fileName)
}
export const getThumb = (fileName, width = 200) => {
	const pictureUrl = `https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/${encodeURIComponent(
		fileName
	)}&width=${width}`

	return pictureUrl
}
