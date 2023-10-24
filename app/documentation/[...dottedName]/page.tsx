import type { Metadata, ResolvingMetadata } from 'next'

import QuickDocumentationPage from '@/components/documentation/QuickDocumentationPage'
import {
	parentName,
	title as ruleTitle,
} from '@/components/utils/publicodesUtils'
import { getRulesFromDottedName } from '@/providers/getRules'
import { utils } from 'publicodes'
import Link from 'next/link'
import ExempleHeader from '@/components/documentation/ExempleHeader'
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
		rule.exposé?.image ||
		'https://futur.eco' +
			`/api/og-image?title=${
				rule.exposé?.titre || rule.titre
			} - le calcul&emojis=${rule.icônes || '📚'}`
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
	const url = findClosestSimulateurUrl(rules, decoded)
	return (
		<main>
			<Back url={url} />
			<QuickDocumentationPage
				dottedName={decoded}
				rules={rules}
				searchParams={searchParams}
			/>
		</main>
	)
}

const findClosestSimulateurUrl = (rules, dottedName) => {
	const root = parentName(dottedName),
		entries = Object.entries(rules)
	const rootSimulator = entries.find(
		([k, v]) => k.startsWith(root) && v && v.exposé
	)

	const getEntryURL = ([k, v]) =>
		v.exposé?.url || '/simulateur/' + utils.encodeRuleName(k)

	if (rootSimulator) return getEntryURL(rootSimulator)
	const anySimulator = entries.find(([k, v]) => v.exposé)
	if (anySimulator) return getEntryURL(anySimulator)
	return null
}
const Back = ({ url }) =>
	url && (
		<div>
			<Link href={url}>
				<Emoji e=" 	⬅" /> Revenir au calculateur
			</Link>
			<ExempleHeader />
		</div>
	)

export default Page
