export const mean = (simulationArray) =>
	simulationArray &&
	simulationArray
		.filter((el) => el !== null)
		.reduce((memo, next) => memo + next || 0, 0) / simulationArray.length

export const humanMean = (simulationArray) => {
	const result = mean(simulationArray)

	return result
		? Math.round(result / 100) / 10 + ' tonnes'
		: 'résultats en attente'
}

export default ({ elements }) => {
	const result = humanMean(elements)

	return result
}
