//import train from './train.yaml'
import trajet from './trajet.yaml'
import possession from './voiture . coût de possession.yaml'
import divers from './voiture . coûts divers.yaml'
import voiture from './voiture.yaml'

const rules = {
	//	...train,

	...voiture,
	...trajet,
	...possession,
	...divers,
}

const prefixedRules = Object.fromEntries(
	Object.entries(rules).map(([k, v]) => ['voyage . ' + k, v])
)
export default prefixedRules
