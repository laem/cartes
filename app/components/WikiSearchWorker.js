import Fuse from 'fuse.js'

const searchWeights = [
	{
		name: 'dottedName',
		weight: 0.3,
	},
	{
		name: 'titre',
		weight: 0.3,
	},
	{ name: 'description', weight: 0.2 },
]

let fuse = null
onmessage = function (event) {
	if (event.data.rules && !fuse)
		fuse = new Fuse(event.data.rules, {
			keys: searchWeights,
			threshold: 0.3,
		})

	if (event.data.input) {
		let results = fuse.search(event.data.input)
		postMessage(results)
	}
}
