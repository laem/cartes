export const ferryQuestions = [
	'transport . ferry . départ',
	'transport . ferry . arrivée',
	'transport . ferry . distance aller . orthodromique',
]
export const voyageQuestions = [
	'trajet voiture. départ',
	'trajet voiture . arrivée',
	'trajet voiture . distance',
]

export const airportsQuestions = [
	'transport . avion . distance de vol aller',
	'transport . avion . départ',
	'transport . avion . arrivée',
]

export function isVoyageQuestion(question) {
	return [...ferryQuestions, ...voyageQuestions, ...airportsQuestions].includes(
		question
	)
}
