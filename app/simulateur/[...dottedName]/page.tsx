import Simulateur from './Simulateur'
import { capitalise0, utils } from 'publicodes'

export default ({ params: { dottedName } }) => {
	const rawObjective = dottedName.join('/'),
		decoded = utils.decodeRuleName(rawObjective)
	return <Simulateur dottedName={decoded} />
}
