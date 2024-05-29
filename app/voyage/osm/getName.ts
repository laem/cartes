export const baseNameKeys = ['name:fr', 'name']

export default function getName(tags) {
	const name = tags['name:fr'] || tags['name']

	return name
}

export const getNameKeys = (tags) => {
	return Object.keys(tags).filter((key) => key.startsWith('name:'))
}
