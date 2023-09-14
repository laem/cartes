import train from './train.yaml'
import trajet from './trajet.yaml'
import voiture from './voiture.yaml'
import fixes from './voiture . coûts fixes.yaml'

const rules = { ...train, ...voiture, ...trajet, ...fixes }
export default rules
