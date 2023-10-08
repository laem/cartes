const questionsConfig = (dottedName) => ({
	'non prioritaires':
		dottedName === 'transport . avion . impact'
			? ['transport . avion . forçage radiatif']
			: null,
	prioritaires:
		dottedName === 'transport . ferry . empreinte du voyage'
			? ['transport . ferry . distance aller . orthodromique']
			: dottedName === 'trajet voiture . coût trajet par personne'
			? ['trajet voiture . distance', 'trajet . voyageurs']
			: null,
})
export default questionsConfig

export const eqValues = (a, b) => JSON.stringify(a) === JSON.stringify(b) // arrays are very small, we don't care about perf here
