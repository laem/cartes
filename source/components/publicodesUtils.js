import { capitalise0 } from '../utils'

export const parentName = (dottedName, outputSeparator = ' . ') =>
	splitName(dottedName).slice(0, -1).join(outputSeparator)

export const splitName = (dottedName) => dottedName.split(' . ')

export const title = (rule) =>
	rule.titre ||
	capitalise0(splitName(rule.dottedName)[splitName(rule.dottedName).length - 1])
