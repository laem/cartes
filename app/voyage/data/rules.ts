import train from './train.yaml'
import trajet from './trajet.yaml'
import voiture from './voiture.yaml'
import possession from './voiture . coûts de possession.yaml'

const rules = { ...train, ...voiture, ...trajet, ...possession }
export default rules
