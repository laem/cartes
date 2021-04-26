const fs = require('fs')
const fetch = require('node-fetch')
const lines = require('./base-URLs.js')

fetch('https://ecolab-data.netlify.app/co2.json')
	.then((res) => res.json())
	.then((json) => {
		const documentationLines = Object.keys(json).map(
			(dottedName) =>
				`https://nosgestesclimat.fr/documentation/${encodeRuleName(dottedName)}`
		)
		const text = documentationLines.join('\n')
		fs.writeFileSync('./sitemap.txt', lines + text, 'utf8')
		console.log('Sitemap mis à jour avec les dernières règles publicodes :)')
	})

/* Unfortunately, we can't yet import this function from engine/rules */
const encodeRuleName = (name) =>
	name
		.replace(/\s\.\s/g, '/')
		.replace(/-/g, '\u2011') // replace with a insecable tiret to differenciate from space
		.replace(/\s/g, '-')
