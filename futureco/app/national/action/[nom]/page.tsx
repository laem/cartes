import data from '../../data.yaml'
import { utils } from 'publicodes'
const { decodeRuleName } = utils
import { MDXRemote } from 'next-mdx-remote/rsc'
import Article from 'Components/Article'
import Link from 'next/link'
import Emoji from 'Components/Emoji'

const getRule = (raw) => {
	const nom = decodeRuleName(raw)

	const rule = data.find(
		(r) => r.titre.toLowerCase() === decodeURIComponent(nom)
	)
	return rule
}

export function generateMetadata({ params }) {
	const rule = getRule(params.nom)
	const image =
		'https://futur.eco' +
		`/api/og-image?title=${rule.titre}&emojis=${rule.icônes}`
	return {
		title: rule.titre,
		description: rule.description,
		openGraph: {
			images: [image],
		},
	}
}

const Page = ({ params }) => {
	const rule = getRule(params.nom)

	if (!rule) return <p>Cette action n'existe pas.</p>
	return (
		<main>
			<Link href="/national">
				<Emoji e="◀️" />
				Retour au tableau de bord de la planfication écologique
			</Link>
			<h1>{rule.titre}</h1>
			<Article>
				<MDXRemote source={rule.notes} />
			</Article>
		</main>
	)
}

export default Page
