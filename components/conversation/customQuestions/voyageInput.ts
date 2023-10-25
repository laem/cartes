// Some questions are handled by the UI, they're custom complex questions that trigger multiple fields and API calls. We need to store theses fields too

export const ferryQuestions = [
	'transport . ferry . départ',
	'transport . ferry . arrivée',
	'transport . ferry . distance aller . orthodromique',
]
export const voyageQuestions = [
	'voyage . trajet voiture . départ',
	'voyage . trajet voiture . arrivée',
	'voyage . trajet voiture . distance',
	'voyage . trajet voiture . péages . prix calculé . prix 2018',
	'voyage . trajet voiture . péages . calcul GPS',
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
