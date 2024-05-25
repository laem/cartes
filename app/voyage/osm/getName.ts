export default function getName(tags) {
	const name = tags['name:fr'] || tags['name']

	return [name, ['name:fr', 'name']]
}
