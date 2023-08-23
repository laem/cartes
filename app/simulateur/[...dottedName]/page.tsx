import type { Metadata, ResolvingMetadata } from 'next'

import { getRulesFromDottedName } from '@/providers/getRules'
import { utils } from 'publicodes'
import Simulateur from './Simulateur'

/*
;<Meta
	title={}
	description={rule.exposé?.description || rule.description}
	image={
		rule.exposé?.image ||
		'https://futur.eco' +
			`/api/og-image?title=${rule.exposé?.titre || rule.titre}&emojis=${
				rule.icônes
			}`
	} // we could simply render SVG emojis, but SVG images don't work in og tags, we'll have to convert them
/>
*/

type Props = {
	params: { dottedName: string[] }
	searchParams: { [key: string]: string | string[] | undefined }
}
export async function generateMetadata(
	{ params, searchParams }: Props,
	parent?: ResolvingMetadata
): Promise<Metadata> {
	const dottedName = utils.decodeRuleName(params.dottedName.join('/')),
		rules = await getRulesFromDottedName(dottedName),
		rule = rules[dottedName]

	const title = rule.exposé?.titre || rule.titre
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
	const dottedName = rawDottedName.join('/')
	const decoded = utils.decodeRuleName(dottedName)
	const rules = await getRulesFromDottedName(dottedName)
	return (
		<main>
			<Simulateur dottedName={decoded} rules={rules} />
		</main>
	)
}

export default Page