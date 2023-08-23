import { LightButton } from '../UI'
import { title } from '../utils/publicodesUtils'

// Not integratable yet, see https://github.com/betagouv/publicodes/issues/336
export const GithubContributionLink = ({ dottedName }) => (
	<section
		css={`
			margin: 1rem 0;
			display: block;
			text-align: right;
		`}
	>
		<a
			href={`https://github.com/search?q=${encodeURIComponent(
				`repo:laem/futureco-data "${title({ dottedName })}:"`
			)} path:data&type=code`}
		>
			<LightButton>✏️ Contribuer</LightButton>
		</a>
	</section>
)
