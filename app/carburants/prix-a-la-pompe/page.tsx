import { Metadata } from 'next'
import Carburants from './Carburants'

const title = 'Comprendre le prix à la pompe'
const description =
	"Comprendre comment le prix de l'essence et du gazole à la pompe est calculé."

export const metadata: Metadata = {
	title,
	description,
}

export default () => (
	<div>
		<Carburants />
	</div>
)
