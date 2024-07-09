import { allArticles } from '@/.contentlayer/generated'
import { compareDesc } from 'date-fns'
import Link from 'next/link'
import { List } from './UI'
import { dateCool } from './utils'

const title = `Le blog - Cartes`
const description =
	"Découvrez l'histoire, les nouveautés et le futur de Cartes.app"

export const metadata: metadata = {
	title,
	description,
}

const Page = () => {
	const articles = allArticles.sort((a, b) =>
		compareDesc(new Date(a.date), new Date(b.date))
	)
	return (
		<main>
			<h1>Le blog de Cartes.app</h1>
			<p>{description}</p>
			<p>
				Pour l'instant, nous sommes dans une phase de construction : l'objectif
				est de sortir une version 1 en 2024, et ces articles en expliquent
				l'avancement. L'application reste largement utilisable, mais
				attendez-vous à quelques bugs.
			</p>
			<List>
				{articles.map(({ url, date, titre }) => (
					<li key={url}>
						<div>
							<Link href={url}>{titre}</Link>
						</div>
						<small>publié {dateCool(date)}</small>
					</li>
				))}
			</List>
		</main>
	)
}

export default Page
