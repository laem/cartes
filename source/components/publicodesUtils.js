export const parentName = (dottedName, outputSeparator = ' . ') =>
	splitName(dottedName).slice(0, -1).join(outputSeparator)

export const splitName = (dottedName) => dottedName.split(' . ')
