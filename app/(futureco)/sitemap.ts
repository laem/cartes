import nationalData from '@/app/(futureco)/national/data.yaml'
import { utils } from 'publicodes'
import voyageRules from '@/app/(futureco)/cout-voiture/data/rules.ts'

const lines = [
	'https://futur.eco',
	'https://futur.eco/a-propos',
	//	'https://futur.eco/documentation',
	'https://futur.eco/scenarios',
	'https://futur.eco/national',
	'https://futur.eco/carburants/prix-a-la-pompe',
	'https://futur.eco/cout-voiture',
]

const voyageLines = Object.entries(voyageRules).map(
	([k, v]) => `https://futur.eco/documentation/` + utils.encodeRuleName(k)
)

const nationalLines = nationalData.map(
	(element) =>
		'https://futur.eco/national/action/' +
		utils.encodeRuleName(element.titre.toLowerCase())
)

const getResults = () =>
	fetch('https://futureco-data.netlify.app/co2.json')
		.then((res) => res.json())
		.then((json) => {
			const documentationLines = Object.keys(json).map(
				(dottedName) =>
					`https://futur.eco/documentation/${encodeRuleName(dottedName)}`
			)
			const simulationLines = Object.keys(json)
				.filter(
					(dottedName) => json[dottedName] && json[dottedName]['exposé'] != null
				)
				.map(
					(dottedName) =>
						`https://futur.eco/simulateur/${encodeRuleName(dottedName)}`
				)

			const results = [...lines, ...simulationLines, ...documentationLines]
			return results
		})

/* Unfortunately, we can't yet import this function from engine/rules */
const encodeRuleName = (name) =>
	name
		.replace(/\s\.\s/g, '/')
		.replace(/-/g, '\u2011') // replace with a insecable tiret to differenciate from space
		.replace(/\s/g, '-')

export default async function sitemap() {
	const asyncResults = await getResults(),
		results = [...asyncResults, ...nationalLines, ...voyageLines]

	return results.map((el) => ({ url: el }))
	return [
		{
			url: 'https://acme.com',
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 1,
		},
	]
}
