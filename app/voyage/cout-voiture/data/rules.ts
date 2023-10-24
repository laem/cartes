//import train from './train.yaml'
import trajet from './trajet.yaml'
import possession from './voiture . coût de possession.yaml'
import divers from './voiture . coûts divers.yaml'
import voiture from './voiture.yaml'

const rules = {
	//	...train,

	voyage: null,
	...voiture,
	...trajet,
	...possession,
	...divers,
}

const prefixedRules = Object.fromEntries(
	Object.entries(rules).map(([k, v]) => [
		k === 'voyage' ? k : 'voyage . ' + k,
		v,
	])
)

export default prefixedRules
