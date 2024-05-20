export const camelize = (str) =>
	str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

export const indentLine = (obj, indent) => JSON.stringify(obj, null, indent)

export const reverseMediaQueries = (inputData) => {
	const exportObject = {}
	const moveMediaInsideClass = (object, media = false) => {
		Object.entries(object).forEach(([key, value]) => {
			if (key.includes('@media')) {
				moveMediaInsideClass(object[key], key)
			} else if (media) {
				const tempObj = {}
				tempObj[media] = value
				if (exportObject[key]) {
					exportObject[key] = { ...exportObject[key], ...tempObj }
				} else {
					exportObject[key] = tempObj
				}
			} else if (exportObject[key]) {
				exportObject[key] = { ...exportObject[key], ...value }
			} else {
				exportObject[key] = value
			}
		})
	}

	moveMediaInsideClass(inputData)
	return exportObject
}

export const sanitize = (name) =>
	name
		.replace(/\*/g, 'all-children')
		.replace(/#/g, '$')
		.replace(/\s\s+/g, ' ')
		.replace(/[^a-zA-Z0-9$]/g, '_')
		.replace(/^_+/g, '')
		.replace(/_+$/g, '')

export const addProperty = (obj, key, value) => {
	const retObj = obj
	if (retObj[key]) {
		retObj[key] = { ...retObj[key], ...value }
	} else {
		retObj[key] = value
	}

	return retObj
}

export function isOverflowX(element) {
	if (!element) return null
	return (
		element.scrollWidth != Math.max(element.offsetWidth, element.clientWidth)
	)
}
export const isWhiteColor = (unsafeColor) => {
	if (!unsafeColor) return false

	if (unsafeColor.toLowerCase().includes('ffffff')) return true

	console.log('orange', unsafeColor)
	if (unsafeColor === 'white') return true
}
