import { capitalise0 } from '../utils'

export const parentName = (dottedName, outputSeparator = ' . ', shift = 0) =>
	splitName(dottedName).slice(shift, -1).join(outputSeparator)

export const splitName = (dottedName) => dottedName.split(' . ')

export const title = (rule) =>
	rule.titre ||
	capitalise0(splitName(rule.dottedName)[splitName(rule.dottedName).length - 1])
// Publicodes's % unit is strangely handlded
// the nodeValue is * 100 to account for the unit
// hence we divide it by 100 and drop the unit
export const correctValue = (evaluated) => {
	const { nodeValue, unit } = evaluated

	const result = unit?.numerators.includes('%') ? nodeValue / 100 : nodeValue
	return result
}
