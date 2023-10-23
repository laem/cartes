import { objectMap } from './utils'

export const encodeDottedName = (decoded) => decoded.replace(/\s\.\s/g, '.')
const decodeDottedName = (encoded) => encoded.replace(/\./g, ' . ')

const ruleKeysFromSearchParams = (searchParams, rules) =>
	Object.entries(searchParams || {})
		.map(([k, v]) => [decodeDottedName(k), v])
		.filter(([k, v]) => rules[k] !== undefined)
export const getFoldedSteps = (searchParams, rules) =>
	ruleKeysFromSearchParams(searchParams, rules).map(([k, v]) => k)

export const getSituation = (searchParams, rules) =>
	Object.fromEntries(
		ruleKeysFromSearchParams(searchParams, rules).filter(([k, v]) => v !== '∅')
	) //should be changed to clearly handle defaultValues

export const encodeValue = (value) => {
	if (value == null) return '∅'

	if (typeof value === 'string') return value
	if (typeof value === 'number') return value

	if (value.valeur) return value.valeur //TODO units should be handled, this is dangerous
	if (value.nodeKind === 'constant' && typeof value.nodeValue === 'number')
		return value.nodeValue

	console.log('ENCODEVALUE', value)
	throw new Error('Unhandled value format')
}

export const encodeSituation = (situation, doEncodeValue = false) =>
	Object.fromEntries(
		Object.entries(situation).map(([k, v]) => [
			encodeDottedName(k),
			doEncodeValue ? encodeValue(v) : v,
		])
	)
