import setDefaultsToZero from './setDefaultsToZero'
import transformRules from './transformRules'
import { utils } from 'publicodes'

export async function getRules(ruleSet: 'NGC' | 'futureco') {
	const rulesDomain =
		ruleSet === 'NGC'
			? 'data.nosgestesclimat.fr/co2-model.FR-lang.fr.json'
			: 'futureco-data.netlify.app/co2.json'

	const res = await fetch('https://' + rulesDomain)
	// The return value is *not* serialized
	// You can return Date, Map, Set, etc.

	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error('Failed to fetch rules data for set ' + ruleSet)
	}

	const json = await res.json()

	const newRules =
		ruleSet === 'futureco' ? transformRules(json) : setDefaultsToZero(json)

	return newRules
}

export async function getRulesFromDottedName(dottedName) {
	const ruleSet = dottedName === 'bilan' ? 'NGC' : 'futureco'
	const rules = await getRules(ruleSet)
	return rules
}
