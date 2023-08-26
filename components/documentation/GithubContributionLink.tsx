import { LightButton } from '../UI'
import { title } from '../utils/publicodesUtils'
import { RightSection } from './DocumentationStyle'

// Not integratable yet, see https://github.com/betagouv/publicodes/issues/336
export const GithubContributionLink = ({ dottedName }) => (
	<RightSection>
		<a
			href={`https://github.com/search?q=${encodeURIComponent(
				`repo:laem/futureco-data "${title({ dottedName })}:"`
			)} path:data&type=code`}
		>
			<LightButton>✏️ Contribuer</LightButton>
		</a>
	</RightSection>
)
