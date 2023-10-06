import type { Metadata, ResolvingMetadata } from 'next'

import { title as ruleTitle } from '@/components/utils/publicodesUtils'
import { getRulesFromDottedName } from '@/providers/getRules'
import { utils } from 'publicodes'
import Simulateur from './Simulateur'
import Article from '@/components/Article'
import convert from '@/components/css/convertToJs'
import { Markdown } from '@/components/utils/markdown'

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
		rule.exposé?.image ||
		'https://futur.eco' +
			`/api/og-image?title=${rule.exposé?.titre || rule.titre}&emojis=${
				rule.icônes
			}`
	return {
		title,
		description,
		openGraph: {
			images: [image],
		},
		// we could simply render SVG emojis, but SVG images don't work in og tags, we'll have to convert them
	}
}

const Page = async ({ params: { dottedName: rawDottedName } }: Props) => {
	const dottedName = decodeURIComponent(rawDottedName.join('/'))
	const decoded = utils.decodeRuleName(dottedName)
	const rules = await getRulesFromDottedName(dottedName)
	const rule = rules[decoded]
	const text = rule.exposé?.description || rule.description
	const title = rule.exposé?.titre || rule.titre
	return (
		<main>
			<Simulateur dottedName={decoded} rules={rules} />
			<Article>
				<div style={convert(`margin-top: 6rem`)}>
					<hr />
					<h2>{title}</h2>
					<Markdown>{text}</Markdown>
				</div>
			</Article>
		</main>
	)
}

export default Page
