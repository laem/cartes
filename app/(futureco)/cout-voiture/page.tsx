import Article from '@/components/Article'
import css from '@/components/css/convertToJs'
import { Card, LightButton } from '@/components/UI'
import voitures from '@/public/voitures.svg'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Explanation from './Explanation.mdx'
import { Header } from './UI'
import Voyage from './Voyage'
import rules from './data/rules.ts'
import BetaBanner from '@/components/BetaBanner'
import { ogImageURL } from './ogImageUrl'

const title = `Quel est le vrai coût d'un trajet en voiture ?`
const description1 =
		"Le coût d'un trajet en voiture est souvent réduit à celui du carburant et des péages d'autoroute. Mais alors qui paie l'achat, l'entretien, le parking, l'assurance ?",
	description2 =
		"On fait le point en quelques clics avec le simulateur de référence du coût d'un trajet en voiture."

export const objectives = ['voyage . trajet voiture . coût trajet par personne']
const rule = rules[objectives[0]]

export async function generateMetadata(
	{ params, searchParams }: Props,
	parent?: ResolvingMetadata
): Promise<Metadata> {
	const dottedName = objectives[0]
	const image =
		Object.keys(searchParams).length === 0
			? `/voitures.png`
			: ogImageURL(dottedName, rule.icônes, searchParams)

	return {
		title,
		description: description1 + ' ' + description2,
		openGraph: {
			images: [image],
			type: 'article',
			publishedTime: '2023-10-10T00:00:00.000Z',
		},
		// we could simply render SVG emojis, but SVG images don't work in og tags, we'll have to convert them
	}
}

const Page = ({ searchParams }) => {
	const iframe = searchParams.iframe != null
	return (
		<main>
			{!searchParams.lu && (
				<Card $fullWidth>
					<Header>
						<Image
							src={voitures}
							alt="Illustration de plusieurs formes d'automobiles, de la citadine au camping car"
							width="100"
							height="140"
						/>
						<div>
							<h1>{title}</h1>
							<>
								<p>{description1}</p>
								<p>{description2}</p>
								<BetaBanner />
								<Link
									href={{
										pathname: '/cout-voiture',
										query: { ...searchParams, lu: 'oui' },
									}}
									prefetch={false}
								>
									<LightButton>OK</LightButton>
								</Link>
							</>
						</div>
					</Header>
				</Card>
			)}
			<Voyage searchParams={searchParams} />
			<details
				open={!iframe}
				style={css`
					margin-top: 1rem;
				`}
			>
				<summary
					style={css`
						text-align: center;
					`}
				>
					Explications
				</summary>
				<Article>
					<div style={css(`margin-top: 2rem`)}>
						<hr />
						<Explanation searchParams={searchParams} />
					</div>
				</Article>
			</details>
		</main>
	)
}

export default Page
