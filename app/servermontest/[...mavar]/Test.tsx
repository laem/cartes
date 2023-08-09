import Engine from 'publicodes'

export default function Test({ maVar, rules }) {
	if (!rules) return 'En attente des règles'

	console.log('RULES', rules)
	const engine = new Engine(rules)
	const evaluation = engine.evaluate('transport . avion . impact')
	const value = evaluation.nodeValue

	return 'ici on est serveur ' + maVar + value
}
