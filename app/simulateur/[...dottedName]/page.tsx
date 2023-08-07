import {utils} from 'publicodes'
import Simulateur from './Simulateur'

export default ({ params: { dottedName } }) => {
	const rawObjective = dottedName.join('/'),
		decoded = utils.decodeRuleName(rawObjective)
	return <Simulateur dottedName={decoded} />
}
