export const nameKeys = ['name:fr', 'name']

export default function getName(tags) {
	const name = tags['name:fr'] || tags['name']

	return name
}
