import { capitalise0 } from '../utils/utils'
import { StyledReferences } from './ReferencesUI'

const referencesImages = {
	'service-public.fr': '/références-images/marianne.png',
	'legifrance.gouv.fr': '/références-images/marianne.png',
	'gouv.fr': '/références-images/marianne.png',
	'senat.fr': '/références-images/senat.png',
	'ademe.fr': 'https://www.ademe.fr/wp-content/uploads/2021/12/logo-ademe.svg',
	'bilans-ges.ademe.fr':
		'https://www.ademe.fr/wp-content/uploads/2021/12/logo-ademe.svg',
}

export default function References({ references }) {
	if (!references) return null
	const cleanDomain = (link: string) =>
		(link.includes('://') ? link.split('/')[2] : link.split('/')[0]).replace(
			'www.',
			''
		)

	// Can be an object with labels as keys or just a list of URLs
	const referencesWithoutKeys = Array.isArray(references)

	return (
		<StyledReferences>
			{Object.entries(references).map(([name, link]) => {
				const domain = cleanDomain(link)
				const path = link.split(domain)[1]
				return (
					<li key={name}>
						{!referencesWithoutKeys && (
							<span className="imageWrapper">
								{Object.keys(referencesImages).includes(domain) && (
									<img
										src={
											referencesImages[domain as keyof typeof referencesImages]
										}
										alt={`logo de ${domain}`}
									/>
								)}
							</span>
						)}
						<a
							href={link}
							target="_blank"
							rel="noreferrer"
							css={`
								display: flex;
								align-items: center;
							`}
						>
							<span className="ui__ label">{domain}</span>
							<span css="margin-left: .4rem">
								{referencesWithoutKeys ? path : capitalise0(name)}
							</span>
						</a>
					</li>
				)
			})}
		</StyledReferences>
	)
}
