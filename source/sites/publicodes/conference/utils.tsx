import geologicalPeriods from './périodesGéologiques.json'
import adjectifs from './adjectifs.json'
// Merci https://github.com/akaAgar/vocabulaire-francais
import verbs from './participePassés.json'

export const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max))

export const stringToColour = function (str) {
	var hash = 0
	for (var i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash)
	}
	var colour = '#'
	for (var i = 0; i < 3; i++) {
		var value = (hash >> (i * 8)) & 0xff
		colour += ('00' + value.toString(16)).substr(-2)
	}
	return colour
}

export const generateRoomName = () => {
	const periodsCount = geologicalPeriods.length
	const adjectifsCount = adjectifs.length
	const verbsCount = verbs.length

	console.log(
		'Suggestion de nom de conférence unique à 1/' +
			periodsCount * adjectifsCount * verbsCount
	)

	return [
		geologicalPeriods[getRandomInt(periodsCount)],
		adjectifs[getRandomInt(adjectifsCount)],
		verbs[getRandomInt(verbsCount)],
	]
		.join('-')
		.toLowerCase()
}

export const extremeThreshold = 100 * 1000

export const filterExtremes = (elements) =>
	Object.fromEntries(
		Object.entries(elements).filter(
			([_, { bilan }]) => bilan < extremeThreshold
		)
	)
