import { capitalise0 } from 'publicodes'
import { RulePage } from 'publicodes-react'
import styled from 'styled-components'

const referencesImages = {
	'service-public.fr': '/références-images/marianne.png',
	'legifrance.gouv.fr': '/références-images/marianne.png',
	'gouv.fr': '/références-images/marianne.png',
	'ladocumentationfrançaise.fr':
		'/références-images/ladocumentationfrançaise.png',
	'senat.fr': '/références-images/senat.png',
	'bpifrance-creation.fr': '/références-images/bpi-création.png',
	'ademe.fr': 'https://www.ademe.fr/wp-content/uploads/2021/12/logo-ademe.svg',
	'bilans-ges.ademe.fr':
		'https://www.ademe.fr/wp-content/uploads/2021/12/logo-ademe.svg',
}

type ReferencesProps = {
	references: React.ComponentProps<
		NonNullable<
			React.ComponentProps<typeof RulePage>['renderers']['References']
		>
	>['references']
}

export default function References({ references }: ReferencesProps) {
	const cleanDomain = (link: string) =>
		(link.includes('://') ? link.split('/')[2] : link.split('/')[0]).replace(
			'www.',
			''
		)

	const noKeys = Array.isArray(references)
	console.log(noKeys, references)

	return (
		<StyledReferences>
			{Object.entries(references).map(([name, link]) => {
				const domain = cleanDomain(link)
				const path = link.split(domain)[1]
				return (
					<li key={name}>
						{!noKeys && (
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
								{noKeys ? path : capitalise0(name)}
							</span>
						</a>
					</li>
				)
			})}
		</StyledReferences>
	)
}

const StyledReferences = styled.ul`
	list-style: none;
	padding-left: 0.6rem;
	a {
		flex: 1;
		min-width: 45%;
		text-decoration: none;
		margin-right: 1rem;
	}
	li {
		margin-bottom: 0.6em;
		width: 100%;
		display: flex;
		align-items: center;
	}
	.imageWrapper {
		width: 4.5rem;
		height: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 1rem;
	}
	img {
		max-height: 3rem;
		vertical-align: sub;
		max-width: 100%;
		border-radius: 0.3em;
	}
`
