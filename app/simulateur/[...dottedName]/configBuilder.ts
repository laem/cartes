export default (objectifs, decoded) => ({
	objectifs,
	questions: {
		'non prioritaires':
			decoded === 'transport . avion . impact'
				? ['transport . avion . forçage radiatif']
				: null,
		prioritaires:
			decoded === 'transport . ferry . empreinte du voyage'
				? ['transport . ferry . distance aller . orthodromique']
				: null,
	},
})
