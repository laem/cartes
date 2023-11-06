import type { Metadata, ResolvingMetadata } from 'next'

import { title as ruleTitle } from '@/components/utils/publicodesUtils'
import { getRulesFromDottedName } from '@/providers/getRules'
import { utils } from 'publicodes'
import Simulateur from './Simulateur'
import Article from '@/components/Article'
import convert from '@/components/css/convertToJs'
import { Markdown } from '@/components/utils/markdown'
import BaseCarboneReference from '@/components/BaseCarboneReference'
import css from '@/components/css/convertToJs'
import Link from 'next/link'
import Emoji from '@/components/Emoji'

type Props = {
	params: { dottedName: string[] }
	searchParams: { [key: string]: string | string[] | undefined }
}
export async function generateMetadata(
	{ params, searchParams }: Props,
	parent?: ResolvingMetadata
): Promise<Metadata> {
	const dottedName = utils.decodeRuleName(
			decodeURIComponent(params.dottedName.join('/'))
		),
		rules = await getRulesFromDottedName(dottedName),
		rule = rules[dottedName] || {}

	const title = rule.exposé?.titre || ruleTitle({ ...rule, dottedName })
	const description = rule.exposé?.description || rule.description

	const image =
		rule.exposé?.image && Object.keys(searchParams).length === 0
			? rule.exposé.image
			: `/voyage/cout-voiture/og?dottedName=${dottedName}&title=${
					rule.titre
			  }&emojis=${rule.icônes}&${new URLSearchParams(searchParams).toString()}`
	return {
		title,
		description,
		openGraph: {
			images: [image],
		},
		// we could simply render SVG emojis, but SVG images don't work in og tags, we'll have to convert them
	}
}

const Page = async ({
	params: { dottedName: rawDottedName },
	searchParams,
}: Props) => {
	const dottedName = decodeURIComponent(rawDottedName.join('/'))
	const decoded = utils.decodeRuleName(dottedName)
	const rules = await getRulesFromDottedName(dottedName)
	const rule = rules[decoded]
	const text = rule.exposé?.description || rule.description
	const title = rule.exposé?.titre || rule.titre
	const iframe = searchParams.iframe != null
	return (
		<main>
			<Simulateur
				dottedName={decoded}
				rules={rules}
				searchParams={searchParams}
			/>
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
					<div style={convert(`margin-top: 2rem`)}>
						<hr />
						<h2>{title}</h2>
						<Markdown>{text}</Markdown>
						<h2>⚙️ Comprendre le calcul</h2>
						<p>
							Le modèle de calcul est entièrement ouvert et expliqué{' '}
							<Link
								href={{
									pathname: '/documentation/' + utils.encodeRuleName(decoded),
									query: searchParams,
								}}
							>
								dans la documentation intéractive.
							</Link>
						</p>
						<BaseCarboneReference rule={rule} />
					</div>
				</Article>
			</details>
		</main>
	)
}

export default Page
