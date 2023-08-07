import { utils } from 'publicodes'
import Simulateur from './Simulateur'

const Page = ({ params: { dottedName } }) => {
	const rawObjective = dottedName.join('/'),
		decoded = utils.decodeRuleName(rawObjective)
	return <Simulateur dottedName={decoded} />
};

export default Page;
