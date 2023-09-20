import data from '../../data.yaml'
import { utils } from 'publicodes'
const { decodeRuleName } = utils
import { MDXRemote } from 'next-mdx-remote/rsc'
import Article from '@/components/Article'
import Link from 'next/link'
import Emoji from '@/components/Emoji'

const Page = ({ params }) => {
	const { nom: raw } = params

	const nom = decodeRuleName(raw)

	const rule = data.find(
		(r) => r.titre.toLowerCase() === decodeURIComponent(nom)
	)

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
