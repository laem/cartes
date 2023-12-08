import md5 from 'Components/md5'

const endpointUrl = 'https://query.wikidata.org/sparql'
const getQuery = (name, onlyCities) => `#defaultView:ImageGrid
SELECT distinct ?item ?itemLabel ?itemDescription ?pic ${
	onlyCities ? `?population ?area ` : ''
}WHERE{  
  ?item ?label "${name}"@fr;
   wdt:P18 ?pic;
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

	const fullUrl = endpointUrl + '?query=' + encodeURIComponent(query)
	const headers = { Accept: 'application/sparql-results+json' }

	return fetch(fullUrl, { headers }).then((body) => body.json())
}

export const toThumb = (url) => {
	const paths = url.includes('FilePath/')
		? url.split('FilePath/')
		: url.includes('File:')
		? url.split('File:')
		: url.split('Fichier:')
	const fileName = paths[1]
	const decoded = decodeURIComponent(fileName).replaceAll(' ', '_')
	const hash = md5(unescape(encodeURIComponent(decoded)))

	return `https://upload.wikimedia.org/wikipedia/commons/thumb/${hash[0]}/${hash[0]}${hash[1]}/${decoded}/400px-${decoded}`
}
