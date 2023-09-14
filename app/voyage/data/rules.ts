import train from './train.yaml'
import trajet from './trajet.yaml'
import voiture from './voiture.yaml'
import possession from './voiture . coût de possession.yaml'
import divers from './voiture . coûts divers.yaml'

const rules = { ...train, ...voiture, ...trajet, ...possession, ...divers }
export default rules
