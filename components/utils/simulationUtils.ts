export const encodeDottedName = (decoded) => decoded.replace(/\s\.\s/g, '.')
const decodeDottedName = (encoded) => encoded.replace(/\./g, ' . ')
const ruleKeysFromSearchParams = (searchParams, rules) =>
	Object.entries(searchParams || {})
		.map(([k, v]) => [decodeDottedName(k), v])
		.filter(([k, v]) => rules[k] !== undefined)
export const getFoldedSteps = (searchParams, rules) =>
	ruleKeysFromSearchParams(searchParams, rules).map(([k, v]) => k)

export const getSituation = (searchParams, rules) =>
	console.log('getSituation', searchParams) ||
	Object.fromEntries(
		ruleKeysFromSearchParams(searchParams, rules).filter(([k, v]) => v !== '∅')
	) //should be changed to clearly handle defaultValues
