import train from './train.yaml'
import trajet from './trajet.yaml'
import voiture from './voiture.yaml'

const rules = { ...train, ...voiture, ...trajet }
export default rules
