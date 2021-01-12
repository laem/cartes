export const parentName = (dottedName, outputSeparator = ' . ') =>
	dottedName.split(' . ').slice(0, -1).join(outputSeparator)
