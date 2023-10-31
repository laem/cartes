const getQuestionsConfig = (dottedName) => ({
	'non prioritaires':
		dottedName === 'transport . avion . impact'
			? ['transport . avion . forçage radiatif']
			: null,
	prioritaires:
		dottedName === 'transport . ferry . empreinte du voyage'
			? ['transport . ferry . distance aller . orthodromique']
			: dottedName === 'voyage . trajet voiture . coût trajet par personne'
			? ['voyage . trajet voiture . distance', 'voyage . trajet . voyageurs']
			: null,
})
export default getQuestionsConfig

export const eqValues = (a, b) => JSON.stringify(a) === JSON.stringify(b) // arrays are very small, we don't care about perf here
