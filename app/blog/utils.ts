export const dateCool = (date) =>
	new Date(date).toLocaleString('fr-FR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})

const repo = 'laem/cartes'

export const getLastEdit = async (name) => {
	try {
		const url = `https://api.github.com/repos/${repo}/commits?path=articles%2F${name}.mdx&page=1&per_page=1`

		const request = await fetch(url)

		const json = await request.json()

		const date = json[0].commit.committer.date
		return date
	} catch (e) {
		return null
	}
}
