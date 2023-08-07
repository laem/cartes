import md5 from 'Components/md5'

const endpointUrl = 'https://query.wikidata.org/sparql'
const getQuery = (cityName) => `#defaultView:ImageGrid
SELECT distinct ?item ?itemLabel ?itemDescription ?pic ?population ?area WHERE{  
  ?item ?label "${cityName}";
   wdt:P18 ?pic;
   wdt:P1082 ?population;
   wdt:P2046 ?area.
  ?article schema:about ?item .
  ?article schema:inLanguage "en" .
  ?article schema:isPartOf <https://en.wikipedia.org/>. 
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr". }    
}
 `

export default (cityName) => {
	const queryCity = cityName

	const query = getQuery(queryCity)

	const fullUrl = endpointUrl + '?query=' + encodeURIComponent(query)
	const headers = { Accept: 'application/sparql-results+json' }

	return fetch(fullUrl, { headers }).then((body) => body.json())
}

export const toThumb = (url) => {
	console.log(url)
	const paths = url.includes('FilePath/')
		? url.split('FilePath/')
		: url.split('Fichier:')
	const fileName = paths[1]
	console.log(fileName)
	const decoded = decodeURIComponent(fileName).replaceAll(' ', '_')
	const hash = md5(unescape(encodeURIComponent(decoded)))
	console.log(decoded, hash)

	return `https://upload.wikimedia.org/wikipedia/commons/thumb/${hash[0]}/${hash[0]}${hash[1]}/${decoded}/400px-${fileName}`
}
